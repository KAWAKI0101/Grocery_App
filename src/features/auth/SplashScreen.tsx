import { StyleSheet, View, Image, Alert } from 'react-native';
import React, { FC, useEffect } from 'react';
import { Colors } from "../../utils/Constants";
import Logo from "@assets/images/logo.jpeg";
import { screenHeight, screenWidth } from '@utils/Scaling';
import { resetAndNavigate } from '@utils/NavigationUtils';
import GeoLocation from '@react-native-community/geolocation';
import { useAuthStore } from '@state/authStore';
import { jwtDecode } from 'jwt-decode';
import { refetchUser, refresh_tokens } from 'Service/AuthService';
import { mmkv } from '@state/Storage';
import { restoreAuthFromMMKV } from '@utils/helper';

// // ✅ Temporary MMKV clear
// useEffect(() => {
//   console.log("🧹 Clearing MMKV for fresh debug...");
//   mmkv.clearAll();
// }, []);


console.log("✅ SplashScreen loaded: Colors =", Colors);

GeoLocation.setRNConfiguration({
  skipPermissionRequests: false,
  authorizationLevel: "always",
  enableBackgroundLocationUpdates: true,
  locationProvider: "auto"
});

interface DecodedToken {
  exp: number;
}


const SplashScreen: FC = () => {

  const { isHydrated } = useAuthStore();

  console.log("🔥 Zustand hydrated:", isHydrated);

  const tokenCheck = async () => {
    console.log("🔍 Starting token check");

    const store = useAuthStore.getState();
    const { setTokens, setUser, accessToken, refreshToken, user: storeUser } = store;



    if (!accessToken || !refreshToken) {
      restoreAuthFromMMKV(); // ✅ Restore if needed
    }

    // const { accessToken, refreshToken, user: storeUser } = useAuthStore.getState();

    console.log("🧪 Zustand hydrated tokens/user:", {
      accessToken,
      refreshToken,
      user: storeUser
    });


    if (accessToken && refreshToken) {
      const decodedAccessToken = jwtDecode<DecodedToken>(accessToken);
      const decodedRefreshToken = jwtDecode<DecodedToken>(refreshToken);
      const currentTime = Date.now() / 1000;

      if (decodedRefreshToken?.exp < currentTime) {
        console.warn("❌ Refresh token expired");
        Alert.alert("Session Expired", "Please login again");
        return resetAndNavigate("CustomerLogin");
      }

      if (decodedAccessToken?.exp < currentTime) {
        try {
          console.log("🔁 Refreshing access token...");
          await refresh_tokens();
        } catch (error) {
          console.error("❌ Error refreshing token:", error);
          Alert.alert("Token refresh failed", "Please login again.");
          return resetAndNavigate("CustomerLogin");
        }
      }

      const freshUser = useAuthStore.getState().user;

      if (freshUser?.role === "Customer") {
        return resetAndNavigate("ProductDashboard");
      } else if (freshUser?.role === "DeliveryPartner") {
        return resetAndNavigate("DeliveryDashboard");
      } else {
        const fetchedUser = await refetchUser(setUser);
        console.log("📦 fetchedUser:", fetchedUser);

        if (fetchedUser?.role === "Customer") {
          return resetAndNavigate("ProductDashboard");
        } else if (fetchedUser?.role === "DeliveryPartner") {
          return resetAndNavigate("DeliveryDashboard");
        } else {
          console.warn("❌ No valid user role found. Redirecting to login.");
          return resetAndNavigate("CustomerLogin");
        }
      }
    } else {
      console.log("❗ No tokens found, navigating to login.");
      return resetAndNavigate("CustomerLogin");
    }
  };



  useEffect(() => {
    const intialStartup = async () => {
      if (!isHydrated) return;

      // ✅ Manually restore if Zustand store is empty
      if (!useAuthStore.getState().accessToken || !useAuthStore.getState().refreshToken) {
        console.log("🧪 Attempting manual MMKV restore");
        restoreAuthFromMMKV();

        // Wait 100ms to give Zustand time to update before proceeding
        await new Promise(res => setTimeout(res, 100));
      }
      try {
        GeoLocation.requestAuthorization();
        await tokenCheck(); // ✅ Await here

      } catch (error) {
        Alert.alert("Location Permission Required", "Sorry, we need location service to give you a better shopping experience.");
        console.error("❌ Error in startup:", error);
      }
    };

    const timeoutId = setTimeout(() => {
      intialStartup();
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [isHydrated]);

  return (
    <View style={styles.container}>
      <Image source={Logo} style={styles.logoImage} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors?.primary || "#FDCC00",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  logoImage: {
    height: screenHeight * 0.5,
    width: screenWidth * 0.5,
    resizeMode: "contain",
    borderRadius: 1
  }
});
