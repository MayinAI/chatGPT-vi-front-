"use client"
import { createContext, useContext, useEffect, useState } from 'react'
import { useAuth } from './useAuth'
import { db } from '@/lib/firebase/client'
import { doc, onSnapshot } from 'firebase/firestore'

interface Profile {
  isSubscribed?: boolean
  subscriptionStatus?: string
  planTier?: string
  scanCredits?: number
  [key: string]: any
}

const ProfileContext = createContext<Profile | null>(null)

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (!user) {
      setProfile(null)
      return
    }

    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      setProfile(snap.data() || {})
    })

    return () => unsub()
  }, [user])

  return (
    <ProfileContext.Provider value={profile}>
      {children}
    </ProfileContext.Provider>
  )
}

export function useProfile() {
  return useContext(ProfileContext)
}
