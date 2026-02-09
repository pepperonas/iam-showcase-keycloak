export interface TokenInspectResponse {
  subject: string
  preferredUsername: string
  email: string
  name: string
  realmRoles: string[]
  clientRoles: string[]
  header: Record<string, unknown>
  claims: Record<string, unknown>
  issuedAt: string
  expiresAt: string
  expiresInSeconds: number
}

export interface PermissionsResponse {
  username: string
  realmRoles: string[]
  clientRoles: string[]
  effectiveAuthorities: string[]
  permissionMatrix: Record<string, boolean>
}

export interface UserDto {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  enabled: boolean
  realmRoles: string[]
  clientRoles: string[]
  createdTimestamp: string
}

export interface CreateUserDto {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
  realmRoles: string[]
  clientRoles: string[]
}

export interface RoleDto {
  id: string
  name: string
  description: string
  composite: boolean
  clientRole: boolean
}

export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface AuditLogDto {
  id: number
  userId: string
  username: string
  action: string
  resource: string
  detail: string
  ipAddress: string
  timestamp: string
}

export interface DashboardStats {
  totalUsers: number
  totalRealmRoles: number
  totalClientRoles: number
  realm: string
  realmRoles: string[]
  clientRoles: string[]
}
