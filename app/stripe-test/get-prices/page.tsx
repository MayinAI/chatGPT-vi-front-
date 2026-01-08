"use client"
import { useState } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { debugStripeResolvePrice } from '@/lib/functions'

export default function GetPricesPage() {
  const { user, loading } = useAuth()
  const [result, setResult] = useState<string>('')
  const [busy, setBusy] = useState(false)

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <div className="p-8">Please sign in to test</div>

  const getPrices = async (productId: string, mode: 'subscription' | 'payment') => {
    setBusy(true)
    try {
      const res = await debugStripeResolvePrice({ productId, mode })
      setResult(prev => prev + `\n\nProduct: ${productId} (${mode})\n${JSON.stringify(res, null, 2)}`)
    } catch (e: any) {
      setResult(prev => prev + `\n\nError for ${productId}: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  const getAllPrices = async () => {
    setResult('')
    await getPrices('prod_TAOXV0xliDfMGu', 'payment')  // Test Rs.1 one-time
    await getPrices('prod_TAOYJxFQUH3jAb', 'subscription')  // Test Rs.1 subscription
  }

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Get Stripe Price IDs</h1>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Test Products</h2>
        <div className="space-y-2">
          <p><strong>One-time Rs.1:</strong> prod_TAOXV0xliDfMGu</p>
          <p><strong>Subscription Rs.1:</strong> prod_TAOYJxFQUH3jAb</p>
        </div>
      </div>

      <button
        onClick={getAllPrices}
        disabled={busy}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {busy ? 'Getting Prices...' : 'Get All Price IDs'}
      </button>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Results</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto min-h-[400px] whitespace-pre-wrap">
          {result || 'Click button above to get price IDs'}
        </pre>
      </div>
    </div>
  )
}