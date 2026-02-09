import { useAuth } from '../auth/useAuth'
import { DEMO_USERS } from '../types/auth'
import { Navigate } from 'react-router-dom'

const TECH_STACK = [
  'Keycloak 24', 'Spring Boot 3.3', 'Java 21', 'React 18',
  'TypeScript', 'Tailwind CSS', 'OIDC / PKCE', 'TOTP / 2FA',
]

export function LoginPage() {
  const auth = useAuth()

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const loginAs = (username: string) => {
    auth.signinRedirect({ login_hint: username })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-12">
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-md-primary-container text-on-primary-container text-label-lg mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.23 9.36-7 10.57-3.77-1.21-7-5.74-7-10.57V6.3l7-3.12z" />
              <path d="M10 12l-2-2-1.41 1.41L10 14.83l6-6L14.59 7z" />
            </svg>
            IAM Showcase
          </div>

          <h1 className="text-display-sm md:text-display-md text-on-surface mb-4">
            Identity & Access Management
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-lg mx-auto mb-8">
            Interaktive Demo einer vollstaendigen IAM-Loesung mit Keycloak, Spring Boot und React.
            Waehlen Sie einen Demo-Benutzer, um verschiedene Berechtigungsstufen zu erkunden.
          </p>

          <button
            onClick={() => auth.signinRedirect()}
            className="btn-filled text-title-md px-8 py-3"
          >
            Mit Keycloak anmelden
          </button>
        </div>

        {/* Demo User Cards */}
        <div className="w-full max-w-5xl px-4">
          <h2 className="text-title-md text-on-surface-variant text-center mb-6">
            Demo-Zugangsdaten
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_USERS.map((user) => (
              <button
                key={user.username}
                onClick={() => loginAs(user.username)}
                className="group card-elevated p-5 text-left cursor-pointer
                           hover:shadow-elevation-3 transition-all duration-md3-medium ease-md3-standard"
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-11 h-11 ${user.color} rounded-full flex items-center justify-center text-white font-medium text-title-md`}>
                    {user.label[0]}
                  </div>
                  <div>
                    <div className="text-title-sm text-on-surface">{user.label}</div>
                    <div className="text-body-sm text-on-surface-variant">{user.username}</div>
                  </div>
                </div>

                {/* Password */}
                <div className="mb-4">
                  <div className="text-label-sm text-on-surface-variant mb-1">Passwort</div>
                  <code className="block bg-surface-container-highest px-3 py-1.5 rounded-xs text-body-sm font-mono text-on-surface">
                    {user.password}
                  </code>
                </div>

                {/* Roles */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      className="inline-flex px-2.5 py-0.5 rounded-full border border-outline-variant
                                 text-label-sm text-on-surface-variant"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                {/* Hover CTA */}
                <div className="text-label-md text-primary-500 opacity-0 group-hover:opacity-100
                                transition-opacity duration-md3-short ease-md3-standard text-center">
                  Klicken zum Anmelden
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tech Stack Footer */}
      <div className="border-t border-outline-variant py-6 px-4">
        <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
          {TECH_STACK.map((tech) => (
            <span
              key={tech}
              className="px-3 py-1 rounded-full bg-surface-container text-label-sm text-on-surface-variant"
            >
              {tech}
            </span>
          ))}
        </div>
        <p className="text-center text-body-sm text-on-surface-variant mt-4">
          (c) 2026 Martin Pfeffer |{' '}
          <a href="https://celox.io" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
            celox.io
          </a>
        </p>
      </div>
    </div>
  )
}
