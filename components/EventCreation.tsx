import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StyleSheet,
} from "react-native";
import { IconSymbol } from "./ui/icon-symbol";
// import {} from '@expo/vector-icons'

interface ScheduleItem {
    time: string;
    activity: string;
}

interface EventCreationProps {
    onEventCreated: () => void;
    onCancel: () => void;
}

export default function EventCreation({
    onEventCreated,
    onCancel,
}: EventCreationProps) {
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        isOnline: false,
        category: "",
        capacity: "",
        imageUrl: "",
    });

    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([
        { time: "", activity: "" },
    ]);

    const categories = [
        "Wellness",
        "Technology",
        "Food & Drink",
        "Literature",
        "Sports",
        "Arts & Culture",
        "Business",
        "Education",
        "Social",
    ];

    const updateScheduleItem = (
        index: number,
        field: keyof ScheduleItem,
        value: string
    ) => {
        const updated = [...scheduleItems];
        updated[index][field] = value;
        setScheduleItems(updated);
    };

    const addScheduleItem = () => {
        setScheduleItems([...scheduleItems, { time: "", activity: "" }]);
    };

    const removeScheduleItem = (index: number) => {
        setScheduleItems(scheduleItems.filter((_, i) => i !== index));
    };

    const handleSubmit = () => {
        Alert.alert("Event Created", `${formData.title} has been published.`);
        onEventCreated();
    };

    const styles = lightStyles;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.title}>Create New Event</Text>
                <Text style={styles.subtitle}>
                    Fill in the details below to create your community event
                </Text>

                {/* Title */}
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Event Title *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.title}
                        onChangeText={(v) => setFormData({ ...formData, title: v })}
                        placeholder="Community Yoga Session"
                        placeholderTextColor={styles.placeholder.color}
                    />
                </View>

                {/* Description */}
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Event Description *</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        multiline
                        value={formData.description}
                        onChangeText={(v) => setFormData({ ...formData, description: v })}
                        placeholder="Describe your event..."
                        placeholderTextColor={styles.placeholder.color}
                    />
                </View>

                {/* Date + Time */}
                <View style={styles.row}>
                    <View style={styles.col}>
                        <Text style={styles.label}>Date *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.date}
                            onChangeText={(v) => setFormData({ ...formData, date: v })}
                            placeholder="YYYY-MM-DD"
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View>

                    <View style={styles.col}>
                        <Text style={styles.label}>Time *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.time}
                            onChangeText={(v) => setFormData({ ...formData, time: v })}
                            placeholder="HH:MM"
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View>
                </View>

                {/* Type toggle */}
                <Text style={styles.label}>Event Type *</Text>
                <View style={styles.row}>
                    <TouchableOpacity
                        style={[
                            styles.toggle,
                            !formData.isOnline && styles.toggleActive,
                        ]}
                        onPress={() => setFormData({ ...formData, isOnline: false })}
                    >
                        <IconSymbol name="mappin" size={18} color={styles.icon.color} />
                        <Text style={styles.toggleText}>In-Person</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.toggle,
                            formData.isOnline && styles.toggleActive,
                        ]}
                        onPress={() => setFormData({ ...formData, isOnline: true })}
                    >
                        <IconSymbol name="globe" size={18} color={styles.icon.color} />
                        <Text style={styles.toggleText}>Online</Text>
                    </TouchableOpacity>
                </View>

                {/* Location */}
                {!formData.isOnline && (
                    <View style={styles.fieldWrapper}>
                        <Text style={styles.label}>Venue Location *</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.location}
                            onChangeText={(v) => setFormData({ ...formData, location: v })}
                            placeholder="123 Main St, NY"
                            placeholderTextColor={styles.placeholder.color}
                        />
                    </View>
                )}

                {/* Category */}
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Category *</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.category}
                        onChangeText={(v) => setFormData({ ...formData, category: v })}
                        placeholder="Select category"
                        placeholderTextColor={styles.placeholder.color}
                    />
                </View>

                {/* Capacity */}
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Maximum Capacity (optional)</Text>
                    <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        value={formData.capacity}
                        onChangeText={(v) => setFormData({ ...formData, capacity: v })}
                        placeholder="Unlimited"
                        placeholderTextColor={styles.placeholder.color}
                    />
                </View>

                {/* Image */}
                <View style={styles.fieldWrapper}>
                    <Text style={styles.label}>Cover Image URL</Text>
                    <TextInput
                        style={styles.input}
                        value={formData.imageUrl}
                        onChangeText={(v) => setFormData({ ...formData, imageUrl: v })}
                        placeholder="https://example.com/img.jpg"
                        placeholderTextColor={styles.placeholder.color}
                    />
                    <Text style={styles.helper}>
                        Paste an image URL or leave empty for default
                    </Text>
                </View>

                {/* Schedule */}
                <Text style={styles.label}>Event Schedule (Optional)</Text>
                {scheduleItems.map((item, index) => (
                    <View key={index} style={styles.row}>
                        <TextInput
                            style={[styles.input, styles.timeInput]}
                            value={item.time}
                            onChangeText={(v) => updateScheduleItem(index, "time", v)}
                            placeholder="HH:MM"
                            placeholderTextColor={styles.placeholder.color}
                        />
                        <TextInput
                            style={[styles.input, styles.flex1]}
                            value={item.activity}
                            onChangeText={(v) =>
                                updateScheduleItem(index, "activity", v)
                            }
                            placeholder="Activity description"
                            placeholderTextColor={styles.placeholder.color}
                        />

                        {scheduleItems.length > 1 && (
                            <TouchableOpacity
                                style={styles.removeBtn}
                                onPress={() => removeScheduleItem(index)}
                            >
                                <IconSymbol name="x.circle" size={18} color="#E53935" />
                            </TouchableOpacity>
                        )}
                    </View>
                ))}

                <TouchableOpacity onPress={addScheduleItem}>
                    <Text style={styles.addSchedule}>+ Add schedule item</Text>
                </TouchableOpacity>

                {/* Buttons */}
                <View style={[styles.row, styles.actions]}>
                    <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit}>
                        <Text style={styles.submitText}>Create Event</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
}

