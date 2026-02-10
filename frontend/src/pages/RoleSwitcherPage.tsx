import { useAuth } from '../auth/useAuth'
import { DEMO_USERS } from '../types/auth'
import { RoleBadge } from '../components/common/RoleBadge'

export function RoleSwitcherPage() {
  const auth = useAuth()
  const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180'
  const realm = import.meta.env.VITE_KEYCLOAK_REALM || 'iam-showcase'

  const switchUser = (username: string) => {
    // Logout und dann mit login_hint fuer den neuen User re-login
    const logoutUrl = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/logout`
    const redirectUri = `${window.location.origin}/login?hint=${encodeURIComponent(username)}`

    window.location.href = `${logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(redirectUri)}&client_id=iam-frontend`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-headline-sm text-on-surface">Role Switcher</h2>
      <p className="text-body-lg text-on-surface-variant">
        Schnell zwischen Demo-Benutzern wechseln, um verschiedene Berechtigungsstufen zu testen.
      </p>

      {auth.isAuthenticated && (
        <div className="card-outlined p-4 border-blue-200 bg-blue-50">
          <span className="text-body-md text-blue-700">
            Aktuell angemeldet als: <strong>{auth.username}</strong>
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_USERS.map((user) => {
          const isCurrentUser = auth.username === user.username
          return (
            <div
              key={user.username}
              className={`card-elevated p-6 border-2 transition-all duration-md3-short ease-md3-standard ${isCurrentUser ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${user.color} rounded-full flex items-center justify-center text-white font-medium text-title-md`}>
                  {user.label[0]}
                </div>
                <div>
                  <div className="text-title-sm text-on-surface">{user.label}</div>
                  <div className="text-body-sm text-on-surface-variant">{user.username}</div>
                </div>
                {isCurrentUser && (
                  <span className="ml-auto px-3 py-1 bg-md-primary-container text-on-primary-container text-label-sm rounded-full font-medium">
                    Aktiv
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="text-label-sm text-on-surface-variant mb-1">Rollen:</div>
                <div className="flex flex-wrap gap-1.5">
                  {user.roles.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </div>

              <div className="mb-4 text-body-md text-on-surface-variant">
                Passwort: <code className="bg-surface-container-highest px-2 py-0.5 rounded-xs font-mono text-on-surface">{user.password}</code>
              </div>

              <button
                onClick={() => switchUser(user.username)}
                disabled={isCurrentUser}
                className={`w-full py-2.5 rounded-full text-label-lg font-medium transition-all duration-md3-short ease-md3-standard ${isCurrentUser ? 'bg-surface-container-highest text-on-surface-variant cursor-not-allowed' : 'btn-filled'}`}
              >
                {isCurrentUser ? 'Aktueller Benutzer' : `Als ${user.label} anmelden`}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
