// mmkvStorageForZustand.ts
import { mmkv } from './Storage';
import { StateStorage } from 'zustand/middleware';

export const zustandMMKVStorage: StateStorage = {
  getItem: (name: string): string | null => {
    const value = mmkv.getString(name);
    return value ?? null;
  },
  setItem: (name: string, value: string) => {
    mmkv.set(name, value);
  },
  removeItem: (name: string) => {
    mmkv.delete(name);
  },
};
