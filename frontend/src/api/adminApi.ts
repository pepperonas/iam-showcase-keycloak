import api from './axiosInstance'
import type { DashboardStats, AuditLogDto, PagedResponse } from '../types'

export async function getDashboardStats(): Promise<DashboardStats> {
  const { data } = await api.get<DashboardStats>('/admin/dashboard')
  return data
}

export async function getAuditLog(page = 0, size = 20): Promise<PagedResponse<AuditLogDto>> {
  const { data } = await api.get<PagedResponse<AuditLogDto>>('/admin/audit-log', {
    params: { page, size },
  })
  return data
}
