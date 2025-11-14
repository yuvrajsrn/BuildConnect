# Supabase Configuration Fix

## Critical Issue Found

Your `.env` file has a **service role key mismatch**:
- Frontend URL: `https://nzwbnivycuyhujdpmtgo.supabase.co`
- Service Role Key: From project `oeccxntwqrlgwvretorl` (WRONG PROJECT!)

## How to Fix

### Step 1: Get the Correct Service Role Key

1. Go to your Supabase dashboard: https://supabase.com/dashboard/project/nzwbnivycuyhujdpmtgo
2. Navigate to **Settings** → **API**
3. Scroll down to **Project API keys**
4. Copy the **service_role** key (NOT the anon key)

### Step 2: Update Your .env File

Replace the `SUPABASE_SERVICE_ROLE_KEY` in your `.env` file with the correct key from Step 1.

### Step 3: Update Vercel Environment Variables

**IMPORTANT:** You must also update this in Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project: `build-connect-two`
3. Go to **Settings** → **Environment Variables**
4. Find `SUPABASE_SERVICE_ROLE_KEY` and update it with the correct key
5. **Redeploy** your application for changes to take effect

### Step 4: Verify All Environment Variables Match

Make sure these are consistent everywhere (.env, Vercel):
- `NEXT_PUBLIC_SUPABASE_URL` = `https://nzwbnivycuyhujdpmtgo.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` = Your current anon key (this one is correct)
- `SUPABASE_SERVICE_ROLE_KEY` = The NEW service role key from Step 1

## Additional Fixes Applied

I also fixed the login redirect logic to use Next.js router instead of `window.location.href`, which should prevent navigation issues.

## Testing After Fix

1. Update the service role key in both `.env` and Vercel
2. Redeploy on Vercel
3. Try logging in with correct credentials
4. Check browser console for any errors
5. Verify you're redirected to the correct dashboard

## Why This Happened

The service role key belongs to a different Supabase project (`oeccxntwqrlgwvretorl`), which means any server-side operations were failing silently or causing authentication issues.
