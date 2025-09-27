import { performRefresh } from './refreshService';

type RefreshFn = () => Promise<string | null>;
type SignOutFn = () => void;

let refreshHandler: RefreshFn | null = null;
let signOutHandler: SignOutFn | null = null;

export const setRefreshHandler = (fn: RefreshFn | null) => {
  refreshHandler = fn;
};

export const setSignOutHandler = (fn: SignOutFn | null) => {
  signOutHandler = fn;
};

export const callRefresh = async (): Promise<string | null> => {
  if (refreshHandler) return refreshHandler();
  const res = await performRefresh();
  return res?.accessToken ?? null;
};

export const callSignOut = (): void => {
  if (signOutHandler) return signOutHandler();
  // fallback signout: clear storage and dispatch event
  localStorage.clear();
  window.dispatchEvent(new Event('app:logout'));
};

export default { setRefreshHandler, setSignOutHandler, callRefresh, callSignOut };
