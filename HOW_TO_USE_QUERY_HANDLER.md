# How to Use Query Handler (Optional Enhancement)

The query handler provides automatic error detection and recovery for database queries. While the main fix (using `getUser()`) solves the core issue, you can optionally wrap queries for extra protection.

## Basic Usage

### Before (Standard Query)
```javascript
const { data, error } = await supabase
  .from('projects')
  .select('*')
  .eq('status', 'open')

if (error) {
  console.error('Error:', error)
  return
}
```

### After (With Auto-Recovery)
```javascript
import { handleQuery } from '@/lib/supabase/query-handler'

const { data, error, authError } = await handleQuery(
  () => supabase
    .from('projects')
    .select('*')
    .eq('status', 'open'),
  supabase
)

if (authError) {
  // User was signed out and redirected
  return
}

if (error) {
  console.error('Error:', error)
  return
}
```

## What It Does

1. **Detects Auth Errors**: Identifies JWT expired, invalid token, etc.
2. **Auto-Refreshes**: Tries to refresh the session automatically
3. **Retries Query**: Re-runs the query with fresh token
4. **Forces Sign Out**: If refresh fails, signs out and redirects

## When to Use

- **Critical queries** where you want guaranteed recovery
- **User-facing operations** where failures would be confusing
- **Background operations** that should retry automatically

## When NOT to Use

- You don't need to wrap every query
- The main fix (using `getUser()`) already prevents most issues
- Use it selectively for important operations

## Check Session Validity

```javascript
import { isSessionValid } from '@/lib/supabase/query-handler'

if (await isSessionValid(supabase)) {
  // Proceed with operation
} else {
  // Redirect to login
}
```

## Note

The core fix is using `getUser()` instead of `getSession()`. The query handler is an optional enhancement for extra protection on critical operations.
