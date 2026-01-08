"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { BarChart3, Target, TrendingUp, Lightbulb, Award, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

export default function AIVisibilityScorePage() {
  return (
    <ContentPageLayout
      title="AI Search Visibility Score"
      description="Understanding your brand's AI discoverability metric"
      badge="Learn"
      badgeIcon={<BarChart3 className="w-4 h-4" />}
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-neutral-300 leading-relaxed">
          Mayin's AI Visibility Score measures how often a brand appears in ChatGPT's responses and AI search results. It's a quantitative metric that helps you track and improve your AI discoverability over time.
        </p>
      </div>

      {/* Score Breakdown */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Award className="w-8 h-8 text-yellow-400" />
          Understanding Your Score
        </h2>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          {[
            { range: "75-100", label: "Excellent", color: "green", desc: "Top-of-mind brand" },
            { range: "50-74", label: "Good", color: "yellow", desc: "Competitive presence" },
            { range: "25-49", label: "Fair", color: "orange", desc: "Room to improve" },
            { range: "0-24", label: "Low", color: "red", desc: "Needs optimization" }
          ].map((tier, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-xl bg-${tier.color}-500/10 border border-${tier.color}-500/20`}
            >
              <div className={`text-2xl font-bold text-${tier.color}-400 mb-1`}>{tier.range}</div>
              <div className="text-sm font-semibold text-white mb-1">{tier.label}</div>
              <div className="text-xs text-neutral-400">{tier.desc}</div>
            </motion.div>
          ))}
        </div>

        <p className="text-neutral-300 leading-relaxed">
          Your score is calculated based on mention frequency, prominence in responses, sentiment, and competitive positioning. A higher score means your brand is more discoverable in AI conversations.
        </p>
      </section>

      {/* Visibility Metrics */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Target className="w-8 h-8 text-blue-400" />
          Visibility Metrics
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          Mayin calculates brand mentions, sentiment, and prominence across AI-generated answers to build a quantitative visibility score.
        </p>

        <div className="space-y-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10 flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Mention Rate</h3>
                <p className="text-sm text-neutral-400">
                  Percentage of relevant prompts where your brand appears in the response. Higher is better.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10 flex-shrink-0">
                <Award className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Prominence Position</h3>
                <p className="text-sm text-neutral-400">
                  Average ranking when mentioned (1st, 2nd, 3rd brand mentioned). Earlier mentions score higher.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-green-500/10 flex-shrink-0">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Sentiment Score</h3>
                <p className="text-sm text-neutral-400">
                  Ratio of positive to negative mentions. Positive sentiment boosts your overall score.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-orange-500/10 flex-shrink-0">
                <Target className="w-6 h-6 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Context Relevance</h3>
                <p className="text-sm text-neutral-400">
                  How contextually appropriate the mentions are. Being mentioned in the right scenarios matters.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Actionable Insights */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Lightbulb className="w-8 h-8 text-purple-400" />
          Actionable Insights
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          Each score report includes specific recommendations — such as missing structured data, low contextual presence, or content gaps — to boost AI visibility.
        </p>

        <div className="p-6 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-purple-500/20">
          <h3 className="text-xl font-semibold text-white mb-4">What's Included in Your Report</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              "Competitor benchmarking",
              "Missing mention opportunities",
              "Content optimization tips",
              "Structured data recommendations",
              "Sentiment improvement areas",
              "Category expansion ideas",
              "Keyword gap analysis",
              "Priority action items"
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 text-purple-400" />
                </div>
                <span className="text-neutral-300 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Score Trends */}
      <section>
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <TrendingUp className="w-8 h-8 text-green-400" />
          Track Your Progress
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          With Mayin Pro, you can run monthly scans and track your visibility score over time. See the impact of your optimization efforts and measure ROI.
        </p>

        <div className="p-6 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-700">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 text-sm font-bold">📊</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Historical Comparison</h4>
                <p className="text-neutral-400 text-sm">Compare your current score to previous months and identify trends.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-green-400 text-sm font-bold">📈</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Improvement Tracking</h4>
                <p className="text-neutral-400 text-sm">See which recommendations had the biggest impact on your score.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 text-sm font-bold">🎯</span>
              </div>
              <div>
                <h4 className="text-white font-semibold mb-1">Competitive Monitoring</h4>
                <p className="text-neutral-400 text-sm">Track how your score compares to competitors over time.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ContentPageLayout>
  )
}
