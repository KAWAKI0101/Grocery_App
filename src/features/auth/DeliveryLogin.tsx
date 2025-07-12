import { Alert, StyleSheet, View } from 'react-native';
import React, { FC, useState } from 'react';
import { deliveryLogin } from '../../Service/AuthService';
import { resetAndNavigate } from '@utils/NavigationUtils';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import { screenHeight } from '@utils/Scaling';
import { ScrollView } from 'react-native-gesture-handler';
import LottieView from 'lottie-react-native';
import CustomText from '@components/global/ui/CustomText';
import { Fonts } from '@utils/Constants';
import CustomInput from '@components/global/ui/CustomInput';
import Icon from 'react-native-vector-icons/Ionicons';
import { RFValue } from 'react-native-responsive-fontsize';
import CustomButton from '@components/global/ui/CustomButton';


const DeliveryLogin:FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
  setLoading(true);
  try {
    console.log("🔐 Attempting delivery login...");
    const { accessToken, refreshToken, deliveryPartner } = await deliveryLogin(email, password);

    if (!accessToken || !deliveryPartner) {
      throw new Error("Missing login credentials or user info");
    }

    if (deliveryPartner?.role !== "DeliveryPartner") {
      Alert.alert("Invalid Role", "You are not authorized as a delivery partner.");
      return;
    }

    console.log("✅ Delivery partner logged in:", deliveryPartner);
    resetAndNavigate('DeliveryDashboard');
  } catch (error) {
    console.error("❌ Delivery login error:", error);
    Alert.alert('Login Failed', 'Invalid email or password. Please try again.');
  } finally {
    setLoading(false);
  }
};


  return (
    <CustomSafeAreaView style={{ backgroundColor: 'white' }}>
      <ScrollView keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
        <View style={styles.container}>
          <View style={styles.lottieContainer}>
            <LottieView
              autoPlay
              loop
              style={styles.lottie}
              source={require('@assets/animations/delivery_man.json')}
              hardwareAccelerationAndroid={true}
            />
          </View>

          <CustomText variant="h3" fontFamily={Fonts.Bold}>
            Delivery Partner Portal
          </CustomText>
          <CustomText variant="h6" style={styles.text} fontFamily={Fonts.SemiBold}>
            Faster than Flash ⚡
          </CustomText>

          <CustomInput
            onChangeText={setEmail}
            value={email}
            left={
              <Icon name="mail" color="#F8890E" style={{ marginLeft: 10 }} size={RFValue(18)} />
            }
            placeholder="Email"
            inputMode="email"
            autoCapitalize='none'
            right={false}
          />

          <CustomInput
            onChangeText={setPassword}
            value={password}
            left={
              <Icon name="key-sharp" color="#F8890E" style={{ marginLeft: 10 }} size={RFValue(18)} />
            }
            placeholder="Password"
            secureTextEntry
            right={false}
          />

          <CustomButton
            disabled={email.length === 0 || password.length < 8}
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />
        </View>
      </ScrollView>
    </CustomSafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  lottie: {
    height: '100%',
    width: '100%',
  },
  lottieContainer: {
    height: screenHeight * 0.12,
    width: '100%',
  },
  text: {
    margin: 1,
    marginBottom: 25,
    opacity: 0.8,
  },
});

export default DeliveryLogin;
