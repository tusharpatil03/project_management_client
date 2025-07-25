export const refreshToken = async (): Promise<Boolean> => {
  const refreshToken = localStorage.getItem('refreshToken');
  if (!refreshToken) {
    console.error('Refresh Token not found');
    return false;
  }

  const res = await fetch('http://localhost:4000/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${refreshToken}`,
    },
    body: JSON.stringify({
      query: `mutation RefreshToken($refreshToken: String!) {
                refreshToken(refreshToken: $refreshToken) {
                    accessToken
                    refreshToken
                }
            }`,
      variables: {
        refreshToken,
      },
    }),
  });

  const { data, errors } = await res.json();
  if (errors) {
    console.error('Error refreshing token:', errors);
    return false;
  }

  if (!data.refreshToken.accessToken || !data.refreshToken.refreshToken) {
    console.error('Invalid response structure in RefreshTokenMutation :', data);
    return false;
  }
  console.log('refresh token success');
  localStorage.setItem('token', data.refreshToken.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken.refreshToken);

  return true;
};
