import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

vi.mock('react-oidc-context', () => ({
  useAuth: () => ({
    isAuthenticated: true,
    isLoading: false,
    user: {
      profile: {
        preferred_username: 'admin@demo.celox.io',
        realm_access: { roles: ['admin'] },
        resource_access: { 'iam-backend': { roles: ['api-admin'] } },
      },
      access_token: 'mock-token',
    },
    signinRedirect: vi.fn(),
    signoutRedirect: vi.fn(),
  }),
}))

import { PermissionMatrixPage } from '../pages/PermissionMatrixPage'

describe('PermissionMatrixPage', () => {
  it('rendert die Permission Matrix Tabelle', () => {
    render(
      <MemoryRouter>
        <PermissionMatrixPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Permission Matrix')).toBeInTheDocument()
    expect(screen.getByText('Endpoint')).toBeInTheDocument()
  })

  it('zeigt alle API-Endpoints', () => {
    render(
      <MemoryRouter>
        <PermissionMatrixPage />
      </MemoryRouter>
    )

    expect(screen.getByText('/api/v1/public/health')).toBeInTheDocument()
    expect(screen.getByText('/api/v1/admin/dashboard')).toBeInTheDocument()
  })

  it('zeigt Legende', () => {
    render(
      <MemoryRouter>
        <PermissionMatrixPage />
      </MemoryRouter>
    )

    expect(screen.getByText('Zugriff erlaubt')).toBeInTheDocument()
    expect(screen.getByText('Zugriff verweigert')).toBeInTheDocument()
  })
})
