"use client"
import { useAuth } from '@/lib/auth/useAuth'
import { useProfile } from '@/lib/auth/ProfileProvider'
import { Button } from '@/components/ui/Button'
import { createStripeCheckoutSession, createStripePortalSession } from '@/lib/functions'
import { motion } from 'framer-motion'
import { Check, X, Crown, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Logo } from '@/components/Logo'

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    tier: "free",
    type: "free",
    description: "Perfect for trying out Mayin",
    features: [
      { text: "1 free scan", included: true },
      { text: "10 AI prompts per scan", included: true },
      { text: "Basic visibility score", included: true },
      { text: "Competitor analysis", included: false },
      { text: "Improvement recommendations", included: false },
      { text: "Sample ChatGPT responses", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Current Plan",
    popular: false,
  },
  
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    tier: "pro",
    type: "subscription",
    description: "Best for ongoing visibility tracking",
    features: [
      { text: "1 scan every 15 days", included: true },
      { text: "100 AI prompts per scan", included: true },
      { text: "Advanced visibility analytics", included: true },
      { text: "Full competitor analysis", included: true },
      { text: "Improvement recommendations", included: true },
      { text: "Unlimited sample responses", included: true },
      { text: "Priority email support", included: true },
      { text: "Trend tracking over time", included: true },
    ],
    cta: "Start Pro Plan",
    popular: true,
  },
  
]

export default function BillingPage() {
  const { user, loading } = useAuth()
  const profile = useProfile()
  const router = useRouter()

  if (loading || !profile) {
    return (
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    )
  }

  if (!user) {
    router.push('/login')
    return null
  }

  const isSubscribed = profile?.isSubscribed || false
  const currentTier = (profile?.planTier || 'free').toLowerCase()
  const status = profile?.subscriptionStatus || 'inactive'

  const onSubscribe = async (tier: 'pro') => {
    try {
      console.log(`Subscription request for ${tier}`)

      const res = await createStripeCheckoutSession({ planTier: 'pro' })

      console.log('Stripe response:', res)
      if (!res?.url) throw new Error('Missing checkout URL')

      window.location.href = res.url
    } catch (e: any) {
      console.error('Subscription error:', e)
      alert(e?.message || 'Failed to start checkout')
    }
  }

  // One-time purchases disabled

  const onManage = async () => {
    try {
      console.log('Opening Stripe billing portal...')
      const res = await createStripePortalSession()
      console.log('Portal response:', res)

      if (!res?.url) throw new Error('Missing portal URL')
      window.location.href = res.url
    } catch (e: any) {
      console.error('Portal error:', e)
      alert(e?.message || 'Failed to open billing portal.')
    }
  }

  const handlePlanAction = (plan: typeof plans[0]) => {
    if (plan.name === "Free") {
      // Already on free plan, do nothing
      return
    } else if (plan.type === "subscription") {
      onSubscribe('pro')
    }
  }

  const getButtonText = (plan: typeof plans[0]) => {
    if (plan.name === "Free" && currentTier === "free") {
      return "Current Plan"
    }
    if (plan.type === "subscription" && isSubscribed && currentTier === plan.tier) {
      return "Current Plan"
    }
    return plan.cta
  }

  const isButtonDisabled = (plan: typeof plans[0]) => {
    if (plan.name === "Free" && currentTier === "free") return true
    if (plan.type === "subscription" && isSubscribed && currentTier === plan.tier) return true
    return false
  }

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="relative z-20 flex h-20 items-center justify-between border-b border-neutral-800/50">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
          <Logo href="/" />
        </header>

        {/* Current Status */}
        <section className="py-8">
          <div className="max-w-4xl mx-auto">
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Current Plan</h3>
                  <p className="text-2xl font-bold text-white capitalize">{currentTier}</p>
                  {isSubscribed && (
                    <p className="text-sm text-neutral-400 mt-1">Status: <span className="text-green-400">{status}</span></p>
                  )}
                </div>
                {isSubscribed && (
                  <Button onClick={onManage} variant="outline">
                    Manage Billing
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section className="py-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-neutral-300">Upgrade Your Plan</span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
              Choose Your Plan
            </h1>
            <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
              Unlock advanced features and deeper insights with our premium plans
            </p>
          </motion.div>
        </section>

        {/* Pricing Cards */}
        <section className="pb-20">
          <div className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 max-w-7xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`relative p-8 rounded-xl border transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-br from-neutral-900 to-neutral-900/50 border-blue-500/50 shadow-lg shadow-blue-500/10'
                    : 'bg-neutral-900/50 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-semibold">
                      <Crown className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                {currentTier === plan.tier && (
                  <div className="absolute -top-4 right-4">
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                      Current Plan
                    </div>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <>
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-neutral-400">/{plan.period}</span>
                    </>
                  </div>
                  <p className="text-sm text-neutral-400">{plan.description}</p>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-neutral-600 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`text-sm ${feature.included ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <Button
                  variant={plan.popular ? "primary" : "outline"}
                  className="w-full"
                  onClick={() => handlePlanAction(plan)}
                  disabled={isButtonDisabled(plan)}
                >
                  {getButtonText(plan)}
                </Button>
              </motion.div>
            ))}
          </div>

          
        </section>
      </div>
    </div>
  )
}
