"use client"

import { ReactNode } from 'react'
import { Button } from '@/components/ui/Button'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { UserMenu } from '@/components/UserMenu'
import { Logo } from '@/components/Logo'
import { motion } from 'framer-motion'

interface ContentPageLayoutProps {
  children: ReactNode
  title: string
  description?: string
  badge?: string
  badgeIcon?: ReactNode
}

export function ContentPageLayout({ children, title, description, badge, badgeIcon }: ContentPageLayoutProps) {
  const router = useRouter()
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-neutral-800/50 bg-dark-bg/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
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
              <Button variant="primary" size="sm" onClick={() => router.push('/scan/new')}>Get Started</Button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          {badge && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6">
              {badgeIcon}
              <span className="text-neutral-300">{badge}</span>
            </div>
          )}
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">{title}</h1>
          {description && (
            <p className="text-xl text-neutral-400 leading-relaxed">{description}</p>
          )}
        </motion.div>

        {/* Content */}
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="prose prose-invert prose-lg max-w-none"
        >
          {children}
        </motion.article>
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-800/50 py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <div className="mb-4">
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
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white mb-3">Learn</h3>
              <ul className="space-y-2 text-sm text-neutral-500">
                <li><a href="/what-is-mayin" className="hover:text-white transition-colors">What is Mayin?</a></li>
                <li><a href="/how-ai-visibility-works" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="/ai-search-visibility-score" className="hover:text-white transition-colors">Visibility Score</a></li>
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
        </div>
      </footer>
    </div>
  )
}
