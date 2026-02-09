import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { setAuthToken } from '../api/axiosInstance'
import { getUsers, deleteUser } from '../api/userApi'
import { useRoles } from '../hooks/useRoles'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { RoleBadge } from '../components/common/RoleBadge'
import type { UserDto, PagedResponse } from '../types'

export function UserManagementPage() {
  const auth = useAuth()
  const { canWrite, canDelete } = useRoles()
  const [users, setUsers] = useState<PagedResponse<UserDto> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (auth.accessToken) {
      setAuthToken(auth.accessToken)
      loadUsers()
    }
  }, [auth.accessToken])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const data = await getUsers()
      setUsers(data)
    } catch (err) {
      setError('Fehler beim Laden der Benutzer')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId: string) => {
    if (!confirm('Benutzer wirklich loeschen?')) return
    try {
      await deleteUser(userId)
      await loadUsers()
    } catch (err) {
      setError('Fehler beim Loeschen')
      console.error(err)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-headline-sm text-on-surface">User Management</h2>
        {canWrite && (
          <button className="btn-filled">
            Neuer Benutzer
          </button>
        )}
      </div>

      {error && (
        <div className="card-outlined p-4 border-red-200 bg-red-50 text-md-error text-body-md">{error}</div>
      )}

      <div className="card-elevated overflow-hidden">
        <table className="min-w-full divide-y divide-outline-variant">
          <thead className="bg-surface-container">
            <tr>
              <th className="px-6 py-3 text-left text-label-md text-on-surface-variant">Username</th>
              <th className="px-6 py-3 text-left text-label-md text-on-surface-variant">Email</th>
              <th className="px-6 py-3 text-left text-label-md text-on-surface-variant">Name</th>
              <th className="px-6 py-3 text-left text-label-md text-on-surface-variant">Rollen</th>
              <th className="px-6 py-3 text-left text-label-md text-on-surface-variant">Status</th>
              {canDelete && <th className="px-6 py-3 text-right text-label-md text-on-surface-variant">Aktionen</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {users?.content.map((user) => (
              <tr key={user.id} className="hover:bg-on-surface/[0.04] transition-colors duration-md3-short">
                <td className="px-6 py-4 text-body-md font-medium text-on-surface">{user.username}</td>
                <td className="px-6 py-4 text-body-md text-on-surface-variant">{user.email}</td>
                <td className="px-6 py-4 text-body-md text-on-surface-variant">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {[...user.realmRoles, ...user.clientRoles].map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-0.5 text-label-sm rounded-full border font-medium ${user.enabled ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {user.enabled ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                {canDelete && (
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="btn-text text-md-error text-label-md px-3 py-1"
                    >
                      Loeschen
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {users && (
          <div className="px-6 py-3 bg-surface-container text-body-sm text-on-surface-variant">
            Seite {users.page + 1} von {users.totalPages} ({users.totalElements} Benutzer gesamt)
          </div>
        )}
      </div>
    </div>
  )
}
