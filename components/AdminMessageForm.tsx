import { useAppUser } from '@/context/auth.context';
import { IMessage } from '@/interface/message.interface';
import { useRouter } from 'expo-router';
import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface AdminMessageFormProps {
    onClose: () => void;
    onSubmit: (message: Partial<IMessage>) => void;
    visible: boolean;
}

const AdminMessageForm = (props: AdminMessageFormProps) => {
    const { visible, onClose } = props
    const { user } = useAppUser();
    const router = useRouter();
    const isPaying = user?.isPaying || (user?.subscriptionExpires && user.subscriptionExpires > Date.now());

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>New Message</Text>
                {isPaying ? (
                    <Text> Form fields would go here... </Text>
                ) : (
                    <View style={styles.upgradeContent}>
                        <Text style={styles.upgradeText}>
                            You need to pay for the system to send community messages.
                        </Text>
                        <TouchableOpacity
                            style={styles.upgradeBtn}
                            onPress={() => {
                                onClose();
                                router.push('/billing');
                            }}
                        >
                            <Text style={styles.upgradeBtnText}>Upgrade Now</Text>
                        </TouchableOpacity>
                    </View>
                )}
                <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
                    <Text style={styles.closeBtnText}>Close</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
    },
    upgradeContent: {
        alignItems: 'center',
        padding: 10,
    },
    upgradeText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
    },
    upgradeBtn: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    upgradeBtnText: {
        color: '#fff',
        fontWeight: '600',
    },
    closeBtn: {
        marginTop: 20,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#666',
    }
});

export default AdminMessageForm