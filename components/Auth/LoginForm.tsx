import { login, siginWithEmailPasswrodMethod } from '@/api/auth/auth';
import { appStaticConfig } from '@/constants/config';
import { useAppUser } from '@/context/auth.context';
import { useToast } from '@/context/toast.context';
import IUser from '@/interface/user.interface';
import { colors } from '@/utils/colors';
import { CircularProgress } from '@expo/ui/jetpack-compose';
import { GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './LoginForm.styles';
import { AuthErrorCodes } from 'firebase/auth';

const LoginForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { setUser, setLoading, loading } = useAppUser();
    const { showError } = useToast();

    const handleGoogleLogin = async () => {
        setLoading(true);
        try {
            const data = await login();

            if (data !== null) {
                setUser(data as IUser);

                setTimeout(() => {
                    setLoading(false)
                    router.replace('/(tabs)');
                }, appStaticConfig.pages.login_timeout)
            }

        } catch (error) {
            alert(`An error occured in login proccess: ${error}`)
            setLoading(false);
        }
    }

    const handleEmailPasswordLogin = async () => {
        try {
            const data = await siginWithEmailPasswrodMethod({ email, password });

            if (data) {
                setUser(data);

                setTimeout(() => {
                    setLoading(false);
                    router.replace('/(tabs)');
                }, appStaticConfig.pages.login_timeout)
            }
        } catch (error: any) {
            console.log({ error })
            setLoading(false);
            const errorMessage = error?.code || error?.message || 'Unknown error';
            console.log(error?.code, error?.message, 'Unknown error')
            if (errorMessage === AuthErrorCodes.INVALID_LOGIN_CREDENTIALS) {
                showError(`Login error: Invalid credentials, check information or signup.`)
            }
        }
    }

    return (
        <View style={styles.loginFormContainer}>

            <Text style={styles.continueText}>Continue With</Text>

            <View style={styles.socialConnection}>

                {loading ? (
                    <CircularProgress color={colors.progress} />
                ) :
                    (<Pressable
                        onPress={handleGoogleLogin}
                        style={({ pressed }) => [
                            styles.googleButton,
                            pressed && {
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
                                transform: [{ scale: 0.98 }]
                            }
                        ]}
                    >
                        <GoogleSigninButton
                            color={'dark'}
                            style={{ width: '100%', height: 48 }}
                            pointerEvents="none"
                        />
                    </Pressable>)
                }


                <Pressable style={styles.cell}>
                    <Text style={styles.cellText}>Facebook (soon)</Text>
                </Pressable>

                <Pressable style={styles.bottomCell}>
                    <Text style={styles.cellText}>Apple (soon)</Text>
                </Pressable>
            </View>

            <View style={styles.divider}>
                <Text style={styles.dividerText}>Or</Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput
                    placeholderTextColor={'#888'}
                    style={styles.input}
                    placeholder='Email address'
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                />

                <TextInput
                    placeholderTextColor={'#888'}
                    style={styles.input}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                />

                <Pressable
                    onPress={() => handleEmailPasswordLogin()}
                    style={({ hovered }) => [
                        styles.submitButton,
                        hovered && styles.submitButtonHovered
                    ]}
                >
                    <Text style={styles.buttonLabel}>Sign In</Text>
                </Pressable>

            </View>
        </View>
    )
}

export default LoginForm;
