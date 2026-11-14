import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { inspectToken } from '../api/tokenApi'
import { setAuthToken } from '../api/axiosInstance'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { RoleBadge } from '../components/common/RoleBadge'
import type { TokenInspectResponse } from '../types'
import { PageIntro } from '../components/common/PageIntro'

export function TokenInspectorPage() {
  const auth = useAuth()
  const [tokenInfo, setTokenInfo] = useState<TokenInspectResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [countdown, setCountdown] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (auth.accessToken) {
      setAuthToken(auth.accessToken)
      inspectToken()
        .then((data) => {
          setTokenInfo(data)
          setCountdown(data.expiresInSeconds)
        })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [auth.accessToken])

  useEffect(() => {
    if (countdown <= 0) return
    const timer = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000)
    return () => clearInterval(timer)
  }, [countdown])

  const copyToken = () => {
    if (auth.accessToken) {
      navigator.clipboard.writeText(auth.accessToken)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageIntro
        title="Token Inspector"
        tryIt={[
          'Vergleichen Sie die Rollen hier mit denen eines anderen Demo-Kontos (Role Switcher).',
          'Beobachten Sie den Ablauf-Zähler: Kurz vor Ablauf holt die App im Hintergrund ein neues Token.',
        ]}
        actions={
        <div className="flex items-center gap-3">
          <span className={`text-label-md font-mono px-3 py-1.5 rounded-full border ${countdown > 60 ? 'bg-green-50 text-green-700 border-green-200' : countdown > 0 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
            Ablauf in: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
          </span>
          <button onClick={copyToken} className="btn-tonal px-4 py-1.5 text-label-md">
            {copied ? 'Kopiert!' : 'Token kopieren'}
          </button>
        </div>
        }
      >
        <p>
          Nach der Anmeldung hat Keycloak dieser App ein <strong>Access Token</strong> ausgestellt. Das ist
          ein digital unterschriebener Ausweis im Format JWT (JSON Web Token). Die App schickt ihn bei jeder
          Anfrage an das Backend mit, und das Backend entscheidet allein anhand dieses Ausweises, was Sie dürfen.
        </p>
        <p>
          Diese Seite zeigt den Ausweis aufgeklappt. Der Inhalt ist nicht verschlüsselt, nur unterschrieben:
          Jeder kann ihn lesen, aber niemand kann ihn unbemerkt verändern. Aus Sicherheitsgründen gilt er nur
          fünf Minuten, danach holt die App automatisch einen neuen.
        </p>
      </PageIntro>

      {tokenInfo && (
        <>
          <div className="card-elevated p-6">
            <h3 className="text-title-lg text-on-surface mb-1">Benutzer-Info</h3>
            <p className="text-body-sm text-on-surface-variant mb-3">
              Wer Sie sind. „Subject“ ist Ihre eindeutige, unveränderliche Kennung in Keycloak.
            </p>
            <div className="grid grid-cols-2 gap-4 text-body-md">
              <div><span className="text-on-surface-variant">Subject:</span> <span className="font-mono text-on-surface">{tokenInfo.subject}</span></div>
              <div><span className="text-on-surface-variant">Username:</span> <span className="font-mono text-on-surface">{tokenInfo.preferredUsername}</span></div>
              <div><span className="text-on-surface-variant">Email:</span> <span className="font-mono text-on-surface">{tokenInfo.email}</span></div>
              <div><span className="text-on-surface-variant">Name:</span> <span className="font-mono text-on-surface">{tokenInfo.name}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card-elevated p-6">
              <h3 className="text-title-lg text-on-surface mb-1">Realm-Rollen</h3>
              <p className="text-body-sm text-on-surface-variant mb-3">
                Fachliche Rollen, die in der ganzen Keycloak-Umgebung („Realm“) gelten, etwa admin oder manager.
              </p>
              <div className="flex flex-wrap gap-2">
                {tokenInfo.realmRoles.map((role) => <RoleBadge key={role} role={role} />)}
                {tokenInfo.realmRoles.length === 0 && <span className="text-body-sm text-on-surface-variant">Keine</span>}
              </div>
            </div>
            <div className="card-elevated p-6">
              <h3 className="text-title-lg text-on-surface mb-1">Client-Rollen (iam-backend)</h3>
              <p className="text-body-sm text-on-surface-variant mb-3">
                Rechte, die nur für eine bestimmte Anwendung gelten, hier das Backend: lesen, schreiben, löschen.
              </p>
              <div className="flex flex-wrap gap-2">
                {tokenInfo.clientRoles.map((role) => <RoleBadge key={role} role={role} />)}
                {tokenInfo.clientRoles.length === 0 && <span className="text-body-sm text-on-surface-variant">Keine</span>}
              </div>
            </div>
          </div>

          <div className="card-elevated p-6">
            <h3 className="text-title-lg text-on-surface mb-1">JWT Header</h3>
            <p className="text-body-sm text-on-surface-variant mb-3">
              Technische Angaben zur Unterschrift: das Verfahren (<code className="font-mono">alg</code>) und
              welcher Schlüssel von Keycloak benutzt wurde (<code className="font-mono">kid</code>). Damit
              kann das Backend die Echtheit prüfen.
            </p>
            <pre className="bg-secondary-800 text-green-400 p-4 rounded-md overflow-auto text-body-sm font-mono">
              {JSON.stringify(tokenInfo.header, null, 2)}
            </pre>
          </div>

          <div className="card-elevated p-6">
            <h3 className="text-title-lg text-on-surface mb-1">JWT Claims (Payload)</h3>
            <p className="text-body-sm text-on-surface-variant mb-3">
              Der eigentliche Inhalt des Ausweises. Die wichtigsten Felder:{' '}
              <code className="font-mono">iss</code> (wer hat ihn ausgestellt),{' '}
              <code className="font-mono">sub</code> (für wen),{' '}
              <code className="font-mono">exp</code> (gültig bis, als Unix-Zeit),{' '}
              <code className="font-mono">realm_access</code> und{' '}
              <code className="font-mono">resource_access</code> (die Rollen).
            </p>
            <pre className="bg-secondary-800 text-blue-400 p-4 rounded-md overflow-auto text-body-sm font-mono">
              {JSON.stringify(tokenInfo.claims, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}
