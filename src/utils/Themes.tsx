// utils/Theme.ts

import { DefaultTheme } from '@react-navigation/native';
import { Colors } from '../utils/Constants';

console.log("🧪 Loaded Colors object in theme:", Colors); // Debug log

export const MyCustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary,
    background: '#ffffff',
    card: '#ffffff',
    text: Colors.text,
    border: Colors.border,
    notification: Colors.primary,
  },
};
