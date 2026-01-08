import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'

export async function POST(req: Request) {
  try {
    const token = process.env.REVALIDATE_TOKEN
    const provided = req.headers.get('x-revalidate-token') || new URL(req.url).searchParams.get('token')
    if (!token || provided !== token) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    revalidatePath('/insights')
    return NextResponse.json({ revalidated: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'INTERNAL' }, { status: 500 })
  }
}

