import { getCampaignsList } from "@/api/campaigns/campaigns";
import { useAppUser } from "@/context/auth.context";
import { useDemo } from "@/context/demo.context";
import { CampaignTypeEnum } from "@/interface/campaign.interface";
import { colors } from "@/utils/colors";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Card from "./Card";
import Typewriter from "./Typewriter";

const volunteerWords = [
    'food delivery',
    'making cake for Shabos',
    'visiting elderly',
    'teaching Hebrew',
    'event setup',
    'community garden'
];

const eventWords = [
    'birthdays',
    'anniversaries',
    'graduations',
    'baby showers',
    'house warmings',
    'Shabbat dinners'
];

interface DynamicSubtitleProps {
    prefix: string;
    words: string[];
    color: string;
}

const DynamicSubtitle = ({ prefix, words, color }: DynamicSubtitleProps) => {
    const [wordIndex, setWordIndex] = React.useState<number>(0);

    React.useEffect(() => {
        const interval = setInterval(() => {
            setWordIndex((prev) => (prev + 1) % words.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [words.length]);

    return (
        <Text style={styles.sub}>
            {prefix}{' '}
            <Typewriter
                text={words[wordIndex]}
                style={[styles.typingText, { color }]}
                speed={70}
                cursor={true}
            />
        </Text>
    );
};

const Menu = () => {
    const router = useRouter();
    const [openedCampaignsCount, setOpenedCampaignsCount] = useState<number>(0);
    const { registerLayout } = useDemo();

    useEffect(() => {
        const fetchCampaigns = async () => {
            const campaigns = await getCampaignsList();
            const activeCampaigns = campaigns.filter(c => c.status === 'active');
            setOpenedCampaignsCount(activeCampaigns.length);
        };
        fetchCampaigns();
    }, []);

    const { user } = useAppUser();

    const demo = [
        ...(user?.role === 'admin' ? [{
            title: 'Admin Panel',
            subtitle: 'Manage users and permissions',
            accent: colors.blue,
            path: '/admin'
        }] : []),
        {
            title: 'New Event',
            subtitle: <DynamicSubtitle prefix="Organize" words={eventWords} color={colors.pink} />,
            accent: colors.pink,
            path: '/events?view=create'
        },
        {
            title: 'Member Spotlight',
            subtitle: `Join the campaign (${openedCampaignsCount})`,
            accent: colors.yellow,
            path: `/community?type=${CampaignTypeEnum.AWARENESS}`
        },
        {
            title: 'Help Needed',
            subtitle: <DynamicSubtitle prefix="Volunteer for" words={volunteerWords} color={colors.purple} />,
            accent: colors.purple,
            path: `/community?type=${CampaignTypeEnum.VOLUNTEER}`
        }
    ];

    return (
        <View
            onLayout={(e) => {
                const layout = e.nativeEvent.layout;
                // Since this is the first container of buttons, it's a good target for "Fast Buttons"
                registerLayout('home_fast_buttons', {
                    x: layout.x,
                    y: layout.y + 120, // Offset for header
                    width: layout.width,
                    height: layout.height / 2 // Just highlight the top part for better focus
                });
            }}
        >
            {demo.map((d, i) => (
                <TouchableOpacity
                    key={i}
                    activeOpacity={0.85}
                    style={styles.cardWrapper}
                    onPress={() => router.push(d.path as any)}
                >
                    <Card index={i} title={d.title} subtitle={d.subtitle} accent={d.accent} />
                </TouchableOpacity>
            ))}
        </View>
    )
}

export default Menu;

const styles = StyleSheet.create({
    cardWrapper: {
        marginBottom: 16,
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
        elevation: 6,
    },
    sub: { color: colors.textSecondary, fontSize: 14 },
    typingText: {
        fontWeight: '600'
    }
})
