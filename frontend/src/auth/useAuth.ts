import { useAuth as useOidcAuth } from 'react-oidc-context'

// Access Token JWT dekodieren (ohne Signatur-Validierung - nur fuer UI-Anzeige)
function parseAccessToken(token: string | undefined): Record<string, unknown> | null {
  if (!token) return null
  try {
    const payload = token.split('.')[1]
    return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')))
  } catch {
    return null
  }
}

export function useAuth() {
  const auth = useOidcAuth()

  const getRoles = (): string[] => {
    // Rollen aus dem Access Token lesen (nicht ID-Token), da Keycloak
    // realm_access/resource_access standardmaessig nur im Access Token mitliefert
    const claims = parseAccessToken(auth.user?.access_token)
    if (!claims) return []
    const realmAccess = claims.realm_access as { roles?: string[] } | undefined
    const resourceAccess = claims.resource_access as Record<string, { roles?: string[] }> | undefined
    const realmRoles = realmAccess?.roles || []
    const clientRoles = resourceAccess?.['iam-backend']?.roles || []
    return [...realmRoles, ...clientRoles]
  }

  const hasRole = (role: string): boolean => {
    return getRoles().includes(role)
  }

  const hasAnyRole = (...roles: string[]): boolean => {
    const userRoles = getRoles()
    return roles.some((role) => userRoles.includes(role))
  }

  return {
    ...auth,
    getRoles,
    hasRole,
    hasAnyRole,
    username: auth.user?.profile?.preferred_username as string | undefined,
    email: auth.user?.profile?.email as string | undefined,
    accessToken: auth.user?.access_token,
  }
}
