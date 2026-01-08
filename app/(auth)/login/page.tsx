"use client"
import { useEffect, useState, Suspense } from 'react'
import { useAuth, signInWithGoogle, signInWithEmail, signUpWithEmail } from '@/lib/auth/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Logo } from '@/components/Logo'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Mail } from 'lucide-react'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // Check if URL has ?mode=signup to default to signup mode
  const initialMode = searchParams.get('mode') === 'signup' ? 'signup' : 'signin'
  const [mode, setMode] = useState<'signin' | 'signup'>(initialMode)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const onEmailAuth = async () => {
    setError(null)
    setLoading(true)
    try {
      if (mode === 'signin') await signInWithEmail(email, password)
      else await signUpWithEmail(email, password)
      router.replace('/dashboard')
    } catch (e: any) {
      setError(e?.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      router.replace('/dashboard')
    }
  }, [user, router])

  return (
    <div className="min-h-screen bg-dark-bg text-white flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-neutral-900 to-dark-bg p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(99,102,241,0.1),transparent_50%)]" />
        <div className="relative z-10">
          <Logo href="/" size="lg" />
        </div>

        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-4">
              Measure Your Brand&apos;s Visibility in AI Conversations
            </h2>
            <p className="text-neutral-400 text-lg leading-relaxed">
              Join forward-thinking brands using Mayin to track and improve their presence in ChatGPT recommendations.
            </p>
          </motion.div>

          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {[
              "100+ AI prompts analyzed in seconds",
              "Competitor benchmarking insights",
              "Actionable recommendations to improve visibility"
            ].map((feature, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
                  <div className="w-2 h-2 rounded-full bg-green-400" />
                </div>
                <p className="text-neutral-300">{feature}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative z-10 text-sm text-neutral-500">
          © 2025 Mayin. All rights reserved.
        </div>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          className="w-full max-w-md"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo href="/" size="lg" />
          </div>

          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6">
              <Zap className="w-4 h-4 text-yellow-400" />
              <span className="text-neutral-300">AI Visibility Platform</span>
            </div>
            <h1 className="text-3xl font-bold mb-2">
              {mode === 'signin' ? 'Welcome back' : 'Create your account'}
            </h1>
            <p className="text-neutral-400">
              {mode === 'signin'
                ? 'Sign in to access your AI visibility dashboard'
                : 'Start tracking your brand in AI conversations'}
            </p>
          </div>

          <div className="space-y-4">
            <Button
              className="w-full flex items-center justify-center gap-2"
              variant="outline"
              size="lg"
              onClick={async () => {
                setError(null)
                setLoading(true)
                try {
                  await signInWithGoogle()
                  router.replace('/dashboard')
                } catch (e: any) {
                  setError(e?.message || 'Authentication failed')
                } finally {
                  setLoading(false)
                }
              }}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-dark-bg px-3 text-neutral-500">or continue with email</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
                <Input
                  id="email"
                  placeholder="you@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full"
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button
                className="w-full"
                variant="primary"
                size="lg"
                disabled={loading}
                onClick={onEmailAuth}
              >
                {loading ? 'Loading...' : (mode === 'signin' ? 'Sign in' : 'Create account')}
              </Button>
            </div>

            <div className="text-sm text-center text-neutral-400">
              {mode === 'signin' ? (
                <span>
                  Don&apos;t have an account?{' '}
                  <button
                    className="font-medium text-white hover:underline"
                    onClick={() => setMode('signup')}
                  >
                    Sign up
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    className="font-medium text-white hover:underline"
                    onClick={() => setMode('signin')}
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>

          <div className="mt-8 text-xs text-center text-neutral-500">
            By continuing, you agree to our{' '}
            <Link href="/terms" className="underline hover:text-neutral-400">Terms of Service</Link>
            {' '}and{' '}
            <Link href="/privacy" className="underline hover:text-neutral-400">Privacy Policy</Link>.
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">
        <div className="text-neutral-400">Loading...</div>
      </div>
    }>
      <LoginPageContent />
    </Suspense>
  )
}
