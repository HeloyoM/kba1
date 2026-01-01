import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, TextInput, Alert, StyleSheet } from "react-native";
// import { Camera, Edit2, Check, X } from "lucide-react-native";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppUser } from "@/context/auth.context";

const ProfileHeader = () => {
    const { user } = useAppUser();
    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);
    const [displayName, setDisplayName] = useState(user?.givenName!);
    const [tempDisplayName, setTempDisplayName] = useState(displayName);
    const [bio, setBio] = useState(
        "Creative designer passionate about building meaningful connections 🌟"
    );
    const [tempBio, setTempBio] = useState(bio);
    const [avatarUrl, setAvatarUrl] = useState(
        user?.photoUrl
    );
    console.log({ user })
    const handleAvatarClick = () => {
        Alert.alert("Change profile picture", "File picker would open here in a real app");
    };

    if (user === null) return

    return (
        <View style={styles.container}>
            {/* Cover */}
            <View style={styles.cover} />

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
                <Image source={{ uri: user.photoUrl! }} style={styles.avatar} />

                <TouchableOpacity onPress={handleAvatarClick} style={styles.cameraBtn}>
                    <IconSymbol size={28} name="camera" color={'#fff'} />
                    {/* <Camera size={16} color="#fff" /> */}
                </TouchableOpacity>
            </View>

            {/* Name */}
            <View style={{ marginTop: 8 }}>
                {isEditingName ? (
                    <View style={styles.row}>
                        <TextInput
                            value={tempDisplayName}
                            onChangeText={setTempDisplayName}
                            style={styles.input}
                            autoFocus
                        />
                        <TouchableOpacity style={styles.saveBtn} onPress={() => {
                            setDisplayName(tempDisplayName);
                            setIsEditingName(false);
                        }}>
                            {/* <Check size={18} color="#fff" /> */}
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={() => {
                            setTempDisplayName(displayName);
                            setIsEditingName(false);
                        }}>
                            {/* <X size={18} color="#555" /> */}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.name}>{displayName}</Text>

                        <TouchableOpacity onPress={() => setIsEditingName(true)}>
                            {/* <Edit2 size={18} color="#666" /> */}
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.username}>@{user.name}</Text>
            </View>

            {/* Bio */}
            <View style={{ marginTop: 10 }}>
                {isEditingBio ? (
                    <View>
                        <TextInput
                            value={tempBio}
                            onChangeText={setTempBio}
                            multiline
                            style={[styles.input, { height: 80 }]}
                        />

                        <View style={[styles.row, { marginTop: 8 }]}>
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={() => {
                                    setBio(tempBio);
                                    setIsEditingBio(false);
                                }}>
                                <Text style={styles.whiteText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => {
                                    setTempBio(bio);
                                    setIsEditingBio(false);
                                }}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.bio}>{bio}</Text>

                        <TouchableOpacity onPress={() => setIsEditingBio(true)}>
                            {/* <Edit2 size={18} color="#666" /> */}
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

export default ProfileHeader;


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        borderRadius: 16,
        margin: 12,
        paddingBottom: 20,
        overflow: "hidden",
        elevation: 2,
    },
    cover: {
        height: 90,
        backgroundColor: "#a855f7",
    },
    avatarWrapper: {
        alignSelf: "center",
        marginTop: -40,
    },
    avatar: {
        width: 90,
        height: 90,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: "#fff",
    },
    cameraBtn: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: "#7c3aed",
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    row: { flexDirection: "row", alignItems: "center", gap: 8 },
    name: { fontSize: 20, fontWeight: "600", color: "#000" },
    username: { color: "#777", marginTop: 2 },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 8,
        flex: 1,
    },
    bio: { flex: 1, color: "#444" },
    saveBtn: {
        backgroundColor: "#7c3aed",
        padding: 10,
        borderRadius: 8,
    },
    cancelBtn: {
        backgroundColor: "#eee",
        padding: 10,
        borderRadius: 8,
    },
    whiteText: { color: "#fff" },
    cancelText: { color: "#555" },
});