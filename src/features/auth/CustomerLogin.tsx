import {
    Animated,
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    Keyboard,
    Alert,
    TouchableOpacity,
    Platform
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import {
    GestureHandlerRootView,
    PanGestureHandler,
    State
} from 'react-native-gesture-handler';
import CustomSafeAreaView from '@components/global/CustomSafeAreaView';
import ProductSlider from '@components/global/login/ProductSlider';
import { Colors, Fonts, lightColors } from '@utils/Constants';
import CustomText from '@components/global/ui/CustomText';
import { resetAndNavigate } from '@utils/NavigationUtils';
import useKeyboardOffsetHeight from '@utils/useKeyboardOffsetHeight';
import LinearGradient from 'react-native-linear-gradient';
import CustomInput from '@components/global/ui/CustomInput';
import CustomButton from '@components/global/ui/CustomButton';
import { customerLogin } from '../../Service/AuthService';
import logo from '@assets/images/logo.jpeg';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { mmkv as tokenStorage } from '@state/Storage';
import { useAuthStore } from '@state/authStore';

const bottomColors = [...lightColors].reverse();

const CustomerLogin = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [gestureSequence, setGestureSequence] = useState<string[]>([]);
    const animatedValue = useRef(new Animated.Value(0)).current;
    const keyboardOffsetHeight = useKeyboardOffsetHeight();
    // const { setTokens, setUser } = useAuthStore.getState();
    const setTokens = useAuthStore((state) => state.setTokens);
const setUser = useAuthStore((state) => state.setUser);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: keyboardOffsetHeight === 0 ? 0 : -keyboardOffsetHeight * 0.84,
            duration: keyboardOffsetHeight === 0 ? 500 : 1000,
            useNativeDriver: true
        }).start();
    }, [keyboardOffsetHeight]);

    const handleGesture = ({ nativeEvent }: any) => {
        if (nativeEvent.state === State.END) {
            const { translationX, translationY } = nativeEvent;

            let direction = '';
            if (Math.abs(translationX) > Math.abs(translationY)) {
                direction = translationX > 0 ? 'right' : 'left';
            } else {
                direction = translationY > 0 ? 'down' : 'up';
            }

            const newSequence = [...gestureSequence, direction].slice(-5);
            setGestureSequence(newSequence);

            if (newSequence.join(' ') === 'up up down left right') {
                setGestureSequence([]);
                resetAndNavigate('DeliveryLogin');
            }
        }
    };


    const handleAuth = async () => {
        Keyboard.dismiss();

        if (!phoneNumber) {
            Alert.alert('Validation Error', 'Phone number is required.');
            return;
        }

        setLoading(true);

        try {
            console.log('📞 Calling customerLogin...');
            const response = await customerLogin(phoneNumber);
            const { accessToken, refreshToken, customer } = response;

            console.log('✅ Login successful. Checking MMKV token values:');
            console.log('🔐 accessToken:', tokenStorage.getString('accessToken'));
            console.log('🔐 refreshToken:', tokenStorage.getString('refreshToken'));
            console.log('📦 All Keys:', tokenStorage.getAllKeys());

            if (!accessToken || !refreshToken || !customer?.role) {
                Alert.alert('Login Failed', 'Token not received from server.');
                return;
            }
            // ✅ Save tokens and user to Zustand + MMKV
            setTokens(accessToken, refreshToken);
            setUser(customer);


            // ✅ Wait a bit to let Zustand persist to MMKV before navigating
            setTimeout(() => {
                console.log('🧪 Zustand snapshot after login:', useAuthStore.getState());
                console.log('🧪 MMKV keys after login:', tokenStorage.getAllKeys());
                console.log('🧪 MMKV auth-storage value:', tokenStorage.getString('auth-storage'));

                if (customer.role === 'Customer') {
                    resetAndNavigate('ProductDashboard');
                } else if (customer.role === 'DeliveryPartner') {
                    resetAndNavigate('DeliveryDashboard');
                } else {
                    Alert.alert('Login Failed', 'Unknown user role.');
                } 
            }, 500); // 👈 500ms is usually enough
        } catch (error) {
            console.error('Login error', error);
            Alert.alert('Login Failed', 'Check your network or try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.container}>
                <CustomSafeAreaView style={styles.container}>
                    <ProductSlider />

                    <PanGestureHandler onHandlerStateChange={handleGesture}>
                        <Animated.ScrollView
                            bounces={false}
                            style={{ transform: [{ translateY: animatedValue }] }}
                            keyboardDismissMode="on-drag"
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={styles.subContainer}
                        >
                            <LinearGradient colors={bottomColors} style={styles.gradient} />
                            <View style={styles.content}>
                                <Image source={logo} style={styles.logo} />
                                <CustomText variant="h2" fontFamily={Fonts.Bold}>
                                    Grocery Delivery App
                                </CustomText>
                                <CustomText variant="h5" fontFamily={Fonts.SemiBold} style={styles.text}>
                                    Log in or Sign up
                                </CustomText>

                                <CustomInput
                                    onChangeText={(text) => setPhoneNumber(text.slice(0, 10))}
                                    onClear={() => setPhoneNumber('')}
                                    value={phoneNumber}
                                    placeholder=" Enter mobile number"
                                    inputMode="numeric"
                                    left={
                                        <CustomText style={styles.phoneText} variant="h6" fontFamily={Fonts.SemiBold}>
                                            +91
                                        </CustomText>
                                    }
                                />

                                <CustomButton
                                    disabled={phoneNumber.length !== 10}
                                    onPress={handleAuth}
                                    loading={loading}
                                    title="Continue"
                                />
                            </View>
                        </Animated.ScrollView>
                    </PanGestureHandler>
                </CustomSafeAreaView>

                <View style={styles.footer}>
                    <SafeAreaView />
                    <CustomText fontSize={8}>
                        By Continuing, you agree to our Terms of Service & Privacy Policy
                    </CustomText>
                    <SafeAreaView />
                </View>

                <TouchableOpacity
                    style={styles.absoluteSwitchLoginButton}
                    onPress={() => resetAndNavigate('DeliveryLogin')}
                >
                    <Icon name="bike-fast" color="#000" size={RFValue(20)} />
                </TouchableOpacity>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    phoneText: {
        marginLeft: 10
    },
    absoluteSwitchLoginButton: {
        position: 'absolute',
        top: Platform.OS === 'android' ? 20 : 40,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 1, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 15,
        elevation: 10,
        padding: 20,
        borderRadius: 25,
        right: 10,
        zIndex: 99
    },
    subContainer: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        marginBottom: 30
    },
    footer: {
        borderTopWidth: 0.8,
        borderColor: Colors.border,
        paddingBottom: 10,
        zIndex: 22,
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#f8f9fc',
        width: '100%'
    },
    gradient: {
        paddingTop: 80,
        width: '100%'
    },
    content: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        backgroundColor: 'white',
        paddingHorizontal: 20,
        paddingBottom: 20
    },
    logo: {
        height: 50,
        width: 50,
        borderRadius: 40,
        marginVertical: 10
    },
    text: {
        marginTop: 2,
        marginBottom: 25,
        opacity: 0.8
    }
});

export default CustomerLogin;
