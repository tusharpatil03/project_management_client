import { getRefreshToken, setRefreshToken, clearAll } from './storage';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000/graphql';

export const performRefresh = async (): Promise<{ accessToken: string; refreshToken: string } | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  try {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation RefreshToken($refreshToken: String!) {
            refreshToken(refreshToken: $refreshToken) {
              accessToken
              refreshToken
            }
          }
        `,
        variables: { refreshToken },
      }),
    });

    const { data, errors } = await res.json();
    if (errors) {
      console.error('Error refreshing token:', errors);
      return null;
    }

    const payload = data?.refreshToken ?? null;
    if (!payload) return null;

    const { accessToken, refreshToken: newRefreshToken } = payload;
    if (!accessToken || !newRefreshToken) return null;

    setRefreshToken(newRefreshToken);
    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    console.error('Refresh token request failed:', err);
    clearAll();
    return null;
  }
};

export default { performRefresh };
