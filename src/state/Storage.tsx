// Storage.ts
import { MMKV } from 'react-native-mmkv';

export const mmkv = new MMKV({
  id: 'app-storage',
  encryptionKey: 'some_secret_key',
});

// ✅ Use same instance everywhere (alias if you want)
// export const mmkv = mmkvInstance; 
export const tokenStorage = mmkv;



// ✅ Pass this directly to Zustand 
export const mmkvStorage = {
  getItem: (key: string): string | null => {
    const value = mmkv.getString(key);
    return value ?? null;

  },
  setItem: (key: string, value: string): void => {
    mmkv.set(key, value);
  },
  removeItem: (key: string): void => {
    mmkv.delete(key);
  },
};