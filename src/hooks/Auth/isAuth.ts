import { authState } from '../../utils/logout';

export const useAuth = () => {
  const isLoggedIn = authState.isAuthenticated ? true : false;
  return isLoggedIn;
};
