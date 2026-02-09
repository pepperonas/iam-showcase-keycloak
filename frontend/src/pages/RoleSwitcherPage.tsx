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
    const redirectUri = `${keycloakUrl}/realms/${realm}/protocol/openid-connect/auth?client_id=iam-frontend&redirect_uri=${encodeURIComponent(window.location.origin + '/')}&response_type=code&scope=openid+profile+email&login_hint=${encodeURIComponent(username)}`

    window.location.href = `${logoutUrl}?post_logout_redirect_uri=${encodeURIComponent(redirectUri)}&client_id=iam-frontend`
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Role Switcher</h2>
      <p className="text-gray-500">
        Schnell zwischen Demo-Benutzern wechseln, um verschiedene Berechtigungsstufen zu testen.
      </p>

      {auth.isAuthenticated && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-700">
          Aktuell angemeldet als: <strong>{auth.username}</strong>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {DEMO_USERS.map((user) => {
          const isCurrentUser = auth.username === user.username
          return (
            <div
              key={user.username}
              className={`bg-white rounded-lg shadow p-6 border-2 transition ${isCurrentUser ? 'border-primary-500 ring-2 ring-primary-200' : 'border-transparent hover:border-gray-200'}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 ${user.color} rounded-full flex items-center justify-center text-white font-bold text-lg`}>
                  {user.label[0]}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{user.label}</div>
                  <div className="text-sm text-gray-500">{user.username}</div>
                </div>
                {isCurrentUser && (
                  <span className="ml-auto px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full font-medium">
                    Aktiv
                  </span>
                )}
              </div>

              <div className="mb-4">
                <div className="text-xs text-gray-500 mb-1">Rollen:</div>
                <div className="flex flex-wrap gap-1">
                  {user.roles.map((role) => (
                    <RoleBadge key={role} role={role} />
                  ))}
                </div>
              </div>

              <div className="mb-4 text-sm text-gray-500">
                Passwort: <code className="bg-gray-100 px-1.5 py-0.5 rounded">{user.password}</code>
              </div>

              <button
                onClick={() => switchUser(user.username)}
                disabled={isCurrentUser}
                className={`w-full py-2 rounded-md text-sm font-medium transition ${isCurrentUser ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-500 text-white hover:bg-primary-600'}`}
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
