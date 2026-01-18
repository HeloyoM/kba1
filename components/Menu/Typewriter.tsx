import React, { useEffect, useState } from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';

interface TypewriterProps {
    text: string;
    speed?: number;
    style?: StyleProp<TextStyle>;
    cursor?: boolean;
}

/**
 * A simple typewriter effect component for React Native.
 */
const Typewriter: React.FC<TypewriterProps> = ({
    text,
    speed = 80, // Normal typing speed
    style,
    cursor = true
}) => {
    const [displayText, setDisplayText] = useState('');

    useEffect(() => {
        // Reset when text changes
        setDisplayText('');

        const intervalId = setInterval(() => {
            setDisplayText((prev) => {
                if (prev.length < text.length) {
                    return text.slice(0, prev.length + 1);
                }
                clearInterval(intervalId);
                return prev;
            });
        }, speed);

        return () => clearInterval(intervalId);
    }, [text, speed]);

    return (
        <Text style={style}>
            {displayText}
            {cursor && <Text style={{ opacity: displayText.length < text.length ? 1 : 0 }}>|</Text>}
        </Text>
    );
};

export default Typewriter;
