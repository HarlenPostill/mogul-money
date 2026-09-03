import { initializeApp } from 'firebase/app'
import { connectDatabaseEmulator, getDatabase } from 'firebase/database'

const env = import.meta.env

const app = initializeApp({
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.VITE_FIREBASE_DATABASE_URL,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
})

export const db = getDatabase(app)

if (env.VITE_FIREBASE_EMULATOR === 'true') {
  connectDatabaseEmulator(db, '127.0.0.1', 9000)
}

/** Every client talks to one fixed room. Change to run two shows at once. */
export const GAME_ID = env.VITE_GAME_ID ?? 'main'
