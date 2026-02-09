import { useAuth } from '../../auth/useAuth'
import { RoleBadge } from '../common/RoleBadge'

export function Header() {
  const auth = useAuth()

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-gray-800">IAM Showcase</h1>
        <span className="text-xs text-gray-400">by celox.io</span>
      </div>

      {auth.isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{auth.username}</span>
            <div className="flex gap-1">
              {auth.getRoles().filter(r => !r.startsWith('default-')).map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </div>
          <button
            onClick={() => auth.signoutRedirect()}
            className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded hover:bg-gray-50 transition"
          >
            Abmelden
          </button>
        </div>
      )}
    </header>
  )
}
