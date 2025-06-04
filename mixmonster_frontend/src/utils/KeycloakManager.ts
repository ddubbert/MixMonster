// import { dev } from '$app/environment'
// import { error, type Cookies } from '@sveltejs/kit'

// caution: all functions should only be called within a server context

// import User from '@/types/user';
import Cookies from 'js-cookie';
import keycloakConfig from '@/configs/keycloak.json';
// eslint-disable-next-line import/extensions,import/no-unresolved
import { User } from '@/types/user';

// You can optionally define an interface for type safety
interface KeycloakConfig {
  realm: string;
  'auth-server-url': string;
  'ssl-required': string;
  resource: string;
  'public-client': boolean;
  'confidential-port': number;
}

const {
  resource: KEYCLOAK_CLIENT_ID,
  realm: KEYCLOAK_REALM,
  'auth-server-url': KEYCLOAK_URL,
} = keycloakConfig as KeycloakConfig;

const AccessTokenKey = 'kc-access';

const AccessTokenExpiresAtKey = 'kc-access-exp';

const RefreshTokenKey = 'kc-refresh';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parserJwt(token: string): any | undefined {
  try {
    const [, payloadB64] = token.split('.');
    const json = atob(payloadB64.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return undefined;
  }
}

function shouldRefreshToken(): boolean {
  console.log('shouldRefreshToken');
  const exp = Cookies.get(AccessTokenExpiresAtKey);
  if (!exp) {
    return true;
  }
  try {
    const expTime = Date.parse(decodeURIComponent(exp));
    const currTime = Date.now();
    const timeUntilExpiry = expTime - currTime;

    // refresh if token will expire in less than 5 minutes (300 seconds)
    return timeUntilExpiry < 300;
  } catch {
    // assume refreshing if there is an error
    return true;
  }
}

export function getUserInfo(accessToken: string): User | undefined {
  const token = parserJwt(accessToken);
  if (!token) {
    return undefined;
  }
  return {
    firstname: token.firstname,
    lastname: token.lastname,
    roles: token.realm_access.roles,
  };
}

export function setCookies(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,camelcase
  {
    access_token: accessToken,
    expires_in: expiresIn,
    refresh_token: refreshToken,
    refresh_expires_in: refreshExpiresIn,
  }: any,
) {
  Cookies.set(AccessTokenKey, accessToken, {
    path: '/',
    // httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(new Date().getTime() + (expiresIn * 1000)),
  });
  console.log('access set');

  Cookies.set(RefreshTokenKey, refreshToken, {
    path: '/',
    // httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(new Date().getTime() + (refreshExpiresIn * 1000)),
  });
  console.log('refresh set');

  // store token expiry for refresh logic

  const expiresAt = new Date();
  expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

  Cookies.set(AccessTokenExpiresAtKey, expiresAt.toISOString(), {
    path: '/',
    // httpOnly: true,
    secure: false,
    sameSite: 'lax',
    expires: new Date(new Date().getTime() + (expiresIn * 1000)),
  });
  console.log('expires set');
}

// refresh the access token if the refresh token is present
async function refreshAccessToken(
  fetch: typeof globalThis.fetch,
): Promise<string | undefined> {
  console.log('refreshAccessToken');
  const refreshToken = Cookies.get(RefreshTokenKey);

  if (!refreshToken) {
    return undefined;
  }

  const tokenEndpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

  const formData = new URLSearchParams();
  formData.append('grant_type', 'refresh_token');
  formData.append('client_id', KEYCLOAK_CLIENT_ID);
  formData.append('refresh_token', refreshToken);

  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: formData.toString(),
  });

  if (!res.ok) {
    const errorText = await res.text();
    const message = `Failed to refresh token: ${errorText}`;
    throw new Error(`${res.status}: ${message}`);
  }

  const json = await res.json();

  setCookies(json);

  return json.access_token;
}

// get a valid access token, refreshing if necessary
export async function getValidAccessToken(
  fetch: typeof globalThis.fetch,
): Promise<string | undefined> {
  console.log('getValidAccessToken');
  const accessToken = Cookies.get(AccessTokenKey);

  if (!accessToken) {
    return undefined;
  }

  if (shouldRefreshToken()) {
    return refreshAccessToken(fetch);
  }

  return accessToken;
}

export function deleteCookies() {
  Cookies.remove(AccessTokenKey, { path: '/' });
  Cookies.remove(AccessTokenExpiresAtKey, { path: '/' });
  Cookies.remove(RefreshTokenKey, { path: '/' });
}

export function loginUrl(redirectUri: string): string {
  const realmUrl = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/auth`;
  const params = new URLSearchParams();
  params.append('response_type', 'code');
  params.append('scope', 'openid profile email');
  params.append('redirect_uri', redirectUri);
  params.append('client_id', KEYCLOAK_CLIENT_ID);
  return `${realmUrl}?${params.toString()}`;
}

// exchanges the auth code for access token
export async function exchangeToken(
  redirectUri: string,
  authCode: string,
  fetch: typeof globalThis.fetch,
): Promise<string> {
  try {
    const endpoint = `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/token`;

    const params = new URLSearchParams();
    params.append('grant_type', 'authorization_code');
    params.append('client_id', KEYCLOAK_CLIENT_ID);
    params.append('code', authCode);
    params.append('redirect_uri', redirectUri);

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw Error(`${response.status}: Failed to exchange authorization code - ${errorText}`);
    }

    const json = await response.json();
    console.log(json);
    setCookies(json);
    return json.access_token;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    throw Error(`500: ${message}`);
  }
}
