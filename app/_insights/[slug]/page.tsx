import { db } from '@/lib/firebase/admin';
import Link from 'next/link';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/ui/Button';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { notFound } from 'next/navigation';
import { remark } from 'remark';
import html from 'remark-html';

async function getInsightData(slug: string) {
  try {
    const insightDoc = await db().collection('insights').doc(slug).get();

    if (!insightDoc.exists) {
      return null;
    }

    const data = insightDoc.data();

    // Process markdown content to HTML
    let contentHtml = data?.htmlContent || '';
    if (data?.content) {
      try {
        // Remove frontmatter if present
        const contentWithoutFrontmatter = data.content.replace(/^---json[\s\S]*?---\n\n/, '');
        const processedContent = await remark()
          .use(html)
          .process(contentWithoutFrontmatter);
        contentHtml = processedContent.toString();
      } catch (e) {
        console.error('Error processing markdown:', e);
        contentHtml = data.htmlContent || data.content || '';
      }
    }

    return {
      title: data?.title || 'Untitled',
      contentHtml,
      schema: data?.schema || {},
      publishedAt: data?.publishedAt?.toDate()?.toISOString(),
    };
  } catch (error) {
    console.warn('Insight fetch skipped (admin not initialized):', (error as any)?.message || error);
    return null;
  }
}

export async function generateStaticParams() {
  try {
    const snapshot = await db().collection('insights')
      .where('status', '==', 'published')
      .limit(100)
      .get();

    return snapshot.docs.map(doc => ({
      slug: doc.id,
    }));
  } catch (error) {
    console.warn('generateStaticParams skipped:', (error as any)?.message || error);
    return [];
  }
}

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const insight = await getInsightData(params.slug);

  if (!insight) {
    return {
      title: 'Insight Not Found',
    };
  }

  return {
    title: `${insight.title} | Mayin Insights`,
    description: insight.schema.description || insight.title,
    openGraph: {
      title: insight.title,
      description: insight.schema.description || insight.title,
      type: 'article',
      publishedTime: insight.publishedAt,
    },
  };
}

export const revalidate = 300; // Revalidate frequently for instant content

export default async function InsightPage({ params }: { params: { slug: string } }) {
  const insight = await getInsightData(params.slug);

  if (!insight) {
    notFound();
  }

  // Calculate reading time (rough estimate: 200 words per minute)
  const wordCount = insight.contentHtml.split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="min-h-screen bg-dark-bg text-white">
      {/* SEO Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(insight.schema) }}
      />

      {/* Header */}
      <header className="border-b border-neutral-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Logo href="/" />
          <Link href="/insights">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              All Insights
            </Button>
          </Link>
        </div>
      </header>

      {/* Article */}
      <article className="max-w-4xl mx-auto px-6 py-12">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
          {insight.publishedAt && (
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>
                {new Date(insight.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{readingTime} min read</span>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl font-bold mb-8 leading-tight">
          {insight.title}
        </h1>

        {/* Content */}
        <div
          className="prose prose-invert prose-lg max-w-none
            prose-headings:font-bold prose-headings:text-white
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-neutral-300 prose-p:leading-relaxed prose-p:mb-6
            prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-white prose-strong:font-semibold
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-li:text-neutral-300 prose-li:mb-2
            prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-neutral-400
            prose-code:text-blue-400 prose-code:bg-neutral-900 prose-code:px-1 prose-code:rounded
            prose-pre:bg-neutral-900 prose-pre:border prose-pre:border-neutral-800"
          dangerouslySetInnerHTML={{ __html: insight.contentHtml }}
        />

        {/* CTA */}
        <div className="mt-16 p-8 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Improve Your AI Visibility?
          </h3>
          <p className="text-neutral-400 mb-6">
            See where your brand stands in ChatGPT conversations with a free visibility scan.
          </p>
          <Link href="/scan/new">
            <Button variant="primary" size="lg">
              Run Free Scan
            </Button>
          </Link>
        </div>
      </article>
    </div>
  );
}
