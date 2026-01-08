"use client"
import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/Logo'
import { motion } from 'framer-motion'
import {
  ArrowLeft, TrendingUp, TrendingDown, Minus,
  Target, Users, MessageSquare, Lightbulb,
  Crown, BarChart3, Zap, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { db } from '@/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'

const COLORS = {
  primary: '#6366F1',
  positive: '#22C55E',
  negative: '#EF4444',
  neutral: '#9CA3AF',
}

function ScoreRing({ value, delta, displayText }: { value: number; delta?: number; displayText?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = 70
  const c = 2 * Math.PI * r
  const offset = c - (pct / 100) * c

  const getScoreColor = (score: number) => {
    if (score >= 75) return '#22C55E'
    if (score >= 50) return '#FACC15'
    if (score >= 25) return '#FB923C'
    return '#EF4444'
  }

  const scoreColor = getScoreColor(pct)

  return (
    <div className="relative w-48 h-48">
      <svg viewBox="0 0 160 160" className="w-full h-full transform -rotate-90">
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke="rgba(255,255,255,0.1)"
          strokeWidth="12"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r={r}
          stroke={scoreColor}
          strokeWidth="12"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-bold text-white">{displayText ?? pct}</span>
        <span className="text-sm text-neutral-400 mt-1">Visibility Score</span>
        {delta !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            {delta > 0 ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : delta < 0 ? (
              <TrendingDown className="w-4 h-4 text-red-400" />
            ) : (
              <Minus className="w-4 h-4 text-neutral-400" />
            )}
            <span className={`text-sm font-medium ${delta > 0 ? 'text-green-400' : delta < 0 ? 'text-red-400' : 'text-neutral-400'}`}>
              {delta > 0 ? '+' : ''}{delta} vs last
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function TrendChart({ points }: { points: Array<{ x: number; y: number }> }) {
  if (points.length < 2) {
    return (
      <div className="w-full h-32 flex items-center justify-center text-neutral-500 text-sm">
        Run more scans to see trend
      </div>
    )
  }

  const w = 100, h = 100
  const minY = 0, maxY = 100
  const minX = 0, maxX = points.length - 1

  const pathData = points.map((p, i) => {
    const x = (i / maxX) * w
    const y = h - ((p.y - minY) / (maxY - minY)) * h
    return `${i === 0 ? 'M' : 'L'} ${x},${y}`
  }).join(' ')

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#6366F1" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6366F1" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`${pathData} L ${w},${h} L 0,${h} Z`}
        fill="url(#gradient)"
      />
      <path
        d={pathData}
        stroke="#6366F1"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {points.map((p, i) => {
        const x = (i / maxX) * w
        const y = h - ((p.y - minY) / (maxY - minY)) * h
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#6366F1"
            className="hover:r-4 transition-all"
          />
        )
      })}
    </svg>
  )
}

function SentimentDonut({ sentiment }: { sentiment: { positive: number; neutral: number; negative: number } }) {
  const total = Math.max(1, sentiment.positive + sentiment.neutral + sentiment.negative)
  const positive = (sentiment.positive / total) * 100
  const neutral = (sentiment.neutral / total) * 100
  const negative = (sentiment.negative / total) * 100

  return (
    <div className="flex items-center gap-8">
      <div className="relative w-32 h-32">
        <svg viewBox="0 0 120 120" className="w-full h-full transform -rotate-90">
          <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="20" />
          {sentiment.positive > 0 && (
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={COLORS.positive}
              strokeWidth="20"
              strokeDasharray={`${positive * 3.14} 314`}
              className="transition-all duration-1000"
            />
          )}
          {sentiment.neutral > 0 && (
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={COLORS.neutral}
              strokeWidth="20"
              strokeDasharray={`${neutral * 3.14} 314`}
              strokeDashoffset={-positive * 3.14}
              className="transition-all duration-1000"
            />
          )}
          {sentiment.negative > 0 && (
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={COLORS.negative}
              strokeWidth="20"
              strokeDasharray={`${negative * 3.14} 314`}
              strokeDashoffset={-(positive + neutral) * 3.14}
              className="transition-all duration-1000"
            />
          )}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">{total}</div>
            <div className="text-xs text-neutral-400">mentions</div>
          </div>
        </div>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS.positive }} />
          <span className="text-sm text-neutral-300">Positive</span>
          <span className="text-sm font-semibold text-white ml-auto">{sentiment.positive}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS.neutral }} />
          <span className="text-sm text-neutral-300">Neutral</span>
          <span className="text-sm font-semibold text-white ml-auto">{sentiment.neutral}</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full" style={{ background: COLORS.negative }} />
          <span className="text-sm text-neutral-300">Negative</span>
          <span className="text-sm font-semibold text-white ml-auto">{sentiment.negative}</span>
        </div>
      </div>
    </div>
  )
}

