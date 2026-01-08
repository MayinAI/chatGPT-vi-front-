import { db } from '@/lib/firebase/admin';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { BookOpen, TrendingUp, Lightbulb } from 'lucide-react';

async function getInsights() {
  try {
    const insightsRef = db().collection('insights');
    // Fallback without composite index: fetch published and sort in memory
    const snapshot = await insightsRef
      .where('status', '==', 'published')
      .limit(200)
      .get();
    const items = snapshot.docs.map(doc => ({
      slug: doc.id,
      title: doc.data().title,
      description: doc.data().schema?.description || doc.data().htmlContent?.substring(0, 160),
      publishedAt: doc.data().publishedAt?.toDate?.()?.toISOString?.() || null,
      _ts: doc.data().publishedAt?.toMillis?.() || 0,
    }));
    // Show all published insights (sorted newest first) instead of capping at 20
    return items
      .sort((a, b) => b._ts - a._ts)
      .map(({ _ts, ...rest }) => rest);
  } catch (error) {
    console.warn('Insights fetch skipped (admin not initialized):', (error as any)?.message || error);
    return [];
  }
}

async function maybeSeedCuratedInsights() {
  try {
    const insightsRef = db().collection('insights');
    const hasAny = await insightsRef.where('status', '==', 'published').limit(1).get();
    if (!hasAny.empty) return; // already have content

    const settingsRef = db().collection('system').doc('settings');
    const settingsDoc = await settingsRef.get();
    const curatedSeedDone = settingsDoc.get('curatedSeedDone') === true;
    const curatedSeedRequested = settingsDoc.get('curatedSeedRequested') === true;
    if (curatedSeedDone || curatedSeedRequested) return;

    const fnUrl = process.env.GENERATE_CURATED_FN_URL;
    const adminKey = process.env.ADMIN_HTTP_KEY;
    if (!fnUrl || !adminKey) {
      console.warn('Curated seed skipped: missing GENERATE_CURATED_FN_URL or ADMIN_HTTP_KEY');
      return;
    }

    // Mark as requested to avoid duplicate triggers, then fire-and-forget
    await settingsRef.set({ curatedSeedRequested: true, curatedSeedRequestedAt: new Date().toISOString() }, { merge: true });

    // Trigger curated insights generation (do not await to keep page fast)
    fetch(fnUrl, {
      method: 'POST',
      headers: { 'x-admin-key': adminKey },
      // no body required
      cache: 'no-store'
    }).then(async (r) => {
      if (r.ok) {
        await settingsRef.set({ curatedSeedDone: true, curatedSeedAt: new Date().toISOString() }, { merge: true });
      } else {
        const body = await r.text().catch(() => '');
        console.warn('Curated insights generation failed:', r.status, body);
      }
    }).catch((e) => console.warn('Curated insights request error:', e?.message || String(e)));
  } catch (e: any) {
    console.warn('maybeSeedCuratedInsights error:', e?.message || String(e));
  }
}

export const revalidate = 300; // Revalidate frequently for instant content

export default async function InsightsPage() {
  await maybeSeedCuratedInsights();
  const insights = await getInsights();

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* Header */}
      <header className="border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo href="/" />
          <Link href="/">
            <Button variant="ghost" size="sm">
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-4xl mx-auto px-6 py-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-neutral-800 border border-neutral-700 text-sm mb-6">
          <BookOpen className="w-4 h-4 text-blue-400" />
          <span className="text-neutral-300">AI Visibility Insights</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">
          Insights & Resources
        </h1>
        <p className="text-lg text-neutral-400 max-w-2xl mx-auto">
          Learn how to improve your brand&apos;s visibility in AI conversations, ChatGPT recommendations, and LLM-powered search.
        </p>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-6 pb-20">
        {insights.length === 0 ? (
          <div className="text-center py-20">
            <Lightbulb className="w-16 h-16 text-neutral-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-neutral-400 mb-2">
              New insights coming soon
            </h2>
            <p className="text-neutral-500">
              New AI visibility insights are generated dynamically.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight) => (
              <Link
                key={insight.slug}
                href={`/insights/${insight.slug}`}
                className="group p-6 rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-all hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-blue-500/10">
                    <TrendingUp className="w-5 h-5 text-blue-400" />
                  </div>
                  <div className="flex-1">
                    {insight.publishedAt && (
                      <p className="text-xs text-neutral-500 mb-2">
                        {new Date(insight.publishedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>
                </div>
                <h2 className="text-xl font-bold mb-3 group-hover:text-blue-400 transition-colors">
                  {insight.title}
                </h2>
                {insight.description && (
                  <p className="text-sm text-neutral-400 line-clamp-3">
                    {insight.description}
                  </p>
                )}
                <div className="mt-4 text-sm text-blue-400 flex items-center gap-2">
                  Read more
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* CTA Section */}
      <section className="border-t border-neutral-800/50">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Measure Your AI Visibility?
          </h2>
          <p className="text-lg text-neutral-400 mb-8">
            Start with a free scan and see where your brand stands in ChatGPT conversations.
          </p>
          <Link href="/scan/new">
            <Button variant="primary" size="lg">
              Run Free Scan
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
