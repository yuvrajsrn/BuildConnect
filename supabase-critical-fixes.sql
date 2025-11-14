-- ============================================
-- CRITICAL FIXES FOR BUILDCONNECT
-- Run this in Supabase SQL Editor
-- ============================================

-- 1. FIX SECURITY DEFINER VIEW (CRITICAL SECURITY ISSUE)
-- Drop and recreate contractor_stats without SECURITY DEFINER
DROP VIEW IF EXISTS public.contractor_stats;

CREATE VIEW public.contractor_stats AS
SELECT 
  c.id,
  c.profile_id,
  COUNT(DISTINCT b.id) as total_bids,
  COUNT(DISTINCT CASE WHEN b.status = 'accepted' THEN b.id END) as won_bids,
  COALESCE(AVG(r.rating), 0) as avg_rating,
  COUNT(DISTINCT r.id) as total_reviews
FROM contractors c
LEFT JOIN bids b ON b.contractor_id = c.profile_id
LEFT JOIN reviews r ON r.contractor_id = c.profile_id
GROUP BY c.id, c.profile_id;

-- Grant appropriate permissions
GRANT SELECT ON public.contractor_stats TO authenticated;
GRANT SELECT ON public.contractor_stats TO anon;

-- 2. FIX RLS PERFORMANCE ISSUES
-- Optimize auth.uid() calls by wrapping in SELECT

-- Profiles table
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (id = (SELECT auth.uid()));

-- Contractors table
DROP POLICY IF EXISTS "Contractors can update own data" ON contractors;
CREATE POLICY "Contractors can update own data" ON contractors
  FOR UPDATE USING (profile_id = (SELECT auth.uid()));

