# Quick Fix Reference - Session Issues

## 🚨 Problem
- Can't login after a few minutes
- Data disappears
- Session gets lost
- Need to clear cookies to login again

## ✅ Solution Status
**FIXED** - All session management issues resolved

## 🔧 What Was Fixed

| Issue | Fix | File |
|-------|-----|------|
| Sessions expiring | Auto-refresh tokens | `lib/supabase/client.js` |
| Lost cookies | Proper cookie handling | `lib/supabase/client.js` |
| No monitoring | Added SessionMonitor | `components/SessionMonitor.jsx` |
| Poor error handling | Enhanced error recovery | `context/UserContext.jsx` |
| Stale sessions | Clear invalid cookies | `middleware.js` |
| Login issues | Full page reload | `components/auth/SignInForm.jsx` |

## 🧪 Quick Test

```bash
# 1. Clear browser data
Press F12 > Application > Clear storage > Clear site data

# 2. Start dev server
npm run dev

# 3. Login
Go to http://localhost:3000/login

# 4. Test persistence
- Refresh page multiple times
- Navigate between pages
- Wait 5-10 minutes
- Should stay logged in!
```

## 🐛 Debug Indicator

Look for this in bottom-right corner (dev mode only):

- `Session: active` ✅ All good
- `Session: checking` ⏳ Verifying
- `Session: expired` ❌ Need to re-login
- `Session: error` ⚠️ Check console

## 📊 Test Page

Open `test-session.html` in browser:
1. Enter your Supabase URL and Key
2. Enter email and password
3. Click "Test Login"
4. Monitor session status
5. Test refresh and logout

## 🔍 Console Messages

**Good signs:**
```
✅ Login successful
✅ Session: active
✅ Token refreshed successfully
```

**Warning signs:**
```
⚠️ Session expiring soon, refreshing...
⚠️ Session check error
❌ Session expired
```

## 🛠️ Troubleshooting

### Still getting logged out?

**Step 1:** Clear everything
```
1. Open DevTools (F12)
2. Application > Storage > Clear site data
3. Close and reopen browser
```

**Step 2:** Check environment
```bash
# Verify .env.local has:
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key-here
```

**Step 3:** Check Supabase
```
1. Go to Supabase Dashboard
2. Authentication > Logs
3. Look for errors
```

**Step 4:** Test in incognito
```
1. Open incognito/private window
2. Try logging in
3. If works = browser extension issue
```

### Session not persisting?

**Check cookies:**
```
F12 > Application > Cookies
Should see: sb-*-auth-token
```

**Check localStorage:**
```
F12 > Application > Local Storage
Should see: sb-*-auth-token
```

**Check console:**
```
F12 > Console
Look for red errors
```

## 📁 Key Files

### Modified:
- `lib/supabase/client.js` - Client config
- `context/UserContext.jsx` - Session state
- `middleware.js` - Route protection
- `components/auth/SignInForm.jsx` - Login flow
- `app/layout.js` - Added monitor

### Created:
- `components/SessionMonitor.jsx` - Auto-refresh
- `lib/supabase/session-utils.js` - Utilities
- `test-session.html` - Test tool

## 🎯 Key Features

✅ **Auto-refresh** - Tokens refresh before expiry
✅ **Persistence** - Sessions survive page reloads
✅ **Monitoring** - Real-time session health checks
✅ **Error handling** - Graceful recovery from errors
✅ **Debug mode** - Visual indicator in development
✅ **Cookie management** - Proper cookie handling
✅ **Memory safety** - No memory leaks

## ⚙️ Configuration

**Session duration:** 1 hour (default)
**Refresh check:** Every 1 minute
**Auto-refresh:** 5 minutes before expiry
**Refresh token:** 30 days

Change in: Supabase Dashboard > Auth > Settings

## 📚 Documentation

- `SESSION_FIX_SUMMARY.md` - Quick overview
- `SESSION_FIX_GUIDE.md` - Detailed guide
- `QUICK_FIX_REFERENCE.md` - This file

## 🆘 Still Need Help?

1. **Check logs:**
   - Browser console (F12)
   - Supabase Dashboard > Auth > Logs

2. **Test tools:**
   - Use `test-session.html`
   - Check SessionMonitor indicator

3. **Verify setup:**
   - Environment variables correct?
   - Supabase project active?
   - Cookies enabled?

4. **Fresh start:**
   - Clear all browser data
   - Restart dev server
   - Try incognito mode

## 💡 Tips

- Always clear browser data after code changes
- Watch the SessionMonitor indicator
- Check console for detailed logs
- Test in incognito to rule out extensions
- Use test-session.html for debugging

## ✨ Expected Behavior

**After login:**
1. Redirect to dashboard
2. See "Session: active" indicator
3. Can navigate freely
4. Page refreshes work
5. Stay logged in for hours

**Before expiry:**
1. SessionMonitor detects expiring token
2. Automatically refreshes
3. Console shows "Token refreshed"
4. No interruption to user

**On expiry:**
1. If refresh fails
2. Redirect to /login
3. Clear message shown
4. Can login again

---

**Status:** ✅ Ready to use
**Last Updated:** Now
**Priority:** Critical fix applied
