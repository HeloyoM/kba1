// src/screens/Messages.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '@/utils/colors';

export default function Messages() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Messages (coming soon)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center' },
    text: { color: colors.textSecondary }
});
