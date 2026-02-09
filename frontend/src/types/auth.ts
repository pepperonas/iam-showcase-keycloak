export interface DemoUser {
  username: string
  password: string
  label: string
  roles: string[]
  color: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    username: 'admin@demo.celox.io',
    password: 'Admin123',
    label: 'Admin',
    roles: ['admin', 'api-admin', 'api-write', 'api-read'],
    color: 'bg-red-500',
  },
  {
    username: 'manager@demo.celox.io',
    password: 'Manager123',
    label: 'Manager',
    roles: ['manager', 'api-write', 'api-read'],
    color: 'bg-amber-500',
  },
  {
    username: 'user@demo.celox.io',
    password: 'User1234',
    label: 'User',
    roles: ['user', 'api-read'],
    color: 'bg-blue-500',
  },
  {
    username: 'viewer@demo.celox.io',
    password: 'Viewer123',
    label: 'Viewer',
    roles: ['viewer'],
    color: 'bg-gray-500',
  },
]
