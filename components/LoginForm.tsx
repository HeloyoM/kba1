import { login, logout, sigupWithEmailPasswrodMethod } from '@/api/users/users';
import { useAppUser } from '@/context/auth.context';
import { GoogleSigninButton, User } from '@react-native-google-signin/google-signin';
import React, { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


const LoginForm = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const { setUser, user } = useAppUser();

    return (
        <View style={styles.loginFormContainer}>
            {user !== null && <Text style={{ color: '#fff', fontSize: 25 }}>{user.givenName}</Text>}
            <Text style={{ margin: 'auto', fontSize: 16, color: '#fff' }}>Continue With</Text>
            <View style={styles.socialConnection}>
                {/* <Pressable style={styles.cell}> */}
                <GoogleSigninButton
                    color={'dark'}
                    style={{ width: '50%' }}
                    onPress={async () => {
                        const data = await login();
                        setUser(data as unknown as User['user'])
                    }} />
                {/* </Pressable> */}
                <Pressable style={styles.cell}>
                    <Text style={{ color: '#fff' }}>Facebook</Text>
                </Pressable>
                <Pressable style={styles.bottomCell}>
                    <Text style={{ color: '#fff' }}>Apple</Text>
                </Pressable>
            </View>

            <View
                style={{
                    height: 1,
                    backgroundColor: 'rgba(0,0,0,0.1)',
                    width: '100%',
                }}
            ><Text style={{ color: 'white' }}>Or</Text></View>

            {user !== null && <Pressable
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
                onPress={logout}
            >
                <Text style={styles.buttonLabel}>logout</Text>
            </Pressable>}

            <View style={{ marginTop: 15, marginBottom: 15, gap: 8, display: 'flex', alignItems: 'center' }}>
                <TextInput
                    placeholderTextColor={'#ededed'}
                    style={{ backgroundColor: '#0d0d0d', paddingLeft: 16, color: '#ededed', borderRadius: 12, width: '75%' }}
                    placeholder='Email address'
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholderTextColor={'#ededed'}
                    style={{ backgroundColor: '#0d0d0d', paddingLeft: 16, color: '#fff', borderRadius: 12, width: '75%' }}
                    placeholder='Password'
                    value={password}
                    onChangeText={setPassword}
                />

                <Pressable
                    onPress={() => sigupWithEmailPasswrodMethod({ email, password })}
                    style={({ hovered }) => [
                        {
                            backgroundColor: '#8a3ffc',
                            width: '95%',
                            borderRadius: 12,
                            height: 43,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        },
                        hovered && {
                            backgroundColor: '#7433d4',
                        },
                    ]}
                // onPress={() => setExpandLogin((prev) => !prev)}
                >
                    <Text style={styles.buttonLabel}>Sigin</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default LoginForm;

const styles = StyleSheet.create({
    loginFormContainer: {
        backgroundColor: '#1a1a1a',
        width: '95%',
        borderRadius: 12,
        margin: 2,
        height: 'auto'
    },
    socialConnection: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
    },
    cell: {
        width: '45%',
        height: 45,
        borderRadius: 12,
        justifyContent: 'space-around',
        alignItems: 'center',
        borderWidth: 1,
        backgroundColor: '#242424'
    },
    bottomCell: {
        width: '95%',
        margin: 3,
        borderRadius: 12,
        backgroundColor: '#242424',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonLabel: {
        color: '#fff',
        margin: 'auto',
        fontSize: 19
    }
})