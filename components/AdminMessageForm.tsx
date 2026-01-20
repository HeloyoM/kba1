import { useAppUser } from '@/context/auth.context';
import { IAuthor, IMessage } from '@/interface/message.interface';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface AdminMessageFormProps {
    onClose: () => void;
    onSubmit: (message: Partial<IMessage>) => void;
    visible: boolean;
}

const AdminMessageForm = (props: AdminMessageFormProps) => {
    const { visible, onClose, onSubmit } = props;
    const { user } = useAppUser();
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [preview, setPreview] = useState('');

    const isPaying = user?.isPaying || (user?.subscriptionExpires && user.subscriptionExpires > Date.now());

    const handleSubmit = () => {
        if (!title || !content || !user) return;

        const author: IAuthor = {
            id: user.id || user.uid || '',
            name: user.givenName || user.name || 'Admin',
            avatar: user.photoUrl || 'https://via.placeholder.com/150'
        };

        const newMessage: Partial<IMessage> = {
            title,
            content,
            preview: preview || content.substring(0, 50),
            author,
            isRead: false,
            createdAt: Date.now(),
            hasAttachment: false,
        };

        onSubmit(newMessage);
        onClose();
        // Reset form
        setTitle('');
        setContent('');
        setPreview('');
    };

    return (
        <View style={styles.overlay}>
            <View style={styles.container}>
                <Text style={styles.title}>New Message</Text>
                {isPaying ? (
                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Title</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Message Title"
                                value={title}
                                onChangeText={setTitle}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Content</Text>
                            <TextInput
                                style={[styles.input, styles.textArea]}
                                placeholder="Write your message here..."
                                value={content}
                                onChangeText={setContent}
                                multiline
                                numberOfLines={4}
                            />
                        </View>

                        <View style={styles.formGroup}>
                            <Text style={styles.label}>Preview (Optional)</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="Short preview text"
                                value={preview}
                                onChangeText={setPreview}
                            />
                        </View>

                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                            <Text style={styles.submitBtnText}>Post Message</Text>
                        </TouchableOpacity>
                    </ScrollView>
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
                    <Text style={styles.closeBtnText}>Cancel</Text>
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
        width: '90%',
        maxHeight: '80%',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 24,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#111',
    },
    formGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 12,
        padding: 12,
        fontSize: 15,
        color: '#111',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    upgradeContent: {
        alignItems: 'center',
        padding: 10,
    },
    upgradeText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#666',
        fontSize: 16,
        lineHeight: 24,
    },
    upgradeBtn: {
        backgroundColor: '#2563eb',
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 12,
    },
    upgradeBtnText: {
        color: '#fff',
        fontWeight: '700',
    },
    submitBtn: {
        backgroundColor: '#2563eb',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    closeBtn: {
        marginTop: 16,
        alignItems: 'center',
    },
    closeBtnText: {
        color: '#6B7280',
        fontSize: 14,
        fontWeight: '500',
    }
});

export default AdminMessageForm