export default function PublicReportPage() {
  const router = useRouter()
  const params = useParams()
  const [scan, setScan] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchReport = async () => {
      try {
        if (!params?.id) {
          setError('No report ID found in the URL')
          setLoading(false)
          return
        }

        const reportRef = doc(db, 'scanReports', String(params.id))
        const reportSnap = await getDoc(reportRef)

        if (reportSnap.exists()) {
          setScan(reportSnap.data())
        } else {
          setError('Report not found')
        }
      } catch (e: any) {
        setError(e?.message || 'Failed to fetch report')
      } finally {
        setLoading(false)
      }
    }

    fetchReport()
  }, [params?.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Loading report...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-red-400">Error: {error}</div>
      </div>
    )
  }

  if (!scan) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-white">Report not found.</div>
      </div>
    )
  }

  const sentiment = scan.breakdown?.sentiment || { positive: 0, neutral: 0, negative: 0 }
  const proView = scan.planTier === 'pro'

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-neutral-800/50 bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Logo href="/" />
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={() => router.push('/login')}
              className="flex items-center gap-2"
            >
              Sign Up to Create Your Own Report
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-neutral-300">AI Visibility Report</span>
            </div>
            {proView && (
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 text-sm">
                <Crown className="w-4 h-4 text-yellow-400" />
                <span className="text-yellow-400">Pro Scan</span>
              </div>
            )}
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{scan.brandName}</h1>
          <div className="flex items-center gap-4 text-neutral-400">
            <span>{scan.category}</span>
            <span>•</span>
            <span>{scan.locationScope}</span>
            <span>•</span>
            <span className="inline-flex items-center gap-2 px-2 py-1 rounded-md bg-green-500/20 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              complete
            </span>
          </div>
        </motion.div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Score Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-1 p-8 rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-900/50 border border-neutral-800 flex items-center justify-center"
          >
            <ScoreRing value={typeof scan.visibilityScore === 'number' ? scan.visibilityScore : 0} />
          </motion.div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-blue-500/10">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-semibold">Mentions</h3>
              </div>
              <div className="text-3xl font-bold mb-1">
                {scan.mentionsCount ?? '--'}
              </div>
              <p className="text-sm text-neutral-400">
                in AI responses
              </p>
            </div>

            <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-purple-500/10">
                  <Users className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="font-semibold">Competitors</h3>
              </div>
              <div className="text-3xl font-bold mb-1">
                {(scan.topBrandsMentioned || []).length}
              </div>
              <p className="text-sm text-neutral-400">brands tracked</p>
            </div>

            <div className="sm:col-span-2 p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg bg-green-500/10">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-semibold">Score Trend</h3>
              </div>
              <div className="h-32 flex items-center justify-center text-neutral-500 text-sm">
                Trend data is not available for public reports.
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sentiment & Competitors */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-green-500/10">
                <MessageSquare className="w-5 h-5 text-green-400" />
              </div>
              <h2 className="text-2xl font-bold">Sentiment Analysis</h2>
            </div>
            <SentimentDonut sentiment={sentiment} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="p-8 rounded-xl bg-neutral-900/50 border border-neutral-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Users className="w-5 h-5 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold">Top Competitors</h2>
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {(scan.topBrandsMentioned || [])
                .map((c: any, idx: number) => (
                  <div
                    key={c.name}
                    className="flex items-center justify-between p-3 rounded-lg bg-neutral-900/50 border border-neutral-800/50 hover:border-neutral-700 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {idx + 1}
                      </div>
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-blue-400">{c.score}</div>
                      <div className="text-xs text-neutral-500">mentions</div>
                    </div>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
