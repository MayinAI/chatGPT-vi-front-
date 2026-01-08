"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { db } from '@/lib/firebase/client'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { findVisibilityReasons } from '@/lib/functions'
import { Button } from '@/components/ui/Button'
import { diagHash, diagKey } from '@/lib/diag'
import { CheckCircle2 } from 'lucide-react'

export default function ImproveMentionsPage() {
  const { user, loading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [brand, setBrand] = useState('')
  const [category, setCategory] = useState('')
  const [region, setRegion] = useState('')
  const [reasons, setReasons] = useState<string[]>([])
  const [strategies, setStrategies] = useState<string[]>([])
  const [completed, setCompleted] = useState<Record<number, boolean>>({})
  const [createdAt, setCreatedAt] = useState<Date | null>(null)
  const [cooldownUntil, setCooldownUntil] = useState<Date | null>(null)
  const [busy, setBusy] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) return
        const id = (params?.id as string) || ''
        const ref = doc(db, 'users', user.uid, 'scans', id)
        const snap = await getDoc(ref)
        const d: any = snap.data() || {}
        const b = String(d.brandName || '')
        const c = String(d.category || '')
        const r = String(d.locationScope || '')
        setBrand(b); setCategory(c); setRegion(r)

        // Try to use existing diagnostics, but do not block function call if read fails
        const now = new Date()
        const fifteenMs = 15 * 24 * 60 * 60 * 1000
        let usedExisting = false
        try {
          const hash = await diagHash(b, c, r)
          const dref = doc(db, 'users', user.uid, 'diagnostics', hash)
          const snapD = await getDoc(dref)
          if (snapD.exists()) {
            const dx: any = snapD.data() || {}
            const rzs = Array.isArray(dx.reasons) ? dx.reasons : []
            const sts = Array.isArray(dx.strategies) ? dx.strategies.slice(0,10) : []
            setReasons(rzs)
            setStrategies(sts)
            setCompleted(dx.completed || {})
            const ca = dx.createdAt?.toDate ? dx.createdAt.toDate() : (dx.createdAt ? new Date(dx.createdAt) : now)
            const cu = dx.cooldownUntil?.toDate ? dx.cooldownUntil.toDate() : (dx.cooldownUntil ? new Date(dx.cooldownUntil) : new Date(ca.getTime() + fifteenMs))
            setCreatedAt(ca)
            setCooldownUntil(cu)
            usedExisting = true
          }
        } catch {}

        if (!usedExisting) {
          const res = await findVisibilityReasons({ brand: b, category: c, region: r })
          const rzs = (res.reasons || []).filter(Boolean)
          const sts = (res.strategies || []).filter(Boolean).slice(0, 10)
          setReasons(rzs)
          setStrategies(sts)
          // Best-effort persist and start cooldown
          try {
            const hash = await diagHash(b, c, r)
            const dref = doc(db, 'users', user.uid, 'diagnostics', hash)
            const cd = new Date(now.getTime() + fifteenMs)
            await setDoc(dref, { key: diagKey(b, c, r), brand: b, category: c, region: r, reasons: rzs, strategies: sts, completed: {}, createdAt: now, cooldownUntil: cd }, { merge: true })
            setCreatedAt(now)
            setCooldownUntil(cd)
          } catch {}
        }
      } catch (e: any) {
        setErr(e?.message || 'Failed to load')
      } finally {
        setBusy(false)
      }
    }
    load()
  }, [user, params?.id])

  const inCooldown = cooldownUntil ? (Date.now() < cooldownUntil.getTime()) : false
  const anyCompleted = Object.values(completed || {}).some(Boolean)

  if (loading || busy) {
    return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Analyzing…</div>
  }
  if (!user) {
    return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Please sign in</div>
  }

  return (
    <main className="bg-dark-bg text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Why {brand} Isn’t Mentioned More — and How to Fix It</h1>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>
        {err && <div className="p-3 rounded bg-red-500/10 border border-red-500/20 text-red-400 mb-4">{err}</div>}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h2 className="text-lg font-semibold mb-3">Top Reasons (Hypotheses)</h2>
            <ul className="list-disc pl-5 space-y-2 text-neutral-300">
              {reasons.length ? reasons.map((r, i) => <li key={i}>{r}</li>) : <li>No reasons found.</li>}
            </ul>
          </div>
          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h2 className="text-lg font-semibold mb-3">Actionable Strategies</h2>
            <div className="space-y-3">
              {strategies.length ? strategies.map((s, i) => (
                <label key={i} className="flex items-start gap-3 p-3 rounded-lg bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 cursor-pointer">
                  <input
                    type="checkbox"
                    className="mt-1 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-blue-500 focus:ring-blue-500"
                    checked={!!completed[i]}
                    onChange={async () => {
                      const next = { ...completed, [i]: !completed[i] }
                      setCompleted(next)
                      try {
                        const hash = await diagHash(brand, category, region)
                        await setDoc(doc(db, 'users', user!.uid, 'diagnostics', hash), { completed: next }, { merge: true })
                      } catch {}
                    }}
                  />
                  <span className={`text-neutral-200 ${completed[i] ? 'line-through text-neutral-500' : ''}`}>{s}</span>
                </label>
              )) : <div className="text-neutral-400">No strategies found.</div>}
            </div>
          </div>
        </div>
        <div className="mt-8 flex items-center gap-3">
          <Button
            variant="primary"
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
            onClick={() => router.push('/scan/new')}
            disabled={inCooldown}
            title={inCooldown ? 'Disabled for 15 days after generating strategies' : ''}
          >
            Run another scan
          </Button>
          <Button
            variant="outline"
            disabled={!anyCompleted || inCooldown}
            onClick={async () => {
              try {
                const { startVisibilityScan } = await import('@/lib/functions')
                const res = await startVisibilityScan({ brandName: brand, category, locationScope: region, planTier: 'pro' })
                router.push(`/scan/${res.scanId}`)
              } catch {}
            }}
            className="inline-flex items-center gap-2"
            title={!anyCompleted ? 'Complete at least one action to enable' : (inCooldown ? 'Available after 15 days' : '')}
          >
            <CheckCircle2 className="w-4 h-4" />
            Check improvement
          </Button>
        </div>
      </div>
    </main>
  )
}
