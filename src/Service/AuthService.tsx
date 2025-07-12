import { mmkv } from "@state/Storage"; // ✅ use consistent MMKV instance
import { BASE_URL } from "./config";
import axios from "axios";
import { useAuthStore } from "@state/authStore";
import { resetAndNavigate } from "@utils/NavigationUtils";
import { appAxios } from "./apiInterceptors";

interface CustomerLoginResponse {
    accessToken: string;
    refreshToken: string;
    customer: any;
}

interface DeliveryLoginResponse {
    accessToken: string;
    refreshToken: string;
    deliveryPartner: any;
}

export const customerLogin = async (phone: string) => {
    try {
        const response = await axios.post(`${BASE_URL}/customer/login`, { phone });
        const { accessToken, refreshToken, customer } = response.data;

        mmkv.set("accessToken", accessToken);
        mmkv.set("refreshToken", refreshToken);
        mmkv.set("user", JSON.stringify(customer)); // optional but useful

        // ✅ ADD THIS LOG:
        console.log("🧪 MMKV set at login:", {
            keys: mmkv.getAllKeys(),
            accessToken: mmkv.getString("accessToken"),
            refreshToken: mmkv.getString("refreshToken"),
        });

        const { setUser, setTokens } = useAuthStore.getState();
        setTokens(accessToken, refreshToken);
        setUser(customer)

        return { accessToken, refreshToken, customer }

    } catch (error) {
        console.log("Login Error", error);
        throw error;
    }
};


export const deliveryLogin = async (
  email: string,
  password: string
) => {
  try {
    const response = await axios.post(`${BASE_URL}/delivery/login`, {
      email,
      password,
    });

    const { accessToken, refreshToken, deliveryPartner } = response.data;

    // ✅ Persist to MMKV
    mmkv.set("accessToken", accessToken);
    mmkv.set("refreshToken", refreshToken);
    mmkv.set("user", JSON.stringify(deliveryPartner)); // Optional, but useful

    // ✅ Update Zustand store
    const { setUser, setTokens } = useAuthStore.getState();
    setTokens(accessToken, refreshToken);
    setUser(deliveryPartner);

    // ✅ Debug log to confirm tokens are saved
    console.log("🧪 MMKV set at login:", {
      keys: mmkv.getAllKeys(),
      accessToken: mmkv.getString("accessToken"),
      refreshToken: mmkv.getString("refreshToken"),
    });

    return { accessToken, refreshToken, deliveryPartner };
  } catch (error) {
    console.log("❌ Login Error", error);
    throw error;
  }
};

export const refresh_tokens = async () => {
    try {
        const refreshToken = mmkv.getString("refreshToken");
        if (!refreshToken) throw new Error("No refresh token");

        const response = await axios.post(`${BASE_URL}/refresh-token`, {
            refreshToken,
        });

        const new_access_token = response.data.accessToken;
        const new_refresh_token = response.data.refreshToken;

        mmkv.set("accessToken", new_access_token);       // ✅ save new token
        mmkv.set("refreshToken", new_refresh_token);
        const { setTokens } = useAuthStore.getState();

        setTokens(new_access_token, new_refresh_token);

        return new_access_token;
    } catch (error) {
        console.log("❌ REFRESH TOKEN ERROR", error);
        mmkv.delete("accessToken");
        mmkv.delete("refreshToken");
        resetAndNavigate("CustomerLogin");
        return null;
    }
};

export const refetchUser = async (setUser: any) => {
    try {
        const response = await appAxios.patch(`/user`);
        const user = response.data.user;
        setUser(user);
        return user;
    } catch (error) {
        console.log("login Error", error);
        return null;
    }
};

export const UpdateUserLocation = async (data: any, setUser: any) => {
    try {
        await appAxios.patch(`/user`, data); // ✅ PATCH not GET
        await refetchUser(setUser);
    } catch (error) {
        console.log("update User Location Error", error);
    }
};
