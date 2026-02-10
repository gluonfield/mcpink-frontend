import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth } from 'firebase/auth'

const app = initializeApp({
  apiKey: 'AIzaSyADYxi33cRt8fy-fM2t3ngfvTGuYa20Xgg',
  authDomain: 'mlink-production.firebaseapp.com',
  projectId: 'mlink-production',
  storageBucket: 'mlink-production.firebasestorage.app',
  messagingSenderId: '44206271373',
  appId: '1:44206271373:web:a3f5478f6036778f7eebc4',
  measurementId: 'G-WJ74CC45BC'
})

export const firebaseAuth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
