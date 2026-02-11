import Menu from '@/components/Menu/Menu';
import VideoBackground from '@/components/VideoBackground/VideoBackground';
import { useAppUser } from '@/context/auth.context';
import { useDemo } from '@/context/demo.context';
import { colors } from '@/utils/colors';
import { CircularProgress } from '@expo/ui/jetpack-compose';
import { Redirect } from 'expo-router';
import React, { useEffect } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { user, loading } = useAppUser();
  const { isTourActive, hasCompletedTour, startTour } = useDemo();

  useEffect(() => {
    if (!loading && user && !hasCompletedTour && !isTourActive) {
      startTour();
    }
  }, [loading, user, hasCompletedTour, isTourActive, startTour]);

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
      <VideoBackground />
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
  },
  adminSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  migrationBtn: {
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  migrationBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  }
});