'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

/**
 * SessionMonitor - Monitors session health and auto-refreshes when needed
 * Add this component to your layout to enable automatic session management
 */
export default function SessionMonitor() {
  const [sessionStatus, setSessionStatus] = useState('checking')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    let refreshInterval

    const checkAndRefreshSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Session check error:', error)
          setSessionStatus('error')
          return
        }

        if (!session) {
          setSessionStatus('no-session')
          return
        }

        const expiresAt = session.expires_at
        const now = Math.floor(Date.now() / 1000)
        const timeUntilExpiry = expiresAt - now

        // If session expires in less than 5 minutes, refresh it
        if (timeUntilExpiry < 300 && timeUntilExpiry > 0) {
          console.log('Session expiring soon, refreshing...')
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          
          if (refreshError) {
            console.error('Failed to refresh session:', refreshError)
            setSessionStatus('refresh-failed')
          } else {
            console.log('Session refreshed successfully')
            setSessionStatus('active')
            router.refresh()
          }
        } else if (timeUntilExpiry <= 0) {
          console.log('Session expired')
          setSessionStatus('expired')
          // Redirect to login
          router.push('/login')
        } else {
          setSessionStatus('active')
        }
      } catch (err) {
        console.error('Unexpected error in session monitor:', err)
        if (mounted) {
          setSessionStatus('error')
        }
      }
    }

    // Check immediately
    checkAndRefreshSession()

    // Check every minute
    refreshInterval = setInterval(checkAndRefreshSession, 60000)

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('SessionMonitor: Auth state changed:', event)
      
      if (event === 'SIGNED_OUT') {
        setSessionStatus('signed-out')
        router.push('/login')
      } else if (event === 'TOKEN_REFRESHED') {
        console.log('SessionMonitor: Token refreshed')
        setSessionStatus('active')
      } else if (event === 'SIGNED_IN') {
        setSessionStatus('active')
      }
    })

    return () => {
      mounted = false
      if (refreshInterval) {
        clearInterval(refreshInterval)
      }
      subscription.unsubscribe()
    }
  }, [supabase, router])

  // This component doesn't render anything visible
  // You can add a debug indicator if needed during development
  if (process.env.NODE_ENV === 'development') {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-full z-50">
        Session: {sessionStatus}
      </div>
    )
  }

  return null
}
