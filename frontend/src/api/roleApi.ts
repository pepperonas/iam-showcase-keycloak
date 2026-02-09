import api from './axiosInstance'
import type { RoleDto } from '../types'

export async function getRoles(): Promise<RoleDto[]> {
  const { data } = await api.get<RoleDto[]>('/roles')
  return data
}
