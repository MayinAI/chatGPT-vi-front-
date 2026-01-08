"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { createStripeCheckoutSession, createStripeOneTimeCheckout, debugStripeResolvePrice } from '@/lib/functions'

export default function StripeTestPage() {
  const { user, loading } = useAuth()
  const [result, setResult] = useState<string>('')
  const [busy, setBusy] = useState(false)

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <div className="p-8">Please sign in to test Stripe</div>

  const testDebugPrice = async (productId: string, mode: 'subscription' | 'payment') => {
    setBusy(true)
    try {
      const res = await debugStripeResolvePrice({ productId, mode })
      setResult(JSON.stringify(res, null, 2))
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  const testCheckout = async (type: 'subscription' | 'onetime') => {
    setBusy(true)
    try {
      const res = type === 'subscription'
        ? await createStripeCheckoutSession({ planTier: 'pro' })
        : await createStripeOneTimeCheckout({ kind: 'pro' })

      setResult(JSON.stringify(res, null, 2))

      if (res?.url) {
        if (confirm('Checkout session created! Open in new tab?')) {
          window.open(res.url, '_blank')
        }
      }
    } catch (e: any) {
      setResult(`Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Stripe Integration Test</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Environment Variables</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
{JSON.stringify({
  STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ? 'Set' : 'Missing',
  PRICE_STARTER: process.env.NEXT_PUBLIC_STRIPE_PRICE_STARTER || 'Missing',
  PRICE_PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_PRO || 'Missing',
  PRICE_ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_PRICE_ENTERPRISE || 'Missing',
  PRICE_OT_STARTER: process.env.NEXT_PUBLIC_STRIPE_PRICE_OT_STARTER || 'Missing',
  PRICE_OT_PRO: process.env.NEXT_PUBLIC_STRIPE_PRICE_OT_PRO || 'Missing',
  PRICE_OT_ENTERPRISE: process.env.NEXT_PUBLIC_STRIPE_PRICE_OT_ENTERPRISE || 'Missing',
}, null, 2)}
        </pre>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Subscription Checkout</h2>
        <div className="flex gap-2">
          <button
            onClick={() => testCheckout('subscription')}
            disabled={busy}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            Test Pro Subscription ($49/mo)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test One-time Checkout</h2>
        <div className="flex gap-2">
          <button
            onClick={() => testCheckout('onetime')}
            disabled={busy}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            Test Pro Scan ($29)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Debug Product Price Resolution</h2>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => testDebugPrice('prod_RSvM8zLgQzYqAa', 'subscription')}
            disabled={busy}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
          >
            Debug Starter Sub
          </button>
          <button
            onClick={() => testDebugPrice('prod_RSvPaDnMsQzTdD', 'payment')}
            disabled={busy}
            className="px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50 text-sm"
          >
            Debug Starter One-time
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Result</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto min-h-[200px] whitespace-pre-wrap">
          {result || 'No result yet. Click a button above to test.'}
        </pre>
      </div>

      {busy && <div className="text-center text-gray-500">Processing...</div>}
    </div>
  )
}