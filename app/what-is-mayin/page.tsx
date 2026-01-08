"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { BookOpen, Target, TrendingUp, Users, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export default function WhatIsMayinPage() {
  return (
    <ContentPageLayout
      title="What is Mayin?"
      description="The first AI Visibility Analytics platform for modern brands"
      badge="Learn"
      badgeIcon={<BookOpen className="w-4 h-4" />}
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-neutral-300 leading-relaxed">
          Mayin is an AI visibility platform that helps brands measure and improve how often they appear in ChatGPT.
        </p>
      </div>

      {/* How Mayin Works */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Sparkles className="w-8 h-8 text-purple-400" />
          How Mayin Works
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          Mayin analyzes ChatGPT responses to measure how frequently and in what context a brand is mentioned. It provides an AI Visibility Score and step-by-step actions to improve presence in ChatGPT.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-4">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Analysis</h3>
            <p className="text-neutral-400">
              We send 100+ relevant prompts to ChatGPT about your industry and analyze how often your brand appears in responses.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="p-3 rounded-lg bg-green-500/10 w-fit mb-4">
              <TrendingUp className="w-6 h-6 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Actionable Insights</h3>
            <p className="text-neutral-400">
              Get specific recommendations on how to improve your AI visibility with data-driven guidance.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why AI Visibility Matters */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <TrendingUp className="w-8 h-8 text-yellow-400" />
          Why AI Visibility Matters
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          With AI chat replacing traditional search, visibility in ChatGPT answers determines how often users discover your brand. Mayin helps businesses stay discoverable as search shifts from SEO to AIO (AI Optimization).
        </p>

        <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-700">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">AI is the new search engine</h4>
                <p className="text-neutral-400 text-sm">Users are asking ChatGPT instead of Googling. If your brand isn't mentioned, you're invisible.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">First movers win</h4>
                <p className="text-neutral-400 text-sm">Brands optimizing for AI visibility today will dominate the AI-driven future of discovery.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-green-400 font-bold">3</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Measurable impact</h4>
                <p className="text-neutral-400 text-sm">Track your AI visibility score over time and measure the ROI of your optimization efforts.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses Mayin */}
      <section>
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Users className="w-8 h-8 text-orange-400" />
          Who Uses Mayin
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-8">
          Brands, marketers, and founders who want to understand their brand presence inside AI systems use Mayin to audit and optimize their AI visibility.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Brand Managers",
              description: "Monitor brand mentions and sentiment across AI platforms",
              color: "blue"
            },
            {
              title: "Marketing Teams",
              description: "Optimize content strategy for AI discoverability",
              color: "purple"
            },
            {
              title: "Founders",
              description: "Understand competitive positioning in AI results",
              color: "green"
            }
          ].map((persona, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{persona.title}</h3>
              <p className="text-sm text-neutral-400">{persona.description}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </ContentPageLayout>
  )
}
