import { initializeApp, getApps } from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import { getFirestore, initializeFirestore } from 'firebase/firestore'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
}

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig)
// Force long-polling to avoid Brave/trackers blocking WebChannel
initializeFirestore(app, {
  experimentalAutoDetectLongPolling: true,
})
const auth = getAuth(app)
const db = getFirestore(app)
const functions = getFunctions(app, process.env.NEXT_PUBLIC_FIREBASE_FUNCTIONS_REGION || 'asia-south1')

const googleProvider = new GoogleAuthProvider()

export { app, auth, db, functions, googleProvider }
