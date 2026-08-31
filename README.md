# Mayin — ChatGPT Visibility Scanner (Frontend)

The web frontend for **Mayin**, a platform that scans how a brand shows up in ChatGPT's
answers — visibility scoring, competitor mentions, and location/industry-aware buyer
questions. Next.js 14 (App Router), Firebase Auth, Firestore, Stripe billing.

This is an earlier, self-hosted iteration of Mayin's ChatGPT-visibility work, open-sourced
as-is. It pairs with the backend at
[MayinAI/chatGPT-vi-back](https://github.com/MayinAI/chatGPT-vi-back) (Firebase Cloud
Functions that run the actual scans).

## What it does

- Runs a set of buyer-style prompts against OpenAI models (GPT-4o / GPT-4o-mini) for a
  given brand, category, and location, and scores how often the brand is mentioned
- Free (10 prompts) and paid (100 prompts) scan tiers, gated through Firebase Auth +
  Firestore subscription status
- Competitor mention comparison and an "improve mentions" report per scan
- Stripe for one-time and subscription billing, with legacy Razorpay support
- Public, shareable scan report pages

## Stack

- **Framework**: Next.js 14.2.5 (App Router), TypeScript, Tailwind CSS
- **Auth / data**: Firebase Authentication, Cloud Firestore
- **Billing**: Stripe (primary), Razorpay (legacy)
- **Hosting**: Vercel

## Setup

```bash
npm install
cp .env.example .env.local
# fill in Firebase web app config + Stripe/Razorpay keys
npm run dev
```

Cloud Functions this frontend calls (visibility-scan callables, Stripe/Razorpay checkout
and webhook endpoints) live in the paired backend repo — see that repo's README for
deployment.

## Key routes

- `/scan/new` — start a scan; `/scan/[id]` — scan report, with `improve-mentions` and
  `full-responses` sub-views
- `/dashboard` — scan history and account
- `/billing` — subscription management (Stripe customer portal)
- `/public-report/[id]` — a shared, read-only scan report

## Where this leads

The GEO (generative engine optimization) idea behind this tool continues in
**[Mayin](https://mayin.app)** — now a Telegram bot instead of a dashboard. Give it a brand
and a category and it sends back a source map: every page AI models actually cite when
answering a buying question in that category, ranked by frequency, for a one-time $49.
No account, no subscription — the map itself is reproducible, so trust comes from being
able to run it again, not from a login-gated score.
