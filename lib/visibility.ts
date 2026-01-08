import { collection, doc, getDoc, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '@/lib/firebase/client'

export function scansCollectionRef(uid: string) {
  return collection(db, 'users', uid, 'scans')
}

export function scanDocRef(uid: string, scanId: string) {
  return doc(db, 'users', uid, 'scans', scanId)
}

export function listenToScans(uid: string, cb: (docs: any[]) => void) {
  const q = query(scansCollectionRef(uid), orderBy('startedAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const out: any[] = []
    snap.forEach((d) => out.push({ id: d.id, ...d.data() }))
    cb(out)
  })
}

export function listenToScan(uid: string, scanId: string, cb: (doc: any | null) => void) {
  return onSnapshot(scanDocRef(uid, scanId), (snap) => {
    cb(snap.exists() ? ({ id: snap.id, ...snap.data() }) : null)
  })
}

export async function getScanOnce(uid: string, scanId: string) {
  const snap = await getDoc(scanDocRef(uid, scanId))
  return snap.exists() ? { id: snap.id, ...snap.data() } : null
}

