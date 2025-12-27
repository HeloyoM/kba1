import React, { useEffect } from "react";
import { View } from "react-native";
import { User2 } from "lucide-react-native";
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
} from "react-native-reanimated";
import { IconSymbol } from "./ui/icon-symbol";

const radius = 30; // half of the parent View's width/height

const ProgressBar = () => {
    const angle = useSharedValue(0);

    useEffect(() => {
        angle.value = withRepeat(
            withTiming(2 * Math.PI, {
                duration: 5000,
                easing: Easing.linear,
            }),
            -1, // infinite
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        const x = radius + radius * Math.cos(angle.value) - 15;
        const y = radius + radius * Math.sin(angle.value) - 15;

        return {
            position: "absolute",
            left: x,
            top: y,
        };
    });

    return (
        <View
            style={{
                width: radius * 2,
                height: radius * 2,
                borderRadius: radius,
                justifyContent: "center",
                alignItems: "center",
                position: "relative",
                backgroundColor: "rgba(0,0,0,0.1)",
            }}
        >
            <Animated.View style={animatedStyle}>
                <IconSymbol name="circle" size={10} color="black" />
            </Animated.View>
        </View>
    );
};

export default ProgressBar;
