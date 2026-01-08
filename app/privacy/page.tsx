"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { Shield, Lock, Database, UserCheck, Eye, AlertCircle } from 'lucide-react'

export default function PrivacyPage() {
  return (
    <ContentPageLayout
      title="Privacy Policy"
      description="How we collect, use, and protect your information"
      badge="Legal"
      badgeIcon={<Shield className="w-4 h-4" />}
    >
      <p className="text-sm text-neutral-500 mb-12">Effective date: September 26, 2025</p>

      <div className="mb-12">
        <p className="text-lg text-neutral-300 leading-relaxed">
          Mayin ("we", "us") respects your privacy. This policy explains what information we collect, how we use it, and your choices.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Database className="w-8 h-8 text-blue-400" />
          Information We Collect
        </h2>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
            <p className="text-neutral-400">
              Name, email, and profile data you provide when signing up or signing in via Firebase Auth.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-3">Subscription Information</h3>
            <p className="text-neutral-400">
              Subscription status, plan details, relevant identifiers (e.g., Razorpay subscription ID).
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-3">Usage Data</h3>
            <p className="text-neutral-400">
              Actions within the app, device/browser information, and diagnostic logs to improve performance and reliability.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-3">Payments</h3>
            <p className="text-neutral-400">
              Payments are processed by Razorpay. We do not store your full card details. We may store payment or subscription references returned by Razorpay for records.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Eye className="w-8 h-8 text-purple-400" />
          How We Use Your Information
        </h2>
        <ul className="space-y-3">
          {[
            "Provide and operate the service and your account",
            "Process subscriptions and payments via Razorpay",
            "Improve features, performance, and user experience",
            "Provide support and communicate important updates",
            "Protect against fraud, abuse, and violations of our Terms"
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900/30 border border-neutral-800/50">
              <div className="w-5 h-5 rounded bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-400 text-xs">✓</span>
              </div>
              <span className="text-neutral-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <UserCheck className="w-8 h-8 text-green-400" />
          Sharing of Information
        </h2>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-3">Service Providers</h3>
            <p className="text-neutral-400">
              Firebase (authentication, database) and Razorpay (payments) to run core functionality.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <h3 className="text-lg font-semibold text-white mb-3">Legal and Compliance</h3>
            <p className="text-neutral-400">
              When required by law or to protect our rights and users.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Data Retention</h2>
        <p className="text-neutral-300 leading-relaxed">
          We retain account and subscription records for as long as your account is active and as required for legal, tax, or audit purposes. You can request deletion of your account data, subject to applicable retention requirements.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Lock className="w-8 h-8 text-yellow-400" />
          Security
        </h2>
        <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <p className="text-neutral-300 leading-relaxed">
            We use reasonable technical and organizational measures to protect your data. However, no method of transmission or storage is 100% secure.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">Your Choices</h2>
        <ul className="space-y-3">
          {[
            "Access and update your account information in the app",
            "Request account deletion by contacting us",
            "Manage subscription and payment methods via Razorpay where applicable"
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-400 text-xs">→</span>
              </div>
              <span className="text-neutral-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Changes to This Policy</h2>
        <p className="text-neutral-300 leading-relaxed">
          We may update this policy. If we make material changes, we will notify you by email or in‑app notice.
        </p>
      </section>

      <section>
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Questions?</h3>
              <p className="text-neutral-300">
                Contact us at{' '}
                <a href="mailto:hello@mayin.app" className="text-blue-400 hover:text-blue-300 underline">
                  hello@mayin.app
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </ContentPageLayout>
  )
}
