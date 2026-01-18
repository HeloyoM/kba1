import { updateUser } from "@/api/auth/users";
import { useAppUser } from "@/context/auth.context";
import IUser from "@/interface/user.interface";
import { Check, Edit2, X } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputRow } from "./InputRow";

type FieldName = "email" | "phone" | "location" | "birthday";


export function PersonalInfoSection() {
    const { user, setUser } = useAppUser();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<Partial<IUser>>({
        email: user?.email!,
        phone: user?.phone! || '',
        location: user?.location! || '',
        birthday: user?.birthday! || '',
    });

    const [tempUserInfo, setTempUserInfo] = useState<Partial<IUser>>(userInfo);
    const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({});

    const changeField = (field: FieldName, value: string) => {
        setTempUserInfo({ ...tempUserInfo, [field]: value });
        setErrors({ ...errors, [field]: undefined });
    };

    const validateUserInfo = (info: Partial<IUser>) => {
        const validationProblems: Partial<Record<FieldName, string>> = {};

        if (!info.email!.includes("@")) {
            validationProblems.email = "Invalid email";
        }

        const phoneNumberDigits = info.phone!.replace(/\D/g, "");
        if (phoneNumberDigits.length < 10) {
            validationProblems.phone = "Invalid phone number";
        }

        return validationProblems;
    };

    const applyChanges = async () => {
        try {
            setLoading(true);
            const updatedUser = { ...user, ...tempUserInfo } as IUser;
            await updateUser({ ...updatedUser, id: user?.id });
            setUser(updatedUser);
            setUserInfo(tempUserInfo);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update user", error);
            // Optionally set a general error state here to show to user
        } finally {
            setLoading(false);
        }
    };

    const handleSave = () => {
        const validationErrors = validateUserInfo(tempUserInfo);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        applyChanges();
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <Text style={styles.title}>Personal Information</Text>

                {!isEditing && (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Edit2 size={18} color="#7c3aed" />
                    </TouchableOpacity>
                )}
            </View>

            <InputRow
                label="Email"
                icon={<></>}
                value={tempUserInfo.email!}
                displayValue={userInfo.email!}
                editing={isEditing}
                error={errors.email}
                onChange={(v: any) => changeField("email", v)}
            />

            <InputRow
                label="Phone"
                icon={<></>}
                value={tempUserInfo.phone!}
                displayValue={userInfo.phone!}
                editing={isEditing}
                error={errors.phone}
                onChange={(v: any) => changeField("phone", v)}
            />

            <InputRow
                label="Location"
                error='sd'
                icon={<></>}
                value={tempUserInfo.location!}
                displayValue={userInfo.location!}
                editing={isEditing}
                onChange={(v: any) => changeField("location", v)}
            />

            <InputRow
                label="Birthday"
                error='sd'
                icon={<></>}
                value={tempUserInfo.birthday!}
                displayValue={userInfo.birthday!}
                editing={isEditing}
                onChange={(v: any) => changeField("birthday", v)}
            />

            {isEditing && (
                <View style={styles.footerBtns}>
                    <TouchableOpacity style={styles.saveBtn} onPress={handleSave} disabled={loading}>
                        {loading ? (
                            <Text style={styles.whiteText}>Saving...</Text>
                        ) : (
                            <>
                                <Check size={18} color="#fff" />
                                <Text style={styles.whiteText}>Save</Text>
                            </>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.cancelBtn}
                        onPress={() => {
                            setTempUserInfo(userInfo);
                            setIsEditing(false);
                        }}>
                        <X size={18} color="#444" />
                        <Text style={styles.cancelText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
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
