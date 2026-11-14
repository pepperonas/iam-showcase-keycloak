import { Link, useLocation } from 'react-router-dom'
import { useRoles } from '../../hooks/useRoles'
import { GitHubLink } from '../common/GitHubLink'

interface NavItem {
  path: string
  label: string
  /** Ein Halbsatz, der sagt, was die Seite zeigt */
  hint: string
  requiredRoles?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { path: '/', label: 'Dashboard', hint: 'Überblick und Einstieg' },
  { path: '/token-inspector', label: 'Token Inspector', hint: 'Ihr digitaler Ausweis' },
  { path: '/api-tester', label: 'API Tester', hint: 'Was darf ich aufrufen?' },
  { path: '/permission-matrix', label: 'Permission Matrix', hint: 'Welche Rolle darf was?' },
  { path: '/flow-diagram', label: 'OIDC Flow', hint: 'Die Anmeldung Schritt für Schritt' },
  { path: '/role-switcher', label: 'Role Switcher', hint: 'Demo-Konto wechseln' },
  { path: '/users', label: 'User Management', hint: 'Benutzer aus Keycloak', requiredRoles: ['api-read'] },
  { path: '/admin', label: 'Admin Dashboard', hint: 'Nur für Admins', requiredRoles: ['admin'] },
]

export function Sidebar() {
  const location = useLocation()
  const { roles } = useRoles()

  const isVisible = (item: NavItem) => {
    if (!item.requiredRoles) return true
    return item.requiredRoles.some((r) => roles.includes(r))
  }

  const hiddenCount = NAV_ITEMS.length - NAV_ITEMS.filter(isVisible).length

  return (
    <aside className="w-64 shrink-0 bg-surface-container-low min-h-screen flex flex-col border-r border-outline-variant">
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
                  className={`block px-4 py-2 rounded-2xl transition-all duration-md3-short ease-md3-standard ${
                    isActive
                      ? 'bg-secondary-container text-on-secondary-container'
                      : 'text-on-surface-variant hover:bg-on-surface/[0.08]'
                  }`}
                >
                  <span className={`block text-label-lg ${isActive ? 'font-medium' : ''}`}>{item.label}</span>
                  <span className="block text-label-sm opacity-80">{item.hint}</span>
                </Link>
              </li>
            )
          })}
        </ul>

        {hiddenCount > 0 && (
          <p className="mt-4 px-4 text-label-sm text-on-surface-variant">
            {hiddenCount === 1 ? 'Ein Menüpunkt ist' : `${hiddenCount} Menüpunkte sind`} ausgeblendet, weil
            Ihrem Konto die nötige Rolle fehlt. Wechseln Sie im Role Switcher das Konto, um den Unterschied zu sehen.
          </p>
        )}
      </nav>

      <div className="p-4 border-t border-outline-variant text-label-sm text-on-surface-variant space-y-2">
        <GitHubLink className="text-primary-500 hover:underline" />
        <div>Keycloak 26 | Spring Boot 4.1 | React 18</div>
      </div>
    </aside>
  )
}
