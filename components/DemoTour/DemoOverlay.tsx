import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useDemo } from '../../context/demo.context';
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DemoOverlay = () => {
    const { isTourActive, currentStepIndex, steps, targetLayouts, nextStep, stopTour } = useDemo();

    if (!isTourActive) return null;

    const currentStep = steps[currentStepIndex];
    const layout = targetLayouts[currentStep.targetId];

    // If layout is not yet registered, we might need to wait or show a generic overlay
    if (!layout) return null;

    const spotlightPadding = 8;
    const spotlightX = layout.x - spotlightPadding;
    const spotlightY = layout.y - spotlightPadding;
    const spotlightWidth = layout.width + spotlightPadding * 2;
    const spotlightHeight = layout.height + spotlightPadding * 2;

    return (
        <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
            {/* Dark semi-transparent background with cut-out */}
            <View style={styles.overlayContainer} pointerEvents="box-none">
                {/* Top mask */}
                <View style={[styles.mask, { top: 0, left: 0, right: 0, height: spotlightY }]} />
                {/* Bottom mask */}
                <View style={[styles.mask, { top: spotlightY + spotlightHeight, left: 0, right: 0, bottom: 0 }]} />
                {/* Left mask */}
                <View style={[styles.mask, { top: spotlightY, left: 0, width: spotlightX, height: spotlightHeight }]} />
                {/* Right mask */}
                <View style={[styles.mask, { top: spotlightY, left: spotlightX + spotlightWidth, right: 0, height: spotlightHeight }]} />
            </View>

            {/* Tooltip */}
            <View
                style={[
                    styles.tooltip,
                    {
                        top: currentStep.position === 'bottom' ? spotlightY + spotlightHeight + 10 : spotlightY - 140,
                        left: Math.max(10, Math.min(SCREEN_WIDTH - 260, spotlightX + (spotlightWidth / 2) - 125))
                    }
                ]}
            >
                <Text style={styles.tooltipText}>{currentStep.text}</Text>
                <View style={styles.footer}>
                    <TouchableOpacity onPress={stopTour}>
                        <Text style={styles.skipBtn}>Skip tour</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.nextBtn} onPress={nextStep}>
                        <Text style={styles.nextBtnText}>next {'->'}</Text>
                    </TouchableOpacity>
                </View>

                {/* Triangle pointer */}
                <View
                    style={[
                        styles.pointer,
                        currentStep.position === 'bottom' ? styles.pointerTop : styles.pointerBottom,
                        { left: Math.min(230, Math.max(10, spotlightX + spotlightWidth / 2 - (Math.max(10, Math.min(SCREEN_WIDTH - 260, spotlightX + (spotlightWidth / 2) - 125))) - 10)) }
                    ]}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlayContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'transparent',
    },
    mask: {
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
    },
    tooltip: {
        position: 'absolute',
        width: 250,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
        zIndex: 1000,
    },
    tooltipText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 12,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    nextBtn: {
        backgroundColor: '#3b82f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 6,
    },
    nextBtnText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
    skipBtn: {
        color: '#666',
        fontSize: 12,
        textDecorationLine: 'underline',
    },
    pointer: {
        position: 'absolute',
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderBottomWidth: 10,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: '#fff',
    },
    pointerTop: {
        top: -10,
    },
    pointerBottom: {
        bottom: -10,
        transform: [{ rotate: '180deg' }],
    }
});
