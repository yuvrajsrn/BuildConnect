# Bid Submission Troubleshooting

## All Potential Issues and Solutions

### 1. Authentication Issues

#### Symptom: "You must be logged in to submit a bid"
**Cause:** User session is not available or expired

**Solutions:**
1. Log out and log back in
2. Clear browser cookies and cache
3. Check if you're logged in as a contractor (not builder)
4. Verify your account is active

**How to Verify:**
- Open Console (F12)
- Type: `localStorage.getItem('supabase.auth.token')`
- Should return a token string, not null

---

### 2. Session Expiration

#### Symptom: "Your session has expired. Please log in again."
**Cause:** Auth token has expired

**Solutions:**
1. Log out completely
2. Close all browser tabs
3. Log back in
4. Try submitting again

**Prevention:**
- Don't leave the page open for too long
- Refresh the page before submitting if you've been idle

---

### 3. Validation Errors

#### Symptom: "Please enter a valid quoted price"
**Cause:** Price field is empty, negative, or not a number

**Solutions:**
1. Enter a numeric value only (no currency symbols)
2. Ensure price is greater than 0
3. Check that price is within budget range

#### Symptom: "Quoted price should be between ₹X and ₹Y"
**Cause:** Price is outside the project's budget range

**Solutions:**
1. Check the project's budget range
2. Enter a price within that range
3. Consider if you can complete the project within budget

#### Symptom: "Please enter a valid estimated duration"
**Cause:** Duration field is empty, negative, or not a number

**Solutions:**
1. Enter a numeric value only
2. Ensure duration is greater than 0
3. Enter duration in days

#### Symptom: "Proposal must be at least 100 characters long"
**Cause:** Proposal text is too short

**Solutions:**
1. Write a more detailed proposal
2. Describe your approach, experience, and qualifications
3. Explain why you're the best fit for the project

---

### 4. Database Connection Issues

#### Symptom: "Database connection not initialized"
**Cause:** Supabase client failed to initialize

**Solutions:**
1. Refresh the page
2. Check your internet connection
3. Verify Supabase is not down (check status page)
4. Clear browser cache

**How to Verify:**
- Check Console for Supabase connection errors
- Look for CORS errors in Network tab

---

### 5. RLS Policy Issues

#### Symptom: "Failed to submit bid" with 403 error in Network tab
**Cause:** Row Level Security policy is blocking the insertion

**Solutions:**
1. Verify you have a contractor profile
2. Check that you're logged in with the correct account
3. Ensure the project is still open for bidding
4. Contact admin if issue persists

**How to Verify:**
Run this SQL in Supabase:
```sql
SELECT * FROM contractors WHERE user_id = auth.uid();
```
Should return your contractor profile.

---

### 6. Duplicate Bid Issues

#### Symptom: Error about duplicate bid or constraint violation
**Cause:** You've already submitted a bid for this project

**Solutions:**
1. Check if you already have a pending bid
2. Update your existing bid instead of creating new one
3. Wait for builder to accept/reject before submitting again

**How to Verify:**
- Go to "My Bids" page
- Look for a bid on this project
- If exists, use "Update Bid" instead

---

### 7. Network Issues

#### Symptom: Request hangs or times out
**Cause:** Network connectivity problems

**Solutions:**
1. Check your internet connection
2. Try refreshing the page
3. Check if Supabase is accessible
4. Disable VPN if using one
5. Try a different network

**How to Verify:**
- Open Network tab in DevTools
- Look for failed or pending requests
- Check request timing

---

### 8. Email Notification Issues

#### Symptom: Bid submitted but builder didn't receive email
**Cause:** Email service is down or not configured

**Note:** This won't prevent bid submission (it's non-blocking)

**Solutions:**
1. Check if RESEND_API_KEY is configured in .env
2. Verify email service is working
3. Check builder's spam folder
4. Builder can still see bid in dashboard

---

### 9. Form Not Submitting

#### Symptom: Nothing happens when clicking Submit
**Cause:** JavaScript error or form validation issue

**Solutions:**
1. Check Console for JavaScript errors
2. Ensure all required fields are filled
3. Try refreshing the page
4. Clear browser cache
5. Try a different browser

**How to Verify:**
- Open Console (F12)
- Look for red error messages
- Check if "Form submitted" log appears

---

### 10. Redirect Not Working

#### Symptom: Bid submitted but not redirected to bids page
**Cause:** Router navigation issue

**Solutions:**
1. Manually navigate to /contractor/bids
2. Refresh the page
3. Check if bid appears in database

**How to Verify:**
- Look for "Bid submitted successfully!" alert
- Check Console for navigation errors
- Manually go to /contractor/bids to see your bid

---

## Quick Diagnostic Checklist

Before submitting a bid, verify:
- [ ] You're logged in as a contractor
- [ ] Project is still open for bidding
- [ ] Bidding deadline hasn't passed
- [ ] You haven't already submitted a bid (or it's pending)
- [ ] All form fields are filled correctly
- [ ] Proposal is at least 100 characters
- [ ] Price is within budget range
- [ ] Duration is a positive number
- [ ] Browser console shows no errors
- [ ] Internet connection is stable

## Emergency Recovery Steps

If nothing works:
1. **Log out completely**
2. **Clear all browser data** (cookies, cache, local storage)
3. **Close all browser tabs**
4. **Restart browser**
5. **Log back in**
6. **Navigate to project**
7. **Try submitting again**

## Getting Help

If you've tried everything and still can't submit:

1. **Collect Information:**
   - Screenshot of Console errors
   - Screenshot of Network tab
   - Screenshot of form with data filled
   - Your user ID
   - Project ID

2. **Check Database:**
   - Go to Supabase Dashboard
   - Check if bid was actually inserted
   - Check if contractor profile exists

3. **Report Issue:**
   - Include all collected information
   - Describe exact steps taken
   - Note any error messages seen
   - Mention browser and OS version
