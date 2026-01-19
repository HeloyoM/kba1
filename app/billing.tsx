import { updateUser } from '@/api/auth/users';
import { capturePayPalOrder, createPayPalOrder } from '@/api/billing/paypal';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppUser } from '@/context/auth.context';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function BillingPage() {
    const { user, setUser } = useAppUser();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handlePayment = async () => {
        if (!user?.uid) return;

        setIsLoading(true);
        try {
            const { id, approvalUrl } = await createPayPalOrder('0.1');

            // Open the PayPal approval URL in a system browser session
            const result = await WebBrowser.openAuthSessionAsync(approvalUrl, 'kba1://payment-success');

            if (result.type === 'success') {
                // Payment was approved, now capture it
                const captureData = await capturePayPalOrder(id);

                if (captureData.status === 'COMPLETED') {
                    const oneYearFromNow = Date.now() + 365 * 24 * 60 * 60 * 1000;
                    const updatedUser = {
                        ...user,
                        isPaying: true,
                        subscriptionExpires: oneYearFromNow
                    };

                    await updateUser({
                        uid: user.uid,
                        isPaying: true,
                        subscriptionExpires: oneYearFromNow
                    });

                    setUser(updatedUser);
                    Alert.alert(
                        "Success",
                        "Thank you for your donation! Your account has been upgraded.",
                        [{ text: "Great!", onPress: () => router.replace('/(tabs)/profile') }]
                    );
                } else {
                    Alert.alert("Payment Error", "Transaction could not be completed. Status: " + captureData.status);
                }
            } else {
                console.log("Payment flow cancelled or failed: ", result.type);
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to process payment with PayPal. Please try again later.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                        <IconSymbol name="chevron.left" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Upgrade Account</Text>
                    <View style={{ width: 24 }} />
                </View>

                <View style={styles.card}>
                    <View style={styles.iconContainer}>
                        <IconSymbol name="star.fill" size={40} color="#FFD700" />
                    </View>
                    <Text style={styles.title}>Community Supporter</Text>
                    <Text style={styles.price}>₪ 9.90 / year</Text>
                    <Text style={styles.description}>
                        Support our community and unlock full access to all system features for an entire year.
                    </Text>

                    <View style={styles.features}>
                        <FeatureItem icon="checkmark.circle.fill" text="Create unlimited events" />
                        <FeatureItem icon="checkmark.circle.fill" text="Publish community campaigns" />
                        <FeatureItem icon="checkmark.circle.fill" text="Send community-wide messages" />
                        <FeatureItem icon="checkmark.circle.fill" text="Support local initiatives" />
                    </View>

                    <TouchableOpacity
                        style={[styles.payBtn, isLoading && styles.disabledBtn]}
                        onPress={handlePayment}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <>
                                <IconSymbol name="creditcard.fill" size={20} color="#fff" />
                                <Text style={styles.payBtnText}>Pay with PayPal</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <Text style={styles.secureText}>
                        <IconSymbol name="lock.fill" size={12} color="#666" /> Secure checkout powered by PayPal
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

function FeatureItem({ icon, text }: { icon: any, text: string }) {
    return (
        <View style={styles.featureItem}>
            <IconSymbol name={icon} size={20} color="#4CAF50" />
            <Text style={styles.featureText}>{text}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    backBtn: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 20,
        elevation: 10,
    },
    iconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#FFFBEB',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 10,
    },
    price: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#8A2BE2',
        marginBottom: 20,
    },
    description: {
        textAlign: 'center',
        color: '#6B7280',
        lineHeight: 22,
        marginBottom: 30,
    },
    features: {
        width: '100%',
        marginBottom: 30,
        gap: 15,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    featureText: {
        color: '#374151',
        fontSize: 16,
    },
    payBtn: {
        backgroundColor: '#0070BA', // PayPal Blue
        flexDirection: 'row',
        width: '100%',
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },
    disabledBtn: {
        opacity: 0.6,
    },
    payBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    secureText: {
        marginTop: 15,
        fontSize: 12,
        color: '#9CA3AF',
    }
});
