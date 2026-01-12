import { updateUser } from "@/api/auth/users";
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useAppUser } from "@/context/auth.context";
import { Camera, Check, Edit2, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { styles } from "./ProfileHeader.styles";

const ProfileHeader = () => {
    const { user, setUser } = useAppUser();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingBio, setIsEditingBio] = useState(false);

    const [displayName, setDisplayName] = useState(user?.name || '');
    const [tempDisplayName, setTempDisplayName] = useState(displayName);
    const [familyName, setFamilyName] = useState(user?.familyName || '');
    const [tempFamilyName, setTempFamilyName] = useState(familyName);

    const [bio, setBio] = useState(
        user?.bio || "Creative designer passionate about building meaningful connections 🌟"
    );
    const [tempBio, setTempBio] = useState(bio);
    const [avatarUrl, setAvatarUrl] = useState(user?.photoUrl);

    useEffect(() => {
        if (!user?.givenName?.trim()) {
            setIsEditingName(true);
        }
    }, [user]);

    const handleAvatarClick = () => {
        Alert.alert("Change profile picture", "File picker would open here in a real app");
    };

    const handleSaveName = async () => {
        try {
            if (user?.uid) {
                const fullGivenName = `${tempDisplayName} ${tempFamilyName}`.trim();
                await updateUser({
                    uid: user.uid,
                    name: tempDisplayName,
                    familyName: tempFamilyName,
                    givenName: fullGivenName
                });
                setDisplayName(tempDisplayName);
                setFamilyName(tempFamilyName);
                setIsEditingName(false);

                if (user) {
                    setUser({
                        ...user,
                        name: tempDisplayName,
                        familyName: tempFamilyName,
                        givenName: fullGivenName
                    });
                }
            }
        } catch (error) {
            console.error("Error updating name:", error);
            Alert.alert("Error", "Failed to update name");
        }
    };

    const handleCancelName = () => {
        setTempDisplayName(displayName);
        setTempFamilyName(familyName);
        setIsEditingName(false);
    };

    const handleSaveBio = async () => {
        try {
            if (user?.uid) {
                await updateUser({ uid: user.uid, bio: tempBio });
                setBio(tempBio);
                setIsEditingBio(false);

                if (user) {
                    setUser({ ...user, bio: tempBio });
                }
            }
        } catch (error) {
            console.error("Error updating bio:", error);
            Alert.alert("Error", "Failed to update bio");
        }
    };

    const handleCancelBio = () => {
        setTempBio(bio);
        setIsEditingBio(false);
    };

    if (user === null) return null;

    return (
        <View style={styles.container}>
            <View style={styles.cover} />

            <View style={styles.avatarWrapper}>
                <Image source={{ uri: user.photoUrl! }} style={styles.avatar} />
                <TouchableOpacity onPress={handleAvatarClick} style={styles.cameraBtn}>
                    <IconSymbol size={28} name="camera" color={'#fff'} />
                    <Camera size={16} color="#fff" />
                </TouchableOpacity>
            </View>

            <View style={styles.nameSection}>
                {isEditingName ? (
                    <View style={styles.row}>
                        <TextInput
                            value={tempDisplayName}
                            onChangeText={setTempDisplayName}
                            style={styles.input}
                            placeholder="First Name"
                            autoFocus
                        />
                        <TextInput
                            value={tempFamilyName}
                            onChangeText={setTempFamilyName}
                            style={styles.input}
                            placeholder="Family Name"
                        />
                        <TouchableOpacity style={styles.saveBtn} onPress={handleSaveName}>
                            <Check size={18} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelName}>
                            <X size={18} color="#555" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.name}>{displayName} {familyName}</Text>
                        <TouchableOpacity onPress={() => setIsEditingName(true)}>
                            <Edit2 size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}

                <Text style={styles.username}>@{user.name}</Text>
            </View>

            <View style={styles.bioSection}>
                {isEditingBio ? (
                    <View>
                        <TextInput
                            value={tempBio}
                            onChangeText={setTempBio}
                            multiline
                            style={[styles.input, styles.bioInput]}
                        />

                        <View style={[styles.row, styles.bioButtonsRow]}>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSaveBio}>
                                <Text style={styles.whiteText}>Save</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.cancelBtn} onPress={handleCancelBio}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                ) : (
                    <View style={styles.row}>
                        <Text style={styles.bio}>{bio}</Text>
                        <TouchableOpacity onPress={() => setIsEditingBio(true)}>
                            <Edit2 size={18} color="#666" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
}

export default ProfileHeader;