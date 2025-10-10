import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { performRefresh } from '../utils/refreshService';
import { getRefreshToken } from '../utils/storage';
import tokenStore from '../utils/tokenStore';
import { setRefreshHandler, setSignOutHandler } from '../utils/authBridge';

type AuthContextType = {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  getAccessToken: () => string | null;
  isAuthenticated: boolean;
  refresh: () => Promise<string | null>;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessTokenState] = useState<string | null>(() =>
    localStorage.getItem('token')
  );

  const tokenRef = useRef<string | null>(accessToken);
  useEffect(() => {
    tokenRef.current = accessToken;
  }, [accessToken]);

  const setAccessToken = (token: string | null) => {
    setAccessTokenState(token);
    tokenRef.current = token;
    if (token) {
      tokenStore.setToken(token);
    } else {
      tokenStore.setToken(null);
    }
  };

  const getAccessToken = () => tokenRef.current;

  const isAuthenticated = !!accessToken;

  // refresh deduplication: only one refresh in-flight at a time
  let refreshPromiseRef = useRef<Promise<string | null> | null>(null);

  const refresh = async (): Promise<string | null> => {
    if (refreshPromiseRef.current) return refreshPromiseRef.current;

    const p = (async () => {
      try {
        const res = await performRefresh();
        if (!res) return null;

        setAccessToken(res.accessToken);
        return res.accessToken;
      } finally {
        refreshPromiseRef.current = null;
      }
    })();

    refreshPromiseRef.current = p;
    return p;
  };

  const signOut = () => {
    setAccessToken(null);
    // clear refresh token and other stored data
    localStorage.clear();
  };

  const emitSingOutEvent = () => {
    window.dispatchEvent(new Event('app:logout'));
  };

  // register handlers for external modules (e.g. apolloClient) to call
  useEffect(() => {
    setRefreshHandler(refresh);
    setSignOutHandler(signOut);

    return () => {
      setRefreshHandler(null);
      setSignOutHandler(null);
    };
  }, []);

  useEffect(() => {
    // if we don't have an access token but we have a refresh token, try to refresh silently.
    if (!accessToken && getRefreshToken()) {
      // attempt silent refresh using provider's deduped refresh
      refresh().catch(() => {
        /* ignore */
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        getAccessToken,
        isAuthenticated,
        refresh,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};

export default AuthContext;
