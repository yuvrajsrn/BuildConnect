# Session Management Fix Guide

## Problem
Users were experiencing authentication issues where:
- Login works initially but stops working after a few minutes
- Unable to see data after some time
- Session appears to expire or get lost
- Need to re-login frequently

## Root Causes Identified

1. **Cookie Handling Issues**: The Supabase client wasn't properly managing cookies in the browser
2. **Session Refresh Not Working**: Tokens weren't being automatically refreshed before expiration
3. **No Session Monitoring**: No mechanism to detect and handle session expiration
4. **Missing Error Handling**: Session errors weren't being caught and handled properly

## Fixes Applied

### 1. Enhanced Supabase Client Configuration (`lib/supabase/client.js`)

**Changes:**
- Added explicit cookie management handlers
- Enabled `persistSession: true` to maintain sessions across page reloads
- Enabled `autoRefreshToken: true` for automatic token refresh
- Added PKCE flow for better security
- Configured localStorage as the storage mechanism

**Key Settings:**
```javascript
{
  auth: {
    persistSession: true,        // Keep session across reloads
    autoRefreshToken: true,      // Auto-refresh before expiry
    detectSessionInUrl: true,    // Handle email confirmation links
    flowType: 'pkce',           // More secure auth flow
    storage: window.localStorage // Persist in localStorage
  }
}
```

### 2. Improved UserContext (`context/UserContext.jsx`)

**Changes:**
- Added proper error handling for session retrieval
- Added cleanup with `mounted` flag to prevent memory leaks
- Added detailed logging for auth state changes
- Handle TOKEN_REFRESHED events
- Better error recovery

**Benefits:**
- Prevents race conditions
- Provides visibility into auth state changes
- Gracefully handles session errors

### 3. Enhanced Middleware (`middleware.js`)

**Changes:**
- Added error handling for session retrieval
- Clear invalid cookies when session errors occur
- Reuse session variable instead of fetching twice

**Benefits:**
- Prevents redirect loops
- Cleans up stale authentication data
- Better error recovery

### 4. Session Monitor Component (`components/SessionMonitor.jsx`)

**New Feature:**
- Automatically checks session health every minute
- Refreshes tokens when they're about to expire (< 5 minutes)
- Redirects to login when session expires
- Listens for auth state changes
- Shows debug indicator in development mode

**Benefits:**
- Proactive session management
- Prevents unexpected logouts
- Better user experience

### 5. Session Utilities (`lib/supabase/session-utils.js`)

**New Utilities:**
- `checkSession()`: Verify session validity and expiration
- `refreshSession()`: Manually refresh session
- `logSessionInfo()`: Debug session information

**Usage:**
```javascript
import { checkSession, refreshSession } from '@/lib/supabase/session-utils'

// Check if session is valid
const { valid, session, timeUntilExpiry } = await checkSession(supabase)

// Manually refresh session
const { success, session } = await refreshSession(supabase)
```

### 6. Improved Login Flow (`components/auth/SignInForm.jsx`)

**Changes:**
- Added session expiry logging
- Use `window.location.href` instead of `router.push` for full page reload
- Added small delay to ensure cookies are set
- Better ensures middleware picks up the new session

## Testing the Fix

### 1. Test Login
```bash
1. Clear browser cookies and localStorage
2. Login with valid credentials
3. Verify redirect to correct dashboard
4. Check browser console for "Login successful" message
```

### 2. Test Session Persistence
```bash
1. Login successfully
2. Refresh the page multiple times
3. Navigate between different pages
4. Verify you remain logged in
5. Check console for "Session: active" in bottom-right corner (dev mode)
```

### 3. Test Session Refresh
```bash
1. Login successfully
2. Wait for session to approach expiry (check console logs)
3. SessionMonitor should automatically refresh the token
4. Verify no logout occurs
5. Check console for "Token refreshed successfully"
```

### 4. Test Session Expiry
```bash
1. Login successfully
2. Manually expire the session (wait or manipulate cookies)
3. Try to access protected pages
4. Should redirect to /login
5. Check console for "Session expired"
```

## Monitoring Session Health

### Development Mode
In development, you'll see a small indicator in the bottom-right corner showing session status:
- `checking`: Initial check
- `active`: Session is valid
- `no-session`: No active session
- `expired`: Session has expired
- `error`: Error checking session
- `refresh-failed`: Failed to refresh token

### Console Logs
Watch for these key messages:
- "Login successful" - Login completed
- "Session expires at" - When current session expires
- "Token refreshed successfully" - Auto-refresh worked
- "Session expiring soon, refreshing..." - Proactive refresh
- "Auth state changed" - Session state updates

## Configuration

### Session Duration
Supabase default session duration is 1 hour. To change this:
1. Go to Supabase Dashboard
2. Navigate to Authentication > Settings
3. Adjust "JWT expiry limit"

### Refresh Token Duration
Default is 30 days. Users will need to re-login after this period.

## Troubleshooting

### Issue: Still getting logged out
**Solution:**
1. Clear all browser cookies and localStorage
2. Check browser console for errors
3. Verify Supabase URL and keys in `.env.local`
4. Check Supabase dashboard for auth logs

### Issue: Session not persisting across tabs
**Solution:**
1. Ensure localStorage is enabled in browser
2. Check if cookies are being blocked
3. Verify same domain across tabs

### Issue: Infinite redirect loop
**Solution:**
1. Clear cookies and localStorage
2. Check middleware.js for correct paths
3. Verify user_type is set correctly in profiles table

### Issue: "Session check error" in console
**Solution:**
1. Check network connectivity
2. Verify Supabase project is active
3. Check API keys are correct
4. Look at Supabase auth logs for errors

## Best Practices

1. **Always use the createClient() function** - Don't create multiple Supabase instances
2. **Check session before protected operations** - Use `checkSession()` utility
3. **Handle auth state changes** - Listen to `onAuthStateChange` events
4. **Clear sensitive data on logout** - Reset all user-related state
5. **Test session expiry scenarios** - Don't just test happy paths

## Additional Security Recommendations

1. **Enable RLS (Row Level Security)** on all tables
2. **Use HTTPS in production** - Required for secure cookies
3. **Set appropriate CORS policies** in Supabase
4. **Rotate API keys regularly**
5. **Monitor auth logs** for suspicious activity

## Files Modified

- `lib/supabase/client.js` - Enhanced client configuration
- `context/UserContext.jsx` - Improved session handling
- `middleware.js` - Better error handling
- `components/auth/SignInForm.jsx` - Improved login flow
- `app/layout.js` - Added SessionMonitor

## Files Created

- `components/SessionMonitor.jsx` - Automatic session management
- `lib/supabase/session-utils.js` - Session utility functions
- `SESSION_FIX_GUIDE.md` - This documentation

## Next Steps

1. Test thoroughly in development
2. Monitor console logs for any errors
3. Test with multiple users and roles
4. Deploy to staging environment
5. Monitor production auth logs
6. Consider adding session analytics

## Support

If issues persist:
1. Check Supabase auth logs: Dashboard > Authentication > Logs
2. Review browser console for errors
3. Check network tab for failed requests
4. Verify environment variables are correct
5. Test with a fresh browser profile (no extensions)
