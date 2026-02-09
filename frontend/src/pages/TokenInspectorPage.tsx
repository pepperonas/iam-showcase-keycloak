import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { inspectToken } from '../api/tokenApi'
import { setAuthToken } from '../api/axiosInstance'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import { RoleBadge } from '../components/common/RoleBadge'
import type { TokenInspectResponse } from '../types'

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Token Inspector</h2>
        <div className="flex items-center gap-3">
          <span className={`text-sm font-mono px-3 py-1 rounded ${countdown > 60 ? 'bg-green-100 text-green-800' : countdown > 0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`}>
            Ablauf in: {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
          </span>
          <button onClick={copyToken} className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded transition">
            {copied ? 'Kopiert!' : 'Token kopieren'}
          </button>
        </div>
      </div>

      {tokenInfo && (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Benutzer-Info</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div><span className="text-gray-500">Subject:</span> <span className="font-mono">{tokenInfo.subject}</span></div>
              <div><span className="text-gray-500">Username:</span> <span className="font-mono">{tokenInfo.preferredUsername}</span></div>
              <div><span className="text-gray-500">Email:</span> <span className="font-mono">{tokenInfo.email}</span></div>
              <div><span className="text-gray-500">Name:</span> <span className="font-mono">{tokenInfo.name}</span></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Realm-Rollen</h3>
              <div className="flex flex-wrap gap-2">
                {tokenInfo.realmRoles.map((role) => <RoleBadge key={role} role={role} />)}
                {tokenInfo.realmRoles.length === 0 && <span className="text-gray-400 text-sm">Keine</span>}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Client-Rollen (iam-backend)</h3>
              <div className="flex flex-wrap gap-2">
                {tokenInfo.clientRoles.map((role) => <RoleBadge key={role} role={role} />)}
                {tokenInfo.clientRoles.length === 0 && <span className="text-gray-400 text-sm">Keine</span>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">JWT Header</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-auto text-sm font-mono">
              {JSON.stringify(tokenInfo.header, null, 2)}
            </pre>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">JWT Claims (Payload)</h3>
            <pre className="bg-gray-900 text-blue-400 p-4 rounded-lg overflow-auto text-sm font-mono">
              {JSON.stringify(tokenInfo.claims, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  )
}
