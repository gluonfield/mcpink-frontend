import { vi } from 'vitest'

export const mockAuth = {
  currentUser: null,
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithPopup: vi.fn(),
  signOut: vi.fn()
}

export const mockApp = {}

export const mockGoogleAuthProvider = vi.fn()

vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => mockApp)
}))

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => mockAuth),
  onAuthStateChanged: vi.fn(() => vi.fn()),
  signInWithPopup: vi.fn(),
  signOut: vi.fn(),
  GoogleAuthProvider: mockGoogleAuthProvider
}))
