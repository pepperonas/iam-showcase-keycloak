import { useAuth } from './useAuth'

interface Props {
  children: React.ReactNode
  roles?: string[]
}

export function ProtectedRoute({ children, roles }: Props) {
  const auth = useAuth()

  if (auth.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500" />
      </div>
    )
  }

  if (!auth.isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-gray-700">Anmeldung erforderlich</h2>
        <p className="text-gray-500">Bitte melden Sie sich an, um fortzufahren.</p>
        <button
          onClick={() => auth.signinRedirect()}
          className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition"
        >
          Anmelden
        </button>
      </div>
    )
  }

  if (roles && roles.length > 0 && !auth.hasAnyRole(...roles)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <h2 className="text-2xl font-bold text-red-600">Zugriff verweigert</h2>
        <p className="text-gray-500">
          Sie haben nicht die erforderlichen Berechtigungen fuer diese Seite.
        </p>
        <p className="text-sm text-gray-400">
          Erforderliche Rollen: {roles.join(', ')}
        </p>
      </div>
    )
  }

  return <>{children}</>
}
