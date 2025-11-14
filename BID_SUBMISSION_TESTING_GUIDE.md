# Bid Submission Testing Guide

## How to Test the Fix

### Step 1: Open Browser Developer Tools
1. Press `F12` or right-click and select "Inspect"
2. Go to the **Console** tab
3. Keep it open while testing

### Step 2: Navigate to a Project
1. Log in as a contractor
2. Go to "Browse Projects"
3. Click on any open project

### Step 3: Fill Out the Bid Form
Fill in the form with these test values:
- **Quoted Price:** 15000 (must be within the project's budget range)
- **Estimated Duration:** 30 (in days)
- **Proposal:** Write at least 100 characters describing your approach

### Step 4: Submit and Monitor Console
1. Click "Submit Bid"
2. Watch the Console tab for these messages:

**Expected Console Output (Success):**
```
Form submitted, user: {id: "...", email: "..."}
Submitting bid with data: {project_id: "...", contractor_id: "...", ...}
Session verified, user ID: ...
Bid inserted successfully: {id: "...", ...}
```

**If You See Errors:**
- `"You must be logged in to submit a bid"` → Log out and log back in
- `"Database connection not initialized"` → Refresh the page
- `"Your session has expired"` → Log out and log back in
- `"Quoted price should be between..."` → Adjust your price
- `"Proposal must be at least 100 characters"` → Write more in the proposal

### Step 5: Verify Success
After successful submission:
1. You should see an alert: "Bid submitted successfully!"
2. You should be redirected to `/contractor/bids`
3. Your bid should appear in the list

## Common Issues and Solutions

### Issue: Button Stays "Submitting..." Forever

**Possible Causes:**
1. JavaScript error preventing completion
2. Network request hanging
3. Session expired

**Solutions:**
1. Check Console tab for errors
2. Check Network tab for failed requests
3. Refresh page and try again
4. Log out and log back in

### Issue: No Error Message Shown

**Possible Causes:**
1. Error is being caught but not displayed
2. Form validation preventing submission

**Solutions:**
1. Check Console tab for error logs
2. Ensure all fields are filled correctly
3. Check that proposal is at least 100 characters

### Issue: "Failed to submit bid" Error

**Possible Causes:**
1. RLS policy blocking insertion
2. Invalid data format
3. Database constraint violation

**Solutions:**
1. Check Console for detailed error message
2. Verify you're logged in as a contractor
3. Ensure project is still open for bidding
4. Check that you haven't already submitted a bid

## Network Tab Debugging

### What to Look For:
1. Go to Network tab in Developer Tools
2. Click "Submit Bid"
3. Look for a POST request to `/rest/v1/bids`

**Success Response:**
- Status: 201 Created
- Response contains bid data with ID

**Error Responses:**
- Status: 401 → Authentication issue
- Status: 403 → RLS policy blocking
- Status: 409 → Duplicate bid (already submitted)
- Status: 422 → Validation error

## Database Verification

To verify the bid was inserted:
1. Go to Supabase Dashboard
2. Navigate to Table Editor
3. Select `bids` table
4. Look for your bid with:
   - Your contractor_id
   - The project_id
   - Status: "pending"

## Additional Debugging Commands

If you have access to the Supabase SQL Editor, run:

```sql
-- Check if bid was inserted
SELECT * FROM bids 
WHERE contractor_id = 'YOUR_USER_ID' 
ORDER BY created_at DESC 
LIMIT 1;

-- Check RLS policies
SELECT * FROM pg_policies WHERE tablename = 'bids';

-- Check if user has contractor profile
SELECT * FROM contractors WHERE user_id = 'YOUR_USER_ID';
```

## Contact Support

If the issue persists after trying all solutions:
1. Copy all Console errors
2. Take a screenshot of the Network tab
3. Note the exact steps you took
4. Report the issue with all this information
