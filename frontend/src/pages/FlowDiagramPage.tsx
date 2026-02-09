export function FlowDiagramPage() {
  const steps = [
    { num: 1, from: 'Browser', to: 'React SPA', label: 'User klickt "Anmelden"', color: 'bg-blue-500' },
    { num: 2, from: 'React SPA', to: 'Keycloak', label: 'Authorization Request + PKCE code_challenge', color: 'bg-purple-500' },
    { num: 3, from: 'Keycloak', to: 'Browser', label: 'Login-Formular anzeigen', color: 'bg-purple-500' },
    { num: 4, from: 'Browser', to: 'Keycloak', label: 'Credentials + optional TOTP', color: 'bg-amber-500' },
    { num: 5, from: 'Keycloak', to: 'React SPA', label: 'Redirect mit Authorization Code', color: 'bg-green-500' },
    { num: 6, from: 'React SPA', to: 'Keycloak', label: 'Token Request + code_verifier (PKCE)', color: 'bg-green-500' },
    { num: 7, from: 'Keycloak', to: 'React SPA', label: 'Access Token (JWT) + Refresh Token', color: 'bg-green-600' },
    { num: 8, from: 'React SPA', to: 'Spring Boot API', label: 'API Request mit Bearer Token', color: 'bg-blue-600' },
    { num: 9, from: 'Spring Boot API', to: 'Keycloak', label: 'JWT Validierung (JWKS Endpoint)', color: 'bg-gray-500' },
    { num: 10, from: 'Spring Boot API', to: 'React SPA', label: 'API Response (RBAC geprueft)', color: 'bg-blue-600' },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-headline-sm text-on-surface">OAuth2 Authorization Code + PKCE Flow</h2>
      <p className="text-body-lg text-on-surface-variant">
        Visualisierung des OIDC-Flows zwischen Browser, React SPA, Keycloak und Spring Boot API.
      </p>

      {/* Beteiligte Systeme */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {['Browser', 'React SPA', 'Keycloak', 'Spring Boot API'].map((system) => (
          <div key={system} className="card-elevated p-4 text-center">
            <div className="text-title-sm text-on-surface">{system}</div>
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
              <div className="flex-1 flex items-center">
                <div className="h-0.5 flex-1 bg-outline-variant" />
                <div className="mx-2 text-outline">&#8594;</div>
                <div className="h-0.5 flex-1 bg-outline-variant" />
              </div>
              <div className="flex-shrink-0 w-32 text-label-lg text-on-surface-variant">{step.to}</div>
              <div className="flex-1 text-body-md text-on-surface">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PKCE Erklaerung */}
      <div className="card-outlined p-6 border-amber-200 bg-amber-50">
        <h3 className="text-title-lg text-amber-800 mb-2">PKCE (Proof Key for Code Exchange)</h3>
        <div className="text-body-md text-amber-700 space-y-2">
          <p><strong>code_verifier:</strong> Zufaelliger String, generiert vom Client (SPA)</p>
          <p><strong>code_challenge:</strong> SHA-256 Hash des code_verifier, gesendet mit Auth-Request</p>
          <p><strong>Schutz:</strong> Verhindert Authorization Code Interception bei Public Clients (SPA)</p>
          <p><strong>Methode:</strong> S256 (SHA-256) - konfiguriert in Keycloak Client</p>
        </div>
      </div>

      {/* MFA */}
      <div className="card-outlined p-6 border-blue-200 bg-blue-50">
        <h3 className="text-title-lg text-blue-800 mb-2">2FA / TOTP Integration</h3>
        <div className="text-body-md text-blue-700 space-y-2">
          <p>In Schritt 4 kann Keycloak zusaetzlich einen TOTP-Code verlangen.</p>
          <p><strong>Konfiguration:</strong> 6-stellig, 30 Sekunden Intervall, HMAC-SHA1</p>
          <p><strong>Unterstuetzte Apps:</strong> Google Authenticator, FreeOTP, Microsoft Authenticator</p>
        </div>
      </div>
    </div>
  )
}
