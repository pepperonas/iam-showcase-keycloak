import { useAuth } from '../../auth/useAuth'
import { RoleBadge } from '../common/RoleBadge'

export function Header() {
  const auth = useAuth()

  return (
    <header className="bg-surface-container-lowest shadow-elevation-1 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <h1 className="text-title-lg text-on-surface">IAM Showcase</h1>
        <span className="text-label-sm text-on-surface-variant">by celox.io</span>
      </div>

      {auth.isAuthenticated && (
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-body-md text-on-surface-variant">{auth.username}</span>
            <div className="flex gap-1">
              {auth.getRoles().filter(r => !r.startsWith('default-')).map((role) => (
                <RoleBadge key={role} role={role} />
              ))}
            </div>
          </div>
          <button
            onClick={() => auth.signoutRedirect()}
            className="btn-outlined px-4 py-1.5 text-label-md"
          >
            Abmelden
          </button>
        </div>
      )}
    </header>
  )
}
