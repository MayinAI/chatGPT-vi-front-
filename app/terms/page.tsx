"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { FileText, UserCheck, CreditCard, Shield, AlertTriangle, Scale } from 'lucide-react'

export default function TermsPage() {
  return (
    <ContentPageLayout
      title="Terms & Conditions"
      description="Terms of use for the Mayin platform"
      badge="Legal"
      badgeIcon={<FileText className="w-4 h-4" />}
    >
      <p className="text-sm text-neutral-500 mb-12">Effective date: September 26, 2025</p>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <UserCheck className="w-8 h-8 text-blue-400" />
          1. Acceptance of Terms
        </h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            By accessing or using Mayin (the "Service"), you agree to these Terms & Conditions and our Privacy Policy. If you do not agree, do not use the Service.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">2. Accounts</h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            You must provide accurate information and keep your account secure. You are responsible for all activity under your account.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <CreditCard className="w-8 h-8 text-green-400" />
          3. Subscriptions & Billing
        </h2>
        <ul className="space-y-3">
          {[
            "Paid features are offered on a subscription basis billed in INR",
            "Payments are processed by Razorpay. We do not store full card details",
            "Subscriptions renew automatically until you cancel",
            "If a payment fails, access may be paused until payment is completed"
          ].map((item, index) => (
            <li key={index} className="flex items-start gap-3 p-4 rounded-lg bg-neutral-900/30 border border-neutral-800/50">
              <div className="w-5 h-5 rounded bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span className="text-neutral-300">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">4. Cancellations & Refunds</h2>
        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <p className="text-neutral-300 leading-relaxed">
            You can cancel at any time to stop future renewals. Fees already paid for the current billing period are non‑refundable unless required by applicable law.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Shield className="w-8 h-8 text-purple-400" />
          5. Acceptable Use
        </h2>
        <ul className="space-y-3">
          {[
            "No scraping, abuse, or attempts to disrupt the Service",
            "No reverse engineering or exploiting vulnerabilities",
            "Use the Service only for lawful purposes"
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
        <h2 className="text-3xl font-bold text-white mb-6">6. Intellectual Property</h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            The Service and its content are owned by Mayin or its licensors and are protected by applicable laws. You receive a limited, non‑transferable license to use the Service.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">7. Termination</h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            We may suspend or terminate access if you violate these Terms or for security, legal, or operational reasons.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <AlertTriangle className="w-8 h-8 text-yellow-400" />
          8. Disclaimers
        </h2>
        <div className="p-6 rounded-xl bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20">
          <p className="text-neutral-300 leading-relaxed">
            The Service is provided "as is" without warranties of any kind. We do not guarantee uninterrupted or error‑free operation.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Scale className="w-8 h-8 text-orange-400" />
          9. Limitation of Liability
        </h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            To the maximum extent permitted by law, Mayin will not be liable for indirect, incidental, special, or consequential damages. Our total liability will not exceed the fees you paid in the three (3) months preceding the claim.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-white mb-6">10. Changes</h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            We may update these Terms. Continued use of the Service after changes becomes effective constitutes acceptance.
          </p>
        </div>
      </section>

      <section>
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-start gap-4">
            <FileText className="w-6 h-6 text-blue-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Questions about these Terms?</h3>
              <p className="text-neutral-300">
                Contact{' '}
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