/* -------------------------------------------------------------------------- */
/*                                 LIGHT MODE                                  */
/* -------------------------------------------------------------------------- */

const lightStyles = StyleSheet.create({
    container: { padding: 16, backgroundColor: "#F8F9FA" },
    card: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#DDD",
    },
    title: { fontSize: 22, fontWeight: "bold", color: "#111" },
    subtitle: { color: "#666", marginBottom: 16 },
    label: { color: "#333", marginBottom: 6, fontWeight: "500" },
    fieldWrapper: { marginBottom: 16 },
    input: {
        backgroundColor: "#F1F1F1",
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: "#CCC",
        color: "#000",
    },
    textArea: { height: 120 },
    placeholder: { color: "#666" },
    row: { flexDirection: "row", gap: 10 },
    col: { flex: 1 },
    toggle: {
        flex: 1,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#DDD",
        justifyContent: "center",
        gap: 6,
    },
    toggleActive: {
        borderColor: "#8A2BE2",
        backgroundColor: "#F3E8FF",
    },
    toggleText: { color: "#333", fontSize: 14 },
    icon: { color: "#666" },
    timeInput: { width: 90 },
    flex1: { flex: 1 },
    removeBtn: {
        padding: 8,
        justifyContent: "center",
    },
    addSchedule: { color: "#8A2BE2", marginTop: 8 },
    actions: { marginTop: 20 },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#EEE",
        padding: 14,
        borderRadius: 12,
    },
    cancelText: { textAlign: "center", color: "#555" },
    submitBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#8A2BE2",
    },
    submitText: { textAlign: "center", color: "white", fontWeight: "600" },
    helper: { fontSize: 12, color: "#777", marginTop: 6 },
});

/* -------------------------------------------------------------------------- */
/*                                 DARK MODE                                   */
/* -------------------------------------------------------------------------- */

const darkStyles = StyleSheet.create({
    ...lightStyles,
    container: { padding: 16, backgroundColor: "#111" },
    card: {
        backgroundColor: "#1A1A1A",
        padding: 20,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#333",
    },
    title: { fontSize: 22, fontWeight: "bold", color: "#FFF" },
    subtitle: { color: "#AAA", marginBottom: 16 },
    label: { color: "#CCC" },
    input: {
        backgroundColor: "#222",
        borderColor: "#444",
        color: "#FFF",
        padding: 12,
        borderRadius: 10,
        borderWidth: 1,
    },
    placeholder: { color: "#777" },
    toggleText: { color: "#DDD" },
    toggle: {
        flex: 1,
        padding: 12,
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 12,
        borderWidth: 2,
        borderColor: "#444",
        justifyContent: "center",
        gap: 6,
    },
    toggleActive: {
        borderColor: "#C084FC",
        backgroundColor: "#2A1840",
    },
    icon: { color: "#CCC" },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#222",
        padding: 14,
        borderRadius: 12,
    },
    cancelText: { textAlign: "center", color: "#CCC" },
    submitBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        backgroundColor: "#A855F7",
    },
    submitText: { textAlign: "center", color: "white", fontWeight: "600" },
    helper: { fontSize: 12, color: "#888", marginTop: 6 },
});
