const REFRESH_KEY = 'refreshToken';
// const EMAIL_KEY = 'Email';

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setRefreshToken = (token: string) => localStorage.setItem(REFRESH_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_KEY);

// export const removeEmail = () => localStorage.removeItem(EMAIL_KEY);

export const clearAll = () => localStorage.clear();

export default { getRefreshToken, setRefreshToken, removeRefreshToken, clearAll };

interface InterfaceUserData {
    email: string,
    setEmail(email: string): void;
    getEmail(): string;
}

export const UserData: InterfaceUserData = {
    email: '',
    setEmail(email: string) {
        this.email = email;
    },
    getEmail() {
        return this.email
    }
}