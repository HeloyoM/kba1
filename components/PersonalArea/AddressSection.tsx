import { updateUser } from "@/api/auth/users";
import { useAppUser } from "@/context/auth.context";
import IUser from "@/interface/user.interface";
import { Check, Edit2, MapPin, X } from "lucide-react-native";
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { InputRow } from "./InputRow";

type AddressField = "street" | "city" | "state" | "zipCode" | "country";

export function AddressSection() {
    const { user, setUser } = useAppUser();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);
    
    const [addressInfo, setAddressInfo] = useState<IUser["location"]>({
        street: user?.location?.street || '',
        city: user?.location?.city || '',
        state: user?.location?.state || '',
        zipCode: user?.location?.zipCode || '',
        country: user?.location?.country || '',
    });

    const [tempAddressInfo, setTempAddressInfo] = useState<IUser["location"]>(addressInfo);

    const changeField = (field: AddressField, value: string) => {
        setTempAddressInfo({ ...tempAddressInfo, [field]: value });
    };

    const applyChanges = async () => {
        try {
            setLoading(true);
            const updatedUser = { ...user, location: tempAddressInfo } as IUser;
            await updateUser({ ...updatedUser, uid: user?.uid });
            setUser(updatedUser);
            setAddressInfo(tempAddressInfo);
            setIsEditing(false);
        } catch (error) {
            console.error("Failed to update address", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.card}>
            <View style={styles.headerRow}>
                <View style={styles.titleContainer}>
                    <MapPin size={20} color="#7c3aed" />
                    <Text style={styles.title}>Address Information</Text>
                </View>

                {!isEditing && (
                    <TouchableOpacity onPress={() => setIsEditing(true)}>
                        <Edit2 size={18} color="#7c3aed" />
                    </TouchableOpacity>
                )}
            </View>

            <InputRow
                label="Street"
                icon={<></>}
                value={tempAddressInfo?.street!}
                displayValue={addressInfo?.street || "Not specified"}
                editing={isEditing}
                onChange={(v: any) => changeField("street", v)}
            />

            <InputRow
                label="City"
                icon={<></>}
                value={tempAddressInfo?.city!}
                displayValue={addressInfo?.city || "Not specified"}
                editing={isEditing}
                onChange={(v: any) => changeField("city", v)}
            />

            <InputRow
                label="State / Province"
                icon={<></>}
                value={tempAddressInfo?.state!}
                displayValue={addressInfo?.state || "Not specified"}
                editing={isEditing}
                onChange={(v: any) => changeField("state", v)}
            />

            <View style={styles.row}>
                <View style={{ flex: 1 }}>
                    <InputRow
                        label="Zip / Postal Code"
                        icon={<></>}
                        value={tempAddressInfo?.zipCode!}
                        displayValue={addressInfo?.zipCode || "Not specified"}
                        editing={isEditing}
                        onChange={(v: any) => changeField("zipCode", v)}
                    />
                </View>
                <View style={{ flex: 1, marginLeft: 10 }}>
                    <InputRow
                        label="Country"
                        icon={<></>}
                        value={tempAddressInfo?.country!}
                        displayValue={addressInfo?.country || "Not specified"}
                        editing={isEditing}
                        onChange={(v: any) => changeField("country", v)}
                    />
                </View>
            </View>

            {isEditing && (
                <View style={styles.footerBtns}>
                    <TouchableOpacity style={styles.saveBtn} onPress={applyChanges} disabled={loading}>
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
                            setTempAddressInfo(addressInfo);
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
    headerRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12, alignItems: 'center' },
    titleContainer: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    title: { fontSize: 18, fontWeight: "600" },
    row: { flexDirection: 'row' },
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
