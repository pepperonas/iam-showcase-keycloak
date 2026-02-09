import { useAuth } from '../auth/useAuth'
import { RoleBadge } from '../components/common/RoleBadge'

export function DashboardPage() {
  const auth = useAuth()
  const roles = auth.getRoles().filter((r) => !r.startsWith('default-'))

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">Willkommen, {auth.username}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">Angemeldet als</div>
            <div className="text-lg font-bold text-blue-900">{auth.email}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-sm text-green-600 font-medium">Aktive Rollen</div>
            <div className="text-lg font-bold text-green-900">{roles.length}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-sm text-purple-600 font-medium">Auth-Methode</div>
            <div className="text-lg font-bold text-purple-900">OIDC / PKCE</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Ihre Rollen</h3>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Showcase Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { title: 'Token Inspector', desc: 'JWT Token decodiert anzeigen', path: '/token-inspector' },
            { title: 'API Tester', desc: 'Interaktiv API-Endpoints testen', path: '/api-tester' },
            { title: 'Permission Matrix', desc: 'Endpoint x Rolle Berechtigungs-Grid', path: '/permission-matrix' },
            { title: 'OIDC Flow', desc: 'OAuth2 Authorization Code + PKCE Flow', path: '/flow-diagram' },
            { title: 'Role Switcher', desc: 'Schnell zwischen Demo-Usern wechseln', path: '/role-switcher' },
          ].map((feature) => (
            <a
              key={feature.path}
              href={feature.path}
              className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition"
            >
              <div className="font-medium text-gray-800">{feature.title}</div>
              <div className="text-sm text-gray-500 mt-1">{feature.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
