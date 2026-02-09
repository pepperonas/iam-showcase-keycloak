import api from './axiosInstance'
import type { UserDto, CreateUserDto, PagedResponse } from '../types'

export async function getUsers(page = 0, size = 20): Promise<PagedResponse<UserDto>> {
  const { data } = await api.get<PagedResponse<UserDto>>('/users', { params: { page, size } })
  return data
}

export async function getUserById(id: string): Promise<UserDto> {
  const { data } = await api.get<UserDto>(`/users/${id}`)
  return data
}

export async function createUser(dto: CreateUserDto): Promise<UserDto> {
  const { data } = await api.post<UserDto>('/users', dto)
  return data
}

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`)
}
