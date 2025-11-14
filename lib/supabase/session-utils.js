/**
 * Session utility functions for debugging and managing Supabase sessions
 */

export async function checkSession(supabase) {
  try {
    const { data: { session }, error } = await supabase.auth.getSession()
    
    if (error) {
      console.error('Session check error:', error)
      return { valid: false, error: error.message }
    }
    
    if (!session) {
      console.log('No active session found')
      return { valid: false, error: 'No session' }
    }
    
    // Check if token is expired
    const expiresAt = session.expires_at
    const now = Math.floor(Date.now() / 1000)
    const isExpired = expiresAt < now
    
    console.log('Session check:', {
      userId: session.user.id,
      expiresAt: new Date(expiresAt * 1000).toISOString(),
      isExpired,
      timeUntilExpiry: expiresAt - now,
    })
    
    return {
      valid: !isExpired,
      session,
      expiresAt,
      isExpired,
      timeUntilExpiry: expiresAt - now,
    }
  } catch (err) {
    console.error('Unexpected error checking session:', err)
    return { valid: false, error: err.message }
  }
}

export async function refreshSession(supabase) {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession()
    
    if (error) {
      console.error('Session refresh error:', error)
      return { success: false, error: error.message }
    }
    
    console.log('Session refreshed successfully')
    return { success: true, session }
  } catch (err) {
    console.error('Unexpected error refreshing session:', err)
    return { success: false, error: err.message }
  }
}

export function logSessionInfo(session) {
  if (!session) {
    console.log('No session to log')
    return
  }
  
  const expiresAt = session.expires_at
  const now = Math.floor(Date.now() / 1000)
  const timeUntilExpiry = expiresAt - now
  
  console.log('=== Session Info ===')
  console.log('User ID:', session.user.id)
  console.log('Email:', session.user.email)
  console.log('User Type:', session.user.user_metadata?.user_type)
  console.log('Expires At:', new Date(expiresAt * 1000).toISOString())
  console.log('Time Until Expiry:', Math.floor(timeUntilExpiry / 60), 'minutes')
  console.log('Is Expired:', timeUntilExpiry < 0)
  console.log('==================')
}
