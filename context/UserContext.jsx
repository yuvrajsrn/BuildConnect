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
    const getUser = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()

        if (error) {
          console.error('Error getting session:', error)
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

          if (profileError) {
            console.error('Error fetching profile:', profileError)
            // Still set loading to false even if profile fetch fails
          } else if (profileData) {
            setProfile(profileData)
          }
        }
      } catch (error) {
        console.error('Error in getUser:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        try {
          if (session) {
            setUser(session.user)
            setUserRole(session.user.user_metadata?.user_type)

            // Fetch profile data
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single()

            if (profileError) {
              console.error('Error fetching profile on auth change:', profileError)
            } else if (profileData) {
              setProfile(profileData)
            }
          } else {
            setUser(null)
            setUserRole(null)
            setProfile(null)
          }
        } catch (error) {
          console.error('Error in onAuthStateChange:', error)
        } finally {
          setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const refreshProfile = async () => {
    if (user) {
      try {
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileError) {
          console.error('Error refreshing profile:', profileError)
        } else if (profileData) {
          setProfile(profileData)
        }
      } catch (error) {
        console.error('Error in refreshProfile:', error)
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
