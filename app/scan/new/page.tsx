"use client"
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { useProfile } from '@/lib/auth/ProfileProvider'
import { db } from '@/lib/firebase/client'
import { collection, query, orderBy, limit as fbLimit, getDocs, doc, setDoc } from 'firebase/firestore'
import { startVisibilityScan, getUserSubscriptionStatus } from '@/lib/functions'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { motion } from 'framer-motion'
import {
  ArrowLeft, Zap, Target, MapPin, Briefcase, Globe, AlertCircle, Loader2
} from 'lucide-react'
import Link from 'next/link'

export default function NewScanPage() {
  const { user, loading } = useAuth()
  const profile = useProfile()
  const router = useRouter()
  const [brandName, setBrandName] = useState('')
  const [website, setWebsite] = useState('')
  const [category, setCategory] = useState('')
  const [location, setLocation] = useState('')
  const [savedLoaded, setSavedLoaded] = useState(false)
  const [useSaved, setUseSaved] = useState(false)

  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [inDiagCooldown, setInDiagCooldown] = useState(false)

  // Load last saved scan details for this user (always call hooks before any conditional returns)
  useEffect(() => {
    const run = async () => {
      try {
        if (!user) return;
        // Prefer saved defaults from profile if they exist
        const hasDefaults = !!(profile?.defaultBrandName && profile?.defaultCategory && profile?.defaultLocationScope)
        if (hasDefaults) {
          setBrandName(String(profile?.defaultBrandName || ''))
          setWebsite(String(profile?.defaultWebsite || ''))
          setCategory(String(profile?.defaultCategory || ''))
          setLocation(String(profile?.defaultLocationScope || ''))
          const subscribed = !!(profile?.isSubscribed || profile?.subscriptionStatus === 'active' || profile?.subscription_status === 'active')
          if (subscribed) setUseSaved(true)
          setSavedLoaded(true)
          return
        }
        const scansCol = collection(db, 'users', user.uid, 'scans')
        const q = query(scansCol, orderBy('startedAt', 'desc'), fbLimit(5))
        const snap = await getDocs(q)
        const doc0 = snap.docs.find(d => !!(d.get('brandName') && d.get('category') && d.get('locationScope')))
        if (doc0) {
          const bn = String(doc0.get('brandName') || '')
          const ws = String(doc0.get('website') || '')
          const cat = String(doc0.get('category') || '')
          const loc = String(doc0.get('locationScope') || '')
          setBrandName(bn)
          setWebsite(ws)
          setCategory(cat)
          setLocation(loc)
          // If user is subscribed, default to one-click mode using saved details
          const subscribed = !!(profile?.isSubscribed || profile?.subscriptionStatus === 'active' || profile?.subscription_status === 'active')
          if (subscribed) setUseSaved(true)
        }
        // Check diagnostics cooldown (global 15-day lock after creating strategies)
        try {
          const dcol = collection(db, 'users', user.uid, 'diagnostics')
          const dsnap = await getDocs(dcol)
          const now = Date.now()
          const active = dsnap.docs.some(d => {
            const cu = (d.data() as any).cooldownUntil
            const date = cu?.toDate ? cu.toDate() : (cu ? new Date(cu) : null)
            return !!(date && now < date.getTime())
          })
          setInDiagCooldown(active)
        } catch {}
      } catch {}
      setSavedLoaded(true)
    }
    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid, profile?.defaultBrandName, profile?.defaultCategory, profile?.defaultLocationScope])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/login?mode=signup')
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Redirecting to sign up...</div>
      </div>
    )
  }

  // (moved effect above to satisfy React hooks rules)

  const onSubmit = async () => {
    setError(null)
    if (!brandName.trim() || !category.trim() || !location.trim()) {
      setError('Brand name, category, and location are required')
      return
    }
    if (inDiagCooldown) {
      setError('Scanning is disabled for 15 days after creating strategies. Please try again later.')
      return
    }
    setBusy(true)
    try {
      const privileged = user?.email === 'onegoal1crore@gmail.com'
      let subscribed = !!(profile?.isSubscribed || profile?.subscriptionStatus === 'active' || profile?.subscription_status === 'active')
      let hasPaidCredits = (profile?.scanCredits || 0) > 0
      try {
        const status = await getUserSubscriptionStatus()
        subscribed = !!status?.isSubscribed
        hasPaidCredits = (status?.scanCredits || 0) > 0
      } catch {}
      const planTier: 'free' | 'pro' = privileged ? 'free' : ((subscribed || hasPaidCredits) ? 'pro' : 'free')
      const res = await startVisibilityScan({
        brandName: brandName.trim(),
        website: website.trim() || undefined,
        category: category.trim(),
        locationScope: location.trim(),
        planTier,
      })
      // Persist defaults if not set yet
      try {
        const hasDefaults = !!(profile?.defaultBrandName && profile?.defaultCategory && profile?.defaultLocationScope)
        if (!hasDefaults && user) {
          await setDoc(doc(db, 'users', user.uid), {
            defaultBrandName: brandName.trim(),
            defaultWebsite: website.trim() || undefined,
            defaultCategory: category.trim(),
            defaultLocationScope: location.trim(),
          }, { merge: true })
        }
      } catch {}
      router.push(`/scan/${res.scanId}`)
    } catch (e: any) {
      const msg = e?.message || ''
      const code = e?.code || ''
      console.error('Scan creation error:', { code, msg, error: e })

      if (code === 'failed-precondition' || msg.includes('NO_CREDITS')) {
        setError('You need a scan credit or subscription to run a scan. Visit billing to upgrade.')
        setTimeout(() => router.push('/billing'), 2000)
      } else if (code === 'resource-exhausted' || msg.includes('MONTHLY_LIMIT_REACHED')) {
        setError('Monthly scan limit reached for your plan. Your limit resets next month, or upgrade now for more scans.')
        setTimeout(() => router.push('/billing'), 2000)
      } else if (code === 'resource-exhausted' || msg.includes('PRO_SCAN_COOLDOWN_ACTIVE')) {
        setError('Pro plan allows one scan every 15 days. Please try again later.')
      } else {
        setError(`Failed to start scan: ${msg}`)
      }
    } finally {
      setBusy(false)
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
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-neutral-300">New Visibility Scan</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Analyze Your Brand&apos;s AI Visibility
          </h1>
          <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
            Enter your brand details below to discover how ChatGPT mentions your brand and compare against competitors.
          </p>
        </motion.div>

        {/* Form / Saved Details Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800"
        >
          <div className="space-y-6">
            {useSaved ? (
              <div className="space-y-4">
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-2">Saved Brand Details</h3>
                  <div className="text-sm text-neutral-300">Brand: <span className="font-medium text-white">{brandName || '—'}</span></div>
                  <div className="text-sm text-neutral-300">Category: <span className="font-medium text-white">{category || '—'}</span></div>
                  <div className="text-sm text-neutral-300">Location: <span className="font-medium text-white">{location || '—'}</span></div>
                  {website && <div className="text-sm text-neutral-300">Website: <span className="font-medium text-white">{website}</span></div>}
                </div>
                <div className="flex items-center justify-between gap-3 pt-4 border-t border-neutral-800">
                  <Button variant="outline" onClick={() => setUseSaved(false)}>Change details</Button>
                  <Button variant="primary" size="lg" onClick={onSubmit} disabled={busy} className="flex items-center gap-2">
                    {busy ? (<><Loader2 className="w-5 h-5 animate-spin" />Running Scan...</>) : (<><Zap className="w-5 h-5" />Run Scan</>)}
                  </Button>
                </div>
              </div>
            ) : (
              <>
            {/* Brand Name */}
            <div>
              <label htmlFor="brandName" className="flex items-center gap-2 text-sm font-medium mb-2">
                <Target className="w-4 h-4 text-blue-400" />
                Brand Name <span className="text-red-400">*</span>
              </label>
              <Input
                id="brandName"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., Nike, Apple, Coca-Cola"
                className="text-base"
              />
              <p className="text-xs text-neutral-500 mt-2">
                The name of the brand you want to analyze in AI conversations.
              </p>
            </div>

            {/* Website */}
            <div>
              <label htmlFor="website" className="flex items-center gap-2 text-sm font-medium mb-2">
                <Globe className="w-4 h-4 text-green-400" />
                Website <span className="text-neutral-500 text-xs">(Optional)</span>
              </label>
              <Input
                id="website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://example.com"
                className="text-base"
              />
              <p className="text-xs text-neutral-500 mt-2">
                Provide your brand&apos;s website for more context-aware analysis.
              </p>
            </div>

            {/* Category */}
            <div>
              <label htmlFor="category" className="flex items-center gap-2 text-sm font-medium mb-2">
                <Briefcase className="w-4 h-4 text-purple-400" />
                Category / Industry <span className="text-red-400">*</span>
              </label>
              <Input
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Sports Apparel, Consumer Electronics, Beverages"
                className="text-base"
              />
              <p className="text-xs text-neutral-500 mt-2">
                The industry or product category your brand operates in.
              </p>
            </div>

            {/* Location */}
            <div>
              <label htmlFor="location" className="flex items-center gap-2 text-sm font-medium mb-2">
                <MapPin className="w-4 h-4 text-orange-400" />
                Location Scope <span className="text-red-400">*</span>
              </label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g., United States, Mumbai India, Global"
                className="text-base"
              />
              <p className="text-xs text-neutral-500 mt-2">
                The geographical area to focus the visibility analysis on.
              </p>
            </div>

            {/* Info Box */}
            <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-blue-400 mb-1">What happens next?</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    We&apos;ll send 100+ relevant prompts to ChatGPT about your industry and analyze how often your brand is mentioned compared to competitors. This takes about 30 seconds.
                  </p>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400"
              >
                <div className="flex gap-2">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <div className="pt-6 border-t border-neutral-800 flex items-center justify-between gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                disabled={busy}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="lg"
                onClick={onSubmit}
                disabled={busy}
                className="flex items-center gap-2"
              >
                {busy ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Running Scan...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    Run Visibility Check
                  </>
                )}
              </Button>
            </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-sm text-neutral-500">
            Need help? Check out our{' '}
            <Link href="/how-ai-visibility-works" className="text-white hover:underline">
              guide on AI visibility
            </Link>
            {' '}or{' '}
            <Link href="/contact" className="text-white hover:underline">
              contact support
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  )
}
