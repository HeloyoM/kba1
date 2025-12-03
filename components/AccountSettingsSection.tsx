// AccountSettingsSection.tsx
import { useAppUser } from "@/context/auth.context";
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Switch } from "react-native";
// import { Bell, Lock, Globe } from "lucide-react-native";

export function AccountSettingsSection() {
    const { user } = useAppUser();
    const [settings, setSettings] = useState({
        notifications: {
            push: true,
            email: true,
            messages: true,
            events: false,
        },
        privacy: {
            profileVisibility: "public",
            showActivity: true,
        },
        language: "en",
    });

    const updateNotif = (key: any) => {
        // setSettings((s) => ({
        //     ...s,
        //     notifications: { ...s.notifications, [key]: !s.notifications[key] },
        // }));
    };

    const updatePrivacy = (value: any) => {
        setSettings((s) => ({
            ...s,
            privacy: { ...s.privacy, profileVisibility: value },
        }));
    };

    return (
        <View style={styles.card}>
            <Text style={styles.title}>Account Settings</Text>

            {/* Notifications */}
            <Section icon={<></>} title="Notifications">
                <Toggle label="Push Notifications" value={settings.notifications.push} onChange={() => updateNotif("push")} />
                <Toggle label="Email Notifications" value={settings.notifications.email} onChange={() => updateNotif("email")} />
                <Toggle label="Direct Messages" value={settings.notifications.messages} onChange={() => updateNotif("messages")} />
                <Toggle label="Event Reminders" value={settings.notifications.events} onChange={() => updateNotif("events")} />
            </Section>

            {/* Privacy */}
            <Section icon={<></>} title="Privacy">
                <View style={{ marginBottom: 10 }}>
                    <Text style={styles.label}>Profile Visibility</Text>

                    <TouchableOpacity onPress={() => updatePrivacy("public")} style={styles.radioRow}>
                        <View style={[styles.radio, settings.privacy.profileVisibility === "public" && styles.radioActive]} />
                        <Text>Public</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => updatePrivacy("friends")} style={styles.radioRow}>
                        <View style={[styles.radio, settings.privacy.profileVisibility === "friends" && styles.radioActive]} />
                        <Text>Friends Only</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => updatePrivacy("private")} style={styles.radioRow}>
                        <View style={[styles.radio, settings.privacy.profileVisibility === "private" && styles.radioActive]} />
                        <Text>Private</Text>
                    </TouchableOpacity>
                </View>

                <Toggle
                    label="Show Activity Status"
                    value={settings.privacy.showActivity}
                    onChange={() =>
                        setSettings((s) => ({
                            ...s,
                            privacy: { ...s.privacy, showActivity: !s.privacy.showActivity },
                        }))
                    }
                />
            </Section>

            {/* Language */}
            <Section icon={<></>} title="Language">
                <Text style={{ fontSize: 16 }}>Current: {settings.language.toUpperCase()}</Text>
            </Section>
        </View>
    );
}

function Section({ title, icon, children }: any) {
    return (
        <View style={{ marginBottom: 22 }}>
            <View style={styles.sectionHeader}>
                {icon}
                <Text style={styles.sectionTitle}>{title}</Text>
            </View>
            <View style={{ marginLeft: 30 }}>{children}</View>
        </View>
    );
}

function Toggle({ label, value, onChange }: any) {
    return (
        <View style={styles.toggleRow}>
            <Text style={styles.toggleLabel}>{label}</Text>
            <Switch value={value} onValueChange={onChange} />
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        margin: 12,
        padding: 16,
        borderRadius: 16,
        elevation: 2,
    },
    title: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
    sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
    sectionTitle: { fontSize: 16, fontWeight: "500" },
    label: { color: "#666", marginBottom: 6 },
    toggleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: 10,
    },
    toggleLabel: { fontSize: 16 },
    radioRow: { flexDirection: "row", alignItems: "center", marginBottom: 6, gap: 8 },
    radio: {
        width: 14,
        height: 14,
        borderRadius: 7,
        borderWidth: 1,
        borderColor: "#555",
    },
    radioActive: {
        backgroundColor: "#7c3aed",
    },
});
