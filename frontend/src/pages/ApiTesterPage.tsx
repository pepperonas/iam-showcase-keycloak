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
      <h2 className="text-2xl font-bold text-gray-800">API Tester</h2>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Endpoint</label>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(Number(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
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
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 transition"
          >
            {loading ? 'Sende...' : 'Senden'}
          </button>
        </div>

        <div className="mt-3 flex gap-4 text-sm text-gray-500">
          <span>Methode: <span className={`font-bold ${endpoint.method === 'GET' ? 'text-green-600' : endpoint.method === 'DELETE' ? 'text-red-600' : 'text-amber-600'}`}>{endpoint.method}</span></span>
          <span>Rolle: <span className="font-medium">{endpoint.requiredRole || 'oeffentlich'}</span></span>
        </div>
      </div>

      {/* Request */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">Request</h3>
        <pre className="bg-gray-900 text-gray-300 p-4 rounded-lg text-sm font-mono overflow-auto">
{`${endpoint.method} ${endpoint.path}
Host: localhost:8080
${endpoint.requiredRole ? `Authorization: Bearer <token>` : '(kein Token erforderlich)'}
Content-Type: application/json`}
        </pre>
      </div>

      {/* Response */}
      {(response || error) && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Response</h3>
            {response && (
              <div className="flex gap-3 text-sm">
                <span className={`px-2 py-1 rounded font-bold ${response.status < 300 ? 'bg-green-100 text-green-800' : response.status < 500 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
                  {response.status}
                </span>
                <span className="text-gray-500">{response.time}ms</span>
              </div>
            )}
          </div>
          {error && <div className="text-red-600 text-sm">{error}</div>}
          {response && (
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm font-mono overflow-auto max-h-96">
              {JSON.stringify(response.data, null, 2)}
            </pre>
          )}
        </div>
      )}
    </div>
  )
}
