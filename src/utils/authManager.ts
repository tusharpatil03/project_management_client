
export const authState = {
    isAuthenticated: !!localStorage.getItem('token'),
    skipAuth: false,
};

export const authManager = {
    // get current authentication state
    getAuth: () => {
        const token = localStorage.getItem("token");
        return token
    },

    setAuth: (token: string) => {
        authState.isAuthenticated = true;
        authState.skipAuth = false;
        localStorage.setItem("token", token);
        // if (user) {
        //     localStorage.setItem("firstName", user.firstName);
        //     localStorage.setItem("lastName", user.lastName);
        //     localStorage.setItem("email", user.email);
        //     localStorage.setItem("avatar", user.profile.avatar);
        // }
    },

    isAuth: () => {
        if (authState.isAuthenticated) {
            return true;
        }
        else {
            return false;
        }
    },

    logout: () => {
        localStorage.clear();
        authState.isAuthenticated = false;
        authState.skipAuth = true;
        window.dispatchEvent(new Event('app:logout'));
    },

    refresh: async () => {
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
            authManager.setAuth(accessToken)
            localStorage.setItem("refreshToken", newRefreshToken);
            console.log('Token refreshed successfully');
            return accessToken;
        } catch (err) {
            console.error('Refresh token request failed:', err);
            localStorage.clear();
            return null;
        }
    }
};

export default authManager;