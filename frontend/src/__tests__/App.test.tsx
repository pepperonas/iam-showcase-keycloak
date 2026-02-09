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
  it('leitet zur Login-Seite weiter wenn nicht authentifiziert', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Identity & Access Management')).toBeInTheDocument()
    expect(screen.getByText('Mit Keycloak anmelden')).toBeInTheDocument()
  })

  it('zeigt Login-Seite mit Demo-Zugangsdaten', () => {
    render(
      <MemoryRouter initialEntries={['/login']}>
        <App />
      </MemoryRouter>
    )

    expect(screen.getByText('Demo-Zugangsdaten')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
    expect(screen.getByText('Manager')).toBeInTheDocument()
    expect(screen.getByText('User')).toBeInTheDocument()
    expect(screen.getByText('Viewer')).toBeInTheDocument()
  })
})
