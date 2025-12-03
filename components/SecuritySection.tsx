// SecuritySection.js
import { useAppUser } from '@/context/auth.context';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Switch } from 'react-native';

export default function SecuritySection() {
    const { user } = useAppUser();
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const confirm = (title: any, message: any, onYes: any) => {
        Alert.alert(title, message, [
            { text: "Cancel", style: "cancel" },
            { text: "Yes", onPress: onYes },
        ]);
    };

    const handleToggleTwoFactor = () => {
        if (!twoFactorEnabled) {
            confirm(
                "Enable Two-Factor Authentication",
                "You will need an authenticator app.",
                () => setTwoFactorEnabled(true)
            );
        } else {
            confirm(
                "Disable Two-Factor Authentication",
                "This will reduce account security.",
                () => setTwoFactorEnabled(false)
            );
        }
    };

    const handleChangePassword = () => {
        Alert.alert("Change Password", "This would open a password form.");
    };

    const handleDeactivateAccount = () => {
        confirm("Deactivate Account", "Are you sure?", () => {
            Alert.alert("Account Deactivation", "Process would start here.");
        });
    };

    const handleDeleteAccount = () => {
        confirm("Delete Account", "This action is permanent.", () => {
            confirm("Final Confirmation", "Delete your account permanently?", () => {
                Alert.alert("Account Deleted", "Process would start here.");
            });
        });
    };

    return (
        <View style={styles.container}>
            <View style={styles.headerRow}>
                {/* <Shield size={20} color="#111827" /> */}
                <Text style={styles.headerText}>Security & Privacy</Text>
            </View>

            <View style={styles.section}>
                {/* Change Password */}
                <TouchableOpacity style={styles.rowButton} onPress={handleChangePassword}>
                    <View style={styles.rowLeft}>
                        {/* <Key size={20} color="#374151" /> */}
                        <Text style={styles.rowText}>Change Password</Text>
                    </View>
                    {/* <ChevronRight size={20} color="#9ca3af" /> */}
                </TouchableOpacity>

                {/* Two Factor Authentication */}
                <View style={styles.rowSwitch}>
                    <View style={styles.rowLeft}>
                        {/* <Smartphone size={20} color="#374151" /> */}
                        <View>
                            <Text style={styles.rowText}>Two-Factor Authentication</Text>
                            {twoFactorEnabled && <Text style={styles.enabledText}>Enabled</Text>}
                        </View>
                    </View>

                    <Switch
                        value={twoFactorEnabled}
                        onValueChange={handleToggleTwoFactor}
                        trackColor={{ false: "#9ca3af", true: "#16a34a" }}
                        thumbColor="#ffffff"
                    />
                </View>
            </View>

            {/* Danger Zone */}
            <View style={styles.dangerZone}>
                <View style={styles.dangerTitle}>
                    {/* <AlertTriangle size={20} color="#dc2626" /> */}
                    <Text style={styles.dangerText}>Danger Zone</Text>
                </View>

                {!showDeleteConfirm ? (
                    <TouchableOpacity
                        style={styles.dangerButton}
                        onPress={() => setShowDeleteConfirm(true)}
                    >
                        <Text style={styles.rowText}>Account Management</Text>
                    </TouchableOpacity>
                ) : (
                    <View style={styles.dangerBox}>
                        <Text style={styles.dangerMessage}>Choose an action:</Text>

                        <TouchableOpacity style={styles.orangeButton} onPress={handleDeactivateAccount}>
                            <Text style={styles.buttonText}>Deactivate Account</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.redButton} onPress={handleDeleteAccount}>
                            <Text style={styles.buttonText}>Delete Account Permanently</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowDeleteConfirm(false)}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        padding: 16,
        borderRadius: 16,
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
    },
    headerText: {
        fontSize: 18,
        fontWeight: "600",
        color: "#111827",
    },
    section: {
        gap: 12,
    },
    rowButton: {
        backgroundColor: "#f3f4f6",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    rowLeft: {
        flexDirection: "row",
        gap: 10,
        alignItems: "center",
    },
    rowText: {
        color: "#374151",
        fontSize: 15,
    },
    rowSwitch: {
        backgroundColor: "#f3f4f6",
        padding: 12,
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    enabledText: {
        color: "#16a34a",
        fontSize: 13,
    },
    dangerZone: {
        marginTop: 20,
        borderTopWidth: 1,
        borderColor: "#e5e7eb",
        paddingTop: 16,
    },
    dangerTitle: {
        flexDirection: "row",
        gap: 8,
        alignItems: "center",
        marginBottom: 12,
    },
    dangerText: {
        fontSize: 16,
        color: "#dc2626",
        fontWeight: "600",
    },
    dangerButton: {
        backgroundColor: "#f3f4f6",
        padding: 12,
        borderRadius: 10,
    },
    dangerBox: {
        backgroundColor: "#fee2e2",
        padding: 14,
        borderRadius: 10,
        gap: 10,
    },
    dangerMessage: {
        color: "#dc2626",
        marginBottom: 6,
        fontWeight: "500",
    },
    orangeButton: {
        backgroundColor: "#ea580c",
        padding: 12,
        borderRadius: 8,
    },
    redButton: {
        backgroundColor: "#dc2626",
        padding: 12,
        borderRadius: 8,
    },
    cancelButton: {
        backgroundColor: "#e5e7eb",
        padding: 12,
        borderRadius: 8,
    },
    buttonText: {
        color: "white",
        textAlign: "center",
        fontWeight: "600",
    },
    cancelText: {
        textAlign: "center",
        color: "#374151",
        fontWeight: "500",
    },
});
