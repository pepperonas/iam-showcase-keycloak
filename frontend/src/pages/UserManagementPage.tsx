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
        <h2 className="text-2xl font-bold text-gray-800">User Management</h2>
        {canWrite && (
          <button className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition text-sm">
            Neuer Benutzer
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Username</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rollen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              {canDelete && <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aktionen</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users?.content.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.username}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.firstName} {user.lastName}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {[...user.realmRoles, ...user.clientRoles].map((role) => (
                      <RoleBadge key={role} role={role} />
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 text-xs rounded-full ${user.enabled ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {user.enabled ? 'Aktiv' : 'Inaktiv'}
                  </span>
                </td>
                {canDelete && (
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 text-sm"
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
          <div className="px-6 py-3 bg-gray-50 text-sm text-gray-500">
            Seite {users.page + 1} von {users.totalPages} ({users.totalElements} Benutzer gesamt)
          </div>
        )}
      </div>
    </div>
  )
}
