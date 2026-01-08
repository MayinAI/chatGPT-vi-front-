"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { DollarSign, XCircle, AlertCircle, Clock, Mail } from 'lucide-react'

export default function RefundPolicyPage() {
  return (
    <ContentPageLayout
      title="Cancellation & Refund Policy"
      description="How cancellations and refunds work for Mayin subscriptions"
      badge="Legal"
      badgeIcon={<DollarSign className="w-4 h-4" />}
    >
      <p className="text-sm text-neutral-500 mb-12">Effective date: September 26, 2025</p>

      <div className="mb-12">
        <p className="text-lg text-neutral-300 leading-relaxed">
          We aim to keep our subscription simple and transparent. This policy explains how cancellations and refunds work for Mayin subscriptions billed via Razorpay.
        </p>
      </div>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <XCircle className="w-8 h-8 text-red-400" />
          Cancelling Your Subscription
        </h2>
        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-blue-400 font-bold">1</span>
              </div>
              <div>
                <p className="text-neutral-300">
                  You can cancel your subscription at any time from your account or by contacting us.
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0">
                <span className="text-purple-400 font-bold">2</span>
              </div>
              <div>
                <p className="text-neutral-300">
                  Cancellation stops future renewals. Your access continues until the end of the current billing period.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <DollarSign className="w-8 h-8 text-green-400" />
          Refunds
        </h2>
        <ul className="space-y-3">
          {[
            "Fees for the current billing period are generally non-refundable",
            "Partial or full refunds may be considered in cases of duplicate charges, accidental renewals, or proven technical issues that prevented service use, at our discretion",
            "Where required by applicable law, we will provide refunds accordingly"
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
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Mail className="w-8 h-8 text-blue-400" />
          How to Request a Refund
        </h2>
        <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <p className="text-neutral-300 leading-relaxed mb-4">
            Please email us with your registered email address, payment reference (from Razorpay), and a brief description.
          </p>
          <div className="flex items-center gap-3 p-4 rounded-lg bg-neutral-900/50 border border-neutral-800">
            <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
            <a
              href="mailto:hello@mayin.app"
              className="text-blue-400 hover:text-blue-300 underline"
            >
              hello@mayin.app
            </a>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <Clock className="w-8 h-8 text-yellow-400" />
          Processing Time
        </h2>
        <div className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800">
          <p className="text-neutral-300 leading-relaxed">
            Approved refunds are processed to the original payment method. Processing times depend on your bank or payment provider and typically take 5–10 business days after approval.
          </p>
        </div>
      </section>

      <section>
        <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-orange-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Questions?</h3>
              <p className="text-neutral-300">
                If you have any questions about cancellations or refunds, contact us at{' '}
                <a href="mailto:hello@mayin.app" className="text-orange-400 hover:text-orange-300 underline">
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
