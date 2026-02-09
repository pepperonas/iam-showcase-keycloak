export interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  path: string
  description: string
  requiredRole: string | null
}

export const API_ENDPOINTS: ApiEndpoint[] = [
  { method: 'GET', path: '/api/v1/public/health', description: 'Health Check', requiredRole: null },
  { method: 'GET', path: '/api/v1/public/info', description: 'App-Info', requiredRole: null },
  { method: 'GET', path: '/api/v1/token/inspect', description: 'Token inspizieren', requiredRole: 'authenticated' },
  { method: 'GET', path: '/api/v1/token/permissions', description: 'Berechtigungen', requiredRole: 'authenticated' },
  { method: 'GET', path: '/api/v1/users', description: 'User auflisten', requiredRole: 'api-read' },
  { method: 'POST', path: '/api/v1/users', description: 'User erstellen', requiredRole: 'api-write' },
  { method: 'DELETE', path: '/api/v1/users/{id}', description: 'User loeschen', requiredRole: 'api-admin' },
  { method: 'GET', path: '/api/v1/roles', description: 'Rollen auflisten', requiredRole: 'api-read' },
  { method: 'GET', path: '/api/v1/admin/dashboard', description: 'Admin Dashboard', requiredRole: 'admin' },
  { method: 'GET', path: '/api/v1/admin/audit-log', description: 'Audit-Log', requiredRole: 'admin' },
  { method: 'GET', path: '/api/v1/saml/metadata', description: 'SAML SP Metadata', requiredRole: null },
]
