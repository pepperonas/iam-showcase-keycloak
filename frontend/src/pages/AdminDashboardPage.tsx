import { useState, useEffect } from 'react'
import { useAuth } from '../auth/useAuth'
import { setAuthToken } from '../api/axiosInstance'
import { getDashboardStats, getAuditLog } from '../api/adminApi'
import { LoadingSpinner } from '../components/common/LoadingSpinner'
import type { DashboardStats, AuditLogDto, PagedResponse } from '../types'

export function AdminDashboardPage() {
  const auth = useAuth()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [auditLogs, setAuditLogs] = useState<PagedResponse<AuditLogDto> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (auth.accessToken) {
      setAuthToken(auth.accessToken)
      Promise.all([getDashboardStats(), getAuditLog()])
        .then(([s, a]) => { setStats(s); setAuditLogs(a) })
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [auth.accessToken])

  if (loading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Realm</div>
            <div className="text-2xl font-bold text-gray-800">{stats.realm}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Benutzer</div>
            <div className="text-2xl font-bold text-blue-600">{stats.totalUsers}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Realm-Rollen</div>
            <div className="text-2xl font-bold text-green-600">{stats.totalRealmRoles}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-500">Client-Rollen</div>
            <div className="text-2xl font-bold text-purple-600">{stats.totalClientRoles}</div>
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-700">Audit-Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Zeitstempel</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Benutzer</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aktion</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ressource</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detail</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {auditLogs?.content.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{log.username}</td>
                  <td className="px-4 py-3 text-sm">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 font-mono">{log.resource}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">{log.detail}</td>
                  <td className="px-4 py-3 text-sm text-gray-400 font-mono">{log.ipAddress}</td>
                </tr>
              ))}
              {(!auditLogs || auditLogs.content.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                    Noch keine Audit-Eintraege vorhanden
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
