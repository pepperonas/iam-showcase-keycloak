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
      <h2 className="text-2xl font-bold text-gray-800">OAuth2 Authorization Code + PKCE Flow</h2>
      <p className="text-gray-500">
        Visualisierung des OIDC-Flows zwischen Browser, React SPA, Keycloak und Spring Boot API.
      </p>

      {/* Beteiligte Systeme */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        {['Browser', 'React SPA', 'Keycloak', 'Spring Boot API'].map((system) => (
          <div key={system} className="bg-white rounded-lg shadow p-4 text-center">
            <div className="font-semibold text-gray-800">{system}</div>
          </div>
        ))}
      </div>

      {/* Sequenzdiagramm */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="space-y-3">
          {steps.map((step) => (
            <div key={step.num} className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition">
              <div className={`w-8 h-8 ${step.color} rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0`}>
                {step.num}
              </div>
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-600">{step.from}</div>
              <div className="flex-1 flex items-center">
                <div className="h-0.5 flex-1 bg-gray-300" />
                <div className="mx-2 text-gray-400">&#8594;</div>
                <div className="h-0.5 flex-1 bg-gray-300" />
              </div>
              <div className="flex-shrink-0 w-32 text-sm font-medium text-gray-600">{step.to}</div>
              <div className="flex-1 text-sm text-gray-700">{step.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* PKCE Erklaerung */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-2">PKCE (Proof Key for Code Exchange)</h3>
        <div className="text-sm text-amber-700 space-y-2">
          <p><strong>code_verifier:</strong> Zufaelliger String, generiert vom Client (SPA)</p>
          <p><strong>code_challenge:</strong> SHA-256 Hash des code_verifier, gesendet mit Auth-Request</p>
          <p><strong>Schutz:</strong> Verhindert Authorization Code Interception bei Public Clients (SPA)</p>
          <p><strong>Methode:</strong> S256 (SHA-256) - konfiguriert in Keycloak Client</p>
        </div>
      </div>

      {/* MFA */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-2">2FA / TOTP Integration</h3>
        <div className="text-sm text-blue-700 space-y-2">
          <p>In Schritt 4 kann Keycloak zusaetzlich einen TOTP-Code verlangen.</p>
          <p><strong>Konfiguration:</strong> 6-stellig, 30 Sekunden Intervall, HMAC-SHA1</p>
          <p><strong>Unterstuetzte Apps:</strong> Google Authenticator, FreeOTP, Microsoft Authenticator</p>
        </div>
      </div>
    </div>
  )
}
