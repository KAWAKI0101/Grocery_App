import { StyleSheet } from 'react-native'
import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import SplashScreen from '@features/auth/SplashScreen'
import DeliveryLogin from '@features/auth/DeliveryLogin'
import CustomerLogin from '@features/auth/CustomerLogin'
import ProductDashboard from '@features/DashBoard/ProductDashboard'
import DeliveryDashboard from '@features/delivery/DeliveryDashboard'

const Stack = createNativeStackNavigator()

const Navigation = () => {
  return (
    <Stack.Navigator
      initialRouteName='SplashScreen'
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name='SplashScreen' component={SplashScreen} />
      <Stack.Screen name='ProductDashboard' component={ProductDashboard} />
      <Stack.Screen name='DeliveryDashboard' component={DeliveryDashboard} />
      <Stack.Screen
        options={{ animation: 'fade' }}
        name='DeliveryLogin'
        component={DeliveryLogin}
      />
      <Stack.Screen
        options={{ animation: 'fade' }}
        name='CustomerLogin'
        component={CustomerLogin}
      />
    </Stack.Navigator>
  )
}

export default Navigation

const styles = StyleSheet.create({})
