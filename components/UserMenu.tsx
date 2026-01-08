"use client"
import { useEffect, useRef, useState } from 'react'
import { useAuth, signOut } from '@/lib/auth/useAuth'
import { db } from '@/lib/firebase/client'
import { doc, onSnapshot } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { LogOut, Crown, User, CreditCard } from 'lucide-react'

function classNames(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(' ')
}

type SubState = {
  isSubscribed?: boolean
  subscriptionStatus?: string
  subscription_status?: string
  subscriptionId?: string
}

function SubscriptionBadge({ state }: { state: SubState }) {
  const active = state.isSubscribed || state.subscriptionStatus === 'active' || state.subscription_status === 'active'
  const pending = !active && !!state.subscriptionId

  if (active) {
    return (
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
        <Crown className="w-3 h-3 text-blue-400" />
        <span className="text-xs font-medium text-blue-400">Pro</span>
      </div>
    )
  }

  if (pending) {
    return (
      <span className="px-2.5 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-400">
        Pending
      </span>
    )
  }

  return (
    <span className="px-2.5 py-1 rounded-full bg-neutral-800 border border-neutral-700 text-xs font-medium text-neutral-400">
      Free
    </span>
  )
}

export function UserMenu() {
  const { user } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [profile, setProfile] = useState<SubState>({})
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (!ref.current) return
      if (!ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  useEffect(() => {
    if (!user) return
    const unsub = onSnapshot(doc(db, 'users', user.uid), (snap) => {
      setProfile((snap.data() as any) || {})
    })
    return () => unsub()
  }, [user])

  const avatar = user?.photoURL || ''
  const initial = (user?.displayName || user?.email || 'U').charAt(0).toUpperCase()

  const active = profile.isSubscribed || profile.subscriptionStatus === 'active' || profile.subscription_status === 'active'

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="User menu"
        onClick={() => setOpen((v) => !v)}
        className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-neutral-800 transition hover:ring-neutral-600"
      >
        {avatar ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img alt="avatar" src={avatar} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
            <span className="text-sm font-semibold text-white">{initial}</span>
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900 shadow-2xl z-50">
          {/* User Info Header */}
          <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-neutral-900 to-neutral-900/50">
            <div className="h-12 w-12 overflow-hidden rounded-full ring-2 ring-neutral-700">
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt="avatar" src={avatar} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                  <User className="w-5 h-5 text-white" />
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-white">{user?.displayName || 'User'}</div>
              <div className="truncate text-xs text-neutral-400">{user?.email}</div>
            </div>
          </div>

          <div className="h-px bg-neutral-800" />

          {/* Subscription Status */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-neutral-400">Plan</span>
              <SubscriptionBadge state={profile} />
            </div>
            {!active && (
              <button
                onClick={() => {
                  setOpen(false)
                  router.push('/billing')
                }}
                className="w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </button>
            )}
            {active && (
              <button
                onClick={() => {
                  setOpen(false)
                  router.push('/billing')
                }}
                className="w-full px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-sm font-medium transition-all flex items-center justify-center gap-2"
              >
                <CreditCard className="w-4 h-4" />
                Manage Subscription
              </button>
            )}
          </div>

          <div className="h-px bg-neutral-800" />

          {/* Logout Button */}
          <button
            onClick={async () => {
              try {
                await signOut()
              } finally {
                router.replace('/')
              }
            }}
            className="w-full px-4 py-3 text-left text-sm text-neutral-300 hover:bg-neutral-800 hover:text-white transition-colors flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  )
}
