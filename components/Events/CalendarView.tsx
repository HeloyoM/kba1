import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export const CalendarView: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>
                Calendar view coming soon…
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginTop: 20,
        backgroundColor: "#f3f3f3",
        borderRadius: 12,
        alignItems: "center",
    },
    text: {
        color: "#666",
    },
});
