/**
 * Enhanced query handler that detects and recovers from auth errors
 */

/**
 * Wraps a Supabase query with automatic error handling and recovery
 * @param {Function} queryFn - The query function to execute
 * @param {Object} supabase - Supabase client instance
 * @returns {Promise} Query result or error
 */
export async function handleQuery(queryFn, supabase) {
  try {
    const result = await queryFn()
    
    // Check for auth-related errors
    if (result.error) {
      const errorMessage = result.error.message?.toLowerCase() || ''
      const errorCode = result.error.code
      
      // Detect auth errors
      const isAuthError = 
        errorCode === 'PGRST301' || // JWT expired
        errorCode === 'PGRST302' || // JWT invalid
        errorMessage.includes('jwt') ||
        errorMessage.includes('token') ||
        errorMessage.includes('expired') ||
        errorMessage.includes('invalid') ||
        errorMessage.includes('unauthorized')
      
      if (isAuthError) {
        console.error('Auth error detected in query:', result.error)
        
        // Try to refresh the session
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
        
        if (refreshError) {
          console.error('Failed to refresh session:', refreshError)
          // Force sign out
          await supabase.auth.signOut()
          if (typeof window !== 'undefined') {
            window.location.href = '/login?session_expired=true'
          }
          return { data: null, error: result.error, authError: true }
        }
        
        // Retry the query with refreshed session
        console.log('Session refreshed, retrying query...')
        const retryResult = await queryFn()
        return { ...retryResult, wasRetried: true }
      }
    }
    
    return result
  } catch (err) {
    console.error('Unexpected error in query handler:', err)
    return { data: null, error: err }
  }
}

/**
 * Check if the current session is valid
 * @param {Object} supabase - Supabase client instance
 * @returns {Promise<boolean>} True if session is valid
 */
export async function isSessionValid(supabase) {
  try {
    const { data: { user }, error } = await supabase.auth.getUser()
    return !error && !!user
  } catch (err) {
    console.error('Error checking session validity:', err)
    return false
  }
}
