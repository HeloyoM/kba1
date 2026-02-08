import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useAppUser } from '@/context/auth.context';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { validateToken } from '@/utils/otp';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function AdminLoginScreen() {
    const { user, setAdminAuthenticated } = useAppUser();
    const router = useRouter();
    const colorScheme = useColorScheme() ?? 'light';
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);

    const handleVerify = async () => {
        console.log(token, user?.totpSecret)
        if (token.length !== 6) {
            Alert.alert('Invalid Code', 'Please enter a 6-digit code.');
            return;
        }

        if (!user?.totpSecret) {
            Alert.alert('Error', 'No TOTP secret found for your account. Please contact system administrator.');
            return;
        }

        setLoading(true);
        try {
            const isValid = await validateToken(token, user.totpSecret);
            if (isValid) {
                setAdminAuthenticated(true);
                router.replace('/admin');
            } else {
                Alert.alert('Invalid Code', 'The code you entered is incorrect. Please try again.');
            }
        } catch (error) {
            Alert.alert('Error', 'An error occurred during verification.');
        } finally {
            setLoading(false);
        }
    };
    console.log({ token })
    return (
        <View style={[styles.container, { backgroundColor: Colors[colorScheme].background }]}>
            <View style={styles.content}>
                <IconSymbol name="lock.fill" size={60} color={Colors[colorScheme].tint} />
                <Text style={[styles.title, { color: Colors[colorScheme].text }]}>Admin Verification</Text>
                <Text style={[styles.subtitle, { color: Colors[colorScheme].text }]}>
                    Enter the 6-digit code from your Google Authenticator app.
                </Text>

                <TextInput
                    style={[styles.input, { color: Colors[colorScheme].text, borderColor: Colors[colorScheme].tint }]}
                    placeholder="000000"
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    keyboardType="number-pad"
                    maxLength={6}
                    value={token}
                    onChangeText={setToken}
                    autoFocus
                />

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: Colors[colorScheme].tint }]}
                    onPress={handleVerify}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.buttonText}>Verify and Login</Text>
                    )}
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} style={styles.cancelButton}>
                    <Text style={{ color: Colors[colorScheme].text, opacity: 0.7 }}>Cancel</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    content: {
        alignItems: 'center',
        padding: 20,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 30,
        opacity: 0.8,
    },
    input: {
        width: '100%',
        height: 60,
        borderWidth: 2,
        borderRadius: 12,
        fontSize: 32,
        textAlign: 'center',
        letterSpacing: 8,
        marginBottom: 20,
    },
    button: {
        width: '100%',
        height: 50,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 18,
        fontWeight: '600',
    },
    cancelButton: {
        marginTop: 20,
    }
});
