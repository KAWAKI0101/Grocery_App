import { StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { tokenStorage } from '@state/Storage'
import { resetAndNavigate } from '@utils/NavigationUtils'
import { useAuthStore } from '@state/authStore'

const ProductDashboard = () => {
  const user = useAuthStore(state => state.user)

  useEffect(() => {
    const accessToken = tokenStorage.getString('accessToken')
    if (!accessToken) {
      resetAndNavigate('CustomerLogin')
    }
  }, [])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Product Dashboard</Text>
      {user && (
        <Text style={styles.subtitle}>
          Welcome, {user?.name || user?.phone || 'Guest'}!
        </Text>
      )}
    </View>
  )
}

export default ProductDashboard

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
})
