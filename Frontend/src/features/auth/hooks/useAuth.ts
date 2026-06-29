import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../store/store';
import {
  registerUser,
  loginUser,
  verifyOTP,
  resendOTP,
  getMe,
  logoutUser,
  clearError,
  setOtpEmail
} from '../state/auth.slice';
import { useCallback } from 'react';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const authState = useSelector((state: RootState) => state.auth);

  const register = useCallback(async (data: any) => {
    return dispatch(registerUser(data)).unwrap();
  }, [dispatch]);

  const login = useCallback(async (data: any) => {
    dispatch(setOtpEmail(data.email));
    return dispatch(loginUser(data)).unwrap();
  }, [dispatch]);

  const verify = useCallback(async (data: any) => {
    return dispatch(verifyOTP(data)).unwrap();
  }, [dispatch]);

  const resend = useCallback(async (data: any) => {
    return dispatch(resendOTP(data)).unwrap();
  }, [dispatch]);

  const fetchUser = useCallback(async () => {
    return dispatch(getMe()).unwrap();
  }, [dispatch]);

  const logout = useCallback(async () => {
    return dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  const dismissError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  return {
    ...authState,
    register,
    login,
    verify,
    resend,
    fetchUser,
    logout,
    dismissError,
  };
};
