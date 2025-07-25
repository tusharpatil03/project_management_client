// import { createBrowserHistory } from 'history';

// export const history = createBrowserHistory();

// /**
//  * Clears all auth state and sends user to landing page.
//  */
// export function logout() {
//   localStorage.clear();
//   // if using react-router, push to your landing route:
//   history.replace('/landingpage');
//   // Alternatively: window.location.href = '/landingpage';
// }

export const authState = {
    isAuthenticated: !!localStorage.getItem('token'),
    skipAuth: false,
};

export const triggerGlobalLogout = () => {
  localStorage.clear();
  authState.isAuthenticated = false;
  authState.skipAuth = true;

  window.dispatchEvent(new Event('app:logout'));
};