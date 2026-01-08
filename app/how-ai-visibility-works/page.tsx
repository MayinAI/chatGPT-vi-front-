"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { Lightbulb, Search, BarChart3, Sparkles, Target, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function HowAIVisibilityWorksPage() {
  return (
    <ContentPageLayout
      title="How AI Visibility Works"
      description="Understanding the science behind AI brand discovery"
      badge="Learn"
      badgeIcon={<Lightbulb className="w-4 h-4" />}
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-neutral-300 leading-relaxed">
          AI visibility measures how often a brand is mentioned or suggested in ChatGPT. Mayin quantifies this data and helps brands improve their visibility with actionable guidance.
        </p>
      </div>

      {/* What Is AI Visibility */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Search className="w-8 h-8 text-blue-400" />
          What Is AI Visibility?
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          AI visibility refers to the likelihood of your brand appearing in ChatGPT answers. It's the next evolution of SEO — instead of optimizing for search engines, brands must now optimize for AI models like ChatGPT.
        </p>

        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">The Shift from SEO to AIO</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-blue-400 text-sm font-bold">→</span>
              </div>
              <p className="text-neutral-300">
                <strong className="text-white">Traditional SEO:</strong> Optimize for Google's algorithm to rank higher in search results
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                <span className="text-purple-400 text-sm font-bold">→</span>
              </div>
              <p className="text-neutral-300">
                <strong className="text-white">AI Optimization (AIO):</strong> Optimize for AI models to appear in conversational answers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How Mayin Measures It */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <BarChart3 className="w-8 h-8 text-green-400" />
          How Mayin Measures It
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-8">
          Mayin runs structured prompts on ChatGPT, analyzes responses, and identifies visibility patterns, missing mentions, and key opportunities for improvement.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
              <span className="text-blue-400 text-xl font-bold">1</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Prompt Generation</h3>
            <p className="text-sm text-neutral-400">
              We create 100+ industry-specific prompts that users might ask about your category.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
              <span className="text-purple-400 text-xl font-bold">2</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Response Analysis</h3>
            <p className="text-sm text-neutral-400">
              We analyze each ChatGPT response to identify brand mentions, sentiment, and context.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-4">
              <span className="text-green-400 text-xl font-bold">3</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-3">Score Calculation</h3>
            <p className="text-sm text-neutral-400">
              We calculate your visibility score based on mention frequency, prominence, and sentiment.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Key Metrics */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Target className="w-8 h-8 text-yellow-400" />
          Key Metrics We Track
        </h2>

        <div className="space-y-4">
          {[
            {
              title: "Mention Frequency",
              description: "How often your brand appears compared to competitors in the same category",
              icon: BarChart3,
              color: "blue"
            },
            {
              title: "Sentiment Analysis",
              description: "Whether mentions are positive, neutral, or negative in context",
              icon: Sparkles,
              color: "purple"
            },
            {
              title: "Prominence Score",
              description: "Where your brand appears in responses (first mention vs. buried in list)",
              icon: Target,
              color: "green"
            },
            {
              title: "Category Coverage",
              description: "Which use cases and contexts your brand is mentioned in",
              icon: Search,
              color: "orange"
            }
          ].map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-${metric.color}-500/10 flex-shrink-0`}>
                  <metric.icon className={`w-6 h-6 text-${metric.color}-400`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">{metric.title}</h3>
                  <p className="text-sm text-neutral-400">{metric.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Improving Your AI Visibility */}
      <section>
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Zap className="w-8 h-8 text-purple-400" />
          Improving Your AI Visibility
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          Mayin provides actionable guidance — from structured data improvements to AI-friendly content creation — to help brands become more discoverable in ChatGPT.
        </p>

        <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-700">
          <h3 className="text-xl font-semibold text-white mb-4">What You'll Get</h3>
          <ul className="space-y-3">
            {[
              "Specific content gaps to fill in your marketing materials",
              "Structured data recommendations for better AI parsing",
              "Keyword and phrase optimization for AI context",
              "Competitor analysis showing what's working for others",
              "Monthly tracking to measure improvement over time"
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-green-400 text-xs">✓</span>
                </div>
                <span className="text-neutral-300">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </ContentPageLayout>
  )
}
