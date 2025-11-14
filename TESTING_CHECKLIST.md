# Testing Checklist - Session Fix

## Pre-Testing Setup

### ✅ Step 1: Clear Browser Data
- [ ] Open DevTools (F12)
- [ ] Go to Application tab
- [ ] Click "Clear storage"
- [ ] Click "Clear site data"
- [ ] Close browser completely
- [ ] Reopen browser

### ✅ Step 2: Verify Environment
- [ ] Check `.env.local` exists
- [ ] Verify `NEXT_PUBLIC_SUPABASE_URL` is set
- [ ] Verify `NEXT_PUBLIC_SUPABASE_ANON_KEY` is set
- [ ] Confirm Supabase project is active

### ✅ Step 3: Start Development Server
```bash
npm run dev
```
- [ ] Server starts without errors
- [ ] No compilation errors
- [ ] Can access http://localhost:3000

---

## Basic Login Tests

### ✅ Test 1: Login Flow
- [ ] Go to http://localhost:3000/login
- [ ] Enter valid email and password
- [ ] Click "Sign In"
- [ ] Should redirect to correct dashboard
- [ ] See "Session: active" in bottom-right corner
- [ ] Console shows "Login successful"
- [ ] Console shows session expiry time

**Expected Result:** ✅ Login works, redirects correctly

---

### ✅ Test 2: Session Persistence
- [ ] After logging in, refresh the page (F5)
- [ ] Still logged in?
- [ ] Data still visible?
- [ ] "Session: active" still showing?
- [ ] Refresh 5 more times
- [ ] Still logged in?

**Expected Result:** ✅ Session persists across refreshes

---

### ✅ Test 3: Navigation
- [ ] Navigate to different pages
- [ ] Go to profile page
- [ ] Go to projects page
- [ ] Go back to dashboard
- [ ] Use browser back button
- [ ] Use browser forward button
- [ ] Still logged in throughout?

**Expected Result:** ✅ Session maintained during navigation

---

## Session Monitoring Tests

### ✅ Test 4: SessionMonitor Indicator
- [ ] Look at bottom-right corner
- [ ] See "Session: active"?
- [ ] Indicator updates in real-time?
- [ ] No errors in console?

**Expected Result:** ✅ Indicator shows "Session: active"

---

### ✅ Test 5: Console Logs
Open browser console (F12) and check for:
- [ ] "Login successful" message
- [ ] "Session expires at" timestamp
- [ ] "SessionMonitor: Auth state changed: SIGNED_IN"
- [ ] No red error messages
- [ ] "Session: active" logs

**Expected Result:** ✅ Clean console logs, no errors

---

### ✅ Test 6: Session Check
- [ ] Wait 1-2 minutes after login
- [ ] Check console for "Session check" messages
- [ ] Should see periodic checks
- [ ] No errors during checks

**Expected Result:** ✅ Automatic session checks working

---

## Token Refresh Tests

### ✅ Test 7: Manual Token Refresh
Open `test-session.html`:
- [ ] Enter Supabase URL and Key
- [ ] Enter email and password
- [ ] Click "Test Login"
- [ ] See "Login successful"
- [ ] Click "Check Session"
- [ ] See session details
- [ ] Click "Refresh Session"
- [ ] See "Session refreshed successfully"

**Expected Result:** ✅ Manual refresh works

---

### ✅ Test 8: Automatic Refresh (Long Test)
**Note:** This test takes ~55 minutes

- [ ] Login to the app
- [ ] Note the session expiry time in console
- [ ] Wait until 5 minutes before expiry
- [ ] Watch console for "Session expiring soon, refreshing..."
- [ ] Should see "Token refreshed successfully"
- [ ] Session continues without interruption
- [ ] User not logged out

**Expected Result:** ✅ Token auto-refreshes before expiry

---

## Error Handling Tests

### ✅ Test 9: Invalid Credentials
- [ ] Go to login page
- [ ] Enter wrong password
- [ ] Click "Sign In"
- [ ] See error message
- [ ] Error is clear and helpful
- [ ] Can try again

**Expected Result:** ✅ Error handled gracefully

---

### ✅ Test 10: Network Error
- [ ] Login successfully
- [ ] Open DevTools > Network tab
- [ ] Set throttling to "Offline"
- [ ] Try to navigate
- [ ] Should see appropriate error
- [ ] Set back to "Online"
- [ ] App recovers automatically

**Expected Result:** ✅ Handles network errors

---

### ✅ Test 11: Expired Session
Using `test-session.html`:
- [ ] Login
- [ ] Wait for session to expire (or manipulate cookies)
- [ ] Try to access protected page
- [ ] Should redirect to /login
- [ ] Can login again successfully

**Expected Result:** ✅ Expired sessions handled properly

---

## Multi-Tab Tests

### ✅ Test 12: Multiple Tabs
- [ ] Login in Tab 1
- [ ] Open Tab 2 to same site
- [ ] Both tabs show logged in?
- [ ] Navigate in Tab 1
- [ ] Navigate in Tab 2
- [ ] Both stay logged in?
- [ ] Refresh Tab 1
- [ ] Refresh Tab 2
- [ ] Both still logged in?

**Expected Result:** ✅ Session shared across tabs

---

### ✅ Test 13: Logout in One Tab
- [ ] Login in Tab 1 and Tab 2
- [ ] Logout in Tab 1
- [ ] Tab 2 should detect logout
- [ ] Tab 2 redirects to login
- [ ] Both tabs logged out

