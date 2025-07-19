export const useAuth = () => {
  const isLoggedIn = localStorage.getItem('IsLoggedIn') === 'TRUE';
  return isLoggedIn;
};
