
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/utils/colors';
import Profile from './profile';

export default function Events() {
  return (
    <View style={styles.container}>
      <Profile />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: colors.background, justifyContent:'center', alignItems:'center' },
  text: { color: colors.textSecondary }
});
