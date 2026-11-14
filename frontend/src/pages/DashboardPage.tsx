import { Link } from 'react-router-dom'
import { useAuth } from '../auth/useAuth'
import { useRoles } from '../hooks/useRoles'
import { RoleBadge } from '../components/common/RoleBadge'
import { PageIntro } from '../components/common/PageIntro'
import { GitHubLink } from '../components/common/GitHubLink'
import { ROLE_INFO } from '../types/auth'

const FEATURES = [
  {
    title: 'Token Inspector',
    desc: 'Öffnet Ihren digitalen Ausweis (das Token) und zeigt, was darin über Sie steht.',
    path: '/token-inspector',
  },
  {
    title: 'API Tester',
    desc: 'Ruft alle Schnittstellen des Backends mit Ihrem Konto auf und zeigt, welche erlaubt und welche gesperrt sind.',
    path: '/api-tester',
  },
  {
    title: 'Permission Matrix',
    desc: 'Tabelle: Welche Rolle darf welche Schnittstelle benutzen?',
    path: '/permission-matrix',
  },
  {
    title: 'OIDC Flow',
    desc: 'Die Anmeldung, die Sie gerade durchlaufen haben, in zehn erklärten Schritten.',
    path: '/flow-diagram',
  },
  {
    title: 'Role Switcher',
    desc: 'Wechselt zu einem anderen Demo-Konto, um den Unterschied zwischen den Rollen zu sehen.',
    path: '/role-switcher',
  },
]

const GLOSSARY = [
  { term: 'IAM', text: 'Identity & Access Management: alles rund um die Fragen „Wer ist das?“ und „Was darf diese Person?“.' },
  { term: 'Keycloak', text: 'Ein Open-Source-Anmeldedienst. Er verwaltet Benutzer, Passwörter und Rollen an einer zentralen Stelle, damit nicht jede Anwendung das selbst bauen muss.' },
  { term: 'Authentifizierung', text: 'Der Nachweis, wer man ist, hier per Benutzername und Passwort bei Keycloak.' },
  { term: 'Autorisierung', text: 'Die Entscheidung, was eine angemeldete Person tun darf, hier anhand ihrer Rollen.' },
  { term: 'Token (JWT)', text: 'Ein digital unterschriebener Ausweis mit Name, Rollen und Ablaufzeit. Die App schickt ihn bei jeder Anfrage mit.' },
  { term: 'Rolle / RBAC', text: 'Rechte werden nicht einzelnen Personen gegeben, sondern Rollen. Wer die Rolle hat, hat die Rechte (Role-Based Access Control).' },
  { term: 'OIDC', text: 'OpenID Connect: der offene Standard, nach dem App und Anmeldedienst miteinander sprechen. Dasselbe Prinzip wie bei „Mit Google anmelden“.' },
  { term: 'PKCE', text: 'Eine Schutzmaßnahme bei der Anmeldung, die verhindert, dass ein abgefangener Anmeldecode von Fremden eingelöst werden kann.' },
]

