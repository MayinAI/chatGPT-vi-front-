import * as admin from 'firebase-admin';

function parseMaybeBase64(value?: string) {
  if (!value) return undefined
  try {
    // If value looks like base64 (no braces), try decode
    if (!value.trim().startsWith('{')) {
      const decoded = Buffer.from(value, 'base64').toString('utf8')
      if (decoded && decoded.trim().length > 0) return decoded
    }
  } catch {}
  return value
}

function resolveServiceAccount(): admin.ServiceAccount | undefined {
  console.log('Attempting to resolve service account...');

  // Support full JSON via FIREBASE_SERVICE_ACCOUNT (raw or base64)
  const rawSa = parseMaybeBase64(process.env.FIREBASE_SERVICE_ACCOUNT || process.env.GOOGLE_CREDENTIALS)
  if (rawSa && rawSa.trim().startsWith('{')) {
    console.log('Found FIREBASE_SERVICE_ACCOUNT, attempting to parse.');
    try {
      const parsed = JSON.parse(rawSa);
      console.log('Successfully parsed FIREBASE_SERVICE_ACCOUNT.');
      return parsed;
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT:', e);
    }
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    console.log('FIREBASE_SERVICE_ACCOUNT was found, but it was not valid JSON.');
  }

  // Support legacy split-env format
  console.log('Checking for legacy split-env format...');
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  const pkRaw = parseMaybeBase64(process.env.FIREBASE_PRIVATE_KEY)
  const privateKey = pkRaw?.includes('BEGIN PRIVATE KEY') ? pkRaw.replace(/\\n/g, '\n') : pkRaw
  
  console.log('Legacy Vars Check:');
  console.log(`- projectId found: ${!!projectId}`);
  console.log(`- clientEmail found: ${!!clientEmail}`);
  console.log(`- privateKey found: ${!!privateKey}`);

  if (projectId && clientEmail && privateKey) {
    console.log('Found all required legacy split-env vars. Using them.');
    return { projectId, clientEmail, privateKey } as admin.ServiceAccount
  }

  console.log('Could not resolve service account from any source.');
  return undefined
}

const ensureInitialized = () => {
  if (admin.apps.length) {
    console.log('Firebase Admin already initialized.');
    return;
  }
  console.log('Firebase Admin not initialized. Starting initialization...');

  const serviceAccount = resolveServiceAccount()

  if (serviceAccount) {
    try {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: `https://${(serviceAccount as any).projectId || process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
      })
      console.log('Firebase Admin initialized successfully with service account.');
      return
    } catch (e) {
      console.error('Firebase Admin initialization with service account failed:', e);
      return;
    }
  }

  // Fall back to application default credentials if available (e.g., GCP environments)
  console.log('No service account found. Falling back to application default credentials.');
  try {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    })
    console.log('Firebase Admin initialized successfully with application default credentials.');
  } catch (e) {
    // Defer throwing until first usage to allow build-time code paths to catch and fallback
    console.warn('Firebase Admin initialization skipped: missing credentials from all sources.')
    console.error(e);
  }
}

const db = () => {
  ensureInitialized()
  return admin.firestore()
}

const auth = () => {
  ensureInitialized()
  return admin.auth()
}

export { db, auth }
