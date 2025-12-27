import React, { useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    Animated,
    Text,
    ViewStyle,
    TextStyle,
} from "react-native";

type Props = {
    value: number;          // 0–1
    height?: number;
    width?: number;
    showLabel?: boolean;
    containerStyle?: ViewStyle;
    style?: ViewStyle;
    labelStyle?: TextStyle;
};

const GOOGLE_COLORS = ["#4285F4", "#DB4437", "#F4B400", "#0F9D58"];

export default function GoogleFitProgressBar({
    value,
    height = 14,
    width,
    showLabel = true,
    containerStyle,
    style,
    labelStyle,
}: Props) {
    const clamped = Math.max(0, Math.min(1, value));

    const anim = useRef(new Animated.Value(clamped)).current;

    useEffect(() => {
        Animated.timing(anim, {
            toValue: clamped,
            duration: 600,
            useNativeDriver: false,
        }).start();
    }, [clamped]);

    const widthInterp = anim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    return (
        <View style={[containerStyle, { width }]}>
            <View style={[styles.track, { height }, style]}>
                {/* COLOR SEGMENTS */}
                {GOOGLE_COLORS.map((color, i) => (
                    <View
                        key={i}
                        style={[
                            styles.segment,
                            { backgroundColor: color, width: `${100 / 4}%` },
                        ]}
                    />
                ))}

                {/* ANIMATED MASK */}
                <Animated.View
                    style={[
                        styles.mask,
                        { width: widthInterp, backgroundColor: "white" },
                    ]}
                />
            </View>

            {showLabel && (
                <Text style={[styles.label, labelStyle]}>
                    {Math.round(clamped * 100)}%
                </Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    track: {
        flexDirection: "row",
        overflow: "hidden",
        borderRadius: 999,
        backgroundColor: "#e6e6e6",
        position: "relative",
    },
    segment: {
        height: "100%",
    },
    mask: {
        position: "absolute",
        top: 0,
        bottom: 0,
        right: 0,
    },
    label: {
        marginTop: 6,
        textAlign: "right",
        color: "#333",
        fontSize: 14,
    },
});
