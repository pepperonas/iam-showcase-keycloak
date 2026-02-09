import { useAuth } from '../auth/useAuth'

export function useRoles() {
  const { getRoles, hasRole, hasAnyRole } = useAuth()

  const roles = getRoles()
  const isAdmin = hasRole('admin')
  const isManager = hasRole('manager')
  const canRead = hasAnyRole('api-read', 'api-admin')
  const canWrite = hasAnyRole('api-write', 'api-admin')
  const canDelete = hasRole('api-admin')

  return { roles, isAdmin, isManager, canRead, canWrite, canDelete }
}
