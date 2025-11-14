'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [user, setUser] = useState(null)
  const [userRole, setUserRole] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const getUser = async () => {
      try {
        // First try to get the session
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (error) {
          console.error('Session error:', error)
          // Try to recover by refreshing the session
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()
          if (!refreshError && refreshData?.session) {
            console.log('Session recovered via refresh')
            setUser(refreshData.session.user)
            setUserRole(refreshData.session.user.user_metadata?.user_type)
            setLoading(false)
            return
          }
          // If refresh fails, clear everything
          setUser(null)
          setUserRole(null)
          setProfile(null)
          setLoading(false)
          return
        }
        
        if (session) {
          setUser(session.user)
          setUserRole(session.user.user_metadata?.user_type)
          
          // Fetch profile data
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()
            
          if (!mounted) return

          if (profileError) {
            console.error('Profile fetch error:', profileError)
          } else if (profileData) {
            setProfile(profileData)
          }
        } else {
          setUser(null)
          setUserRole(null)
          setProfile(null)
        }
      } catch (err) {
        console.error('Unexpected error in getUser:', err)
        if (mounted) {
          setUser(null)
          setUserRole(null)
          setProfile(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id)

        if (!mounted) return

        if (event === 'SIGNED_OUT' || !session) {
          setUser(null)
          setUserRole(null)
          setProfile(null)
          setLoading(false)
          return
        }

        if (event === 'TOKEN_REFRESHED') {
          console.log('Token refreshed successfully')
        }

        if (session) {
          setUser(session.user)
          setUserRole(session.user.user_metadata?.user_type)
          
          // Fetch profile data
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()
              
            if (!mounted) return

            if (profileError) {
              console.error('Profile fetch error:', profileError)
            } else if (profileData) {
              setProfile(profileData)
            }
          } catch (err) {
            console.error('Error fetching profile:', err)
          }
        }
        
        if (mounted) {
          setLoading(false)
        }
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (user) {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        
      if (profileData) {
        setProfile(profileData)
      }
    }
  }

  return (
    <UserContext.Provider value={{ user, userRole, profile, loading, refreshProfile }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
