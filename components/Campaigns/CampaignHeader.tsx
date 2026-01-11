import { useAppUser } from "@/context/auth.context";
import { Feather } from "@expo/vector-icons";
import React from 'react';
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from 'react-native';

interface HeaderButtonProps {
    onPress: () => void;
    icon: keyof typeof Feather.glyphMap;
    text?: string;
    color?: string;
    style?: StyleProp<ViewStyle>;
}

const HeaderButton = ({ onPress, icon, text, color = "#333", style }: HeaderButtonProps) => (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
        <Feather name={icon} size={20} color={color} />
        {text && <Text style={styles.buttonText}>{text}</Text>}
    </TouchableOpacity>
);

interface CampaignHeaderProps {
    onBack: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export function CampaignHeader({ onBack, onEdit, onDelete }: CampaignHeaderProps) {
    const { user } = useAppUser()
    return (
        <View style={styles.header}>
            <HeaderButton
                icon="arrow-left"
                text="Back"
                onPress={onBack}
            />
            <View style={styles.actions}>
                {user?.role === "admin" && <HeaderButton
                    icon="edit"
                    onPress={onEdit}
                    style={styles.iconButton}
                />}
                {user?.role === "admin" && <HeaderButton
                    icon="trash-2"
                    color="red"
                    onPress={onDelete}
                    style={styles.iconButton}
                />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        alignItems: 'center',
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    buttonText: {
        marginLeft: 6,
        fontSize: 16,
        color: '#333',
    },
    iconButton: {
        marginLeft: 12,
    },
});