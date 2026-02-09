interface Props {
  role: string
}

const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-red-100 text-red-800',
  manager: 'bg-amber-100 text-amber-800',
  user: 'bg-blue-100 text-blue-800',
  viewer: 'bg-gray-100 text-gray-800',
  'api-admin': 'bg-red-50 text-red-700 border border-red-200',
  'api-write': 'bg-amber-50 text-amber-700 border border-amber-200',
  'api-read': 'bg-green-50 text-green-700 border border-green-200',
}

export function RoleBadge({ role }: Props) {
  const colorClasses = ROLE_COLORS[role] || 'bg-gray-100 text-gray-700'

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses}`}>
      {role}
    </span>
  )
}
