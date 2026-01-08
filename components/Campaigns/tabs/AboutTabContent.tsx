import React from 'react';
import { FlatList, ScrollView, StyleSheet, Text, View } from 'react-native';
import { ImageWithFallback } from '../../ImageWithFallback';

interface AboutTabContentProps {
    description: string;
    mediaGallery?: string[];
}

const ABOUT_TAB_TEXT = {
    DESCRIPTION_TITLE: 'Description',
    MEDIA_GALLERY_TITLE: 'Media Gallery',
};

export function AboutTabContent({ description, mediaGallery, header }: AboutTabContentProps & { header: React.ReactNode }) {
    return (
        <ScrollView>
            {header}
            <View style={styles.contentContainer}>
                <Text style={styles.sectionTitle}>{ABOUT_TAB_TEXT.DESCRIPTION_TITLE}</Text>
                <Text style={styles.sectionText}>{description}</Text>

                {mediaGallery && mediaGallery.length > 0 && (
                    <View>
                        <Text style={styles.sectionTitle}>{ABOUT_TAB_TEXT.MEDIA_GALLERY_TITLE}</Text>
                        <FlatList
                            data={mediaGallery}
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item, idx) => idx.toString()}
                            renderItem={({ item }) => (
                                <ImageWithFallback source={{ uri: item }} style={styles.mediaImage} />
                            )}
                        />
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    contentContainer: {
        padding: 16,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 6,
    },
    sectionText: {
        color: '#555',
        marginBottom: 12,
    },
    mediaImage: {
        width: 160,
        height: 90,
        borderRadius: 12,
        marginRight: 8,
    },
});
