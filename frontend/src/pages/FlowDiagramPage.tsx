import { PageIntro } from '../components/common/PageIntro'
export function FlowDiagramPage() {
  const steps = [
    { num: 1, from: 'Browser', to: 'React SPA', label: 'User klickt "Anmelden"', plain: 'Sie wollen in die App. Die App selbst kennt kein Passwort von Ihnen.', color: 'bg-blue-500' },
    { num: 2, from: 'React SPA', to: 'Keycloak', label: 'Authorization Request + PKCE code_challenge', plain: 'Die App schickt Sie zu Keycloak und gibt einen Prüfwert mit, dessen Geheimnis nur sie kennt.', color: 'bg-purple-500' },
    { num: 3, from: 'Keycloak', to: 'Browser', label: 'Login-Formular anzeigen', plain: 'Sie sehen jetzt eine Seite von Keycloak, nicht mehr von der App.', color: 'bg-purple-500' },
    { num: 4, from: 'Browser', to: 'Keycloak', label: 'Zugangsdaten + optional TOTP', plain: 'Ihr Passwort geht nur an Keycloak. Die App bekommt es nie zu sehen.', color: 'bg-amber-500' },
    { num: 5, from: 'Keycloak', to: 'React SPA', label: 'Redirect mit Authorization Code', plain: 'Keycloak schickt Sie zurück zur App, mit einem Einmal-Code in der Adresse.', color: 'bg-green-500' },
    { num: 6, from: 'React SPA', to: 'Keycloak', label: 'Token Request + code_verifier (PKCE)', plain: 'Die App tauscht den Code gegen Token und beweist mit dem Geheimnis aus Schritt 2, dass sie die Anfragende war.', color: 'bg-green-500' },
    { num: 7, from: 'Keycloak', to: 'React SPA', label: 'Access Token (JWT) + Refresh Token', plain: 'Die App hat jetzt Ihren Ausweis (Access Token) und einen Verlängerungsschein (Refresh Token).', color: 'bg-green-600' },
    { num: 8, from: 'React SPA', to: 'Spring Boot API', label: 'API Request mit Bearer Token', plain: 'Bei jeder Datenanfrage legt die App den Ausweis bei.', color: 'bg-blue-600' },
    { num: 9, from: 'Spring Boot API', to: 'Keycloak', label: 'JWT Validierung (JWKS Endpoint)', plain: 'Das Backend prüft die Unterschrift mit dem öffentlichen Schlüssel von Keycloak. Den lädt es einmal und merkt ihn sich.', color: 'bg-gray-500' },
    { num: 10, from: 'Spring Boot API', to: 'React SPA', label: 'API Response (RBAC geprüft)', plain: 'Passt die Rolle zur Anfrage, kommen Daten zurück, sonst ein „403 Verboten“.', color: 'bg-blue-600' },
  ]

  return (
    <div className="space-y-6">
      <PageIntro title="OIDC Flow: die Anmeldung Schritt für Schritt">
        <p>
          Was zwischen Ihrem Klick auf „Anmelden“ und der ersten angezeigten Seite passiert ist. Das Verfahren
          heißt „Authorization Code Flow mit PKCE“ und ist der heute empfohlene Standard für Web-Apps. Sie
          kennen es von „Mit Google anmelden“.
        </p>
        <p>
          Der Kern: Die App bekommt Ihr Passwort nie zu sehen. Sie erhält von Keycloak nur einen zeitlich
          begrenzten Ausweis, das Token. Jeder Schritt unten nennt erst den Fachbegriff und darunter, was er
          bedeutet.
        </p>
      </PageIntro>

      {/* Beteiligte Systeme */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { name: 'Browser', role: 'Sie, vor dem Bildschirm' },
          { name: 'React SPA', role: 'Diese App. Sie läuft komplett in Ihrem Browser.' },
          { name: 'Keycloak', role: 'Der Anmeldedienst. Kennt Benutzer, Passwörter und Rollen.' },
          { name: 'Spring Boot API', role: 'Das Backend. Liefert Daten, wenn der Ausweis passt.' },
        ].map((system) => (
          <div key={system.name} className="card-elevated p-4 text-center">
            <div className="text-title-sm text-on-surface">{system.name}</div>
            <div className="text-body-sm text-on-surface-variant mt-1">{system.role}</div>
          </div>
        ))}
      </div>

      {/* Sequenzdiagramm */}
      <div className="card-elevated p-6">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.num} className="flex items-center gap-4 p-3 rounded-md hover:bg-on-surface/[0.04] transition-colors duration-md3-short">
              <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white font-medium text-label-md flex-shrink-0`}>
                {step.num}
              </div>
              <div className="flex-shrink-0 w-32 text-label-lg text-on-surface-variant">{step.from}</div>
              <div className="w-12 shrink-0 hidden md:flex items-center">
                <div className="h-0.5 flex-1 bg-outline-variant" />
                <div className="mx-2 text-outline" aria-label="an">&#8594;</div>
              </div>
              <div className="flex-shrink-0 w-32 text-label-lg text-on-surface-variant">{step.to}</div>
              <div className="flex-[2] min-w-0">
                <div className="text-body-md text-on-surface">{step.label}</div>
                <div className="text-body-sm text-on-surface-variant">{step.plain}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PKCE Erklaerung */}
      <div className="card-outlined p-6 border-amber-200 bg-amber-50">
        <h3 className="text-title-lg text-amber-800 mb-2">PKCE (Proof Key for Code Exchange)</h3>
        <div className="text-body-md text-amber-700 space-y-2">
          <p>
            Eine App im Browser kann kein Geheimnis sicher aufbewahren. PKCE löst das: Die App denkt sich für
            jede Anmeldung ein frisches Geheimnis aus, schickt zuerst nur dessen Fingerabdruck mit und legt
            das Geheimnis erst beim Einlösen des Codes offen. Wer den Code unterwegs abfängt, kann damit nichts anfangen.
          </p>
          <p><strong>code_verifier:</strong> Das Geheimnis, eine zufällige Zeichenfolge, erzeugt von der App</p>
          <p><strong>code_challenge:</strong> Der Fingerabdruck (SHA-256-Hash) des Geheimnisses, mitgeschickt in Schritt 2</p>
          <p><strong>Schutz:</strong> Verhindert, dass ein abgefangener Anmeldecode von Fremden eingelöst wird</p>
          <p><strong>Methode:</strong> S256 (SHA-256) - konfiguriert in Keycloak Client</p>
        </div>
      </div>

      {/* MFA */}
      <div className="card-outlined p-6 border-blue-200 bg-blue-50">
        <h3 className="text-title-lg text-blue-800 mb-2">2FA / TOTP Integration</h3>
        <div className="text-body-md text-blue-700 space-y-2">
          <p>
            In Schritt 4 kann Keycloak zusätzlich einen sechsstelligen Einmal-Code aus einer Authenticator-App
            verlangen (TOTP, „Time-based One-Time Password“). Dann reicht ein gestohlenes Passwort allein
            nicht mehr. Die App muss dafür nichts tun, das regelt allein Keycloak. In dieser Demo ist der
            zweite Faktor freiwillig.
          </p>
          <p><strong>Konfiguration:</strong> 6-stellig, 30 Sekunden Intervall, HMAC-SHA1</p>
          <p><strong>Unterstützte Apps:</strong> Google Authenticator, FreeOTP, Microsoft Authenticator</p>
        </div>
      </div>
    </div>
  )
}
