import authManager from "../authManager";

export const refresh = async () => {
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    console.error('Refresh Token not found in localStorage');
    return null;
  }

  try {
    const res = await fetch('http://localhost:4000/graphql', {
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
        variables: { refreshToken: refreshToken },
      }),
    });

    const { data, errors } = await res.json();

    if (errors) {
      console.error('Error refreshing token:', errors);
      return null;
    }

    const {
      accessToken,
      refreshToken: newRefreshToken,
    } = data?.refreshToken ?? {};

    if (!accessToken || !newRefreshToken) {
      console.error('Invalid refreshToken mutation response:', data);
      return null;
    }

    // Update auth state
    authManager.setAuth(accessToken, undefined)

    console.log('Token refreshed successfully');
    return accessToken;
  } catch (err) {
    console.error('Refresh token request failed:', err);
    localStorage.clear();
    return null;
  }
};