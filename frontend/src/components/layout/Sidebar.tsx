import { Link, useLocation } from 'react-router-dom'
import { useRoles } from '../../hooks/useRoles'

interface NavItem {
  path: string
  label: string
  requiredRoles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard' },
  { path: '/token-inspector', label: 'Token Inspector' },
  { path: '/api-tester', label: 'API Tester' },
  { path: '/permission-matrix', label: 'Permission Matrix' },
  { path: '/flow-diagram', label: 'OIDC Flow' },
  { path: '/role-switcher', label: 'Role Switcher' },
  { path: '/users', label: 'User Management', requiredRoles: ['api-read'] },
  { path: '/admin', label: 'Admin Dashboard', requiredRoles: ['admin'] },
]

export function Sidebar() {
  const location = useLocation()
  const { roles } = useRoles()

  const isVisible = (item: NavItem) => {
    if (!item.requiredRoles) return true
    return item.requiredRoles.some((r) => roles.includes(r))
  }

  return (
    <aside className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
            IAM
          </div>
          <div>
            <div className="text-sm font-semibold">IAM Showcase</div>
            <div className="text-xs text-gray-400">Keycloak Demo</div>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <ul className="space-y-1">
          {NAV_ITEMS.filter(isVisible).map((item) => {
            const isActive = location.pathname === item.path
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`block px-3 py-2 rounded-md text-sm transition ${
                    isActive
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-700 text-xs text-gray-500">
        Keycloak 24 | Spring Boot 3.3 | React 18
      </div>
    </aside>
  )
}