**Expected Result:** ✅ Logout syncs across tabs

---

## Role-Based Tests

### ✅ Test 14: Builder Login
- [ ] Login as builder
- [ ] Redirects to /builder/dashboard
- [ ] Can access builder pages
- [ ] Cannot access contractor pages
- [ ] Session persists

**Expected Result:** ✅ Builder role works correctly

---

### ✅ Test 15: Contractor Login
- [ ] Login as contractor
- [ ] Redirects to /contractor/dashboard
- [ ] Can access contractor pages
- [ ] Cannot access builder pages
- [ ] Session persists

**Expected Result:** ✅ Contractor role works correctly

---

## Browser Compatibility Tests

### ✅ Test 16: Chrome/Edge
- [ ] All tests pass in Chrome
- [ ] All tests pass in Edge
- [ ] SessionMonitor works
- [ ] No console errors

**Expected Result:** ✅ Works in Chrome/Edge

---

### ✅ Test 17: Firefox
- [ ] All tests pass in Firefox
- [ ] SessionMonitor works
- [ ] No console errors

**Expected Result:** ✅ Works in Firefox

---

### ✅ Test 18: Safari (if available)
- [ ] All tests pass in Safari
- [ ] SessionMonitor works
- [ ] No console errors

**Expected Result:** ✅ Works in Safari

---

## Mobile Tests

### ✅ Test 19: Mobile Browser
- [ ] Open on mobile device
- [ ] Login works
- [ ] Session persists
- [ ] Navigation works
- [ ] Can refresh page
- [ ] Stays logged in

**Expected Result:** ✅ Works on mobile

---

## Performance Tests

### ✅ Test 20: Page Load Time
- [ ] Login
- [ ] Navigate to different pages
- [ ] Pages load quickly?
- [ ] No noticeable delay?
- [ ] SessionMonitor not slowing down app?

**Expected Result:** ✅ No performance impact

---

### ✅ Test 21: Memory Usage
- [ ] Open DevTools > Performance
- [ ] Record for 2 minutes
- [ ] Check memory usage
- [ ] No memory leaks?
- [ ] Memory stays stable?

**Expected Result:** ✅ No memory leaks

---

## Edge Cases

### ✅ Test 22: Rapid Page Refreshes
- [ ] Login
- [ ] Rapidly refresh page 10 times
- [ ] Still logged in?
- [ ] No errors?
- [ ] Session stable?

**Expected Result:** ✅ Handles rapid refreshes

---

### ✅ Test 23: Browser Back/Forward
- [ ] Login
- [ ] Navigate to several pages
- [ ] Click back button multiple times
- [ ] Click forward button multiple times
- [ ] Still logged in?
- [ ] No errors?

**Expected Result:** ✅ Handles browser navigation

---

### ✅ Test 24: Incognito Mode
- [ ] Open incognito/private window
- [ ] Login
- [ ] All features work?
- [ ] Session persists?
- [ ] Close and reopen incognito
- [ ] Session cleared (as expected)?

**Expected Result:** ✅ Works in incognito

---

## Production Readiness

### ✅ Test 25: Build Test
```bash
npm run build
```
- [ ] Build completes without errors
- [ ] No TypeScript errors
- [ ] No ESLint errors
- [ ] Build output looks good

**Expected Result:** ✅ Builds successfully

---

### ✅ Test 26: Production Mode
```bash
npm run build
npm start
```
- [ ] App runs in production mode
- [ ] Login works
- [ ] Session persists
- [ ] No SessionMonitor indicator (correct)
- [ ] All features work

**Expected Result:** ✅ Works in production mode

---

## Final Verification

### ✅ Test 27: End-to-End Flow
Complete user journey:
- [ ] Clear browser data
- [ ] Go to homepage
- [ ] Click login
- [ ] Enter credentials
- [ ] Login successful
- [ ] Redirected to dashboard
- [ ] View projects
- [ ] View profile
- [ ] Navigate around
- [ ] Refresh page
- [ ] Still logged in
- [ ] Wait 5 minutes
- [ ] Still logged in
- [ ] Logout
- [ ] Redirected to login
- [ ] Can login again

**Expected Result:** ✅ Complete flow works perfectly

---

## Test Results Summary

### Passed Tests: _____ / 27

### Failed Tests:
- [ ] None (hopefully!)
- [ ] List any failures here

### Issues Found:
1. _____________________
2. _____________________
3. _____________________

### Notes:
_____________________
_____________________
_____________________

---

## Sign-Off

- [ ] All critical tests passed
- [ ] No blocking issues found
- [ ] Ready for production deployment
- [ ] Documentation reviewed
- [ ] Team notified

**Tested By:** _____________________
**Date:** _____________________
**Status:** ✅ APPROVED / ⚠️ NEEDS WORK

---

## Quick Reference

### If Test Fails:

1. **Check console** for errors
2. **Clear browser data** and retry
3. **Check `.env.local`** configuration
4. **Verify Supabase** project is active
5. **Review logs** in Supabase Dashboard
6. **Try incognito mode** to rule out extensions
7. **Check documentation** files for help

### Documentation Files:
- `SESSION_FIX_COMPLETE.md` - Overview
- `SESSION_FIX_GUIDE.md` - Technical details
- `QUICK_FIX_REFERENCE.md` - Quick help
- `WHAT_CHANGED.md` - Visual guide

### Test Tools:
- `test-session.html` - Standalone tester
- Browser DevTools - Debugging
- Supabase Dashboard - Auth logs

---

**Good luck with testing! 🚀**
