import { WebStorageStateStore } from 'oidc-client-ts'
import type { AuthProviderProps } from 'react-oidc-context'

const keycloakUrl = import.meta.env.VITE_KEYCLOAK_URL || 'http://localhost:8180'
const realm = import.meta.env.VITE_KEYCLOAK_REALM || 'iam-showcase'
const clientId = import.meta.env.VITE_KEYCLOAK_CLIENT_ID || 'iam-frontend'

export const oidcConfig: AuthProviderProps = {
  authority: `${keycloakUrl}/realms/${realm}`,
  client_id: clientId,
  redirect_uri: window.location.origin + '/',
  post_logout_redirect_uri: window.location.origin + '/',
  response_type: 'code',
  scope: 'openid profile email',
  automaticSilentRenew: true,
  userStore: new WebStorageStateStore({ store: window.localStorage }),
  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname)
  },
}
