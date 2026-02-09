import { AuthProvider as OidcAuthProvider } from 'react-oidc-context'
import { oidcConfig } from './authConfig'

interface Props {
  children: React.ReactNode
}

export function AuthProvider({ children }: Props) {
  return <OidcAuthProvider {...oidcConfig}>{children}</OidcAuthProvider>
}
