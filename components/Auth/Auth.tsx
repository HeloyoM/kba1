import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, useColorScheme, View } from 'react-native';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import Animated, {
    useAnimatedStyle,
    withTiming,
} from 'react-native-reanimated';

const COLLAPSED_HEIGHT = 0;
const EXPANDED_HEIGHT = 300;
const TIMING_CONFIG = { duration: 500 };

const Auth = () => {
    const colorScheme = useColorScheme();
    const [expandLogin, setExpandLogin] = useState<boolean>(false);
    const [expandSignup, setExpandSignup] = useState<boolean>(false);

    const animatedStyle = useAnimatedStyle(() => ({
        height: withTiming(expandLogin ? EXPANDED_HEIGHT : COLLAPSED_HEIGHT, TIMING_CONFIG),
    }));

    const animatedSignupStyle = useAnimatedStyle(() => ({
        height: withTiming(expandSignup ? 200 : COLLAPSED_HEIGHT, TIMING_CONFIG),
    }));

    return (
        <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: 3,
        }}>
            <Text style={{ color: colorScheme === 'dark' ? '#fff' : '#000' }}>Welcome</Text>
            <Pressable
                style={({ hovered }) => [
                    {
                        backgroundColor: '#8a3ffc',
                        width: '95%',
                        borderRadius: 12,
                        height: 43,
                    },
                    hovered && {
                        backgroundColor: '#7433d4',
                    },
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
                style={{
                    backgroundColor: '#3a3a3a',
                    width: '95%',
                    borderRadius: 12,
                    height: 43
                }}
                onPress={() => setExpandSignup((prev) => !prev)}>
                <Text style={styles.buttonLabel}>Sign Up</Text>
            </Pressable>
            {expandSignup &&
                <Animated.View style={[styles.box, animatedSignupStyle]}>
                    <SignupForm />
                </Animated.View>
            }
            <Pressable
                style={{
                    backgroundColor: '#3a3a3a',
                    width: '95%',
                    borderRadius: 12,
                    height: 43
                }}>
                <Text style={styles.buttonLabel}>Enter as guest</Text>
            </Pressable>
        </View >
    )
}

export default Auth;

const styles = StyleSheet.create({
    buttonLabel: {
        color: '#fff',
        margin: 'auto',
    },
    container: {
        paddingTop: 80,
        paddingHorizontal: 24,
    },
    box: {
        // width: '100%',
        overflow: 'hidden',
        // backgroundColor: '#eee',
        marginTop: 16,
    },
})