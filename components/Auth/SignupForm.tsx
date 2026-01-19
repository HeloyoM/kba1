import { createWithEmailPasswrodMethod, signInAnonymouslyMethod } from '@/api/auth/auth';
import { useAppUser } from '@/context/auth.context';
import IUser from '@/interface/user.interface';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { appStaticConfig } from '../../constants/config';
import { styles } from './SignupForm.styles';

const SignupForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { setUser, setLoading, loading } = useAppUser();

  const handleEmailPasswordSignup = async () => {
    setLoading(true);
    try {
      const data = await createWithEmailPasswrodMethod({ email, password });

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

  const handleGuestSignIn = async () => {
    setLoading(true);
    try {
      const data = await signInAnonymouslyMethod();
      if (data) {
        setUser(data);
        setTimeout(() => {
          setLoading(false);
          router.replace('/(tabs)/profile');
        }, appStaticConfig.pages.login_timeout);
      }
    } catch (error) {
      alert(`An error occured in guest signin: ${error}`);
      setLoading(false);
    }
  }

  return (
    <View style={styles.signupFormContainer}>
      <Text style={styles.donationMessage}>
        Join our community! By donating for the system, you get access to all features.
        Otherwise, resources will be read-only for you.
      </Text>
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

        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>OR</Text>
          <View style={styles.dividerLine} />
        </View>

        <Pressable
          onPress={handleGuestSignIn}
          style={styles.guestButton}
        >
          <Text style={styles.guestButtonLabel}>Continue as Guest</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default SignupForm
