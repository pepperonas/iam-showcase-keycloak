import { Routes, Route } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './auth/useAuth'
import { setAuthToken } from './api/axiosInstance'
import { ProtectedRoute } from './auth/ProtectedRoute'
import { MainLayout } from './components/layout/MainLayout'
import { DashboardPage } from './pages/DashboardPage'
import { TokenInspectorPage } from './pages/TokenInspectorPage'
import { ApiTesterPage } from './pages/ApiTesterPage'
import { PermissionMatrixPage } from './pages/PermissionMatrixPage'
import { FlowDiagramPage } from './pages/FlowDiagramPage'
import { RoleSwitcherPage } from './pages/RoleSwitcherPage'
import { UserManagementPage } from './pages/UserManagementPage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'

export default function App() {
  const auth = useAuth()

  useEffect(() => {
    if (auth.accessToken) {
      setAuthToken(auth.accessToken)
    }
  }, [auth.accessToken])

  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<DashboardPage />} />
        <Route path="/token-inspector" element={<TokenInspectorPage />} />
        <Route path="/api-tester" element={<ApiTesterPage />} />
        <Route path="/permission-matrix" element={<PermissionMatrixPage />} />
        <Route path="/flow-diagram" element={<FlowDiagramPage />} />
        <Route path="/role-switcher" element={<RoleSwitcherPage />} />
        <Route
          path="/users"
          element={
            <ProtectedRoute roles={['api-read']}>
              <UserManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  )
}
