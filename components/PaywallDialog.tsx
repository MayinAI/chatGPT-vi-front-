"use client"
import { Dialog } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { useState } from 'react'
import { createStripeCheckoutSession } from '@/lib/functions'

export function PaywallDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isTestPlan = process.env.NEXT_PUBLIC_DEPLOY_ENV === 'preview'

  const onSubscribe = async () => {
    setError(null)
    setLoading(true)
    try {
      // Create Stripe Checkout session for subscription (pro tier for MVP)
      const res = await createStripeCheckoutSession({ planTier: 'pro' })
      if (!res?.url) throw new Error('Unable to start checkout')
      window.location.href = res.url
    } catch (e: any) {
      setError(e?.message || 'Failed to initiate subscription')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} title="Unlock Unlimited Lookups">
      <div className="space-y-3">
        <p className="text-gray-700">You have used your free attempt. Subscribe to continue.</p>
        <div className="rounded-md bg-gray-50 p-3 text-sm text-gray-700">
          <div className="font-medium flex items-baseline gap-2">
            <span>Plan:</span>
            {isTestPlan ? (
              <span>$1 (Test)</span>
            ) : (
              <span className="font-semibold">$49/mo</span>
            )}
          </div>
          <div>Run visibility scans and unlock pro insights.</div>
          
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div className="flex gap-2 justify-end pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Maybe later</Button>
          <Button onClick={onSubscribe} disabled={loading}>{loading ? 'Processing…' : 'Proceed to Pay'}</Button>
        </div>
      </div>
    </Dialog>
  )
}
