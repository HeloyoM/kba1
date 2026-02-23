import { IconSymbol } from '@/components/ui/icon-symbol';
import IUser from '@/interface/user.interface';
import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Image, LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface MemberCardProps {
    member: IUser;
}

export const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = () => {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setIsExpanded(!isExpanded);
    };

    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={toggleExpand}
            style={[styles.card, isExpanded && styles.cardExpanded]}
        >
            <View style={styles.header}>
                <View style={styles.avatarContainer}>
                    {member.photoUrl ? (
                        <Image source={{ uri: member.photoUrl }} style={styles.avatar} />
                    ) : (
                        <View style={styles.avatarPlaceholder}>
                            <IconSymbol name="person.fill" size={24} color="#666" />
                        </View>
                    )}
                </View>
                <View style={styles.headerContent}>
                    <Text style={styles.name}>{member.givenName || member.name || 'Anonymous'}</Text>
                    <Text style={styles.role}>{member.role.charAt(0).toUpperCase() + member.role.slice(1)}</Text>
                </View>
                <Feather
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666"
                />
            </View>

            {isExpanded && (
                <View style={styles.details}>
                    <View style={styles.divider} />

                    {member.bio && (
                        <View style={styles.detailItem}>
                            <Feather name="info" size={16} color="#666" />
                            <Text style={styles.detailText}>{member.bio}</Text>
                        </View>
                    )}

                    <View style={styles.detailItem}>
                        <Feather name="mail" size={16} color="#666" />
                        <Text style={styles.detailText}>{member.email}</Text>
                    </View>

                    {member.phone && (
                        <View style={styles.detailItem}>
                            <Feather name="phone" size={16} color="#666" />
                            <Text style={styles.detailText}>{member.phone}</Text>
                        </View>
                    )}

                    {member.location && (
                        <View style={styles.detailItem}>
                            <Feather name="map-pin" size={16} color="#666" />
                            <Text style={styles.detailText}>{member.location}</Text>
                        </View>
                    )}

                    {/* Action Buttons could go here */}
                </View>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
    },
    cardExpanded: {
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        marginRight: 12,
    },
    avatar: {
        width: 48,
        height: 48,
        borderRadius: 24,
    },
    avatarPlaceholder: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#f3f4f6',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerContent: {
        flex: 1,
    },
    name: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111',
    },
    role: {
        fontSize: 14,
        color: '#666',
        marginTop: 2,
    },
    details: {
        marginTop: 12,
    },
    divider: {
        height: 1,
        backgroundColor: '#f1f1f1',
        marginBottom: 12,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        gap: 10,
    },
    detailText: {
        fontSize: 15,
        color: '#444',
        flex: 1,
    },
});
