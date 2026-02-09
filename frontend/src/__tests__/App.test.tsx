import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

// Mock react-oidc-context
vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: false,
    isLoading: false,
    user: null,
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

import App from '../App'

describe('App', () => {
  it('zeigt Anmelde-Aufforderung wenn nicht authentifiziert', () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Anmeldung erforderlich')).toBeInTheDocument()
    expect(screen.getByText('Anmelden')).toBeInTheDocument()
  })
})
