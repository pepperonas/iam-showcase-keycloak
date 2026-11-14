export interface DemoUser {
  username: string
  password: string
  label: string
  roles: string[]
  color: string
  /** Was dieses Konto in der Demo darf, in einem Satz */
  description: string
}

export const DEMO_USERS: DemoUser[] = [
  {
    username: 'admin@demo.celox.io',
    password: 'Admin123',
    label: 'Admin',
    roles: ['admin', 'api-admin', 'api-write', 'api-read'],
    color: 'bg-red-500',
    description: 'Darf alles: Benutzer ansehen, anlegen und löschen, dazu Admin-Bereich und Audit-Log.',
  },
  {
    username: 'manager@demo.celox.io',
    password: 'Manager123',
    label: 'Manager',
    roles: ['manager', 'api-write', 'api-read'],
    color: 'bg-amber-500',
    description: 'Darf Benutzer ansehen und anlegen, aber nicht löschen. Der Admin-Bereich bleibt gesperrt.',
  },
  {
    username: 'user@demo.celox.io',
    password: 'User1234',
    label: 'User',
    roles: ['user', 'api-read'],
    color: 'bg-blue-500',
    description: 'Darf Benutzer und Rollen nur ansehen, nichts ändern.',
  },
  {
    username: 'viewer@demo.celox.io',
    password: 'Viewer123',
    label: 'Viewer',
    roles: ['viewer'],
    color: 'bg-gray-500',
    description: 'Ist angemeldet, hat aber keine API-Rechte. Hier sieht man, wie Ablehnungen aussehen.',
  },
]

/** Was jede Rolle bedeutet, in Alltagssprache */
export const ROLE_INFO: Record<string, string> = {
  admin: 'Fachliche Rolle: Administrator. Öffnet den Admin-Bereich.',
  manager: 'Fachliche Rolle: Teamleitung.',
  user: 'Fachliche Rolle: normaler Mitarbeiter.',
  viewer: 'Fachliche Rolle: Gast ohne API-Rechte.',
  'api-admin': 'API-Recht: darf Daten löschen.',
  'api-write': 'API-Recht: darf Daten anlegen und ändern.',
  'api-read': 'API-Recht: darf Daten lesen.',
}
