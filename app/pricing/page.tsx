"use client"

import { Button } from "@/components/ui/Button"
import { useRouter } from "next/navigation"
import { Logo } from "@/components/Logo"
import { useAuth } from "@/lib/auth/useAuth"
import { UserMenu } from "@/components/UserMenu"
import { motion } from "framer-motion"
import {
  Check, X, Crown, Zap, TrendingUp,
  Users, MessageSquare, Lightbulb, Target, BarChart3
} from "lucide-react"
import Link from "next/link"

export default function PricingPage() {
  const router = useRouter()
  const { user } = useAuth()

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
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
      cta: "Get Started",
      popular: false,
    },
    
    {
      name: "Pro",
      price: "$49",
      period: "per month",
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

  return (
    <main className="bg-dark-bg text-white min-h-screen">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <header className="relative z-20 flex h-20 items-center justify-between border-b border-neutral-800/50">
          <Logo href="/" />
          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>Dashboard</Button>
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>Sign In</Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/login')}>Sign Up</Button>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6">
              <Crown className="w-4 h-4 text-yellow-400" />
              <span className="text-neutral-300">Simple, Transparent Pricing</span>
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight mb-6">
              Choose Your Plan
            </h1>
            <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
              Start with a free scan. Upgrade anytime to unlock advanced features and deeper insights.
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

                <div className="mb-6">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    <span className="text-neutral-400">/{plan.period}</span>
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
                  onClick={() => {
                    if (plan.name === "Enterprise") {
                      router.push('/contact')
                    } else if (plan.name === "Free") {
                      router.push(user ? '/scan/new' : '/login')
                    } else {
                      // For paid plans (Starter, Pro, Premium), route to billing/payment
                      router.push(user ? '/billing' : '/login')
                    }
                  }}
                >
                  {plan.cta}
                </Button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features Comparison */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 border-t border-neutral-800/50"
        >
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">What You Get</h2>
            <p className="text-neutral-400 text-lg">All plans include these core features</p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                icon: BarChart3,
                color: "blue",
                title: "Visibility Score",
                description: "Comprehensive 0-100 score based on AI mention analysis"
              },
              {
                icon: Users,
                color: "purple",
                title: "Competitor Analysis",
                description: "See which brands dominate your category in AI results"
              },
              {
                icon: MessageSquare,
                color: "green",
                title: "ChatGPT Responses",
                description: "Real samples of how AI talks about your brand"
              },
              {
                icon: TrendingUp,
                color: "yellow",
                title: "Trend Tracking",
                description: "Monitor your visibility improvements over time"
              },
              {
                icon: Lightbulb,
                color: "orange",
                title: "Improvement Tips",
                description: "Actionable recommendations to boost AI visibility"
              },
              {
                icon: Target,
                color: "red",
                title: "Industry-Specific",
                description: "Tailored analysis for your business category"
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
              >
                <div className={`p-3 rounded-lg bg-${feature.color}-500/10 w-fit mb-4`}>
                  <feature.icon className={`w-6 h-6 text-${feature.color}-400`} />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-neutral-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* FAQ Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 border-t border-neutral-800/50"
        >
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                {
                  q: "What's included in the free plan?",
                  a: "The free plan includes 1 scan with 10 AI prompts and a basic visibility score. It's perfect for getting started and understanding how Mayin works."
                },
                // Removed discount FAQ: no active discounts currently
                {
                  q: "Can I cancel my monthly subscription anytime?",
                  a: "Yes! You can cancel your Pro subscription at any time from your dashboard. You'll retain access until the end of your billing period."
                },
              ].map((faq, index) => (
                <div key={index} className="p-6 rounded-xl bg-neutral-900/30 border border-neutral-800">
                  <h3 className="text-lg font-semibold mb-2">{faq.q}</h3>
                  <p className="text-neutral-400">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* CTA Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="py-20 text-center"
        >
          <div className="p-12 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-700">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Ready to Improve Your AI Visibility?
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Start with a free scan and see where your brand stands in AI conversations
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={() => router.push(user ? '/scan/new' : '/login')}
              >
                Start Free Scan
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={() => router.push('/contact')}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-neutral-800/50 py-12">
          <div className="mb-8">
            <div className="flex justify-center sm:justify-start mb-4">
              <Logo size="md" showIcon={true} href="/" />
            </div>
            <p className="text-sm text-neutral-500 max-w-md">
              The first AI Visibility Analytics platform. Measure and improve your brand&apos;s presence in ChatGPT conversations.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/insights" className="hover:text-white transition-colors">Insights</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Learn</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/what-is-mayin" className="hover:text-white transition-colors">What is Mayin?</a></li>
                <li><a href="/how-ai-visibility-works" className="hover:text-white transition-colors">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-neutral-800/50 text-center text-sm text-neutral-500">
            © 2025 Mayin. All rights reserved.
          </div>
        </footer>
      </div>
    </main>
  )
}
