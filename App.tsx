import React from 'react'
import Navigation from '@navigation/Navigation'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native'
import { navigationRef } from '@utils/NavigationUtils';

import { MyCustomTheme } from './src/utils/Themes'
console.log('✅ Loaded Theme:', MyCustomTheme)

const App = () => {
  if (!MyCustomTheme || !MyCustomTheme.colors?.primary) {
    console.error("❌ MyCustomTheme is undefined or malformed:", MyCustomTheme);
    // Optional: Show fallback UI or crash deliberately
    throw new Error("Theme loading failed. Check @utils/Themes import.");
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer theme={MyCustomTheme}> 
        <Navigation />
      </NavigationContainer>
    </GestureHandlerRootView>
  )
}

export default App

