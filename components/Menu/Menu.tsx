import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Card from "./Card";
import { colors } from "@/utils/colors";

const demo = [
    { title: 'Welcome!', subtitle: 'Community feed and announcements', accent: colors.blue },
    { title: 'New Event', subtitle: 'Shabbat dinner on Friday', accent: colors.pink },
    { title: 'Member Spotlight', subtitle: 'Say hi to our new neighbors', accent: colors.yellow },
    { title: 'Help Needed', subtitle: 'Volunteer for food delivery', accent: colors.purple }
];

const Menu = () => {

    return (

        demo.map((d, i) => (
            <TouchableOpacity key={i} activeOpacity={0.85} style={styles.cardWrapper}>
                <Card index={i} title={d.title} subtitle={d.subtitle} accent={d.accent} />
            </TouchableOpacity>
        ))

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
    }
})