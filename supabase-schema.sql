-- BuildConnect Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  user_type TEXT NOT NULL CHECK (user_type IN ('builder', 'contractor')),
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- CONTRACTORS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS contractors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  team_size INTEGER DEFAULT 0,
  service_locations TEXT[] NOT NULL DEFAULT '{}',
  bio TEXT,
  portfolio_images TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0.0,
  total_projects INTEGER DEFAULT 0,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ============================================================
-- PROJECTS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  builder_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  project_type TEXT NOT NULL CHECK (project_type IN ('residential', 'commercial', 'infrastructure', 'renovation')),
  location TEXT NOT NULL,
  city TEXT NOT NULL,
  required_specializations TEXT[] NOT NULL,
  budget_min INTEGER,
  budget_max INTEGER,
  start_date DATE,
  duration_days INTEGER,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'bidding_closed', 'awarded', 'completed', 'cancelled')),
  document_url TEXT,
  awarded_to UUID REFERENCES contractors(id),
  bidding_deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- BIDS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  contractor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quoted_price INTEGER NOT NULL,
  estimated_duration INTEGER NOT NULL,
  proposal TEXT NOT NULL,
  attachments TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'withdrawn')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_bid_per_project UNIQUE(project_id, contractor_id)
);

-- ============================================================
-- REVIEWS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  builder_id UUID REFERENCES profiles(id),
  contractor_id UUID REFERENCES contractors(id),
  rating INTEGER CHECK (rating BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_profiles_user_type ON profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);

CREATE INDEX IF NOT EXISTS idx_contractors_user_id ON contractors(user_id);
CREATE INDEX IF NOT EXISTS idx_contractors_locations ON contractors USING GIN(service_locations);
CREATE INDEX IF NOT EXISTS idx_contractors_specializations ON contractors USING GIN(specializations);
CREATE INDEX IF NOT EXISTS idx_contractors_rating ON contractors(rating);

CREATE INDEX IF NOT EXISTS idx_projects_builder_id ON projects(builder_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_city ON projects(city);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_specializations ON projects USING GIN(required_specializations);

CREATE INDEX IF NOT EXISTS idx_bids_project_id ON bids(project_id);
CREATE INDEX IF NOT EXISTS idx_bids_contractor_id ON bids(contractor_id);
CREATE INDEX IF NOT EXISTS idx_bids_status ON bids(status);
CREATE INDEX IF NOT EXISTS idx_bids_created_at ON bids(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_reviews_project_id ON reviews(project_id);
CREATE INDEX IF NOT EXISTS idx_reviews_contractor_id ON reviews(contractor_id);

-- ============================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE contractors ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view all profiles"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- CONTRACTORS POLICIES
CREATE POLICY "Anyone can view contractors"
  ON contractors FOR SELECT
  USING (true);

CREATE POLICY "Contractors can update own data"
  ON contractors FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Contractors can insert own data"
  ON contractors FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- PROJECTS POLICIES
CREATE POLICY "Anyone can view open projects"
  ON projects FOR SELECT
  USING (true);

CREATE POLICY "Builders can insert own projects"
  ON projects FOR INSERT
  WITH CHECK (builder_id = auth.uid());

CREATE POLICY "Builders can update own projects"
  ON projects FOR UPDATE
  USING (builder_id = auth.uid());

CREATE POLICY "Builders can delete own projects"
  ON projects FOR DELETE
  USING (builder_id = auth.uid());

-- BIDS POLICIES
CREATE POLICY "Contractors can view own bids"
  ON bids FOR SELECT
  USING (contractor_id = auth.uid());

CREATE POLICY "Builders can view bids on their projects"
  ON bids FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = bids.project_id
      AND projects.builder_id = auth.uid()
    )
  );

CREATE POLICY "Contractors can insert own bids"
  ON bids FOR INSERT
  WITH CHECK (contractor_id = auth.uid());

CREATE POLICY "Contractors can update own pending bids"
  ON bids FOR UPDATE
  USING (contractor_id = auth.uid() AND status = 'pending');

CREATE POLICY "Builders can update bids on their projects"
  ON bids FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = bids.project_id
      AND projects.builder_id = auth.uid()
    )
  );

-- REVIEWS POLICIES
CREATE POLICY "Anyone can view reviews"
  ON reviews FOR SELECT
  USING (true);

CREATE POLICY "Builders can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (builder_id = auth.uid());

CREATE POLICY "Contractors can insert reviews"
  ON reviews FOR INSERT
  WITH CHECK (contractor_id = auth.uid());

-- ============================================================
-- FUNCTIONS AND TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update_updated_at trigger to all tables
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_contractors_updated_at BEFORE UPDATE ON contractors
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bids_updated_at BEFORE UPDATE ON bids
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update contractor rating after review
CREATE OR REPLACE FUNCTION update_contractor_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE contractors
  SET rating = (
    SELECT AVG(rating)::DECIMAL(2,1)
    FROM reviews
    WHERE contractor_id = NEW.contractor_id
  )
  WHERE id = NEW.contractor_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contractor_rating
AFTER INSERT ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_contractor_rating();

-- ============================================================
-- SEED DATA (Optional - for testing)
-- ============================================================

-- Note: This is just sample data for testing. Remove in production.
-- You can uncomment these if you want to test with sample data.

/*
-- Sample Builder Profile
INSERT INTO profiles (id, email, full_name, phone, user_type, company_name)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'builder@example.com',
  'John Builder',
  '9876543210',
  'builder',
  'ABC Constructions'
) ON CONFLICT (id) DO NOTHING;

-- Sample Contractor Profile
INSERT INTO profiles (id, email, full_name, phone, user_type, company_name)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  'contractor@example.com',
  'Sharma Contractors',
  '9876543211',
  'contractor',
  'Sharma Construction Pvt Ltd'
) ON CONFLICT (id) DO NOTHING;

-- Sample Contractor Data
INSERT INTO contractors (user_id, specializations, experience_years, team_size, service_locations, bio, rating, total_projects)
VALUES (
  '00000000-0000-0000-0000-000000000002',
  ARRAY['Plumbing', 'Electrical', 'Civil'],
  12,
  25,
  ARRAY['Patna', 'Lucknow', 'Delhi'],
  'We are a professional construction company with 12 years of experience.',
  4.5,
  45
) ON CONFLICT (user_id) DO NOTHING;
*/

-- ============================================================
-- COMPLETION MESSAGE
-- ============================================================
DO $$
BEGIN
  RAISE NOTICE 'BuildConnect database schema created successfully!';
  RAISE NOTICE 'You can now use the application.';
END $$;
