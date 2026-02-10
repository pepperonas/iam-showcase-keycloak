import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { setAuthToken } from '../api/axiosInstance'
import { API_ENDPOINTS } from '../types/api'
import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

type EndpointResult = {
  status: number | null
  time: number
  loading: boolean
}

export function ApiTesterPage() {
  const auth = useAuth()
  const [selectedEndpoint, setSelectedEndpoint] = useState(0)
  const [response, setResponse] = useState<{ status: number; data: unknown; time: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  // Batch-Test State
  const [batchResults, setBatchResults] = useState<Record<number, EndpointResult>>({})
  const [batchRunning, setBatchRunning] = useState(false)

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

  const testAllEndpoints = async () => {
    setBatchRunning(true)
    setBatchResults({})

    // Alle auf loading setzen
    const initial: Record<number, EndpointResult> = {}
    API_ENDPOINTS.forEach((_, i) => {
      initial[i] = { status: null, time: 0, loading: true }
    })
    setBatchResults({ ...initial })

    // Sequentiell mit Delay fuer visuellen Effekt
    for (let i = 0; i < API_ENDPOINTS.length; i++) {
      const ep = API_ENDPOINTS[i]
      const start = Date.now()

      try {
        // Fuer Batch-Test: DELETE/POST als GET ausfuehren, Pfad-Variablen entfernen
        let path = ep.path.replace('/api/v1', '')
        const isMutating = ep.method === 'DELETE' || ep.method === 'POST' || ep.method === 'PUT'
        if (isMutating) {
          path = path.replace(/\/\{[^}]+\}/, '')
        }
        const url = apiBaseUrl + path
        const headers: Record<string, string> = { 'Content-Type': 'application/json' }
        if (auth.accessToken && ep.requiredRole) {
          headers['Authorization'] = `Bearer ${auth.accessToken}`
        }

        const res = await axios({ method: isMutating ? 'get' : ep.method.toLowerCase(), url, headers })
        setBatchResults(prev => ({ ...prev, [i]: { status: res.status, time: Date.now() - start, loading: false } }))
      } catch (err: unknown) {
        if (axios.isAxiosError(err) && err.response) {
          setBatchResults(prev => ({ ...prev, [i]: { status: err.response!.status, time: Date.now() - start, loading: false } }))
        } else {
          setBatchResults(prev => ({ ...prev, [i]: { status: 0, time: Date.now() - start, loading: false } }))
        }
      }

      // Kurze Pause fuer gestaffelten visuellen Effekt
      if (i < API_ENDPOINTS.length - 1) {
        await new Promise(r => setTimeout(r, 150))
      }
    }

    setBatchRunning(false)
  }

  const getStatusColor = (status: number | null) => {
    if (status === null) return 'bg-surface-container-highest text-on-surface-variant'
    if (status >= 200 && status < 300) return 'bg-green-500 text-white'
    if (status === 401) return 'bg-amber-500 text-white'
    if (status === 403) return 'bg-red-500 text-white'
    if (status >= 400 && status < 500) return 'bg-amber-500 text-white'
    return 'bg-red-700 text-white'
  }

  const getStatusLabel = (status: number | null) => {
    if (status === null) return '...'
    if (status >= 200 && status < 300) return `${status} OK`
    if (status === 401) return '401 Unauthorized'
    if (status === 403) return '403 Forbidden'
    if (status === 404) return '404 Not Found'
    return `${status}`
  }

  const endpoint = API_ENDPOINTS[selectedEndpoint]
  const batchHasResults = Object.keys(batchResults).length > 0

  return (
    <div className="space-y-6">
      <h2 className="text-headline-sm text-on-surface">API Tester</h2>

      {/* Batch-Test: Alle Endpoints */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-title-lg text-on-surface">Schnelltest</h3>
            <p className="text-body-sm text-on-surface-variant mt-0.5">
              Alle Endpoints mit der aktuellen Rolle testen
              {auth.username && (
                <> &mdash; angemeldet als <strong className="text-on-surface">{auth.username}</strong></>
              )}
            </p>
          </div>
          <button
            onClick={testAllEndpoints}
            disabled={batchRunning}
            className="btn-tonal flex items-center gap-2"
          >
            {batchRunning ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                </svg>
                Teste...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Alle testen
              </>
            )}
          </button>
        </div>

        {batchHasResults && (
          <div className="grid gap-2">
            {API_ENDPOINTS.map((ep, i) => {
              const result = batchResults[i]
              const isLoading = result?.loading
              const status = result?.status ?? null
              return (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ease-md3-standard
                    ${isLoading ? 'bg-surface-container animate-pulse' : 'bg-surface-container-low'}`}
                >
                  {/* Method Badge */}
                  <span className={`w-14 text-center text-label-sm font-medium rounded-full px-2 py-0.5 border shrink-0
                    ${ep.method === 'GET' ? 'bg-green-50 text-green-700 border-green-200'
                      : ep.method === 'POST' ? 'bg-blue-50 text-blue-700 border-blue-200'
                      : ep.method === 'DELETE' ? 'bg-red-50 text-red-700 border-red-200'
                      : 'bg-amber-50 text-amber-700 border-amber-200'}`}
                  >
                    {ep.method}
                  </span>

                  {/* Path + Description */}
                  <div className="flex-1 min-w-0">
                    <span className="font-mono text-body-sm text-on-surface">{ep.path}</span>
                    <span className="text-body-sm text-on-surface-variant ml-2 hidden sm:inline">{ep.description}</span>
                  </div>

                  {/* Required Role */}
                  <span className="text-label-sm text-on-surface-variant shrink-0 hidden md:inline">
                    {ep.requiredRole || 'public'}
                  </span>

                  {/* Result Badge */}
                  <div className={`w-28 text-center text-label-sm font-medium rounded-full px-3 py-1 shrink-0 transition-all duration-500
                    ${isLoading ? 'bg-surface-container-highest text-on-surface-variant scale-95' : `${getStatusColor(status)} scale-100`}
                    ${!isLoading && status !== null ? 'shadow-sm' : ''}`}
                  >
                    {isLoading ? (
                      <span className="inline-flex items-center gap-1">
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-1.5 h-1.5 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </span>
                    ) : (
                      getStatusLabel(status)
                    )}
                  </div>

                  {/* Response Time */}
                  {!isLoading && result?.time ? (
                    <span className="text-label-sm text-on-surface-variant w-14 text-right shrink-0">{result.time}ms</span>
                  ) : (
                    <span className="w-14 shrink-0" />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {batchHasResults && !batchRunning && (
          <div className="mt-4 flex gap-6 text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-green-500" /> Erlaubt
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" /> Nicht authentifiziert
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" /> Verboten
            </div>
          </div>
        )}
      </div>

      {/* Einzelner Endpoint-Test */}
      <div className="card-elevated p-6">
        <h3 className="text-title-lg text-on-surface mb-4">Einzeltest</h3>
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
Host: ${apiBaseUrl.replace('https://', '').replace('http://', '').replace('/api/v1', '')}
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
