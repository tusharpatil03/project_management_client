const REFRESH_KEY = 'refreshToken';
const EMAIL_KEY = 'email';

export const getRefreshToken = () => localStorage.getItem(REFRESH_KEY);
export const setRefreshToken = (token: string) => localStorage.setItem(REFRESH_KEY, token);
export const removeRefreshToken = () => localStorage.removeItem(REFRESH_KEY);

export const getEmail = () => localStorage.getItem(EMAIL_KEY);
export const setEmail = (email: string) => localStorage.setItem(EMAIL_KEY, email);
export const removeEmail = () => localStorage.removeItem(EMAIL_KEY);

export const clearAll = () => localStorage.clear();

export default { getRefreshToken, setRefreshToken, removeRefreshToken, getEmail, setEmail, removeEmail, clearAll };
