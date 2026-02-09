import api from './axiosInstance'
import type { TokenInspectResponse, PermissionsResponse } from '../types'

export async function inspectToken(): Promise<TokenInspectResponse> {
  const { data } = await api.get<TokenInspectResponse>('/token/inspect')
  return data
}

export async function getPermissions(): Promise<PermissionsResponse> {
  const { data } = await api.get<PermissionsResponse>('/token/permissions')
  return data
}
