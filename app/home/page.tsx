"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth/useAuth"
import { Button } from "@/components/ui/Button"
import { Logo } from '@/components/Logo'
import { UserMenu } from '@/components/UserMenu'
import { db } from '@/lib/firebase/client'
import { doc, onSnapshot } from 'firebase/firestore'
import { PaywallDialog } from '@/components/PaywallDialog'
import { motion } from 'framer-motion'
import { Search, TrendingUp, BarChart3, Zap, Target, Users, CheckCircle2, ArrowRight, MessageSquare } from 'lucide-react'
import Image from 'next/image'

export default function HomePage() {
  const router = useRouter()
  const { user } = useAuth()
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
  const [showPaywall, setShowPaywall] = useState(false)

  // Watch subscription status when logged in
  useEffect(() => {
    if (!user) return
    const ref = doc(db, 'users', user.uid)
    const unsub = onSnapshot(ref, (snap) => {
      const d = snap.data() as any
      const active = !!(d?.isSubscribed || d?.subscriptionStatus === 'active' || d?.subscription_status === 'active')
      setIsSubscribed(active)
    })
    return () => unsub()
  }, [user])

  const fadeUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  }

  return (
    <main className="bg-dark-bg text-white min-h-screen">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <header className="relative z-20 flex h-20 items-center justify-between">
          <Logo href="/" />
          {user ? (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>Dashboard</Button>
              <UserMenu />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={() => router.push('/pricing')}>Pricing</Button>
              <Button variant="ghost" size="sm" onClick={() => router.push('/login')}>Sign In</Button>
              <Button variant="primary" size="sm" onClick={() => router.push('/login?mode=signup')}>Get Started</Button>
            </div>
          )}
        </header>

        {/* Hero Section */}
        <section className="relative flex min-h-[85vh] flex-col items-center justify-center text-center py-20">
          <motion.div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-neutral-300">AI Visibility Analytics</span>
          </motion.div>

          <motion.h1
            className="max-w-4xl text-5xl sm:text-7xl font-bold tracking-tight leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
          >
            Is ChatGPT Recommending Your Brand?
          </motion.h1>

          <motion.p
            className="mt-6 max-w-2xl text-lg text-neutral-400 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Mayin sends 100s of AI prompts related to your business in 30 seconds — and shows if ChatGPT is mentioning your brand, why it isn&apos;t mentioned more, and exactly how to fix it. Track mentions and compare against competitors.
          </motion.p>

          <motion.div
            className="mt-8 flex items-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <Button
              onClick={() => router.push(user ? '/scan/new' : '/login?mode=signup')}
              variant="primary"
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:opacity-90"
            >
              Scan My Brand Now
            </Button>
          </motion.div>

          <motion.p
            className="mt-6 text-sm text-neutral-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            No credit card required • Free scan in 30 seconds
          </motion.p>
        </section>

        {/* Product Showcase */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              See What ChatGPT Says About Your Brand
            </h2>
            <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
              Discover how AI talks about your brand in ChatGPT answers and get actionable insights to improve your brand visibility.
            </p>
          </div>

          <div className="space-y-16">
            {/* ChatGPT Screenshot - Full Width Hero */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              {/* Subtle radiant border effect like Resend */}
              <div className="relative p-[1px] rounded-xl bg-gradient-to-b from-neutral-700/50 via-neutral-800/30 to-neutral-900/20">
                <div className="relative rounded-xl overflow-hidden bg-dark-bg shadow-2xl">
                  <Image
                    src="/chatGPT_SS.png"
                    alt="ChatGPT showing brand recommendations for running shoes"
                    width={1600}
                    height={900}
                    className="w-full"
                    priority
                  />
                </div>
              </div>

              {/* Caption with badge */}
              <div className="mt-8 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-900/50 border border-neutral-800 mb-4">
                  <MessageSquare className="w-4 h-4 text-neutral-400" />
                  <span className="text-sm text-neutral-400">Live ChatGPT Interface</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Real AI Recommendations
                </h3>
                <p className="text-neutral-400 max-w-2xl mx-auto">
                  This is what users see when they ask ChatGPT for recommendations. Is your brand mentioned? Find out with a free scan.
                </p>
              </div>
            </motion.div>

            {/* Scan Report Screenshots - Enhanced Grid */}
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                  <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-xl hover:border-neutral-600 transition-all duration-300 bg-neutral-900/30">
                    <Image
                      src="/scan_report1.png"
                      alt="AI Visibility Score Dashboard showing score 84"
                      width={1200}
                      height={800}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mt-6 px-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-green-500/10">
                      <BarChart3 className="w-4 h-4 text-green-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Visibility Score Dashboard</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    Track your AI visibility with a comprehensive 0-100 score, trend analysis, and real-time competitor benchmarks
                  </p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="group"
              >
                <div className="relative">
                  {/* Glow effect on hover */}
                  <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300" />

                  <div className="relative rounded-xl overflow-hidden border border-neutral-800 shadow-xl hover:border-neutral-600 transition-all duration-300 bg-neutral-900/30">
                    <Image
                      src="/scan_report2.png"
                      alt="Competitor analysis and sentiment breakdown"
                      width={1200}
                      height={800}
                      className="w-full"
                    />
                  </div>
                </div>

                <div className="mt-6 px-2">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="p-1.5 rounded-md bg-purple-500/10">
                      <Users className="w-4 h-4 text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold">Competitor Intelligence</h3>
                  </div>
                  <p className="text-sm text-neutral-400 leading-relaxed">
                    See who dominates AI conversations in your category with sentiment analysis and sample ChatGPT responses
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Feature Highlights */}
        <motion.section
          className="py-16 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-4 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">100+ AI Prompts</h3>
                <p className="text-sm text-neutral-400">Automated scanning of ChatGPT answers across industry-specific queries</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-lg bg-green-500/10">
                <BarChart3 className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Visibility Score</h3>
                <p className="text-sm text-neutral-400">Comprehensive 0-100 brand mention analysis in ChatGPT</p>
              </div>
            </div>

            <div className="flex items-start gap-4 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Competitor Analysis</h3>
                <p className="text-sm text-neutral-400">See who gets more brand mentions in your space</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Not Mentioned + Fix Section (New) */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">Not Mentioned in ChatGPT? We Find Why — And Fix It</h2>
              <p className="text-neutral-400 text-lg">New: root-cause analysis of missing mentions with a prioritized Fix Playbook</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Root-cause reasons */}
              <div className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center gap-3 mb-4">
                  <Search className="w-5 h-5 text-blue-400" />
                  <h3 className="text-xl font-semibold">Why Your Brand Isn&apos;t Mentioned</h3>
                </div>
                <div className="space-y-3 text-neutral-300">
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-500 mt-1" /><p className="text-sm text-neutral-400">Entity recognition gaps: your brand isn&apos;t consistently understood as a product/service in context</p></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-500 mt-1" /><p className="text-sm text-neutral-400">Content mismatch: on-site/product copy doesn&apos;t answer high‑intent prompts users actually ask</p></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-500 mt-1" /><p className="text-sm text-neutral-400">Authority signals missing: weak reviews, citations, awards, or topical depth vs. competitors</p></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-neutral-500 mt-1" /><p className="text-sm text-neutral-400">Safety/disclaimer triggers: unclear claims or compliance wording causing AI to avoid recommending</p></div>
                </div>
              </div>

              {/* Fix playbook */}
              <div className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-5 h-5 text-purple-400" />
                  <h3 className="text-xl font-semibold">The Fix Playbook (Prioritized)</h3>
                </div>
                <div className="space-y-3 text-neutral-300">
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-1" /><p className="text-sm text-neutral-400">Structured entity tuning: pages and data that help AIs correctly recognize your brand</p></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-1" /><p className="text-sm text-neutral-400">Prompt‑aligned content: add/adjust content mapped to high‑intent prompts that drive mentions</p></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-1" /><p className="text-sm text-neutral-400">Authority uplift: reviews, expert quotes, stats, and citations where they matter</p></div>
                  <div className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-green-400 mt-1" /><p className="text-sm text-neutral-400">Compliance‑friendly claims: rephrase sensitive assertions to avoid safety filters</p></div>
                </div>
              </div>
            </div>

            <div className="text-center mt-10">
              <Button
                onClick={() => router.push(user ? '/scan/new' : '/login?mode=signup')}
                variant="primary"
                size="lg"
              >
                Run Root‑Cause Scan
              </Button>
            </div>
          </div>
        </motion.section>

        {/* Problem Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-5xl font-bold leading-tight">
              Search is Changing. Are You Visible in AI Conversations?
            </h2>
            <div className="mt-8 space-y-5 text-base sm:text-lg text-neutral-400 leading-relaxed">
              <p>
                When customers ask ChatGPT for product or service recommendations, AI doesn&apos;t show ads or SEO results — it mentions brands it trusts.
              </p>
              <p>
                If ChatGPT isn&apos;t talking about your brand, you&apos;re invisible in the most influential search engine of the future.
              </p>
            </div>

            <div className="mt-12 p-6 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800">
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <TrendingUp className="w-5 h-5 text-red-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">The AI Search Revolution</h3>
                  <p className="text-neutral-400 text-sm leading-relaxed">
                    Traditional SEO optimizes for Google. But ChatGPT doesn&apos;t rank websites—it recommends brands.
                    If your brand isn&apos;t in the conversation, you&apos;re losing customers to competitors who are.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* How It Works Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">How Mayin Works</h2>
              <p className="text-neutral-400 text-lg">Four simple steps to improve your AI visibility</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div
                className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-500/20 text-blue-400 font-bold text-sm">
                    1
                  </div>
                  <Search className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">We Send 100+ Prompts</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Our system sends hundreds of relevant prompts to ChatGPT matching your industry, like &quot;best fintech apps in India&quot; or &quot;top D2C skincare brands&quot; to check for brand mentions.
                </p>
              </motion.div>

              <motion.div
                className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-500/20 text-green-400 font-bold text-sm">
                    2
                  </div>
                  <BarChart3 className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">We Analyze ChatGPT Answers</h3>
                <p className="text-neutral-400 leading-relaxed">
                  We detect if your brand is mentioned in ChatGPT answers, how often, how it&apos;s described, and what emotions ChatGPT associates with it.
                </p>
              </motion.div>

              <motion.div
                className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 font-bold text-sm">
                    3
                  </div>
                  <Target className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Get Your Brand Mention Score</h3>
                <p className="text-neutral-400 leading-relaxed">
                  You get a visibility score based on brand mentions, sentiment breakdown, and list of top competitors mentioned more often than you.
                </p>
              </motion.div>

              <motion.div
                className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-400 font-bold text-sm">
                    4
                  </div>
                  <Zap className="w-5 h-5 text-yellow-400" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Apply the Fix Playbook</h3>
                <p className="text-neutral-400 leading-relaxed">
                  Prioritized actions to increase mentions: entity signals, prompt‑aligned content, authority boosters, and compliance‑friendly claims.
                </p>
              </motion.div>
            </div>

            <motion.div
              className="mt-12 text-center"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <Button
                onClick={() => router.push(user ? '/scan/new' : '/login?mode=signup')}
                variant="primary"
                size="lg"
              >
                Run a Free Scan
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* What You Get Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">What You Get</h2>
              <p className="text-neutral-400 text-lg">Comprehensive insights to improve your AI visibility</p>
            </div>

            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: "AI Visibility Score (0-100) based on brand mentions", color: "text-green-400" },
                { icon: CheckCircle2, text: "Competitor benchmark showing who dominates your category", color: "text-green-400" },
                { icon: CheckCircle2, text: "Sentiment analysis of how ChatGPT describes your brand", color: "text-green-400" },
                { icon: CheckCircle2, text: "Location-based visibility breakdown by region", color: "text-green-400" },
                { icon: CheckCircle2, text: "Sample ChatGPT responses featuring your brand", color: "text-green-400" },
                { icon: CheckCircle2, text: "Root‑cause analysis: why your brand isn\'t mentioned", color: "text-green-400" },
                { icon: CheckCircle2, text: "Prioritized Fix Playbook with step‑by‑step actions", color: "text-green-400" },
                { icon: CheckCircle2, text: "Actionable recommendations to improve AI visibility", color: "text-green-400" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900/30 border border-neutral-800/50"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <item.icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${item.color}`} />
                  <p className="text-neutral-300">{item.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Plans Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-5xl font-bold mb-4">Find the Right Plan for You</h2>
              <p className="text-neutral-400 text-lg">Whether you're just getting started or need a comprehensive analysis, we have a plan for you.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 rounded-md bg-blue-500/10">
                    <Zap className="w-5 h-5 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Pro Plan</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  Our Pro plan is perfect for brands who want to get a quick pulse on their visibility in ChatGPT. We'll analyze your brand mentions across 100 prompts.
                </p>
                <Button
                  onClick={() => router.push('/pricing')}
                  variant="outline"
                  size="lg"
                  className="w-full"
                >
                  Get Started with Pro
                </Button>
              </motion.div>

              <motion.div
                className="p-8 rounded-xl bg-neutral-900/50 border border-purple-500/50 hover:border-purple-500 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-1.5 rounded-md bg-purple-500/10">
                    <BarChart3 className="w-5 h-5 text-purple-400" />
                  </div>
                  <h3 className="text-2xl font-semibold">Enterprise Plan</h3>
                </div>
                <p className="text-neutral-400 leading-relaxed mb-6">
                  For a deep dive into your brand&apos;s visibility, our Enterprise plan analyzes 1000 prompts and includes full root‑cause diagnosis of missing mentions plus a tailored Fix Playbook and strategic recommendations.
                </p>
                <Button
                  onClick={() => router.push('/contact')}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Contact Us for Enterprise
                </Button>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Testimonials Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50 overflow-hidden"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-6xl mb-12 px-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">Trusted by Forward-Thinking Brands</h2>
            <p className="text-neutral-400 text-center text-lg">See what companies are saying about Mayin</p>
          </div>

          <motion.div
            className="flex gap-6 px-6"
            animate={{
              x: [0, -1000],
            }}
            transition={{
              x: {
                repeat: Infinity,
                repeatType: "loop",
                duration: 20,
                ease: "linear",
              },
            }}
          >
            {[
              {
                quote: "Mayin revealed we were invisible in ChatGPT. Within 2 months of following their recommendations, our brand mentions tripled.",
                author: "Sarah Chen",
                role: "Head of Marketing",
                company: "TechFlow",
              },
              {
                quote: "The AI visibility report was eye-opening. We discovered our competitors dominated ChatGPT recommendations in our category.",
                author: "Raj Malhotra",
                role: "Founder",
                company: "FinanceHub",
              },
              {
                quote: "Finally, a way to measure brand presence in ChatGPT conversations. This is the future of SEO.",
                author: "Emily Rodriguez",
                role: "CMO",
                company: "BrandLabs",
              },
              {
                quote: "We shifted our content strategy based on Mayin's insights. Now ChatGPT recommends us for key industry queries.",
                author: "Michael Park",
                role: "VP Growth",
                company: "ScaleUp Co",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-[400px] p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
              >
                <p className="text-neutral-300 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-xs text-neutral-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for seamless loop */}
            {[
              {
                quote: "Mayin revealed we were invisible in ChatGPT. Within 2 months of following their recommendations, our brand mentions tripled.",
                author: "Sarah Chen",
                role: "Head of Marketing",
                company: "TechFlow",
              },
              {
                quote: "The AI visibility report was eye-opening. We discovered our competitors dominated ChatGPT recommendations in our category.",
                author: "Raj Malhotra",
                role: "Founder",
                company: "FinanceHub",
              },
              {
                quote: "Finally, a way to measure brand presence in ChatGPT conversations. This is the future of SEO.",
                author: "Emily Rodriguez",
                role: "CMO",
                company: "BrandLabs",
              },
              {
                quote: "We shifted our content strategy based on Mayin's insights. Now ChatGPT recommends us for key industry queries.",
                author: "Michael Park",
                role: "VP Growth",
                company: "ScaleUp Co",
              },
            ].map((testimonial, index) => (
              <div
                key={`duplicate-${index}`}
                className="flex-shrink-0 w-[400px] p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
              >
                <p className="text-neutral-300 mb-6 leading-relaxed">&quot;{testimonial.quote}&quot;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                    {testimonial.author.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{testimonial.author}</div>
                    <div className="text-xs text-neutral-500">{testimonial.role} at {testimonial.company}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.section>

        {/* FOMO Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="p-12 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 border border-neutral-700 text-center">
              <h2 className="text-3xl sm:text-5xl font-bold mb-6">
                Your Competitors Are Already Training the AIs.
              </h2>
              <p className="text-lg text-neutral-400 leading-relaxed mb-10">
                Every brand that appears in ChatGPT responses today will dominate AI-driven discovery tomorrow. Don&apos;t wait until it&apos;s too late to influence what AI says about you.
              </p>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Button
                  onClick={() => router.push(user ? '/scan/new' : '/login?mode=signup')}
                  variant="primary"
                  size="lg"
                >
                  Get Your AI Visibility Report Now
                </Button>
              </motion.div>
              <p className="mt-4 text-sm text-neutral-500">Starting at $9 • Full report in 30 seconds</p>
            </div>
          </div>
        </motion.section>

        {/* Footer CTA Section */}
        <motion.section
          className="py-24 border-t border-neutral-800/50"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Don&apos;t Get Left Behind in the AI Visibility Race
            </h2>
            <p className="text-lg text-neutral-400 mb-8 max-w-2xl mx-auto">
              Start measuring your brand&apos;s presence in AI conversations today
            </p>
            <Button
              onClick={() => router.push(user ? '/scan/new' : '/login?mode=signup')}
              variant="primary"
              size="lg"
            >
              Run Free Visibility Scan
            </Button>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t border-neutral-800/50 py-12">
          <div className="mb-8">
            <div className="flex justify-center sm:justify-start mb-4">
              <Logo size="md" showIcon={true} href="/" />
            </div>
            <p className="text-sm text-neutral-500 max-w-md">
              The first AI Visibility Analytics platform. Measure and improve your brand's presence in ChatGPT conversations by tracking brand mentions, diagnosing why you aren&apos;t mentioned, and delivering a prioritized Fix Playbook.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="/insights" className="hover:text-white transition-colors">Insights</a></li>
                <li><a href="/what-is-mayin" className="hover:text-white transition-colors">What is Mayin?</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Learn</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/how-ai-visibility-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/ai-search-visibility-score" className="hover:text-white transition-colors">Visibility Score</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/contact" className="hover:text-white transition-colors">Contact Us</a></li>
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

          <div className="pt-8 border-t border-neutral-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500">© 2025 Mayin. All rights reserved.</p>
            <div className="flex items-center gap-6 text-sm text-neutral-500">
              <a href="https://twitter.com/mayinapp" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
              <a href="https://linkedin.com/company/mayin" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
            </div>
          </div>
        </footer>

      </div>
      <PaywallDialog open={showPaywall} onOpenChange={setShowPaywall} />
    </main>
  )
}
