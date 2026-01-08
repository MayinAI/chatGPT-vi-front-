"use client"
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth/useAuth'
import { getUserSubscriptionStatus, createStripeCheckoutSession, createStripeOneTimeCheckout } from '@/lib/functions'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'

export default function TestSubscriptionPage() {
  const { user, loading } = useAuth()
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null)
  const [result, setResult] = useState<string>('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (user) {
      loadSubscriptionStatus()
    }
  }, [user])

  const loadSubscriptionStatus = async () => {
    try {
      const status = await getUserSubscriptionStatus()
      setSubscriptionStatus(status)
      setResult(`Subscription Status Loaded:\n${JSON.stringify(status, null, 2)}`)
    } catch (e: any) {
      setResult(`Error loading status: ${e.message}`)
    }
  }

  const testSubscription = async () => {
    setBusy(true)
    try {
      // Use test product for pro subscription (Rs.1 for testing)
      const res = await createStripeCheckoutSession({
        productId: 'prod_TAOYJxFQUH3jAb',  // Test Rs.1 subscription (represents $49 pro plan)
        planTier: 'pro'
      })
      setResult(`Pro Subscription Checkout Created:\n${JSON.stringify(res, null, 2)}`)

      if (res?.url) {
        if (confirm('Open pro subscription checkout in new tab?')) {
          window.open(res.url, '_blank')
        }
      }
    } catch (e: any) {
      setResult(`Subscription Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  const testOneTime = async () => {
    setBusy(true)
    try {
      // Use test product for pro one-time payment (Rs.1 for testing)
      const res = await createStripeOneTimeCheckout({
        productId: 'prod_TAOXV0xliDfMGu',  // Test Rs.1 one-time (represents $29 pro scan)
        kind: 'pro'
      })
      setResult(`Pro One-time Checkout Created:\n${JSON.stringify(res, null, 2)}`)

      if (res?.url) {
        if (confirm('Open pro one-time checkout in new tab?')) {
          window.open(res.url, '_blank')
        }
      }
    } catch (e: any) {
      setResult(`One-time Error: ${e.message}`)
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="p-8">Loading...</div>
  if (!user) return <div className="p-8">Please sign in to test</div>

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Test Subscription System</h1>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>Plan: <span className="font-medium">{subscriptionStatus?.planTier || 'free'}</span></div>
          <div>Status: <span className="font-medium">{subscriptionStatus?.subscriptionStatus || 'inactive'}</span></div>
          <div>Is Subscribed: <span className="font-medium">{subscriptionStatus?.isSubscribed ? 'Yes' : 'No'}</span></div>
          <div>Can Create Scan: <span className="font-medium">{subscriptionStatus?.canCreateScan ? 'Yes' : 'No'}</span></div>
          <div>Credits: <span className="font-medium">{subscriptionStatus?.scanCredits || 0}</span></div>
          <div>Monthly Limit: <span className="font-medium">{subscriptionStatus?.monthlyLimit || 0}</span></div>
          <div>This Month: <span className="font-medium">{subscriptionStatus?.currentMonthScans || 0}</span></div>
          <div>Remaining: <span className="font-medium">{subscriptionStatus?.scansRemaining || 0}</span></div>
        </div>

        {subscriptionStatus?.features && (
          <div className="mt-4">
            <h3 className="font-semibold">Features:</h3>
            <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
              <div>Advanced Reports: <span className={`font-medium ${subscriptionStatus.features.advancedReports ? 'text-green-600' : 'text-red-600'}`}>
                {subscriptionStatus.features.advancedReports ? '✓' : '✗'}
              </span></div>
              <div>Priority Support: <span className={`font-medium ${subscriptionStatus.features.prioritySupport ? 'text-green-600' : 'text-red-600'}`}>
                {subscriptionStatus.features.prioritySupport ? '✓' : '✗'}
              </span></div>
              <div>API Access: <span className={`font-medium ${subscriptionStatus.features.apiAccess ? 'text-green-600' : 'text-red-600'}`}>
                {subscriptionStatus.features.apiAccess ? '✓' : '✗'}
              </span></div>
            </div>
          </div>
        )}
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Test Payments</h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-semibold mb-2">Test Pro Subscription (₹1/month)</h3>
              <p className="text-sm text-gray-600 mb-3">Product ID: prod_TAOYJxFQUH3jAb</p>
              <p className="text-xs text-blue-600 mb-3">Represents $49/month Pro Plan</p>
              <Button
                onClick={testSubscription}
                disabled={busy}
                className="w-full"
              >
                {busy ? 'Processing...' : 'Test Pro Subscription'}
              </Button>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Test Pro Scan (₹1)</h3>
              <p className="text-sm text-gray-600 mb-3">Product ID: prod_TAOXV0xliDfMGu</p>
              <p className="text-xs text-blue-600 mb-3">Represents $29 Pro Scan</p>
              <Button
                onClick={testOneTime}
                disabled={busy}
                variant="secondary"
                className="w-full"
              >
                {busy ? 'Processing...' : 'Test Pro Scan'}
              </Button>
            </div>
          </div>

          <Button
            onClick={loadSubscriptionStatus}
            disabled={busy}
            variant="outline"
            className="w-full"
          >
            Refresh Status
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Result</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto whitespace-pre-wrap min-h-[300px]">
          {result || 'No results yet. Try the buttons above.'}
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <div className="text-sm space-y-2">
          <p><strong>1.</strong> Click "Test Pro Subscription" to create a ₹1/month subscription (represents $49/month)</p>
          <p><strong>2.</strong> Complete the payment in Stripe (use test card: 4242 4242 4242 4242)</p>
          <p><strong>3.</strong> Return to this page and click "Refresh Status"</p>
          <p><strong>4.</strong> Verify subscription is active with 10 scans/month limit</p>
          <p><strong>5.</strong> Test one-time payments by clicking "Test Pro Scan"</p>
          <p><strong>6.</strong> Check that scan credits are added after one-time purchases</p>
        </div>
      </Card>
    </div>
  )
}