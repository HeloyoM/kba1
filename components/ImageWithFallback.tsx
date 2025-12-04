import React, { useState } from 'react';
import { Image, ImageProps, View, StyleSheet } from 'react-native';

const ERROR_IMG_SRC =
    'https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/256px-No-Image-Placeholder.svg.png';

interface ImageWithFallbackProps extends ImageProps {
    fallbackSrc?: string;
}

export function ImageWithFallback({
    source,
    fallbackSrc = ERROR_IMG_SRC,
    style,
    ...rest
}: ImageWithFallbackProps) {
    const [didError, setDidError] = useState(false);

    return (
        <View style={[styles.container, style]}>
            <Image
                source={didError ? { uri: fallbackSrc } : source}
                style={[StyleSheet.absoluteFill, style]}
                onError={() => setDidError(true)}
                resizeMode="cover"
                {...rest}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#e5e7eb', // light gray placeholder
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
});
