// PersonalInfoSection.tsx
import { useAppUser } from "@/context/auth.context";
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
// import { Mail, Phone, MapPin, Calendar, Edit2, Check, X } from "lucide-react-native";

type FieldName = "email" | "phone" | "location" | "birthday";

interface UserInfo {
    email: string;
    phone: string;
    location: string;
    birthday: string;
}

export function PersonalInfoSection() {
    const { user } = useAppUser();
    const [isEditing, setIsEditing] = useState(false);
    const [userInfo, setUserInfo] = useState<UserInfo>({
        email: user?.email!,
        phone: '',
        location: '',
        birthday: '',
    });

    const [tempUserInfo, setTempUserInfo] = useState(userInfo);
    const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

    const changeField = (field: FieldName, value: string) => {
        setTempUserInfo({ ...tempUserInfo, [field]: value });
        setErrors({ ...errors, [field]: undefined });
    };

    const handleSave = () => {
        const newErr: Partial<Record<FieldName, string>> = {};

        if (!tempUserInfo.email.includes("@")) newErr.email = "Invalid email";
        if (tempUserInfo.phone.replace(/\D/g, "").length < 10)
            newErr.phone = "Invalid phone number";

        if (Object.keys(newErr).length > 0) {
            setErrors(newErr);
            return;
        }

        setUserInfo(tempUserInfo);
        setIsEditing(false);
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Personal Information</Text>

                {!isEditing && (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        {/* <Edit2 size={18} color="#7c3aed" /> */}
                    </TouchableOpacity>
                )}
            </View>

            {/* EMAIL */}
            <InputRow
                label="Email"
                icon={<></>}
                value={tempUserInfo.email}
                displayValue={userInfo.email}
                editing={isEditing}
                error={errors.email}
                onChange={(v: any) => changeField("email", v)}
            />

            {/* PHONE */}
            <InputRow
                label="Phone"
                icon={<></>}
                value={tempUserInfo.phone}
                displayValue={userInfo.phone}
                editing={isEditing}
                error={errors.phone}
                onChange={(v: any) => changeField("phone", v)}
            />

            {/* LOCATION */}
            <InputRow
                label="Location"
                error='sd'
                icon={<></>}
                value={tempUserInfo.location}
                displayValue={userInfo.location}
                editing={isEditing}
                onChange={(v: any) => changeField("location", v)}
            />

            {/* BIRTHDAY */}
            <InputRow
                label="Birthday"
                error='sd'
                icon={<></>}
                value={tempUserInfo.birthday}
                displayValue={userInfo.birthday}
                editing={isEditing}
                onChange={(v: any) => changeField("birthday", v)}
            />

            {isEditing && (
                <View style={styles.footerBtns}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                        {/* <Check size={18} color="#fff" /> */}
                        <Text style={styles.whiteText}>Save</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => {
                            setTempUserInfo(userInfo);
                            setIsEditing(false);
                        }}>
                        {/* <X size={18} color="#444" /> */}
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

function InputRow({ label, icon, value, displayValue, editing, onChange, error }: any) {
    return (
        <View style={{ marginBottom: 16 }}>
            <View style={styles.labelRow}>
                {icon}
                <Text style={styles.label}>{label}</Text>
            </View>

            {editing ? (
                <>
                    <TextInput
                        value={value}
                        onChangeText={onChange}
                        style={[styles.input, error && { borderColor: "red" }]}
                    />
                    {error && <Text style={styles.error}>{error}</Text>}
                </>
            ) : (
                <Text style={styles.data}>{displayValue}</Text>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#fff",
        padding: 14,
        borderRadius: 16,
        margin: 12,
        elevation: 2,
    },
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
    title: { fontSize: 18, fontWeight: "600" },
    labelRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 6 },
    label: { color: "#666" },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
    },
    data: { fontSize: 16, color: "#222" },
    error: { color: "red", marginTop: 4 },
    footerBtns: {
        flexDirection: "row",
        gap: 10,
        marginTop: 20,
    },
    saveBtn: {
        flex: 1,
        backgroundColor: "#7c3aed",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: "#eee",
        padding: 12,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "center",
        gap: 6,
    },
    whiteText: { color: "#fff", fontWeight: "500" },
    cancelText: { color: "#444", fontWeight: "500" },
});
