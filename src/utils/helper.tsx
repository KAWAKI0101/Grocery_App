import { useAuthStore } from "@state/authStore";
import { mmkv } from "@state/Storage";

// utils/AuthHelpers.ts
export const restoreAuthFromMMKV = () => {
  const accessToken = mmkv.getString('accessToken');
  const refreshToken = mmkv.getString('refreshToken');
  const userStr = mmkv.getString('user');
  const user = userStr ? JSON.parse(userStr) : null;

  if (accessToken && refreshToken) {
    const { setTokens, setUser } = useAuthStore.getState();
    setTokens(accessToken, refreshToken);
    if (user) setUser(user);
    return true;
  }

  return false;
};
