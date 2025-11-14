# Session Corruption Fix

## Problem
The app was experiencing session corruption where it would work for some time and then get stuck - data wouldn't load and nothing would work. The only fix was to delete cookies and site data.

## Root Cause
The issue was caused by using `getSession()` which returns STALE CACHED data:
1. `getSession()` returns cached session data without verifying if the token is still valid
2. When the auth token expires or becomes invalid, the cache isn't updated
3. All database queries fail silently because the token is invalid
4. The app gets stuck because it thinks it has a valid session but can't fetch data

## Solution Applied

### 1. Use `getUser()` Instead of `getSession()` (CRITICAL FIX)
**Changed in:** `middleware.js`, `context/UserContext.jsx`, `components/SessionMonitor.jsx`

- `getUser()` makes a FRESH API call to verify the token is valid
- `getSession()` returns stale cached data that can be invalid
- This is the KEY fix that prevents the stuck state

### 2. Enhanced Middleware (`middleware.js`)
- Uses `getUser()` to verify auth on every request
- Clears all auth cookies (including project-specific ones) on error
- Prevents invalid tokens from persisting

### 3. Fixed UserContext (`context/UserContext.jsx`)
- Uses `getUser()` for initial auth check
- Removes stale session cache issues
- Cleaner error handling

### 4. Enhanced Session Monitor (`components/SessionMonitor.jsx`)
- Uses `getUser()` to verify token validity every minute
- Detects 3 consecutive errors and forces sign out
- Auto-refreshes expiring sessions

### 5. New Query Handler (`lib/supabase/query-handler.js`)
- Detects auth errors in database queries
- Automatically refreshes session and retries
- Forces sign out if refresh fails
- Can be used to wrap any Supabase query for auto-recovery

## Testing the Fix

1. **Normal Operation**: Log in and use the app normally - should work smoothly
2. **Session Expiry**: Wait for session to expire - should auto-refresh or redirect to login
3. **Corruption Recovery**: If corruption occurs, app should auto-recover within 3 minutes
4. **Manual Recovery**: Users can log out and back in if issues persist

## Manual Recovery (If Needed)

If you still experience issues, you can manually clear the session:

```javascript
import { createClient } from '@/lib/supabase/client'
import { clearCorruptedSession } from '@/lib/supabase/session-utils'

const supabase = createClient()
await clearCorruptedSession(supabase)
// Then redirect to login
window.location.href = '/login'
```

## Why This Works

**The Key Difference:**
- `getSession()` → Returns cached data (can be stale/invalid)
- `getUser()` → Makes fresh API call (always current)

When you were experiencing the stuck state:
1. Your auth token expired or became invalid
2. `getSession()` kept returning the old cached session
3. All database queries failed because the token was invalid
4. The app thought it was logged in but couldn't fetch data
5. Only clearing cookies/data forced a fresh auth check

Now with `getUser()`:
1. Every check verifies the token is actually valid
2. If invalid, we immediately know and can refresh or sign out
3. No more stuck states from stale cache
4. Auto-recovery when possible

## Prevention

The fix prevents future corruption by:
- Using `getUser()` for all auth checks (fresh data, not cache)
- Auto-detecting invalid tokens immediately
- Auto-refreshing sessions before they expire
- Forcing sign out if recovery fails
- Clearing all auth cookies on errors

## Next Steps

1. Deploy these changes
2. Monitor for any session-related errors in logs
3. Users should no longer need to manually clear cookies/data
4. If issues persist, check browser console for specific error messages
