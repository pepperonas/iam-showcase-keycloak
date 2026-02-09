import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { setAuthToken } from '../api/axiosInstance'
import { API_ENDPOINTS } from '../types/api'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export function ApiTesterPage() {
  const auth = useAuth()
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)
  const [response, setResponse] = useState<{ status: number; data: unknown; time: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (auth.accessToken) {
      setAuthToken(auth.accessToken)
    }
  }, [auth.accessToken])

  const executeRequest = async () => {
    const endpoint = API_ENDPOINTS[selectedEndpoint]
    setLoading(true)
    setError(null)
    setResponse(null)

    const start = Date.now()
    try {
      const url = apiBaseUrl + endpoint.path.replace('/api/v1', '')
      const headers: Record<string, string> = { 'Content-Type': 'application/json' }
      if (auth.accessToken && endpoint.requiredRole) {
        headers['Authorization'] = `Bearer ${auth.accessToken}`
      }

      const res = await axios({ method: endpoint.method.toLowerCase(), url, headers })
      setResponse({ status: res.status, data: res.data, time: Date.now() - start })
    } catch (err: unknown) {
      if (axios.isAxiosError(err) && err.response) {
        setResponse({ status: err.response.status, data: err.response.data, time: Date.now() - start })
      } else {
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler')
      }
    } finally {
      setLoading(false)
    }
  }

  const endpoint = API_ENDPOINTS[selectedEndpoint]

  return (
    <div className="space-y-6">
      <h2 className="text-headline-sm text-on-surface">API Tester</h2>

      <div className="card-elevated p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-label-md text-on-surface-variant mb-1">Endpoint</label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(Number(e.target.value))}
              className="w-full px-3 py-2.5 border border-outline-variant rounded-xs bg-surface text-body-lg text-on-surface
                         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500
                         transition-colors duration-md3-short"
            >
              {API_ENDPOINTS.map((ep, i) => (
                <option key={i} value={i}>
                  {ep.method} {ep.path} - {ep.description}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={executeRequest}
            disabled={loading}
            className="btn-filled"
          >
            {loading ? 'Sende...' : 'Senden'}
          </button>
        </div>

        <div className="mt-3 flex gap-4 text-body-sm text-on-surface-variant">
          <span>Methode: <span className={`font-medium ${endpoint.method === 'GET' ? 'text-green-600' : endpoint.method === 'DELETE' ? 'text-red-600' : 'text-amber-600'}`}>{endpoint.method}</span></span>
          <span>Rolle: <span className="font-medium text-on-surface">{endpoint.requiredRole || 'oeffentlich'}</span></span>
        </div>
      </div>

      {/* Request */}
      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-3">Request</h3>
        <pre className="bg-secondary-800 text-gray-300 p-4 rounded-md text-body-sm font-mono overflow-auto">
{`${endpoint.method} ${endpoint.path}
Host: localhost:8080
${endpoint.requiredRole ? `Authorization: Bearer <token>` : '(kein Token erforderlich)'}
Content-Type: application/json`}
        </pre>
      </div>

      {/* Response */}
      {(response || error) && (
        <div className="card-elevated p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-title-lg text-on-surface">Response</h3>
            {response && (
              <div className="flex gap-3 items-center">
                <span className={`px-2.5 py-0.5 rounded-full text-label-md font-medium border ${response.status < 300 ? 'bg-green-50 text-green-700 border-green-200' : response.status < 500 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {response.status}
                </span>
                <span className="text-body-sm text-on-surface-variant">{response.time}ms</span>
              </div>
            )}
          </div>
          {error && <div className="text-md-error text-body-md">{error}</div>}
          {response && (
            <pre className="bg-secondary-800 text-green-400 p-4 rounded-md text-body-sm font-mono overflow-auto max-h-96">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
