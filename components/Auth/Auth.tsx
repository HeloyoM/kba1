import React, { useState } from 'react';
import { Pressable, Text, useColorScheme, View } from 'react-native';
import Animated, {
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';
import { styles } from './Auth.styles';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';

const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 410;
const TIMING_CONFIG = { duration: 500 };

const Auth = () => {
    const colorScheme = useColorScheme();
    const [expandLogin, setExpandLogin] = useState<boolean>(false);
    const [expandSignup, setExpandSignup] = useState<boolean>(false);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(expandLogin ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, TIMING_CONFIG),
    }));

    const animatedSignupStyle = useAnimatedStyle(() => ({
        height: withTiming(expandSignup ? 220 : COLLAPSED_HEIGHT, TIMING_CONFIG),
    }));

    const isDarkMode = colorScheme === 'dark';

    return (
        <View style={styles.container}>
            <Text style={[styles.welcomeText, { color: isDarkMode ? '#fff' : '#000' }]}>
                Welcome
            </Text>

            <Pressable
                style={({ hovered }) => [
                    styles.button,
                    styles.loginButton,
                    hovered && styles.loginButtonHovered,
                ]}
                onPress={() => setExpandLogin((prev) => !prev)}
            >
                <Text style={styles.buttonLabel}>Login</Text>
            </Pressable>

            {expandLogin &&
                <Animated.View style={[styles.box, animatedStyle]}>
                    <LoginForm />
                </Animated.View>
            }

            <Pressable
                style={[styles.button, styles.secondaryButton]}
                onPress={() => setExpandSignup((prev) => !prev)}>
                <Text style={styles.buttonLabel}>Sign Up</Text>
            </Pressable>

            {expandSignup &&
                <Animated.View style={[styles.box, animatedSignupStyle]}>
                    <SignupForm />
                </Animated.View>
            }

            <Pressable disabled style={[styles.button, styles.secondaryButton]}>
                <Text style={styles.buttonLabel}>Enter as guest</Text>
            </Pressable>
        </View >
    )
}

export default Auth;
