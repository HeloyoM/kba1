import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAppUser } from '@/context/auth.context';
import { colors } from '@/utils/colors';
import { CircularProgress } from '@expo/ui/jetpack-compose';
import Menu from '@/components/Menu/Menu';

export default function HomeScreen() {
  const { user, loading } = useAppUser();

  if (user === null) {
    return <Redirect href="/auth" />;
  }

  if (loading) return (
    <CircularProgress
      progress={0.5}
      style={{ width: 300 }}
      color="blue"
      elementColors={{ trackColor: '#cccccc' }}
    />
  )

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.greeting}>Hello, {user.givenName} 👋</Text>
          <Text style={styles.subtitle}>Here's what's happening today</Text>
        </View>


        <View style={styles.cardsContainer}>
          <Menu />
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  header: {
    paddingVertical: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    marginBottom: 24,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#f0f0f0',
  },
  cardsContainer: {
    paddingHorizontal: 16,
  }
});