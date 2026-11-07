import AccountLoadingState from './AccountLoadingState';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getToken } from '../utils/storage';
import { setToken, refreshUserData, logout } from '../store/authSlice';
import { AppDispatch, RootState } from '../store/store';

/** The account response hydrates identity, subscription and allowances together. */
export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((state: RootState) => state.auth.token);
  const hasUser = useSelector((state: RootState) => !!state.auth.user);
  const [restoring, setRestoring] = useState(() => !!(token || getToken()));
  const boot = useRef(true);
  const checkedToken = useRef<string | null>(null);

  useEffect(() => {
    if (boot.current) {
      boot.current = false;
      if (!token) {
        const cookie = getToken();
        if (cookie) {
          dispatch(setToken(cookie));
          return;
        }
        if (hasUser) dispatch(logout());
      }
    }

    if (!token) {
      checkedToken.current = null;
      setRestoring(false);
      return;
    }
    if (checkedToken.current === token) return;
    checkedToken.current = token;

    void dispatch(refreshUserData()).unwrap().catch(() => {
      // Rejected sessions are cleared by the API client. Temporary failures
      // leave the signed-in account available.
    }).finally(() => {
      if (checkedToken.current === token) setRestoring(false);
    });
  }, [dispatch, token, hasUser]);

  return restoring ? <AccountLoadingState /> : <>{children}</>;
}
