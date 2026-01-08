import { httpsCallable } from 'firebase/functions'
import { functions, auth } from '@/lib/firebase/client'

function genRequestId() {
  try {
    const g: any = globalThis as any
    const c = g && g.crypto
    if (c && typeof c.randomUUID === 'function') return c.randomUUID()
  } catch {}
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

// New: ChatGPT Visibility scan starter
export async function startVisibilityScan(payload: {
  brandName: string
  website?: string
  category: string
  locationScope: string
  planTier?: 'free' | 'pro'
  requestId?: string
}): Promise<{ scanId: string; status: string }> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const idToken = await user.getIdToken();
  const endpoint = 'https://asia-south1-mayin-d52c6.cloudfunctions.net/startVisibilityScanV2';
  const withId = { ...payload, requestId: payload.requestId || genRequestId() };
  const resp = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify(withId),
  });
  if (!resp.ok) {
    const body = await resp.json().catch(() => ({}));
    throw new Error(body?.message || 'FAILED_HTTP_CALL');
  }
  return await resp.json();
}

// Stripe: create Checkout Session and return hosted URL
export async function createStripeCheckoutSession(input: { priceId?: string; productId?: string; planTier?: 'pro'; successUrl?: string; cancelUrl?: string }): Promise<{ url: string; sessionId: string }> {
  const user = auth.currentUser;
  if (!user) {
    // This should not happen in a protected route, but as a safeguard:
    throw new Error('Authentication required. Please sign in.');
  }

  const idToken = await user.getIdToken();
  const endpoint = 'https://asia-south1-mayin-d52c6.cloudfunctions.net/createStripeCheckoutSession';

  // Attach Rewardful referral ID (if present in browser)
  let clientReferenceId: string | undefined = undefined
  try {
    const g: any = globalThis as any
    const rw = g && (g.rewardful || g.Rewardful)
    const ref = rw && (rw.referral || (typeof rw.get === 'function' ? rw.get('referral') : undefined))
    if (ref && typeof ref === 'string' && ref.length < 128) clientReferenceId = ref
  } catch {}

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    },
    body: JSON.stringify({ ...input, clientReferenceId }),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'An unknown error occurred.' }));
    console.error('Stripe Checkout Session creation failed:', errorBody);
    throw new Error(errorBody.message || 'Failed to create Stripe session.');
  }

  return response.json();
}

// Stripe: create Billing Portal session
export async function createStripePortalSession(input?: { returnUrl?: string }): Promise<{ url: string }> {
  const fn = httpsCallable(functions, 'createStripePortalSession')
  const res = await fn(input || {})
  return res.data as any
}

// Stripe: one-time (payment mode) Checkout for single scans
export async function createStripeOneTimeCheckout(input: { priceId?: string; productId?: string; kind?: 'pro'; quantity?: number; successUrl?: string; cancelUrl?: string }): Promise<{ url: string; sessionId: string }> {
  // Attach Rewardful referral ID (if present)
  let clientReferenceId: string | undefined = undefined
  try {
    const g: any = globalThis as any
    const rw = g && (g.rewardful || g.Rewardful)
    const ref = rw && (rw.referral || (typeof rw.get === 'function' ? rw.get('referral') : undefined))
    if (ref && typeof ref === 'string' && ref.length < 128) clientReferenceId = ref
  } catch {}
  const fn = httpsCallable(functions, 'createStripeOneTimeCheckout')
  const res = await fn({ ...input, clientReferenceId })
  return res.data as any
}

// Stripe: debug price resolution for a product
export async function debugStripeResolvePrice(input: { productId: string; mode: 'subscription' | 'payment' }): Promise<{ priceId?: string; prices?: any[] }> {
  const fn = httpsCallable(functions, 'debugStripeResolvePrice')
  const res = await fn(input)
  return res.data as any
}

// Visibility diagnostics: find reasons and strategies
export async function findVisibilityReasons(input: { brand: string; category: string; region: string }): Promise<{ cached: boolean; reasons: string[]; strategies: string[] }> {
  const fn = httpsCallable(functions, 'findVisibilityReasons')
  const res = await fn(input)
  return res.data as any
}

// Get user subscription status and features
export async function getUserSubscriptionStatus(): Promise<{
  isSubscribed: boolean
  planTier: string
  subscriptionStatus: string
  scanCredits: number
  monthlyLimit: number
  currentMonthScans: number
  scansRemaining: number
  features: {
    advancedReports: boolean
    prioritySupport: boolean
    apiAccess: boolean
  }
  currentPeriodEnd?: Date
  canCreateScan: boolean
}> {
  const fn = httpsCallable(functions, 'getUserSubscriptionStatus')
  const res = await fn()
  return res.data as any
}
