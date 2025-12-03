// src/components/Header.js
import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import { colors } from '@/utils/colors';
import { Ionicons } from '@expo/vector-icons';

export default function Header() {
    return (
        <View style={styles.container}>
            <Text
                style={styles.title}
            >
                Community App
            </Text>

            <View style={styles.right}>
                <Pressable
                    onPress={() => { /* open notifications */ }}
                    style={{ marginRight: 12 }}
                >
                    <Ionicons name="notifications-outline" size={24} color={colors.textPrimary} />
                </Pressable>

                <Pressable
                    onPress={() => { /* open profile */ }}
                >
                    <Image style={styles.avatar} source={{ uri: 'https://i.pravatar.cc/100' }} />
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        height: 72,
        paddingHorizontal: 16,
        backgroundColor: colors.background,
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: '700'
    },
    right: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: colors.card,
    }
});
