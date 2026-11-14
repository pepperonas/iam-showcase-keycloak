import { useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { DEMO_USERS, ROLE_INFO } from '../types/auth'
import { Navigate, useSearchParams } from 'react-router-dom'
import { GitHubLink } from '../components/common/GitHubLink'

const STEPS = [
  {
    title: 'Anmelden bei Keycloak',
    text: 'Diese App fragt nie selbst nach einem Passwort. Sie leitet zum Anmeldedienst Keycloak weiter. Nur dort werden die Zugangsdaten geprüft.',
  },
  {
    title: 'Ein Token als Ausweis',
    text: 'Nach der Anmeldung erhält die App ein Token: einen digital unterschriebenen Ausweis, in dem steht, wer Sie sind und welche Rollen Sie haben.',
  },
  {
    title: 'Die API prüft jede Anfrage',
    text: 'Bei jeder Anfrage zeigt die App diesen Ausweis vor. Das Backend prüft Unterschrift und Rollen und liefert die Daten oder lehnt ab.',
  },
]

const TECH_STACK = [
  { name: 'Keycloak 26', role: 'Anmeldedienst: verwaltet Benutzer, Passwörter und Rollen' },
  { name: 'Spring Boot 4.1 · Java 21', role: 'Backend-API: prüft bei jeder Anfrage Token und Rolle' },
  { name: 'React 18 · TypeScript', role: 'Die Oberfläche, die Sie gerade im Browser sehen' },
  { name: 'OIDC / PKCE', role: 'Der offene Standard, nach dem die Anmeldung abläuft' },
  { name: 'TOTP / 2FA', role: 'Optionaler zweiter Faktor per Authenticator-App' },
  { name: 'Tailwind CSS', role: 'Gestaltung der Oberfläche' },
]

export function LoginPage() {
  const auth = useAuth()
  const [searchParams] = useSearchParams()
  const hint = searchParams.get('hint')

  // Auto-login bei Role Switcher Redirect
  useEffect(() => {
    if (hint && !auth.isAuthenticated && !auth.isLoading) {
      auth.signinRedirect({ login_hint: hint })
    }
  }, [hint, auth.isAuthenticated, auth.isLoading])

  if (auth.isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const loginAs = (username: string) => {
    auth.signinRedirect({ login_hint: username })
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col">
      <div className="flex-1 flex flex-col items-center px-4 py-12">
        {/* Hero */}
        <div className="text-center mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-md-primary-container text-on-primary-container text-label-lg mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v4.7c0 4.83-3.23 9.36-7 10.57-3.77-1.21-7-5.74-7-10.57V6.3l7-3.12z" />
              <path d="M10 12l-2-2-1.41 1.41L10 14.83l6-6L14.59 7z" />
            </svg>
            IAM Showcase
          </div>

          <h1 className="text-display-sm md:text-display-md text-on-surface mb-4">
            Identity & Access Management
          </h1>
          <p className="text-body-lg text-on-surface-variant max-w-xl mx-auto mb-3">
            Jede Anwendung mit Benutzerkonten muss zwei Fragen beantworten:{' '}
            <strong className="text-on-surface">Wer sind Sie?</strong> und{' '}
            <strong className="text-on-surface">Was dürfen Sie?</strong> Diese Demo zeigt an einem
            lauffähigen Beispiel, wie man das mit Keycloak, Spring Boot und React löst.
          </p>
          <p className="text-body-md text-on-surface-variant max-w-xl mx-auto mb-8">
            Melden Sie sich mit einem der vier Demo-Konten an und beobachten Sie, wie sich die App je nach
            Rolle verändert. Jede Seite erklärt, was sie zeigt.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => auth.signinRedirect()}
              className="btn-filled text-title-md px-8 py-3"
            >
              Mit Keycloak anmelden
            </button>
            <GitHubLink className="btn-outlined text-title-md px-6 py-3" />
          </div>
        </div>

        {/* So funktioniert es */}
        <section className="w-full max-w-5xl px-4 mb-12">
          <h2 className="text-title-md text-on-surface-variant text-center mb-6">
            So funktioniert es, in drei Schritten
          </h2>
          <ol className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {STEPS.map((step, i) => (
              <li key={step.title} className="card-outlined p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-8 h-8 rounded-full bg-md-primary-container text-on-primary-container flex items-center justify-center text-label-lg font-medium shrink-0">
                    {i + 1}
                  </span>
                  <h3 className="text-title-sm text-on-surface">{step.title}</h3>
                </div>
                <p className="text-body-md text-on-surface-variant">{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {/* Demo User Cards */}
        <section className="w-full max-w-5xl px-4 mb-12">
          <h2 className="text-title-md text-on-surface-variant text-center mb-2">
            Demo-Zugangsdaten
          </h2>
          <p className="text-body-md text-on-surface-variant text-center max-w-2xl mx-auto mb-6">
            Vier Konten mit unterschiedlichen Rechten. Ein Klick auf eine Karte öffnet die Keycloak-Anmeldung
            mit vorausgefülltem Benutzernamen, das Passwort tippen Sie dort selbst ein.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {DEMO_USERS.map((user) => (
              <button
                key={user.username}
                onClick={() => loginAs(user.username)}
                className="card-elevated p-5 text-left cursor-pointer flex flex-col
                           hover:shadow-elevation-3 transition-all duration-md3-medium ease-md3-standard"
              >
                {/* Avatar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-11 h-11 ${user.color} rounded-full flex items-center justify-center text-white font-medium text-title-md shrink-0`}>
                    {user.label[0]}
                  </div>
                  <div className="min-w-0">
                    <div className="text-title-sm text-on-surface">{user.label}</div>
                    <div className="text-body-sm text-on-surface-variant break-all">{user.username}</div>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface-variant mb-4">{user.description}</p>

                {/* Password */}
                <div className="mb-4">
                  <div className="text-label-sm text-on-surface-variant mb-1">Passwort</div>
                  <code className="block bg-surface-container-highest px-3 py-1.5 rounded-xs text-body-sm font-mono text-on-surface">
                    {user.password}
                  </code>
                </div>

                {/* Roles */}
                <div className="text-label-sm text-on-surface-variant mb-1">Rollen</div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {user.roles.map((role) => (
                    <span
                      key={role}
                      title={ROLE_INFO[role]}
                      className="inline-flex px-2.5 py-0.5 rounded-full border border-outline-variant
                                 text-label-sm text-on-surface-variant"
                    >
                      {role}
                    </span>
                  ))}
                </div>

                <div className="mt-auto text-label-md text-primary-500 text-center">
                  Mit diesem Konto anmelden &rarr;
                </div>
              </button>
            ))}
          </div>
          <p className="text-body-sm text-on-surface-variant text-center max-w-2xl mx-auto mt-4">
            Rollen wie <code className="font-mono">admin</code> oder <code className="font-mono">manager</code>{' '}
            beschreiben die Funktion einer Person. Rollen mit <code className="font-mono">api-</code> legen fest,
            was sie an der Schnittstelle darf: lesen, schreiben oder löschen.
          </p>
        </section>

        {/* Technik */}
        <section className="w-full max-w-5xl px-4">
          <h2 className="text-title-md text-on-surface-variant text-center mb-6">
            Was steckt dahinter?
          </h2>
          <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {TECH_STACK.map((tech) => (
              <div key={tech.name} className="rounded-md bg-surface-container px-4 py-3">
                <dt className="text-label-lg text-on-surface">{tech.name}</dt>
                <dd className="text-body-sm text-on-surface-variant">{tech.role}</dd>
              </div>
            ))}
          </dl>
          <p className="text-body-md text-on-surface-variant text-center mt-6">
            Der gesamte Code samt Docker-Setup ist offen einsehbar:{' '}
            <GitHubLink label="pepperonas/iam-showcase-keycloak" className="text-primary-500 hover:underline align-middle" />
          </p>
        </section>
      </div>

      <div className="border-t border-outline-variant py-6 px-4">
        <p className="text-center text-body-sm text-on-surface-variant">
          (c) 2026 Martin Pfeffer |{' '}
          <a href="https://celox.io" target="_blank" rel="noopener noreferrer" className="text-primary-500 hover:underline">
            celox.io
          </a>
        </p>
      </div>
    </div>
  )
}
