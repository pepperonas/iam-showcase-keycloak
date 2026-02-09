import { useAuth } from '../auth/useAuth'
import { RoleBadge } from '../components/common/RoleBadge'

export function DashboardPage() {
  const auth = useAuth()
  const roles = auth.getRoles().filter((r) => !r.startsWith('default-'))

  return (
    <div className="space-y-6">
      <h2 className="text-headline-sm text-on-surface">Dashboard</h2>

      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-4">Willkommen, {auth.username}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-md p-4">
            <div className="text-label-md text-primary-600">Angemeldet als</div>
            <div className="text-title-md text-primary-800 mt-1">{auth.email}</div>
          </div>
          <div className="bg-green-50 rounded-md p-4">
            <div className="text-label-md text-green-600">Aktive Rollen</div>
            <div className="text-title-md text-green-800 mt-1">{roles.length}</div>
          </div>
          <div className="bg-purple-50 rounded-md p-4">
            <div className="text-label-md text-purple-600">Auth-Methode</div>
            <div className="text-title-md text-purple-800 mt-1">OIDC / PKCE</div>
          </div>
        </div>
      </div>

      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-3">Ihre Rollen</h3>
        <div className="flex flex-wrap gap-2">
          {roles.map((role) => (
            <RoleBadge key={role} role={role} />
          ))}
        </div>
      </div>

      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-3">Showcase Features</h3>
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
              className="card-outlined p-4 block hover:shadow-elevation-1 transition-shadow duration-md3-short ease-md3-standard"
            >
              <div className="text-title-sm text-on-surface">{feature.title}</div>
              <div className="text-body-sm text-on-surface-variant mt-1">{feature.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
