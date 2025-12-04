import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { ImageWithFallback } from './ImageWithFallback';
import { Campaign } from '@/app/(tabs)/community';
import { IconSymbol } from './ui/icon-symbol';

interface FeaturedCarouselProps {
    campaigns: Campaign[];
    onViewCampaign: (campaign: Campaign) => void;
}

export function FeaturedCarousel({ campaigns, onViewCampaign }: FeaturedCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % campaigns.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [campaigns.length]);

    if (campaigns.length === 0) return null;

    const currentCampaign = campaigns[currentIndex];
    const progress = currentCampaign.goal && currentCampaign.current
        ? (currentCampaign.current / currentCampaign.goal) * 100
        : 0;

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev - 1 + campaigns.length) % campaigns.length);
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev + 1) % campaigns.length);
    };

    return (
        <View style={styles.container}>
            <View style={styles.carouselContainer}>
                <ImageWithFallback
                    source={{ uri: currentCampaign.image }}
                    style={styles.image}
                />
                <View style={styles.gradientOverlay} />

                <View style={styles.content}>
                    <View style={styles.badges}>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>Featured</Text>
                        </View>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>
                                {currentCampaign.type.charAt(0).toUpperCase() + currentCampaign.type.slice(1)}
                            </Text>
                        </View>
                    </View>

                    <Text style={styles.title}>{currentCampaign.title}</Text>
                    <Text style={styles.description} numberOfLines={2}>
                        {currentCampaign.description}
                    </Text>


                    {currentCampaign.goal && currentCampaign.current !== undefined && (
                        <View style={styles.progressContainer}>
                            <View style={styles.progressHeader}>
                                <Text style={styles.progressText}>
                                    {currentCampaign.current.toLocaleString()} / {currentCampaign.goal.toLocaleString()} {currentCampaign.unit}
                                </Text>
                                <Text style={styles.progressTextSecondary}>{progress.toFixed(0)}%</Text>
                            </View>
                            <View style={styles.progressBarBackground}>
                                <View style={[styles.progressBarFill, { width: `${Math.min(progress, 100)}%` }]} />
                            </View>
                        </View>
                    )}

                    <TouchableOpacity
                        style={styles.learnMoreButton}
                        onPress={() => onViewCampaign(currentCampaign)}
                    >
                        <Text style={styles.learnMoreText}>Learn More</Text>
                    </TouchableOpacity>

                </View>

                {
                    campaigns.length > 1 && (
                        <>
                            <TouchableOpacity style={[styles.navButton, { left: 12 }]} onPress={goToPrevious}>
                                <IconSymbol name="chevron.left" size={24} color="white" />
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.navButton, { right: 12 }]} onPress={goToNext}>
                                <IconSymbol name="chevron.right" size={24} color="white" />
                            </TouchableOpacity>
                        </>
                    )
                }
            </View>

            {
                campaigns.length > 1 && (
                    <View style={styles.dotsContainer}>
                        {campaigns.map((_, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.dot,
                                    index === currentIndex ? styles.activeDot : styles.inactiveDot,
                                ]}
                                onPress={() => setCurrentIndex(index)}
                            />
                        ))}
                    </View>
                )
            }

        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
    carouselContainer: {
        width: '100%',
        height: 250,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60%',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    content: {
        position: 'absolute',
        bottom: 16,
        left: 16,
        right: 16,
    },
    badges: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 8,
    },
    badge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    badgeText: {
        fontSize: 10,
        color: 'white',
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: 'white',
        marginBottom: 4,
    },
    description: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginBottom: 8,
    },
    progressContainer: {
        marginBottom: 8,
    },
    progressHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 2,
    },
    progressText: {
        color: 'white',
        fontSize: 12,
    },
    progressTextSecondary: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    progressBarBackground: {
        width: '100%',
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        backgroundColor: 'white',
    },
    learnMoreButton: {
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 24,
        alignSelf: 'flex-start',
    },
    learnMoreText: {
        color: '#111827',
        fontWeight: '600',
    },
    navButton: {
        position: 'absolute',
        top: '50%',
        transform: [{ translateY: -12 }],
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 8,
        gap: 6,
    },
    dot: {
        height: 6,
        borderRadius: 3,
    },
    activeDot: {
        width: 24,
        backgroundColor: '#3b82f6',
    },
    inactiveDot: {
        width: 6,
        backgroundColor: '#d1d5db',
    },
});
