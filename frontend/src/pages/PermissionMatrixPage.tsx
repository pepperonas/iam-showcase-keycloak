import { API_ENDPOINTS } from '../types/api'

const ROLES = ['admin', 'manager', 'user', 'viewer', 'api-admin', 'api-write', 'api-read']

const ROLE_PERMISSIONS: Record<string, string[]> = {
  admin: ['admin', 'api-admin', 'api-write', 'api-read'],
  manager: ['api-write', 'api-read'],
  user: ['api-read'],
  viewer: [],
  'api-admin': ['api-admin', 'api-write', 'api-read'],
  'api-write': ['api-write', 'api-read'],
  'api-read': ['api-read'],
}

function hasAccess(requiredRole: string | null, role: string): boolean {
  if (!requiredRole) return true
  if (requiredRole === 'authenticated') return true
  const effectiveRoles = [role, ...(ROLE_PERMISSIONS[role] || [])]
  return effectiveRoles.includes(requiredRole)
}

export function PermissionMatrixPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Permission Matrix</h2>
      <p className="text-gray-500">Berechtigungs-Uebersicht: Welche Rolle hat Zugriff auf welchen Endpoint</p>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Endpoint</th>
              {ROLES.map((role) => (
                <th key={role} className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {API_ENDPOINTS.map((ep, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 text-sm">
                  <span className={`inline-block w-16 text-center text-xs font-bold rounded px-1.5 py-0.5 mr-2 ${ep.method === 'GET' ? 'bg-green-100 text-green-700' : ep.method === 'POST' ? 'bg-blue-100 text-blue-700' : ep.method === 'PUT' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-gray-700">{ep.path}</span>
                </td>
                {ROLES.map((role) => {
                  const access = hasAccess(ep.requiredRole, role)
                  return (
                    <td key={role} className="px-3 py-3 text-center">
                      <span className={`inline-block w-6 h-6 rounded-full ${access ? 'bg-green-500' : 'bg-red-400'}`} title={access ? 'Erlaubt' : 'Verweigert'} />
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex gap-6 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full bg-green-500" /> Zugriff erlaubt
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full bg-red-400" /> Zugriff verweigert
        </div>
      </div>
    </div>
  )
}
