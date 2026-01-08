"use client"
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/useAuth'
import { db } from '@/lib/firebase/client'
import { doc, getDoc } from 'firebase/firestore'
import { Button } from '@/components/ui/Button'

export default function FullResponsesPage() {
  const { user, loading } = useAuth()
  const params = useParams()
  const router = useRouter()
  const [items, setItems] = useState<Array<{ prompt: string; answer: string }>>([])
  const [brand, setBrand] = useState<string>('')
  const [loadingData, setLoadingData] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        if (!user) return
        const id = (params?.id as string) || ''
        const ref = doc(db, 'users', user.uid, 'scans', id)
        const snap = await getDoc(ref)
        const d: any = snap.data() || {}
        const list = Array.isArray(d.fullAnswers) ? d.fullAnswers : (Array.isArray(d.sampleAnswers) ? d.sampleAnswers : [])
        setItems(list.map((x: any) => ({ prompt: String(x.prompt || ''), answer: String(x.answer || '') })))
        setBrand(String(d.brandName || ''))
      } finally {
        setLoadingData(false)
      }
    }
    load()
  }, [user, params?.id])

  if (loading || !user) {
    return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Loading…</div>
  }
  if (loadingData) {
    return <div className="min-h-screen bg-dark-bg text-white flex items-center justify-center">Preparing responses…</div>
  }

  return (
    <main className="bg-dark-bg text-white min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Full AI Responses {brand ? `— ${brand}` : ''}</h1>
          <Button variant="outline" onClick={() => router.back()}>Back</Button>
        </div>
        <div className="space-y-6">
          {items.map((s, i) => (
            <div key={i} className="p-6 rounded-lg bg-neutral-900/50 border border-neutral-800">
              <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">Prompt #{i+1}</div>
              <p className="text-neutral-300 mb-4 whitespace-pre-wrap">{s.prompt}</p>
              <div className="text-xs font-semibold text-neutral-500 uppercase mb-2">ChatGPT Response</div>
              <p className="text-neutral-400 whitespace-pre-wrap">{s.answer}</p>
            </div>
          ))}
          {items.length === 0 && (
            <div className="text-neutral-400">No responses available.</div>
          )}
        </div>
      </div>
    </main>
  )
}