export function DashboardPage() {
  const auth = useAuth()
  const { canRead, canWrite, canDelete, isAdmin } = useRoles()
  const roles = auth.getRoles().filter((r) => !r.startsWith('default-'))

  const abilities = [
    { label: 'Benutzer und Rollen ansehen', allowed: canRead, role: 'api-read' },
    { label: 'Benutzer anlegen', allowed: canWrite, role: 'api-write' },
    { label: 'Benutzer löschen', allowed: canDelete, role: 'api-admin' },
    { label: 'Admin-Bereich und Audit-Log öffnen', allowed: isAdmin, role: 'admin' },
  ]

  return (
    <div className="space-y-6">
      <PageIntro
        title="Dashboard"
        tryIt={[
          <>Öffnen Sie den <Link to="/api-tester" className="text-primary-500 hover:underline">API Tester</Link> und klicken Sie auf „Alle testen“.</>,
          <>Wechseln Sie danach im <Link to="/role-switcher" className="text-primary-500 hover:underline">Role Switcher</Link> das Konto und wiederholen Sie den Test.</>,
        ]}
      >
        <p>
          Sie sind jetzt über Keycloak angemeldet. Diese Demo zeigt, wie eine Anwendung feststellt, wer Sie
          sind, und wie sie anhand Ihrer Rollen entscheidet, was Sie sehen und tun dürfen. Jede Seite im
          Menü links beleuchtet einen Teil davon.
        </p>
      </PageIntro>

      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-4">Willkommen, {auth.username}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-primary-50 rounded-md p-4">
            <div className="text-label-md text-primary-600">Angemeldet als</div>
            <div className="text-title-md text-primary-800 mt-1 break-all">{auth.email}</div>
          </div>
          <div className="bg-green-50 rounded-md p-4">
            <div className="text-label-md text-green-600">Aktive Rollen</div>
            <div className="text-title-md text-green-800 mt-1">{roles.length}</div>
          </div>
          <div className="bg-purple-50 rounded-md p-4">
            <div className="text-label-md text-purple-600">Anmeldeverfahren</div>
            <div className="text-title-md text-purple-800 mt-1">OIDC / PKCE</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-elevated p-6">
          <h3 className="text-title-lg text-on-surface mb-1">Ihre Rollen</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Diese Rollen hat Keycloak in Ihr Token geschrieben. Sie bestimmen alles Weitere.
          </p>
          <ul className="space-y-2">
            {roles.map((role) => (
              <li key={role} className="flex items-start gap-3">
                <span className="shrink-0 w-24"><RoleBadge role={role} /></span>
                <span className="text-body-sm text-on-surface-variant">{ROLE_INFO[role] ?? 'Weitere Rolle aus Keycloak.'}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="card-elevated p-6">
          <h3 className="text-title-lg text-on-surface mb-1">Was Sie damit dürfen</h3>
          <p className="text-body-sm text-on-surface-variant mb-4">
            Daraus abgeleitet. Das Backend prüft dieselben Regeln bei jeder Anfrage noch einmal selbst.
          </p>
          <ul className="space-y-2">
            {abilities.map((a) => (
              <li key={a.label} className="flex items-center gap-3 text-body-md">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-label-sm shrink-0 ${a.allowed ? 'bg-green-500' : 'bg-red-400'}`}
                  aria-hidden="true"
                >
                  {a.allowed ? '✓' : '✕'}
                </span>
                <span className={a.allowed ? 'text-on-surface' : 'text-on-surface-variant'}>
                  {a.label}
                  <span className="sr-only">{a.allowed ? ' (erlaubt)' : ' (nicht erlaubt)'}</span>
                </span>
                <span className="ml-auto text-label-sm text-on-surface-variant font-mono">{a.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-3">Was es hier zu sehen gibt</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature) => (
            <Link
              key={feature.path}
              to={feature.path}
              className="card-outlined p-4 block hover:shadow-elevation-1 transition-shadow duration-md3-short ease-md3-standard"
            >
              <div className="text-title-sm text-on-surface">{feature.title}</div>
              <div className="text-body-sm text-on-surface-variant mt-1">{feature.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-3">Begriffe kurz erklärt</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
          {GLOSSARY.map((g) => (
            <div key={g.term}>
              <dt className="text-title-sm text-on-surface">{g.term}</dt>
              <dd className="text-body-sm text-on-surface-variant mt-0.5">{g.text}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="card-outlined p-6 flex flex-wrap items-center justify-between gap-4">
        <div className="max-w-2xl">
          <h3 className="text-title-lg text-on-surface mb-1">Der Code ist offen</h3>
          <p className="text-body-md text-on-surface-variant">
            Frontend, Backend, Keycloak-Konfiguration und das Docker-Setup liegen auf GitHub. Dort steht
            auch, wie man die Demo lokal startet.
          </p>
        </div>
        <GitHubLink className="btn-tonal" />
      </div>
    </div>
  )
}
