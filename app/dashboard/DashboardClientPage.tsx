"use client"
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { useProfile } from '@/lib/auth/ProfileProvider'
import { listenToScans } from '@/lib/visibility'
import { db } from '@/lib/firebase/client'
import { collection, getDocs } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'
import { UserMenu } from '@/components/UserMenu'
import { Logo } from '@/components/Logo'
import { getUserSubscriptionStatus } from '@/lib/functions'
import { motion } from 'framer-motion'
import {
  Plus, TrendingUp, Crown, Zap, Calendar,
  BarChart3, CheckCircle2, XCircle, Clock, ArrowRight
} from 'lucide-react'

export default function DashboardClientPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, loading } = useAuth()
  const profile = useProfile()
  const [scans, setScans] = useState<any[]>([])
  const [diagCooldown, setDiagCooldown] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [subStatus, setSubStatus] = useState<null | {
    isSubscribed: boolean
    subscriptionStatus: string
    planTier: string
    scanCredits: number
    monthlyLimit: number
    currentMonthScans: number
    scansRemaining: number
    canCreateScan: boolean
  }>(null)

  useEffect(() => {
    if (!user) return
    const unsub = listenToScans(user.uid, setScans)
    return () => unsub()
  }, [user])

  // Check 15-day diagnostics cooldown to disable new scans globally
  useEffect(() => {
    const check = async () => {
      try {
        if (!user) return setDiagCooldown(false)
        const dcol = collection(db, 'users', user.uid, 'diagnostics')
        const snap = await getDocs(dcol)
        const now = Date.now()
        const active = snap.docs.some(d => {
          const cu: any = (d.data() as any).cooldownUntil
          const dt = cu?.toDate ? cu.toDate() : (cu ? new Date(cu) : null)
          return !!(dt && now < dt.getTime())
        })
        setDiagCooldown(active)
      } catch { setDiagCooldown(false) }
    }
    check()
  }, [user])

  // Load accurate subscription/credit gating from backend
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        if (!user) return
        const s = await getUserSubscriptionStatus()
        if (!cancelled) setSubStatus(s as any)
      } catch {
        // ignore – UI will fallback to profile document fields
      }
    }
    load()
    // also reload when user doc changes (e.g., webhook updates)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, profile?.subscriptionStatus, profile?.scanCredits, profile?.freeScanUsed])

  useEffect(() => {
    const sessionId = searchParams.get('session_id')
    if (sessionId) {
      setShowSuccess(true)
      const interval = setInterval(async () => {
        if (profile && profile.isSubscribed) {
          clearInterval(interval)
        }
      }, 2000)
      setTimeout(() => {
        clearInterval(interval)
      }, 30000) // 30 second timeout
    }
  }, [searchParams, profile])

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Please sign in</div>
      </div>
    )
  }

  console.log('Profile object:', profile)
  const privileged = user?.email === 'onegoal1crore@gmail.com'
  const isSubscribed = !!(subStatus?.isSubscribed ?? profile?.isSubscribed)
  const planTier = String((subStatus?.planTier ?? (profile as any)?.planTier) || '').toLowerCase()
  const canCreateScan = privileged ? true : (
    (subStatus?.canCreateScan ?? (
      isSubscribed
        ? true
        : (!profile?.freeScanUsed || (profile?.scanCredits || 0) > 0)
    )) && !diagCooldown
  )

  // Compute next available scan date for Pro: 1 scan every 15 days
  let proNextAvailableText: string | null = null
  try {
    if (isSubscribed && planTier === 'pro') {
      const proScans = (scans || [])
        .filter(s => String(s.planTier || '').toLowerCase() === 'pro' && s.startedAt)
        .slice()
        .sort((a: any, b: any) => (b.startedAt?.toMillis?.() || 0) - (a.startedAt?.toMillis?.() || 0))
      const last = proScans[0]
      if (last) {
        const lastMs = last.startedAt?.toMillis?.() ? last.startedAt.toMillis() : (new Date(last.startedAt).getTime())
        const fifteenMs = 15 * 24 * 60 * 60 * 1000
        const nextAt = lastMs + fifteenMs
        const now = Date.now()
        if (now < nextAt) {
          const daysLeft = Math.max(1, Math.ceil((nextAt - now) / (24 * 60 * 60 * 1000)))
          const dateStr = new Date(nextAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
          proNextAvailableText = `Next scan available in ${daysLeft} day${daysLeft === 1 ? '' : 's'} (on ${dateStr}).`
        }
      }
    }
  } catch {}

  const getScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-400'
    if (score >= 50) return 'text-yellow-400'
    if (score >= 25) return 'text-orange-400'
    return 'text-red-400'
  }
  const capFirst = (v: any) => {
    const str = (v ?? '').toString()
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : ''
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-neutral-800/50 bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo href="/" />
            <div className="h-6 w-px bg-neutral-800" />
            <h1 className="text-lg font-semibold">Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            {!isSubscribed && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => router.push('/billing')}
                className="flex items-center gap-2"
              >
                <Crown className="w-4 h-4" />
                Upgrade to Pro
              </Button>
            )}
            <UserMenu />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Success Message */}
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 mb-8 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <strong>Payment successful!</strong> Your subscription has been updated.
            </div>
          </motion.div>
        )}

        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-2">Welcome back</h2>
          <p className="text-neutral-400 text-lg">Track your brand&apos;s visibility in AI conversations</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Crown className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold text-neutral-400">Plan</h3>
            </div>
            <p className="text-2xl font-bold capitalize">{profile?.planTier || 'free'}</p>
            {!isSubscribed && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => router.push('/billing')}
              >
                Upgrade
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="font-semibold text-neutral-400">Status</h3>
            </div>
            <p className="text-2xl font-bold capitalize">{profile?.subscriptionStatus || 'inactive'}</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <BarChart3 className="w-5 h-5 text-purple-400" />
              </div>
              <h3 className="font-semibold text-neutral-400">{isSubscribed ? 'Scans Used' : 'Free Scan'}</h3>
            </div>
            <p className="text-2xl font-bold">
              {isSubscribed
                ? `${subStatus?.currentMonthScans || 0} / ${(subStatus?.monthlyLimit || 10)}`
                : !profile?.freeScanUsed ? '1 available' : '0 / 1'}
            </p>
            {!isSubscribed && profile?.freeScanUsed && (
              <Button
                variant="outline"
                size="sm"
                className="mt-4 w-full"
                onClick={() => router.push('/billing')}
              >
                Get More Scans
              </Button>
            )}
          </motion.div>
        </div>

        {/* CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="p-8 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 mb-8 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-4">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-neutral-300">AI Visibility Scan</span>
          </div>
          <h2 className="text-2xl font-bold mb-2">Ready to check your brand&apos;s visibility?</h2>
          <p className="text-neutral-400 mb-6 max-w-2xl mx-auto">
            Run a comprehensive scan to see how ChatGPT mentions your brand and compare against competitors
          </p>
          <Button
            variant="primary"
            size="lg"
            onClick={() => router.push('/scan/new')}
            disabled={!canCreateScan}
            className="flex items-center gap-2 mx-auto"
          >
            <Plus className="w-5 h-5" />
            New Visibility Scan
          </Button>
          {!canCreateScan && (
            <div className="mt-4 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm max-w-xl mx-auto">
              {diagCooldown
                ? 'Scanning is disabled for 15 days after generating strategies. Please try again later.'
                : isSubscribed
                  ? (proNextAvailableText || `You've used all ${(subStatus?.monthlyLimit ?? profile?.monthlyLimit) || 0} scans this month. Your limit resets next month.`)
                  : 'No scan credits remaining. Purchase credits or subscribe to continue.'}
            </div>
          )}
        </motion.div>

        {/* Recent Scans */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Scans</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/scan/new')}
              className="flex items-center gap-2"
              disabled={!canCreateScan}
            >
              <Plus className="w-4 h-4" />
              New Scan
            </Button>
          </div>

          {scans.length === 0 ? (
            <div className="p-12 rounded-xl bg-neutral-900/30 border border-neutral-800 text-center">
              <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-neutral-400 mb-4">No scans yet. Start your first visibility scan.</p>
              <Button
                variant="primary"
                onClick={() => router.push('/scan/new')}
                disabled={!canCreateScan}
              >
                Run Your First Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all group cursor-pointer"
                  onClick={() => router.push(`/scan/${s.id}`)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Score Badge */}
                      <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-neutral-700 flex flex-col items-center justify-center">
                        <span className={`text-3xl font-bold ${getScoreColor(typeof s.score === 'number' ? s.score : 0)}`}>
                          {typeof s.score === 'number' ? s.score : '--'}
                        </span>
                        <span className="text-xs text-neutral-500">score</span>
                      </div>

                      {/* Scan Info */}
                      <div>
                        <h3 className="text-xl font-semibold mb-1 group-hover:text-blue-400 transition-colors">
                          {capFirst(s.brandName)}
                        </h3>
                        <div className="flex items-center gap-3 text-sm text-neutral-400 mb-2">
                          <span>{s.category}</span>
                          <span>•</span>
                          <span>{s.locationScope}</span>
                          {(() => {
                            // Per-brand sequence number: order scans of same brand by start time
                            try {
                              const same = scans
                                .filter(x => (x.brandName || '').toLowerCase() === (s.brandName || '').toLowerCase())
                                .slice()
                                .sort((a,b) => (a.startedAt?.toMillis?.() || 0) - (b.startedAt?.toMillis?.() || 0))
                              const n = same.findIndex(x => x.id === s.id)
                              if (n >= 0) return <span className="ml-2 px-1.5 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-neutral-300">#{n + 1}</span>
                            } catch {}
                            return null
                          })()}
                        </div>
                        <div className="inline-flex items-center gap-2 px-2 py-1 rounded-md text-xs">
                          {s.status === 'completed' ? (
                            <>
                              <CheckCircle2 className="w-3 h-3 text-green-400" />
                              <span className="text-green-400">Completed</span>
                            </>
                          ) : s.status === 'processing' ? (
                            <>
                              <Clock className="w-3 h-3 text-yellow-400" />
                              <span className="text-yellow-400">Processing</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3 text-red-400" />
                              <span className="text-red-400">{s.status}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* View Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation()
                        router.push(`/scan/${s.id}`)
                      }}
                      className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      View Report
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.section>
      </main>
    </div>
  )
}
