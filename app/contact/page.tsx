"use client"

import { ContentPageLayout } from '@/components/ContentPageLayout'
import { Mail, MapPin, Phone, MessageSquare, Send } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ContactPage() {
  return (
    <ContentPageLayout
      title="Get in Touch"
      description="We're here to help with your AI visibility questions"
      badge="Company"
      badgeIcon={<MessageSquare className="w-4 h-4" />}
    >
      {/* Introduction */}
      <div className="mb-12">
        <p className="text-lg text-neutral-300 leading-relaxed">
          Have questions about Mayin? Want to discuss your AI visibility strategy? We'd love to hear from you. Reach out using any of the methods below.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
        >
          <div className="p-3 rounded-lg bg-blue-500/10 w-fit mb-4">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-3">Email</h3>
          <a
            href="mailto:hello@mayin.app"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            hello@mayin.app
          </a>
          <p className="text-sm text-neutral-500 mt-2">
            Best for detailed inquiries
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
        >
          <div className="p-3 rounded-lg bg-green-500/10 w-fit mb-4">
            <Phone className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-3">Phone</h3>
          <a
            href="tel:+917306091003"
            className="text-green-400 hover:text-green-300 transition-colors"
          >
            +91 73060 91003
          </a>
          <p className="text-sm text-neutral-500 mt-2">
            Mon-Fri, 9am-6pm IST
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all"
        >
          <div className="p-3 rounded-lg bg-purple-500/10 w-fit mb-4">
            <MapPin className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-lg font-semibold text-white mb-3">Location</h3>
          <p className="text-neutral-300">
            Kalleril Ho<br />
            Kochi - 683562<br />
            India
          </p>
        </motion.div>
      </div>

      {/* Common Questions */}
      <section className="mb-12">
        <h2 className="flex items-center gap-3 text-3xl font-bold text-white mb-6">
          <MessageSquare className="w-8 h-8 text-yellow-400" />
          Common Questions
        </h2>
        <p className="text-neutral-300 leading-relaxed mb-6">
          Before reaching out, check if your question is answered below:
        </p>

        <div className="space-y-4">
          {[
            {
              q: "How does Mayin pricing work?",
              a: "We offer a free scan with 15 prompts to get started, one-time scans ($9 Starter with 100 prompts, $99 Premium with 1000 prompts), and monthly subscriptions ($49/month Pro with 10 scans of 100 prompts each, $499/month Enterprise with 10 scans of 1000 prompts each). See our pricing page for details."
            },
            {
              q: "Can I schedule a demo?",
              a: "Yes! Email us at hello@mayin.app with your preferred time and we'll set up a call to walk through the platform."
            },
            {
              q: "Do you offer enterprise plans?",
              a: "Yes, our $499/month Enterprise plan includes 10 scans per month with 1000 prompts each, multi-brand tracking, white-label reports, and dedicated support. Contact us for details."
            },
            {
              q: "How long does a scan take?",
              a: "Most scans complete in 30-60 seconds. We'll send you an email notification when your results are ready."
            }
          ].map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="p-6 rounded-xl bg-neutral-900/50 border border-neutral-800"
            >
              <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
              <p className="text-neutral-400">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form CTA */}
      <section>
        <div className="p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 text-center">
          <div className="p-4 rounded-full bg-blue-500/20 w-fit mx-auto mb-4">
            <Send className="w-8 h-8 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-3">
            Ready to Get Started?
          </h3>
          <p className="text-neutral-300 mb-6 max-w-2xl mx-auto">
            The best way to understand Mayin is to try it. Start with a free scan and see where your brand stands in AI conversations.
          </p>
          <a
            href="/scan/new"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-neutral-200 transition-colors"
          >
            Start Free Scan
            <Send className="w-4 h-4" />
          </a>
        </div>
      </section>
    </ContentPageLayout>
  )
}
