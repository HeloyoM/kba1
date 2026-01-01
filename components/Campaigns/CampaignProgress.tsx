import React, { memo } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

interface CampaignProgressProps {
    percent: number;
    height?: number;
    fillColor?: string;
    backgroundColor?: string;
    style?: ViewStyle;
}

export const CampaignProgress = memo(function CampaignProgress({
    percent,
    height = 6,
    fillColor = '#3b82f6',
    backgroundColor = '#e5e7eb',
    style,
}: CampaignProgressProps) {
    return (
        <View style={[styles.container, { height, backgroundColor }, style]}>
            <View
                style={[
                    styles.fill,
                    {
                        width: `${Math.min(percent, 100)}%`,
                        backgroundColor: fillColor,
                    },
                ]}
            />
        </View>
    );
});

const styles = StyleSheet.create({
    container: {
        borderRadius: 9999, // Use a large number for full pill shape, or adjust if originally it was just small radius
        overflow: 'hidden',
    },
    fill: {
        height: '100%',
        borderRadius: 9999,
    },
});
