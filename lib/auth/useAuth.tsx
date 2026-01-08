"use client"
import { useEffect, useState } from 'react'
import { auth, googleProvider, db } from '@/lib/firebase/client'
import { onAuthStateChanged, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as fbSignOut, User } from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      setLoading(false)
      // Ensure user document exists with basic fields for backend functions
      if (u) {
        try {
          const ref = doc(db, 'users', u.uid)
          const snap = await getDoc(ref)
          const base = {
            email: u.email || null,
            display_name: u.displayName || null,
            last_login_at: serverTimestamp(),
          }
          if (!snap.exists()) {
            await setDoc(ref, { ...base, created_at: serverTimestamp(), freeScanUsed: false }, { merge: true })
          } else {
            await setDoc(ref, base, { merge: true })
          }
        } catch {
          // Best-effort; ignore errors on client
        }
      }
    })
    return () => unsub()
  }, [])

  return { user, loading }
}

export async function signInWithGoogle() {
  await signInWithPopup(auth, googleProvider)
}

export async function signInWithEmail(email: string, password: string) {
  await signInWithEmailAndPassword(auth, email, password)
}

export async function signUpWithEmail(email: string, password: string) {
  await createUserWithEmailAndPassword(auth, email, password)
}

export async function signOut() {
  await fbSignOut(auth)
}
