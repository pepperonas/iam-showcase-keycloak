import { useAuth as useOidcAuth } from 'react-oidc-context'

export function useAuth() {
  const auth = useOidcAuth()

  const getRoles = (): string[] => {
    if (!auth.user?.profile) return []
    const realmAccess = auth.user.profile.realm_access as { roles?: string[] } | undefined
    const resourceAccess = auth.user.profile.resource_access as Record<string, { roles?: string[] }> | undefined
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
