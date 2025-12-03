import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Pressable } from 'react-native'
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { getUsersList } from '@/api/users';

const Auth = () => {
    const [expandLogin, setExpandLogin] = useState<boolean>(true);
    const [expandSignup, setExpandSignup] = useState<boolean>(false);

    useEffect(() => {
        getUsersList()
    }, [])
    return (
        <View style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            height: '100%',
            gap: 3,
            borderBlockColor: 'red',
            borderColor: 'red',
            borderCurve: 'circular',
            borderWidth: 1.5,
        }}>
            <Text style={{ color: '#000' }}>Welcome</Text>
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
            {expandLogin && <LoginForm />}

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
            {expandSignup && <SignupForm />}
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

    }
})