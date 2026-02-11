import { signInAnonymouslyMethod } from '@/api/auth/auth';
import { appStaticConfig } from '@/constants/config';
import { useAppUser } from '@/context/auth.context';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Pressable, StatusBar, Text, useColorScheme, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import VideoBackground from '../VideoBackground/VideoBackground';
import { styles } from './Auth.styles';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';


const COLLAPSED_HEIGHT = 0;
const LOGIN_HEIGHT = 410;
const SIGNUP_HEIGHT = 450;
const TIMING_CONFIG = { duration: 500 };

const Auth = () => {
    const colorScheme = useColorScheme();
    const { setUser } = useAppUser();
    const [expandedForm, setExpandedForm] = useState<'login' | 'signup' | null>(null);
    const [isGuestLoading, setIsGuestLoading] = useState(false);
    const router = useRouter();

    const animatedLoginStyle = useAnimatedStyle(() => ({
        height: withTiming(expandedForm === 'login' ? LOGIN_HEIGHT : COLLAPSED_HEIGHT, TIMING_CONFIG),
        opacity: withTiming(expandedForm === 'login' ? 1 : 0, TIMING_CONFIG),
    }));

    const animatedSignupStyle = useAnimatedStyle(() => ({
        height: withTiming(expandedForm === 'signup' ? SIGNUP_HEIGHT : COLLAPSED_HEIGHT, TIMING_CONFIG),
        opacity: withTiming(expandedForm === 'signup' ? 1 : 0, TIMING_CONFIG),
    }));

    const toggleLogin = () => {
        setExpandedForm(prev => prev === 'login' ? null : 'login');
    };

    const toggleSignup = () => {
        setExpandedForm(prev => prev === 'signup' ? null : 'signup');
    };

    const handleGuestLogin = async () => {
        try {
            setIsGuestLoading(true);
            const user = await signInAnonymouslyMethod();

            if (user) {
                setUser(user);

                setTimeout(() => {
                    router.replace('/(tabs)');
                }, appStaticConfig.pages.login_timeout)
            }
        } catch (error) {
            console.error('Guest login failed:', error);
        } finally {
            setIsGuestLoading(false);
        }
    };

    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={[styles.container, { backgroundColor: isDarkMode ? '#0f0f12' : '#f8f9fa' }]}>
            <VideoBackground />
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <View style={styles.overlay}>
                <View style={styles.contentContainer}>
                    <View style={styles.headerSection}>
                        <Text style={[styles.welcomeText, { color: isDarkMode ? '#fff' : '#1a1a1a' }]}>
                            Welcome Back
                        </Text>
                        <Text style={[styles.subtitle, { color: isDarkMode ? '#a0a0a0' : '#6c757d' }]}>
                            Join our community and make a difference today
                        </Text>
                    </View>

                    <View style={styles.buttonContainer}>
                        <Pressable
                            style={({ hovered }) => [
                                styles.button,
                                styles.loginButton,
                                expandedForm === 'login' && styles.activeButton,
                                hovered && styles.loginButtonHovered,
                            ]}
                            onPress={toggleLogin}
                        >
                            <Text style={styles.buttonLabel}>Login</Text>
                        </Pressable>

                        {expandedForm === 'login' && (
                            <Animated.View style={[styles.box, animatedLoginStyle]}>
                                <LoginForm />
                            </Animated.View>
                        )}

                        <Pressable
                            style={[
                                styles.button,
                                styles.secondaryButton,
                                expandedForm === 'signup' && styles.activeButton,
                            ]}
                            onPress={toggleSignup}
                        >
                            <Text style={styles.buttonLabel}>Sign Up</Text>
                        </Pressable>

                        {expandedForm === 'signup' && (
                            <Animated.View style={[styles.box, animatedSignupStyle]}>
                                <SignupForm />
                            </Animated.View>
                        )}

                        <Pressable
                            style={[styles.button, styles.guestButton, { backgroundColor: isDarkMode ? '#1e1e24' : '#e9ecef' }]}
                            onPress={handleGuestLogin}
                            disabled={isGuestLoading}
                        >
                            {isGuestLoading ? (
                                <ActivityIndicator color={isDarkMode ? "#fff" : "#000"} />
                            ) : (
                                <Text style={[styles.buttonLabel, { color: isDarkMode ? '#fff' : '#495057' }]}>Enter as guest</Text>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default Auth;
