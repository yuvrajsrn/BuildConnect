# Bid Submission - Quick Reference Card

## 🚀 Quick Start

1. **Open DevTools:** Press `F12`
2. **Go to Console tab**
3. **Navigate to project**
4. **Fill form completely**
5. **Click Submit**
6. **Watch console logs**

## ✅ Validation Requirements

| Field | Requirement |
|-------|-------------|
| **Quoted Price** | Number > 0, within budget range |
| **Duration** | Number > 0 (in days) |
| **Proposal** | Minimum 100 characters |
| **User** | Must be logged in as contractor |
| **Session** | Must be valid (not expired) |

## 📊 Console Logs to Expect

### Success Flow:
```
1. "Form submitted, user: {...}"
2. "Submitting bid with data: {...}"
3. "Session verified, user ID: ..."
4. "Bid inserted successfully: {...}"
```

### Then:
- Alert: "Bid submitted successfully!"
- Redirect to: `/contractor/bids`

## ❌ Common Errors

| Error Message | Quick Fix |
|---------------|-----------|
| "You must be logged in" | Log out and log back in |
| "Session has expired" | Log out and log back in |
| "Valid quoted price" | Enter number only, no symbols |
| "Between ₹X and ₹Y" | Check budget range, adjust price |
| "100 characters long" | Write more in proposal |
| "Database connection" | Refresh page |

## 🔍 Quick Diagnostics

### Check Authentication:
```javascript
// In Console:
localStorage.getItem('supabase.auth.token')
// Should return a token, not null
```

### Check User Data:
```javascript
// In Console (on project page):
console.log(user)
// Should show user object with id
```

### Check Network:
1. Go to **Network** tab
2. Submit bid
3. Look for POST to `/rest/v1/bids`
4. Check status code:
   - ✅ 201 = Success
   - ❌ 401 = Auth issue
   - ❌ 403 = RLS blocking
   - ❌ 422 = Validation error

## 🛠️ Emergency Fix

If nothing works:
1. Log out
2. Clear browser data (Ctrl+Shift+Delete)
3. Close all tabs
4. Restart browser
5. Log back in
6. Try again

## 📝 Before Submitting

- [ ] Logged in as contractor
- [ ] Project is open
- [ ] Deadline not passed
- [ ] No existing pending bid
- [ ] All fields filled correctly
- [ ] Proposal ≥ 100 chars
- [ ] Price within range
- [ ] Console open (F12)

## 🎯 Success Indicators

1. ✅ Console shows all 4 log messages
2. ✅ Alert appears
3. ✅ Redirected to bids page
4. ✅ Bid appears in list
5. ✅ No errors in console

## 📚 Full Documentation

- **Testing:** `BID_SUBMISSION_TESTING_GUIDE.md`
- **Troubleshooting:** `BID_SUBMISSION_TROUBLESHOOTING.md`
- **Technical Details:** `BID_SUBMISSION_FIX.md`
- **Summary:** `BID_SUBMISSION_FIXES_SUMMARY.md`

## 🆘 Still Stuck?

1. Screenshot console errors
2. Screenshot network tab
3. Note exact steps taken
4. Check `BID_SUBMISSION_TROUBLESHOOTING.md`
5. Report with all info collected

---

**Remember:** Keep DevTools open while testing!