-- Projects table
DROP POLICY IF EXISTS "Builders can insert own projects" ON projects;
CREATE POLICY "Builders can insert own projects" ON projects
  FOR INSERT WITH CHECK (builder_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Builders can update own projects" ON projects;
CREATE POLICY "Builders can update own projects" ON projects
  FOR UPDATE USING (builder_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Builders can delete own projects" ON projects;
CREATE POLICY "Builders can delete own projects" ON projects
  FOR DELETE USING (builder_id = (SELECT auth.uid()));

-- Bids table - Optimize and consolidate policies
DROP POLICY IF EXISTS "Contractors can view own bids" ON bids;
DROP POLICY IF EXISTS "Builders can view bids on their projects" ON bids;
DROP POLICY IF EXISTS "Contractors can insert own bids" ON bids;
DROP POLICY IF EXISTS "Contractors can update own pending bids" ON bids;
DROP POLICY IF EXISTS "Builders can update bids on their projects" ON bids;

-- Create optimized policies
CREATE POLICY "Users can view relevant bids" ON bids
  FOR SELECT USING (
    contractor_id = (SELECT auth.uid()) OR
    project_id IN (SELECT id FROM projects WHERE builder_id = (SELECT auth.uid()))
  );

CREATE POLICY "Contractors can insert bids" ON bids
  FOR INSERT WITH CHECK (contractor_id = (SELECT auth.uid()));

CREATE POLICY "Users can update relevant bids" ON bids
  FOR UPDATE USING (
    (contractor_id = (SELECT auth.uid()) AND status = 'pending') OR
    project_id IN (SELECT id FROM projects WHERE builder_id = (SELECT auth.uid()))
  );

-- Reviews table - Optimize and consolidate
DROP POLICY IF EXISTS "Builders can insert reviews" ON reviews;
DROP POLICY IF EXISTS "Contractors can insert reviews" ON reviews;

CREATE POLICY "Users can insert reviews" ON reviews
  FOR INSERT WITH CHECK (
    builder_id = (SELECT auth.uid()) OR
    contractor_id = (SELECT auth.uid())
  );

-- Ratings table
DROP POLICY IF EXISTS "Builders can rate their contractors" ON ratings;
CREATE POLICY "Builders can rate their contractors" ON ratings
  FOR INSERT WITH CHECK (builder_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Builders can update their own ratings" ON ratings;
CREATE POLICY "Builders can update their own ratings" ON ratings
  FOR UPDATE USING (builder_id = (SELECT auth.uid()));

-- Profile views table
DROP POLICY IF EXISTS "Users can view profile view stats" ON profile_views;
CREATE POLICY "Users can view profile view stats" ON profile_views
  FOR SELECT USING (viewed_profile_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can log profile views" ON profile_views;
CREATE POLICY "Authenticated users can log profile views" ON profile_views
  FOR INSERT WITH CHECK (viewer_id = (SELECT auth.uid()));

-- Notification preferences table
DROP POLICY IF EXISTS "Users can view own notification preferences" ON notification_preferences;
CREATE POLICY "Users can view own notification preferences" ON notification_preferences
  FOR SELECT USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can update own notification preferences" ON notification_preferences;
CREATE POLICY "Users can update own notification preferences" ON notification_preferences
  FOR UPDATE USING (user_id = (SELECT auth.uid()));

DROP POLICY IF EXISTS "Users can insert own notification preferences" ON notification_preferences;
CREATE POLICY "Users can insert own notification preferences" ON notification_preferences
  FOR INSERT WITH CHECK (user_id = (SELECT auth.uid()));

-- 3. FIX FUNCTION SEARCH PATHS (SECURITY)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE contractors
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM reviews
      WHERE contractor_id = NEW.contractor_id
    ),
    total_reviews = (
      SELECT COUNT(*)
      FROM reviews
      WHERE contractor_id = NEW.contractor_id
    )
  WHERE profile_id = NEW.contractor_id;
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION accept_bid(bid_id UUID, project_id UUID, contractor_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  result JSON;
BEGIN
  -- Update the accepted bid
  UPDATE bids
  SET status = 'accepted', updated_at = NOW()
  WHERE id = bid_id;

  -- Reject all other bids for this project
  UPDATE bids
  SET status = 'rejected', updated_at = NOW()
  WHERE bids.project_id = accept_bid.project_id
    AND id != bid_id
    AND status = 'pending';

  -- Update project status and awarded_to
  UPDATE projects
  SET 
    status = 'awarded',
    awarded_to = contractor_id,
    updated_at = NOW()
  WHERE id = project_id;

  result := json_build_object(
    'success', true,
    'bid_id', bid_id,
    'project_id', project_id,
    'contractor_id', contractor_id
  );

  RETURN result;
END;
$$;

CREATE OR REPLACE FUNCTION update_contractor_ratings()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE contractors
  SET 
    rating = (
      SELECT COALESCE(AVG(rating), 0)
      FROM ratings
      WHERE contractor_id = NEW.contractor_id
    ),
    total_ratings = (
      SELECT COUNT(*)
      FROM ratings
      WHERE contractor_id = NEW.contractor_id
    ),
    updated_at = NOW()
  WHERE profile_id = NEW.contractor_id;
  
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION submit_rating(
  p_project_id UUID,
  p_contractor_id UUID,
  p_builder_id UUID,
  p_rating INTEGER,
  p_review_text TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_rating_id UUID;
  result JSON;
BEGIN
  -- Insert or update rating
  INSERT INTO ratings (project_id, contractor_id, builder_id, rating, review_text)
  VALUES (p_project_id, p_contractor_id, p_builder_id, p_rating, p_review_text)
  ON CONFLICT (project_id, contractor_id, builder_id)
  DO UPDATE SET
    rating = EXCLUDED.rating,
    review_text = EXCLUDED.review_text,
    updated_at = NOW()
  RETURNING id INTO v_rating_id;

  result := json_build_object(
    'success', true,
    'rating_id', v_rating_id
  );

  RETURN result;
END;
$$;

-- 4. ADD MISSING INDEXES FOR FOREIGN KEYS
CREATE INDEX IF NOT EXISTS idx_profile_views_project_id ON profile_views(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_builder_id ON reviews(builder_id);

-- 5. REMOVE UNUSED INDEXES (Optional - uncomment if you want to clean up)
-- DROP INDEX IF EXISTS idx_profiles_user_type;
-- DROP INDEX IF EXISTS idx_profiles_email;
-- DROP INDEX IF EXISTS idx_contractors_locations;
-- DROP INDEX IF EXISTS idx_contractors_specializations;
-- DROP INDEX IF EXISTS idx_contractors_rating;
-- DROP INDEX IF EXISTS idx_projects_city;
-- DROP INDEX IF EXISTS idx_projects_created_at;
-- DROP INDEX IF EXISTS idx_projects_specializations;
-- DROP INDEX IF EXISTS idx_bids_created_at;
-- DROP INDEX IF EXISTS idx_reviews_project_id;
-- DROP INDEX IF EXISTS idx_reviews_contractor_id;
-- DROP INDEX IF EXISTS idx_projects_awarded_to;
-- DROP INDEX IF EXISTS idx_bids_contractor_status;
-- DROP INDEX IF EXISTS idx_ratings_builder;
-- DROP INDEX IF EXISTS idx_ratings_project;
-- DROP INDEX IF EXISTS idx_ratings_created;
-- DROP INDEX IF EXISTS idx_profile_views_viewed;
-- DROP INDEX IF EXISTS idx_profile_views_viewer;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if view is fixed
SELECT 
  viewname,
  definition
FROM pg_views
WHERE schemaname = 'public' AND viewname = 'contractor_stats';

-- Check if policies are optimized
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Check if functions have search_path set
SELECT 
  routine_name,
  routine_type,
  security_type
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name IN (
    'update_updated_at_column',
    'update_contractor_rating',
    'accept_bid',
    'update_contractor_ratings',
    'submit_rating'
  );

-- ============================================
SELECT '✅ Critical fixes applied successfully!' as status;
-- ============================================
