interface Props {
  role: string
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-50 text-red-700 border-red-200',
  manager: 'bg-amber-50 text-amber-700 border-amber-200',
  user: 'bg-blue-50 text-blue-700 border-blue-200',
  viewer: 'bg-surface-container-highest text-on-surface-variant border-outline-variant',
  'api-admin': 'bg-red-50 text-red-600 border-red-200',
  'api-write': 'bg-amber-50 text-amber-600 border-amber-200',
  'api-read': 'bg-green-50 text-green-600 border-green-200',
}

export function RoleBadge({ role }: Props) {
  const colorClasses = ROLE_COLORS[role] || 'bg-surface-container-highest text-on-surface-variant border-outline-variant'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-label-sm font-medium ${colorClasses}`}>
      {role}
    </span>
  )
}
