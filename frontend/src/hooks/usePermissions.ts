import { useState, useEffect } from 'react'
import { getPermissions } from '../api/tokenApi'
import type { PermissionsResponse } from '../types'
import { useAuth } from '../auth/useAuth'

export function usePermissions() {
  const [permissions, setPermissions] = useState<PermissionsResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const auth = useAuth()

  useEffect(() => {
    if (auth.isAuthenticated && auth.accessToken) {
      getPermissions()
        .then(setPermissions)
        .catch(console.error)
        .finally(() => setLoading(false))
    }
  }, [auth.isAuthenticated, auth.accessToken])

  return { permissions, loading }
}
