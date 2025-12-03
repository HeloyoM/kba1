// src/screens/Home.js
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import Card from '@/components/Card';
import { colors } from '@/utils/colors';

const demo = [
    { title: 'Welcome!', subtitle: 'Community feed and announcements', accent: colors.blue },
    { title: 'New Event', subtitle: 'Shabbat dinner on Friday', accent: colors.pink },
    { title: 'Member Spotlight', subtitle: 'Say hi to our new neighbors', accent: colors.yellow },
    { title: 'Help Needed', subtitle: 'Volunteer for food delivery', accent: colors.purple }
];

export default function Home() {
    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView contentContainerStyle={{ padding: 16 }}>
                {demo.map((d, i) => <Card key={i} index={i} title={d.title} subtitle={d.subtitle} accent={d.accent} />)}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: colors.background }
});
