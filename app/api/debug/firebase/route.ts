import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase/admin'

export async function GET() {
  try {
    const clientProjectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || null
    let adminProjectId: string | null = null
    try {
      // Trigger admin init and try to infer projectId
      const app: any = (db() as any).app
      adminProjectId = app?.options?.projectId || process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || null
    } catch {
      adminProjectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || null
    }
    return NextResponse.json({ clientProjectId, adminProjectId })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'INTERNAL' }, { status: 500 })
  }
}

