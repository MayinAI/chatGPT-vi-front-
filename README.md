Engagement Score Web (Next.js 14)

Overview
- Next.js 14 App Router app for engagement score lookup with Firebase Auth and subscription gating.
- TailwindCSS styling, minimal shadcn-like UI primitives.
- Vercel-ready. Configure Firebase env vars and callable function names.

Setup
1) Install deps
   npm i

2) Create .env.local from .env.example and fill Firebase config from Firebase Console > Project settings > Web app.

3) Ensure Cloud Functions exist:
   - Engagement function: defaults to getEngagementScore, expects payload { handleOrUrl }
   - Subscription function: defaults to createRazorpaySubscription
   If your backend uses different names, update .env accordingly.

4) Run locally
   npm run dev

Auth & Gating
- Auth: Google + Email/Password via Firebase Auth.
- Gating reads users/{uid} for: isSubscribed (boolean) OR subscription_status='active'.
- Free attempt: marks engagementFreeUsed=true (also sets free_usage=true for compatibility).
- If not subscribed and already used free attempt: shows paywall with ₹449 plan, calls subscription callable to get checkout URL.

UI Flow
- /login: Auth page.
- /dashboard: Input a YouTube handle/URL. Calls engagement function and renders score + reasons.

Deploy to Vercel
- Add the NEXT_PUBLIC_ env vars to Vercel Project Settings.
- Build command: npm run build, Output: .next
- Functions region default is asia-south1; change via NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION if needed.

