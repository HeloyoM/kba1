import {
    Feather as Icon,
} from "@expo/vector-icons";
import { Text, View, StyleSheet } from "react-native";

interface InfoRowProps {
    icon: string;
    label: string;
    primary: string | React.ReactNode;
    secondary?: string;
    children?: React.ReactNode;
}

function InfoRow({ icon, label, primary, secondary, children }: InfoRowProps) {
    return (
        <View style={styles.infoRow}>
            <View style={styles.infoIconWrap}>
                <Icon name={icon as any} size={18} color="#7c3aed" />
            </View>
            <View style={styles.infoContent}>
                <Text style={styles.infoLabel}>{label}</Text>
                <Text style={[styles.infoPrimary, styles.textDark]}>{primary}</Text>
                {secondary && <Text style={styles.infoSecondary}>{secondary}</Text>}
                {children}
            </View>
        </View>
    );
}

export default InfoRow;

const styles = StyleSheet.create({
    infoRow: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 12 as any,
        marginBottom: 12,
    },
    infoIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 10,
        backgroundColor: "rgba(124,58,237,0.1)",
        alignItems: "center",
        justifyContent: "center",
    },
    infoContent: {
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: "#6b7280",
    },
    infoPrimary: {
        fontSize: 15,
        fontWeight: "600",
        marginTop: 2,
    },
    infoSecondary: {
        color: "#9ca3af",
        marginTop: 2,
    },
    textDark: {
        color: "#0b0b0b",
    },
});
