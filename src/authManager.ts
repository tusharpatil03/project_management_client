import { InterfaceUser } from "./types/types";


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

    // isAuth: () => {
    //     const token = localStorage.getItem('token');
    //     if (!token) {
    //         return false;
    //     }
    //     return true;
    // },

    // set the authentication state
    setAuth: (token: string, user: InterfaceUser | undefined) => {
        authState.isAuthenticated = true;
        authState.skipAuth = false;
        localStorage.setItem("token", token);
        if (user) {
            localStorage.setItem("firstName", user.firstName);
            localStorage.setItem("lastName", user.lastName);
            localStorage.setItem("email", user.email);
            localStorage.setItem("avatar", user.profile.avatar);
        }
    },

    logout: () => {
        localStorage.clear();
        authState.isAuthenticated = false;
        authState.skipAuth = true;
        window.dispatchEvent(new Event('app:logout'));
    }
};

export default authManager;