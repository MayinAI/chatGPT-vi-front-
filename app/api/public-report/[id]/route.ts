import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'

type PublicReport = {
  brandName?: string
  domain?: string
  location?: string
  scanDate?: string | Date
  visibilityScore?: number
  mentionsCount?: number
  sentimentScore?: number
  emotionSummary?: string
  topBrandsMentioned?: any[]
  summaryInsights?: string
  reportType?: string
}

async function getPublicReport(id: string): Promise<PublicReport | null> {
  if (!id) return null
  const docRef = db().collection('scanReports').doc(id)
  console.log(`[DEBUG] Attempting to fetch doc from path: ${docRef.path}`)
  const snap = await docRef.get()
  console.log(`[DEBUG] Doc exists at path ${docRef.path}: ${snap.exists}`)
  if (!snap.exists) return null
  const d = snap.data() || {}

  const scanDate = d.scanDate?.toDate ? d.scanDate.toDate().toISOString() : (d.scanDate || null)

  const safe: PublicReport = {
    brandName: d.brandName,
    domain: d.domain,
    location: d.location,
    scanDate,
    visibilityScore: typeof d.visibilityScore === 'number' ? d.visibilityScore : undefined,
    mentionsCount: typeof d.mentionsCount === 'number' ? d.mentionsCount : undefined,
    sentimentScore: typeof d.sentimentScore === 'number' ? d.sentimentScore : undefined,
    emotionSummary: typeof d.emotionSummary === 'string' ? d.emotionSummary : undefined,
    topBrandsMentioned: Array.isArray(d.topBrandsMentioned) ? d.topBrandsMentioned : undefined,
    summaryInsights: typeof d.summaryInsights === 'string' ? d.summaryInsights : undefined,
    reportType: typeof d.reportType === 'string' ? d.reportType : undefined,
  }

  return safe
}

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params?.id
    const report = await getPublicReport(id)
    if (!report) {
      return NextResponse.json({ error: 'Report unavailable' }, { status: 404 })
    }
    return NextResponse.json(report, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
    })
  } catch (e) {
    console.error('GET /api/public-report error:', e)
    return NextResponse.json({ error: 'Report unavailable' }, { status: 404 })
  }
}
