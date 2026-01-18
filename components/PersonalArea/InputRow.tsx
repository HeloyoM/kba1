import React from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";

interface InputRowProps {
    label: string;
    icon: React.ReactNode;
    value: string;
    displayValue: string;
    editing: boolean;
    onChange: (text: string) => void;
    error?: string;
}

export function InputRow({ label, icon, value, displayValue, editing, onChange, error }: InputRowProps) {
    return (
        <View style={{ marginBottom: 16 }}>
            <View style={styles.labelRow}>
                {icon}
                <Text style={styles.label}>{label}</Text>
            </View>

            {editing ? (
                <>
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        style={[styles.input, error ? { borderColor: "red" } : undefined]}
                    />
                    {error && <Text style={styles.error}>{error}</Text>}
                </>
            ) : (
                <Text style={styles.data}>{displayValue}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
    label: { color: "#666" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
    },
    data: { fontSize: 16, color: "#222" },
    error: { color: "red", marginTop: 4 },
});
