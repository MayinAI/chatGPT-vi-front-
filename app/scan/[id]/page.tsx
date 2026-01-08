"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { useProfile } from '@/lib/auth/ProfileProvider'
import { listenToScan, listenToScans } from '@/lib/visibility'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { motion } from 'framer-motion'
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  Target, Users, MessageSquare, Lightbulb,
  Crown, BarChart3, Zap, CheckCircle2, XCircle, AlertCircle, CornerDownRight
} from 'lucide-react'
import Link from 'next/link'
import { auth, db } from '@/lib/firebase/client'
import { findVisibilityReasons } from '@/lib/functions'
import { diagHash, diagKey } from '@/lib/diag'
import { setDoc } from 'firebase/firestore'
// diagHash already imported above
import { doc, getDoc } from 'firebase/firestore'

const COLORS = {
  primary: '#6366F1',
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#9CA3AF',
}

function ScoreRing({ value, delta, displayText }: { value: number; delta?: number; displayText?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = 70
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22C55E'
    if (score >= 50) return '#FACC15'
    if (score >= 25) return '#FB923C'
    return '#EF4444'
  }

  const scoreColor = getScoreColor(pct)

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke={scoreColor}
          strokeWidth="12"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white">{displayText ?? pct}</span>
        <span className="text-sm text-neutral-400 mt-1">Visibility Score</span>
        {delta !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            {delta > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : delta < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <Minus className="w-4 h-4 text-neutral-400" />
            )}
            <span className={`text-sm font-medium ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-neutral-400'}`}>
              {delta > 0 ? '+' : ''}{delta} vs last
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function TrendChart({ points }: { points: Array<{ x: number; y: number }> }) {
  if (points.length < 2) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-neutral-500 text-sm">
        Run more scans to see trend
      </div>
    )
  }

  const w = 100, h = 100
  const minY = 0, maxY = 100
  const minX = 0, maxX = points.length - 1

  const pathData = points.map((p, i) => {
    const x = (i / maxX) * w
    const y = h - ((p.y - minY) / (maxY - minY)) * h
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L ${w},${h} L 0,${h} Z`}
        fill="url(#gradient)"
      />
      <path
        d={pathData}
        stroke="#6366F1"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const x = (i / maxX) * w
        const y = h - ((p.y - minY) / (maxY - minY)) * h
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#6366F1"
            className="hover:r-4 transition-all"
          />
        )
      })}
    </svg>
  )
}

function SentimentDonut({ sentiment }: { sentiment: { positive: number; neutral: number; negative: number } }) {
  const total = Math.max(1, sentiment.positive + sentiment.neutral + sentiment.negative)
  const positive = (sentiment.positive / total) * 100
  const neutral = (sentiment.neutral / total) * 100
  const negative = (sentiment.negative / total) * 100

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
          {sentiment.positive > 0 && (
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={COLORS.positive}
              strokeWidth="20"
              strokeDasharray={`${positive * 3.14} 314`}
              className="transition-all duration-1000"
            />
          )}
          {sentiment.neutral > 0 && (
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={COLORS.neutral}
              strokeWidth="20"
              strokeDasharray={`${neutral * 3.14} 314`}
              strokeDashoffset={-positive * 3.14}
              className="transition-all duration-1000"
            />
          )}
          {sentiment.negative > 0 && (
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={COLORS.negative}
              strokeWidth="20"
              strokeDasharray={`${negative * 3.14} 314`}
              strokeDashoffset={-(positive + neutral) * 3.14}
              className="transition-all duration-1000"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-neutral-400">mentions</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS.positive }} />
          <span className="text-sm text-neutral-300">Positive</span>
          <span className="text-sm font-semibold text-white ml-auto">{sentiment.positive}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS.neutral }} />
          <span className="text-sm text-neutral-300">Neutral</span>
          <span className="text-sm font-semibold text-white ml-auto">{sentiment.neutral}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS.negative }} />
          <span className="text-sm text-neutral-300">Negative</span>
          <span className="text-sm font-semibold text-white ml-auto">{sentiment.negative}</span>
        </div>
      </div>
    </div>
  )
}

export default function ScanDetailsPage() {
  const router = useRouter()
  const params = useParams()
  const { user, loading } = useAuth()
  const profile = useProfile()
  const [scan, setScan] = useState<any | null>(null)
  const [history, setHistory] = useState<any[]>([])
  const [publishing, setPublishing] = useState(false)
  const [publicUrl, setPublicUrl] = useState<string | null>(null)
  const [publishError, setPublishError] = useState<string | null>(null)

  useEffect(() => {
    if (!user || !params?.id) return
    const unsub = listenToScan(user.uid, String(params.id), setScan)
    const unsub2 = listenToScans(user.uid, (docs) => setHistory(docs))
    return () => { unsub(); unsub2() }
  }, [user, params?.id])

  const brandHistory = useMemo(() => {
    if (!scan) return [] as any[]
    const name = (scan.brandName || '').toLowerCase()
    const same = history.filter(h => (h.brandName || '').toLowerCase() === name).slice().sort((a,b) => (a.startedAt?.toMillis?.() || 0) - (b.startedAt?.toMillis?.() || 0))
    return same
  }, [history, scan])

  const trendPoints = useMemo(() => {
    return brandHistory.map((h, i) => ({ x: i, y: typeof h.score === 'number' ? h.score : 0 }))
  }, [brandHistory])

  const delta = useMemo(() => {
    const idx = brandHistory.findIndex(h => h.id === scan?.id)
    if (idx > 0) {
      const prev = brandHistory[idx - 1]
      const curr = scan?.score ?? 0
      return Math.round(curr - (prev?.score ?? 0))
    }
    return undefined
  }, [brandHistory, scan])

  // Inline improvement analysis (ensure hooks are declared before any early returns)
  const [showImprove, setShowImprove] = useState(false)
  const [improveLoading, setImproveLoading] = useState(false)
  const [improveError, setImproveError] = useState<string | null>(null)
  const [improveReasons, setImproveReasons] = useState<string[]>([])
  const [improveStrategies, setImproveStrategies] = useState<string[]>([])
  const [diagInCooldown, setDiagInCooldown] = useState(false)
  const [completedMap, setCompletedMap] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const checkCooldown = async () => {
      try {
        if (!user || !scan) return
        const b = String(scan.brandName || '')
        const c = String(scan.category || '')
        const r = String(scan.locationScope || '')
        const hash = await diagHash(b, c, r)
        const ref = doc(db, 'users', user.uid, 'diagnostics', hash)
        const snap = await getDoc(ref)
        if (!snap.exists()) { setDiagInCooldown(false); return }
        const d: any = snap.data() || {}
        const cu = d.cooldownUntil?.toDate ? d.cooldownUntil.toDate() : (d.cooldownUntil ? new Date(d.cooldownUntil) : null)
        setDiagInCooldown(!!(cu && Date.now() < cu.getTime()))
        setCompletedMap(d.completed || {})
        // Auto-show previously saved diagnostics without additional click
        const prevReasons = Array.isArray(d.reasons) ? d.reasons : []
        const prevStrategies = Array.isArray(d.strategies) ? d.strategies.slice(0, 10) : []
        if ((prevReasons.length + prevStrategies.length) > 0) {
          setImproveReasons(prevReasons)
          setImproveStrategies(prevStrategies)
          setShowImprove(true)
        }
      } catch { setDiagInCooldown(false) }
    }
    checkCooldown()
  }, [user, scan?.id])

  const loadImprove = async () => {
    try {
      setImproveError(null)
      setImproveLoading(true)
      const b = String(scan?.brandName || '')
      const c = String(scan?.category || '')
      const r = String(scan?.locationScope || '')
      // Best-effort: try to use existing diagnostics, but do not block on it
      let usedExisting = false
      try {
        const hash = await diagHash(b, c, r)
        const dref = doc(db, 'users', user!.uid, 'diagnostics', hash)
        const snap = await getDoc(dref)
        if (snap.exists()) {
          const d: any = snap.data() || {}
          const rzs = Array.isArray(d.reasons) ? d.reasons : []
          const sts = Array.isArray(d.strategies) ? d.strategies.slice(0,10) : []
          setImproveReasons(rzs)
          setImproveStrategies(sts)
          const cu = d.cooldownUntil?.toDate ? d.cooldownUntil.toDate() : (d.cooldownUntil ? new Date(d.cooldownUntil) : null)
          setDiagInCooldown(!!(cu && Date.now() < cu.getTime()))
          usedExisting = true
        }
      } catch {}

      if (!usedExisting) {
        try {
          const res = await findVisibilityReasons({ brand: b, category: c, region: r })
          let rzs = Array.isArray(res.reasons) ? res.reasons.filter(Boolean) : []
          let sts = (Array.isArray(res.strategies) ? res.strategies.filter(Boolean) : []).slice(0, 10)
          if (!rzs.length && !sts.length) {
            const reasons: string[] = []
            const strategies: string[] = []
            const total = Number(scan?.stats?.rawTotal || scan?.promptCount || 0)
            const mentions = Number(scan?.stats?.rawMentions || 0)
            if (total) reasons.push(`Low mention rate: ${mentions}/${total} prompts mention the brand`)
            const topComp = (scan?.breakdown?.competitors || []).slice(0, 3).map((x: any) => x.name).join(', ')
            if (topComp) reasons.push(`Competitor dominance: ${topComp} appear more frequently`)
            const weakLoc = (scan?.breakdown?.locations || []).slice().sort((a:any,b:any)=>a.score-b.score)[0]
            if (weakLoc) reasons.push(`Weak geographic presence in ${weakLoc.name}`)
            for (const st of ((scan as any)?.guidance?.steps || []).slice(0,5)) strategies.push(String(st.action || ''))
            if (!strategies.length) strategies.push('Publish comparison and buyer‑guide content targeting category and region queries')
            if (!reasons.length) reasons.push('Insufficient brand coverage in relevant AI/tested prompts')
            rzs = reasons; sts = strategies
          }
          setImproveReasons(rzs)
          setImproveStrategies(sts)
          // Best-effort persist + cooldown
          try {
            const hash = await diagHash(b, c, r)
            const dref = doc(db, 'users', user!.uid, 'diagnostics', hash)
            const now = new Date()
            const cd = new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000)
            await setDoc(dref, { key: diagKey(b, c, r), brand: b, category: c, region: r, reasons: rzs, strategies: sts, createdAt: now, cooldownUntil: cd }, { merge: true })
            setDiagInCooldown(true)
          } catch {}
        } catch (e: any) {
          // Fallback: derive from current scan breakdown/guidance without server
          const reasons: string[] = []
          const strategies: string[] = []
          setImproveError(e?.message || 'Analysis service unavailable')
          const total = Number(scan?.stats?.rawTotal || scan?.promptCount || 0)
          const mentions = Number(scan?.stats?.rawMentions || 0)
          if (total) reasons.push(`Low mention rate: ${mentions}/${total} prompts mention the brand`)
          const topComp = (scan?.breakdown?.competitors || []).slice(0, 3).map((x: any) => x.name).join(', ')
          if (topComp) reasons.push(`Competitor dominance: ${topComp} appear more frequently`)
          const weakLoc = (scan?.breakdown?.locations || []).slice().sort((a:any,b:any)=>a.score-b.score)[0]
          if (weakLoc) reasons.push(`Weak geographic presence in ${weakLoc.name}`)
          for (const st of ((scan as any)?.guidance?.steps || []).slice(0,5)) strategies.push(String(st.action || ''))
          if (!strategies.length) strategies.push('Publish comparison and buyer‑guide content targeting category and region queries')
          if (!reasons.length) reasons.push('Insufficient brand coverage in relevant AI/tested prompts')
          setImproveReasons(reasons)
          setImproveStrategies(strategies)
        }
      }
    } finally {
      setImproveLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
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

  // Show proper loading state for running scans
  if (!scan || scan.status === 'running') {
    const promptCount = scan?.promptCount || 100
    const isPremiumScan = promptCount >= 1000
    const estimatedTime = isPremiumScan ? '5-8 minutes' : '30-60 seconds'

    return (
      <div className="min-h-screen bg-dark-bg text-white">
        <header className="border-b border-neutral-800/50 bg-dark-bg/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Logo href="/" />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-500/20 mb-6">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <h1 className="text-3xl font-bold mb-4">
                {scan ? 'Analyzing Your Brand...' : 'Loading Scan...'}
              </h1>
              <p className="text-lg text-neutral-400 mb-2">
                {isPremiumScan
                  ? `Running comprehensive analysis with ${promptCount} AI prompts`
                  : `Running analysis with ${promptCount} AI prompts`}
              </p>
              <p className="text-sm text-neutral-500">
                Estimated time: {estimatedTime}
              </p>
            </div>

            {scan && (
              <div className="space-y-4 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 text-left max-w-md mx-auto">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-white mb-1">Brand: {scan.brandName}</div>
                    <div className="text-sm text-neutral-400">{scan.category} • {scan.locationScope}</div>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-800">
                  <div className="text-sm text-neutral-400 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                      <span>Sending prompts to ChatGPT...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-600" />
                      <span>Analyzing brand mentions...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-600" />
                      <span>Identifying competitors...</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-neutral-600" />
                      <span>Generating insights...</span>
                    </div>
                  </div>
                </div>

                {isPremiumScan && (
                  <div className="pt-4 border-t border-neutral-800 text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                      <Crown className="w-3 h-3" />
                      <span>Premium scan with 1000 prompts - This may take several minutes</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="mt-8 text-sm text-neutral-500">
              <p>Please keep this page open. Your results will appear automatically when ready.</p>
            </div>
          </motion.div>
        </main>
      </div>
    )
  }

  const sentiment = scan.breakdown?.sentiment || { positive: 0, neutral: 0, negative: 0 }
  const userSubscribed = !!(profile?.isSubscribed || profile?.subscriptionStatus === 'active' || profile?.subscription_status === 'active')
  const proView = userSubscribed || scan.planTier === 'pro'
  const showUpgradeCta = !userSubscribed
  const scanTier = scan.planTier || 'free'
  const isFreeReport = scanTier === 'free'
  const isStarterReport = scanTier === 'starter'
  const isOneTimeReport = isFreeReport || isStarterReport

  const onPublish = async () => {
    try {
      setPublishError(null)
      setPublishing(true)
      const u = auth.currentUser
      if (!u) throw new Error('Please sign in')
      const token = await u.getIdToken()
      const resp = await fetch(`/api/publish-report/${params.id}`, { method: 'POST', headers: { Authorization: `Bearer ${token}` } })
      const data = await resp.json()
      if (!resp.ok) throw new Error(data?.error || 'Failed to publish')
      setPublicUrl(data.url)
    } catch (e: any) {
      setPublishError(e?.message || 'Failed to publish')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-neutral-800/50 bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo href="/" />
            <div className="h-6 w-px bg-neutral-800" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </Button>
          </div>
          <div className="flex items-center gap-3">
            {scan.status === 'complete' && (
              publicUrl ? (
                <Link href={publicUrl} target="_blank" className="text-sm underline text-neutral-300">Open Public Link</Link>
              ) : (
                isFreeReport ? (
                  <div className="relative">
                    <Button variant="outline" size="sm" disabled>
                      Create Share Link
                    </Button>
                    <div className="absolute bottom-full mb-2 w-48 p-2 bg-neutral-800 text-white text-sm rounded-md shadow-lg invisible group-hover:visible">
                      Sharing is only available for Pro plan reports.
                    </div>
                  </div>
                ) : (
                  <Button variant="outline" size="sm" onClick={onPublish} disabled={publishing}>
                    {publishing ? 'Publishing…' : 'Create Share Link'}
                  </Button>
                )
              )
            )}
            {showUpgradeCta && (
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-neutral-300">AI Visibility Report</span>
            </div>
            {proView && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-sm">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">Pro Scan</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{scan.brandName}</h1>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>{scan.category}</span>
            <span>•</span>
            <span>{scan.locationScope}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              {scan.status}
            </span>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 p-8 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 flex items-center justify-center"
          >
            <ScoreRing
              value={typeof scan.score === 'number' ? scan.score : 0}
              delta={delta}
              displayText={isFreeReport ? `${scan.stats?.rawMentions ?? 0}/10` : undefined}
            />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold">Mentions</h3>
              </div>
              <div className="text-3xl font-bold mb-1">
                {proView ? scan.stats?.rawMentions ?? '--' : '•••'}
              </div>
              <p className="text-sm text-neutral-400">
                {proView ? `out of ${scan.promptCount || scan.stats?.rawTotal || '--'} prompts` : 'Upgrade to see details'}
              </p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold">Competitors</h3>
              </div>
              <div className="text-3xl font-bold mb-1">
                {(scan.breakdown?.competitors || []).filter((c: any) => !['offers', 'known'].includes(c.name.toLowerCase())).length}
              </div>
              <p className="text-sm text-neutral-400">brands tracked</p>
            </div>

            <div className="sm:col-span-2 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold">Score Trend</h3>
              </div>
              {proView ? (
                <TrendChart points={trendPoints} />
              ) : (
                <div className="h-32 flex items-center justify-center text-neutral-500 text-sm">
                  Upgrade to Pro to see trend analysis
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sentiment & Competitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MessageSquare className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
            </div>
            <SentimentDonut sentiment={sentiment} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">Top Competitors</h2>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(scan.breakdown?.competitors || [])
                .filter((c: any) => !['offers', 'known'].includes(c.name.toLowerCase()))
                .slice(0, proView ? 10 : 3)
                .map((c: any, idx: number) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">{c.mentions}</div>
                      <div className="text-xs text-neutral-500">mentions</div>
                    </div>
                  </div>
                ))}
            </div>
            {showUpgradeCta && (
              <div className="mt-4">
                <Button variant="outline" size="sm" className="w-full" onClick={() => router.push('/billing')}>
                  View All Competitors
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sample AI Responses */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 mb-8"
        >
          {isFreeReport ? (
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-500/10">
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <h2 className="text-2xl font-bold">Sample AI Responses</h2>
              </div>
              <div className="flex items-center gap-3 text-right">
                <span className="text-xs sm:text-sm text-yellow-400 whitespace-nowrap">⚠️ Limited Accuracy: 10-prompt scans offer only an estimate</span>
                <Button
                  variant="primary"
                  size="sm"
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                  onClick={() => router.push('/billing')}
                >
                  Run a 100-Prompt Pro Scan for Full Accuracy
                </Button>
              </div>
            </div>
          ) : (
            proView && (
              <div className="flex items-center justify-between mb-2">
                <Button
                  variant="primary"
                  onClick={() => {
                    const id = (params as any)?.id
                    if (id) window.open(`/scan/${id}/full-responses`, '_blank')
                  }}
                >
                  View all 100 AI responses
                </Button>
                <div className="flex items-center gap-3">
                  <span className="text-xs sm:text-sm text-neutral-400 inline-flex items-center gap-1">
                    <CornerDownRight className="w-4 h-4 text-neutral-400" />
                    Next step
                  </span>
                  <Button
                    variant="outline"
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                    onClick={async () => { setShowImprove(true); if (!improveReasons.length && !improveStrategies.length) await loadImprove(); }}
                    title={diagInCooldown ? 'Disabled for 15 days after generating strategies' : ''}
                    disabled={diagInCooldown}
                  >
                    Find Why Your Brand Isn’t Mentioned More & Fix It
                  </Button>
                </div>
              </div>
            )
          )}

          {proView && showImprove && (
            <div className="mt-4 space-y-6">
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <h3 className="text-lg font-semibold mb-3">Top Reasons (Hypotheses)</h3>
                {improveLoading ? (
                  <div className="text-neutral-400 text-sm">Analyzing…</div>
                ) : (
                  <>
                    {improveError && (
                      <div className="text-yellow-400 text-xs mb-3">
                        {improveError}{' '}
                        <button className="underline hover:opacity-80" onClick={loadImprove}>Retry analysis</button>
                      </div>
                    )}
                    <ul className="list-disc pl-5 space-y-2 text-neutral-300">
                      {improveReasons.length ? improveReasons.map((r, i) => <li key={i}>{r}</li>) : <li>No reasons found.</li>}
                    </ul>
                  </>
                )}
              </div>
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <h3 className="text-lg font-semibold mb-3">Actionable Strategies</h3>
                {improveLoading ? (
                  <div className="text-neutral-400 text-sm">Analyzing…</div>
                ) : (
                  <div className="space-y-3">
                    {improveStrategies.length ? improveStrategies.map((s, i) => (
                      <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer">
                        <input
                          type="checkbox"
                          className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-blue-500"
                          checked={!!completedMap[i]}
                          onChange={async () => {
                            const b = String(scan?.brandName || '')
                            const c = String(scan?.category || '')
                            const r = String(scan?.locationScope || '')
                            const next = { ...completedMap, [i]: !completedMap[i] }
                            setCompletedMap(next)
                            try {
                              const hash = await diagHash(b, c, r)
                              await setDoc(doc(db, 'users', user!.uid, 'diagnostics', hash), { completed: next }, { merge: true })
                            } catch {}
                          }}
                        />
                        <span className={`text-neutral-200 ${completedMap[i] ? 'line-through text-neutral-500' : ''}`}>{s}</span>
                      </label>
                    )) : <div className="text-neutral-400">No strategies found.</div>}
                    <div className="pt-2">
                      <Button
                        variant="outline"
                        disabled={diagInCooldown || !Object.values(completedMap).some(Boolean)}
                        onClick={async () => {
                          try {
                            const { startVisibilityScan } = await import('@/lib/functions')
                            const b = String(scan?.brandName || '')
                            const c = String(scan?.category || '')
                            const r = String(scan?.locationScope || '')
                            const res = await startVisibilityScan({ brandName: b, category: c, locationScope: r, planTier: 'pro' })
                            router.push(`/scan/${res.scanId}`)
                          } catch {}
                        }}
                        title={!Object.values(completedMap).some(Boolean) ? 'Complete at least one action to enable' : (diagInCooldown ? 'Available after 15 days' : '')}
                      >
                        Check improvement
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {!proView ? (
            <div className="space-y-6">
              {(scan.sampleAnswers || []).slice(0, isFreeReport ? 10 : 2).map((s: any, idx: number) => (
                <div
                  key={idx}
                  className="p-6 rounded-lg bg-neutral-900/30 border border-neutral-800/50"
                >
                  <div className="mb-4">
                    <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Prompt</div>
                    <p className="text-neutral-300">{s.prompt}</p>
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">ChatGPT Response</div>
                    <p className="text-neutral-400 leading-relaxed whitespace-pre-wrap">{s.answer}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : null}

          

          {/* Bottom CTA for Free reports */}
          {isFreeReport && (
            <div className="mt-6 text-center">
              <Button
                variant="primary"
                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
                onClick={() => router.push('/billing')}
              >
                Run a 100-Prompt Pro Scan for Full Accuracy
              </Button>
            </div>
          )}

        </motion.div>

        {/* Improvement Guidance removed */}

        {/* Upsell Section for Free Plan (removed) */}
        {false && isFreeReport && !userSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-10 rounded-xl bg-gradient-to-br from-blue-900/30 via-purple-900/30 to-pink-900/30 border border-blue-500/30"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Want a More Detailed Analysis?</h2>
              <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                This free report analyzed only 15 prompts. Get deeper insights with more comprehensive scanning options.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {/* Starter Plan Upsell */}
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-blue-500/50 transition-all">
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-blue-400 mb-2">$9</div>
                  <div className="text-sm text-neutral-400">One-time payment</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Detailed Report</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300"><strong>100 AI prompts</strong> (6.6x more coverage)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Full competitor analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Complete improvement recommendations</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Sample ChatGPT responses</span>
                  </li>
                </ul>
                <Button variant="outline" className="w-full" onClick={() => router.push('/billing')}>
                  Get Detailed Report
                </Button>
              </div>

              {/* Premium Plan Upsell */}
              <div className="p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 hover:border-purple-400 transition-all relative overflow-hidden">
                <div className="absolute top-3 right-3">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold">
                    BEST VALUE
                  </div>
                </div>
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-purple-400 mb-2">$99</div>
                  <div className="text-sm text-neutral-400">One-time payment</div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">In-Depth Report</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300"><strong>1000 AI prompts</strong> (66x more coverage!)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Comprehensive competitor intelligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Advanced improvement playbook</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Unlimited sample responses</span>
                  </li>
                </ul>
                <Button variant="primary" className="w-full" onClick={() => router.push('/billing')}>
                  Get In-Depth Report
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-neutral-400 mb-3">💡 More prompts = More accurate visibility score and deeper insights</p>
            </div>
          </motion.div>
        )}

        {/* Upsell Section for Starter Plan ($9) */}
        {isStarterReport && !userSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-10 rounded-xl bg-gradient-to-br from-purple-900/30 via-pink-900/30 to-orange-900/30 border border-purple-500/30"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Need Even Deeper Insights?</h2>
              <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                Your current report analyzed 100 prompts. Upgrade to our Premium scan with 1000 prompts for 10x more comprehensive analysis.
              </p>
            </div>

            <div className="max-w-md mx-auto p-6 rounded-xl bg-gradient-to-br from-purple-900/30 to-pink-900/30 border border-purple-500/50 hover:border-purple-400 transition-all mb-6">
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-purple-400 mb-2">$99</div>
                <div className="text-sm text-neutral-400">One-time payment</div>
              </div>
              <h3 className="text-xl font-bold mb-4 text-center">Premium In-Depth Report</h3>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300"><strong>1000 AI prompts</strong> (10x more than Starter)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">Comprehensive visibility analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">In-depth competitor analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">Advanced improvement playbook</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-neutral-300">Unlimited sample responses</span>
                </li>
              </ul>
              <Button variant="primary" className="w-full" onClick={() => router.push('/billing')}>
                Upgrade to Premium Report
              </Button>
            </div>

            <div className="text-center">
              <p className="text-sm text-neutral-400">💡 1000 prompts provide significantly more accurate insights and uncover hidden patterns</p>
            </div>
          </motion.div>
        )}

        {/* Subscription Upsell for One-Time Reports (hidden for free) */}
        {isStarterReport && !userSubscribed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-8 p-10 rounded-xl bg-gradient-to-br from-green-900/30 via-teal-900/30 to-blue-900/30 border border-green-500/30"
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Track Your Progress Over Time</h2>
              <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
                Save more with a Pro subscription. Get 1 scan every 15 days to track your AI visibility improvements.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Pro Subscription */}
              <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-700 hover:border-green-500/50 transition-all">
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <div className="text-4xl font-bold text-green-400">$49</div>
                    <div className="text-neutral-400">/month</div>
                  </div>
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-400 text-xs font-semibold">
                      SAVE 50%
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Pro Plan</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300"><strong>1 scan every 15 days</strong> with 100 prompts</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Track trends over time</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Advanced visibility analytics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Priority email support</span>
                  </li>
                </ul>
                
                <Button variant="outline" className="w-full" onClick={() => router.push('/billing')}>
                  Start Pro Subscription
                </Button>
              </div>

              {/* Enterprise Subscription (removed) */}
              <div className="hidden">
                <div className="mb-4">
                  <div className="flex items-baseline justify-center gap-2 mb-2">
                    <div className="text-4xl font-bold text-blue-400">$499</div>
                    <div className="text-neutral-400">/month</div>
                  </div>
                  <div className="text-center">
                    <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold">
                      SAVE 80%
                    </span>
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-center">Enterprise Plan</h3>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300"><strong>10 scans/month</strong> with 1000 prompts each</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Advanced AI-powered analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">Multi-brand tracking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-neutral-300">White-label reports & API access</span>
                  </li>
                </ul>
                <div className="text-center text-sm text-neutral-400 mb-3">
                  Only $49.90/scan vs $99 one-time
                </div>
                <Button variant="primary" className="w-full" onClick={() => router.push('/billing')}>
                  Start Enterprise Plan
                </Button>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-neutral-400">🎯 Monthly scans let you track improvements and measure the impact of your content strategy</p>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}
