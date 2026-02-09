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
      <h2 className="text-headline-sm text-on-surface">Admin Dashboard</h2>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card-elevated p-6">
            <div className="text-label-md text-on-surface-variant">Realm</div>
            <div className="text-headline-sm text-on-surface mt-1">{stats.realm}</div>
          </div>
          <div className="card-elevated p-6">
            <div className="text-label-md text-on-surface-variant">Benutzer</div>
            <div className="text-headline-sm text-primary-500 mt-1">{stats.totalUsers}</div>
          </div>
          <div className="card-elevated p-6">
            <div className="text-label-md text-on-surface-variant">Realm-Rollen</div>
            <div className="text-headline-sm text-green-600 mt-1">{stats.totalRealmRoles}</div>
          </div>
          <div className="card-elevated p-6">
            <div className="text-label-md text-on-surface-variant">Client-Rollen</div>
            <div className="text-headline-sm text-purple-600 mt-1">{stats.totalClientRoles}</div>
          </div>
        </div>
      )}

      {/* Audit Log */}
      <div className="card-elevated">
        <div className="px-6 py-4 border-b border-outline-variant">
          <h3 className="text-title-lg text-on-surface">Audit-Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-outline-variant">
            <thead className="bg-surface-container">
              <tr>
                <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">Zeitstempel</th>
                <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">Benutzer</th>
                <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">Aktion</th>
                <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">Ressource</th>
                <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">Detail</th>
                <th className="px-4 py-3 text-left text-label-md text-on-surface-variant">IP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {auditLogs?.content.map((log) => (
                <tr key={log.id} className="hover:bg-on-surface/[0.04] transition-colors duration-md3-short">
                  <td className="px-4 py-3 text-body-sm text-on-surface-variant font-mono">{log.timestamp}</td>
                  <td className="px-4 py-3 text-body-md text-on-surface">{log.username}</td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded-full text-label-sm font-medium">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-body-sm text-on-surface-variant font-mono">{log.resource}</td>
                  <td className="px-4 py-3 text-body-sm text-on-surface-variant">{log.detail}</td>
                  <td className="px-4 py-3 text-body-sm text-on-surface-variant font-mono">{log.ipAddress}</td>
                </tr>
              ))}
              {(!auditLogs || auditLogs.content.length === 0) && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-body-md text-on-surface-variant">
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
