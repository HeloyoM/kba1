import { Feather } from "@expo/vector-icons";
import React from 'react';
import { StyleSheet, Text, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';

interface CampaignActionButtonProps {
    variant?: 'primary' | 'secondary';
    icon: React.ComponentProps<typeof Feather>['name'];
    label: string;
    onPress: () => void;
    isActive?: boolean;
    style?: ViewStyle;
}

export function CampaignActionButton({
    variant = 'primary',
    icon,
    label,
    onPress,
    isActive = false,
    style,
}: CampaignActionButtonProps) {
    const isPrimary = variant === 'primary';

    // Base Styles
    const containerStyles: ViewStyle[] = [
        styles.buttonBase,
        isPrimary ? styles.primaryButton : styles.secondaryButton,
    ];

    const textStyles: TextStyle[] = [
        styles.textBase,
        isPrimary ? styles.primaryText : styles.secondaryText,
    ];

    // Icon Color
    let iconColor = isPrimary ? '#fff' : '#333';

    // Active State (specifically for Like/Heart button behavior essentially)
    if (isActive && !isPrimary) {
        containerStyles.push(styles.activeSecondaryButton);
        textStyles.push(styles.activeSecondaryText);
        iconColor = 'red';
    }

    return (
        <TouchableOpacity
            style={[containerStyles, style]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            <Feather name={icon} size={16} color={iconColor} />
            <Text style={textStyles}>{label}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    buttonBase: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 16,
        marginRight: 8,
        marginBottom: 8,
    },
    primaryButton: {
        backgroundColor: '#3b82f6',
    },
    secondaryButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
    },
    activeSecondaryButton: {
        backgroundColor: '#fee2e2',
        borderColor: '#fee2e2', // Optional: match bg or keep border
    },
    textBase: {
        marginLeft: 6,
        fontSize: 14,
    },
    primaryText: {
        color: '#fff',
        fontWeight: '600',
    },
    secondaryText: {
        color: '#333',
    },
    activeSecondaryText: {
        color: 'red',
    },
});
