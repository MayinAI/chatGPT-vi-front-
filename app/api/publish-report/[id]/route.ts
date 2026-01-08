import { NextResponse } from 'next/server'
import { db, auth as adminAuth } from '@/lib/firebase/admin'

function toHost(url?: string | null) {
  if (!url) return ''
  try { return new URL(url.startsWith('http') ? url : `https://${url}`).host } catch { return url }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params?.id
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 })

    const authHeader = req.headers.get('authorization') || ''
    if (!authHeader.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const idToken = authHeader.slice('Bearer '.length)
    const decoded = await adminAuth().verifyIdToken(idToken).catch(() => null)
    if (!decoded?.uid) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const uid = decoded.uid

    const scanRef = db().collection('users').doc(uid).collection('scans').doc(id)
    const scanSnap = await scanRef.get()
    if (!scanSnap.exists) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const s: any = scanSnap.data() || {}
    if ((s.status || '').toString() !== 'complete') return NextResponse.json({ error: 'Scan not complete' }, { status: 400 })

    // Map fields to public report shape
    const brandName = s.brandName || ''
    const domain = toHost(s.website || '')
    const location = s.locationScope || ''
    const scanDate = s.completedAt?.toDate ? s.completedAt.toDate().toISOString() : new Date().toISOString()
    const visibilityScore = typeof s.score === 'number' ? s.score : undefined
    const mentionsCount = s.stats?.rawMentions ?? undefined
    const sentimentScore = (() => {
      const sen = s.breakdown?.sentiment
      if (!sen) return undefined
      const total = Math.max(1, (sen.positive || 0) + (sen.neutral || 0) + (sen.negative || 0))
      const val = ((sen.positive || 0) - (sen.negative || 0)) / total
      return +val.toFixed(2)
    })()
    const emotionSummary = (() => {
      const sen = s.breakdown?.sentiment
      if (!sen) return undefined
      return `+${sen.positive || 0} / ${sen.neutral || 0} / -${sen.negative || 0}`
    })()
    const topBrandsMentioned = Array.isArray(s.breakdown?.competitors)
      ? s.breakdown.competitors.slice(0, 5).map((c: any) => ({ name: c.name, score: c.mentions }))
      : undefined
    const summaryInsights = typeof s.guidance === 'string' ? s.guidance : null
    const reportType = (s.planTier || 'free').toString()

    const publicDoc = {
      brandName,
      domain,
      location,
      scanDate,
      visibilityScore,
      mentionsCount,
      sentimentScore,
      emotionSummary,
      topBrandsMentioned,
      summaryInsights,
      reportType,
      // allow optional future fields
    }

    await db().collection('scanReports').doc(id).set(publicDoc, { merge: true })
    await scanRef.set({ publicLinkCreatedAt: new Date() }, { merge: true })

    const url = `/public-report/${id}`
    return NextResponse.json({ url, id })
  } catch (e: any) {
    console.error('publish-report error:', e)
    return NextResponse.json({ error: e?.message || 'INTERNAL' }, { status: 500 })
  }
}

