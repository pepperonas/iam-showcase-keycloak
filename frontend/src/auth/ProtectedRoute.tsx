import { Navigate } from 'react-router-dom'
import { useAuth } from './useAuth'

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export function ProtectedRoute({ children, roles }: Props) {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <svg className="md3-spinner" viewBox="0 0 48 48">
          <circle cx="24" cy="24" r="18" fill="none" strokeWidth="4" />
        </svg>
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (roles && roles.length > 0 && !auth.hasAnyRole(...roles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-surface">
        <div className="card-elevated p-8 text-center max-w-md">
          <div className="w-16 h-16 rounded-full bg-md-error-container flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-md-error" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
          </div>
          <h2 className="text-headline-sm text-on-surface mb-2">Zugriff verweigert</h2>
          <p className="text-body-md text-on-surface-variant mb-4">
            Sie haben nicht die erforderlichen Berechtigungen fuer diese Seite.
          </p>
          <div className="flex flex-wrap gap-1.5 justify-center">
            {roles.map((role) => (
              <span key={role} className="px-2.5 py-0.5 rounded-full border border-outline-variant text-label-sm text-on-surface-variant">
                {role}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
