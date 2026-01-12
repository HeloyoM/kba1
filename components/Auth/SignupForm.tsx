import { createWithEmailPasswrodMethod } from '@/api/auth/auth';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { styles } from './SignupForm.styles';
import { useAppUser } from '@/context/auth.context';
import IUser from '@/interface/user.interface';
import { useRouter } from 'expo-router';
import { appStaticConfig } from '../../constants/config';

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser, setLoading, loading } = useAppUser();

  const handleEmailPasswordSignup = async () => {
    setLoading(true);
    try {
      const data = await createWithEmailPasswrodMethod({ email, password });
      console.log({ data })
      if (data !== undefined) {
        setUser(data as unknown as IUser);

        setTimeout(() => {
          setLoading(false)
          router.replace('/(tabs)/profile');
        }, appStaticConfig.pages.login_timeout)
      }


    } catch (error) {
      alert(`An error occured in signup proccess: ${error}`)
      setLoading(false);
    }
  }

  return (
    <View style={styles.signupFormContainer}>
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
          onPress={handleEmailPasswordSignup}
          style={({ hovered }) => [
            styles.submitButton,
            hovered && styles.submitButtonHovered
          ]}
        >
          <Text style={styles.buttonLabel}>Sign Up</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SignupForm
