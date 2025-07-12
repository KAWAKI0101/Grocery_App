// authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { mmkv, mmkvStorage } from './Storage';
// import { zustandMMKVStorage } from './mmkvStorageForZustand';


console.log("🧪 Manual MMKV check after login:");
console.log("MMKV accessToken:", mmkv.getString("accessToken")); // if you save this separately
console.log("MMKV auth-storage:", mmkv.getString("auth-storage"));

interface AuthStore {
  user: Record<string, any> | null;
  accessToken: string | null;
  refreshToken: string | null;
  isHydrated: boolean;
  setHydrated: (value: boolean) => void;
  setUser: (user: any) => void;
  setCurrentOrder: (order: any) => void;
  setTokens: (accessToken: string, refreshToken: string) => void; // ✅ Add this
  currentOrder: Record<string, any> | null;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      currentOrder: null,
      isHydrated: false,
      setHydrated: (value) => set({ isHydrated: value }),
      setUser: (user) => set({ user }),
      setTokens: (accessToken, refreshToken) => set({ accessToken, refreshToken }),
      setCurrentOrder: (order) => set({ currentOrder: order }),
      logout: () => set({
        user: null,
        currentOrder: null,
        accessToken: null,
        refreshToken: null,
      }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => mmkvStorage), // ✅ Zustand-compatible
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        currentOrder: state.currentOrder,
      }),

      onRehydrateStorage: () => (state, error) => {
        if(error) console.warn("🧨 Zustand hydration error:", error)

        console.log("🧪 Zustand Rehydrated - Before setHydrated:", {
          accessToken: state?.accessToken,
          refreshToken: state?.refreshToken,
          user: state?.user
        });

        state?.setHydrated(true);
      },
    }
  )
);
