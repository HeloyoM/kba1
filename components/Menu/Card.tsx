// src/components/Card.js
import { colors } from '@/utils/colors';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  title: string
  subtitle: string | React.ReactNode
  accent: string
  index: number
}
export default function Card({ title, subtitle, accent = colors.blue, index = 0 }: Props) {
  return (
    <View style={[styles.card, { backgroundColor: colors.card }]}>
      <View style={[styles.accent, { backgroundColor: accent }]} />
      <Text style={styles.title}>{title}</Text>
      {typeof subtitle === 'string' ? (
        <Text style={styles.sub}>{subtitle}</Text>
      ) : (
        subtitle
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    marginBottom: 16,
    overflow: 'hidden'
  },
  accent: {
    position: 'absolute',
    right: -30,
    top: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    opacity: 0.12,
  },
  title: { color: colors.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 6 },
  sub: { color: colors.textSecondary, fontSize: 14 }
});
