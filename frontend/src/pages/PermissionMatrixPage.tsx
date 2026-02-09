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
      <h2 className="text-headline-sm text-on-surface">Permission Matrix</h2>
      <p className="text-body-lg text-on-surface-variant">Berechtigungs-Uebersicht: Welche Rolle hat Zugriff auf welchen Endpoint</p>

      <div className="card-elevated overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr className="bg-surface-container">
              <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">Endpoint</th>
              {ROLES.map((role) => (
                <th key={role} className="px-3 py-3 text-center text-label-md text-on-surface-variant">
                  {role}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant">
            {API_ENDPOINTS.map((ep, i) => (
              <tr key={i} className="hover:bg-on-surface/[0.04] transition-colors duration-md3-short">
                <td className="px-4 py-3 text-body-md">
                  <span className={`inline-block w-16 text-center text-label-sm font-medium rounded-full px-2 py-0.5 mr-2 border ${ep.method === 'GET' ? 'bg-green-50 text-green-700 border-green-200' : ep.method === 'POST' ? 'bg-blue-50 text-blue-700 border-blue-200' : ep.method === 'PUT' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {ep.method}
                  </span>
                  <span className="font-mono text-on-surface">{ep.path}</span>
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

      <div className="flex gap-6 text-body-sm text-on-surface-variant">
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
