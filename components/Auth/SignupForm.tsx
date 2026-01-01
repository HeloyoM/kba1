import React, { useState } from 'react';
import { sigupWithEmailPasswrodMethod } from '@/api/auth/auth';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

const SignupForm = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  return (
    <View style={styles.loginFormContainer}>
      <View style={{ marginTop: 15, marginBottom: 15, gap: 8, display: 'flex', alignItems: 'center', }}>
        <TextInput
          placeholderTextColor={'#ededed'}
          style={{ backgroundColor: '#0d0d0d', paddingLeft: 16, color: '#ededed', borderRadius: 12, width: '100%' }}
          placeholder='Email address'
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholderTextColor={'#ededed'}
          style={{ backgroundColor: '#0d0d0d', paddingLeft: 16, color: '#fff', borderRadius: 12, width: '100%' }}
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
        >
          <Text style={styles.buttonLabel}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SignupForm


const styles = StyleSheet.create({
  loginFormContainer: {
    backgroundColor: '#1a1a1a',
    display: 'flex',
    borderRadius: 12,
    margin: 2,
    padding: 12,
    width: 320
    // height: 'auto'
  },
  buttonLabel: {
    color: '#fff',
    margin: 'auto',
    fontSize: 19
  }
})