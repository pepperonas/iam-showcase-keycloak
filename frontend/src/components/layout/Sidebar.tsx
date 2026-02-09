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
    <aside className="w-64 bg-surface-container-low min-h-screen flex flex-col border-r border-outline-variant">
      <div className="p-4 border-b border-outline-variant">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-md-primary-container rounded-lg flex items-center justify-center text-on-primary-container font-medium text-label-lg">
            IAM
          </div>
          <div>
            <div className="text-title-sm text-on-surface">IAM Showcase</div>
            <div className="text-label-sm text-on-surface-variant">Keycloak Demo</div>
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
                  className={`block px-4 py-2.5 rounded-full text-label-lg transition-all duration-md3-short ease-md3-standard ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container font-medium'
                      : 'text-on-surface-variant hover:bg-on-surface/[0.08]'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-outline-variant text-label-sm text-on-surface-variant">
        Keycloak 24 | Spring Boot 3.3 | React 18
      </div>
    </aside>
  )
}
