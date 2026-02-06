import { deleteFile, getUserFiles, IUserFile, uploadFile } from "@/api/storage/storage";
import { useAppUser } from "@/context/auth.context";
import { colors } from "@/utils/colors";
import * as DocumentPicker from "expo-document-picker";
import { File, FileText, Image as ImageIcon, Music, Plus, Trash2, Video } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, FlatList, StyleSheet, Text, TouchableOpacity, useColorScheme, View } from "react-native";

const FileManagementSection = () => {
    const { user } = useAppUser();
    const colorScheme = useColorScheme();
    const [files, setFiles] = useState<IUserFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const isDark = colorScheme === 'dark';
    const theme = isDark ? darkStyles : lightStyles;

    useEffect(() => {
        if (user?.uid) {
            loadFiles();
        }
    }, [user]);

    const loadFiles = async () => {
        if (!user?.uid) return;
        setLoading(true);
        try {
            const userFiles = await getUserFiles(user.uid);
            setFiles(userFiles);
        } catch (error) {
            console.error("Load files error:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async () => {
        if (!user?.uid) return;

        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "*/*",
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            setUploading(true);
            setUploadProgress(0);

            // Fetch the file and create a blob
            const response = await fetch(asset.uri);
            const blob = await response.blob();

            const newFile = await uploadFile(
                blob,
                asset.name,
                user.uid,
                (progress) => setUploadProgress(progress)
            );

            setFiles(prev => [newFile, ...prev]);
            Alert.alert("Success", "File uploaded successfully");
        } catch (error) {
            console.error("Upload handler error:", error);
            Alert.alert("Error", "Failed to upload file");
        } finally {
            setUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDelete = (fileId: string, path: string) => {
        Alert.alert(
            "Delete File",
            "Are you sure you want to delete this file?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await deleteFile(fileId, path);
                            setFiles(prev => prev.filter(f => f.id !== fileId));
                        } catch (error) {
                            Alert.alert("Error", "Failed to delete file");
                        }
                    }
                }
            ]
        );
    };

    const getFileIcon = (type: string) => {
        if (type.includes('image')) return <ImageIcon size={24} color={colors.blue} />;
        if (type.includes('pdf')) return <FileText size={24} color="#FF5722" />;
        if (type.includes('audio')) return <Music size={24} color="#9C27B0" />;
        if (type.includes('video')) return <Video size={24} color="#E91E63" />;
        return <File size={24} color="#607D8B" />;
    };

    const formatSize = (bytes: number) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const renderFileItem = ({ item }: { item: IUserFile }) => (
        <View style={[styles.fileItem, theme.fileItem]}>
            <View style={styles.fileIconWrapper}>
                {getFileIcon(item.type)}
            </View>
            <View style={styles.fileDetails}>
                <Text style={[styles.fileName, theme.text]} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.fileMeta}>{formatSize(item.size)} • {item.type.split('/')[1]?.toUpperCase()}</Text>
            </View>
            <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => item.id && handleDelete(item.id, item.path)}
            >
                <Trash2 size={20} color="#ff5c5c" />
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, theme.card]}>
            <View style={styles.header}>
                <Text style={[styles.title, theme.text]}>My Documents</Text>
                <TouchableOpacity
                    style={styles.addBtn}
                    onPress={handleUpload}
                    disabled={uploading}
                >
                    <Plus size={20} color="#fff" />
                    <Text style={styles.addBtnText}>Add</Text>
                </TouchableOpacity>
            </View>

            {uploading && (
                <View style={styles.progressWrapper}>
                    <View style={[styles.progressBar, { width: `${uploadProgress}%` }]} />
                    <Text style={styles.progressText}>Uploading... {Math.round(uploadProgress)}%</Text>
                </View>
            )}

            {loading ? (
                <ActivityIndicator size="small" color={colors.blue} style={{ marginVertical: 20 }} />
            ) : files.length === 0 ? (
                <View style={styles.emptyState}>
                    <File size={40} color="#ccc" />
                    <Text style={styles.emptyText}>No documents uploaded yet</Text>
                </View>
            ) : (
                <FlatList
                    data={files}
                    renderItem={renderFileItem}
                    keyExtractor={item => item.id || Math.random().toString()}
                    scrollEnabled={false}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
    },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#4A90E2',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
    },
    addBtnText: {
        color: '#fff',
        fontWeight: '600',
        marginLeft: 4,
    },
    listContent: {
        paddingTop: 8,
    },
    fileItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    fileIconWrapper: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#f5f7fa',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    fileDetails: {
        flex: 1,
    },
    fileName: {
        fontSize: 14,
        fontWeight: '600',
        marginBottom: 2,
    },
    fileMeta: {
        fontSize: 12,
        color: '#8898AA',
    },
    deleteBtn: {
        padding: 8,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    emptyText: {
        marginTop: 10,
        color: '#999',
        fontSize: 14,
    },
    progressWrapper: {
        height: 24,
        backgroundColor: '#f0f0f0',
        borderRadius: 12,
        overflow: 'hidden',
        marginBottom: 16,
        justifyContent: 'center',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#4A90E2',
        position: 'absolute',
    },
    progressText: {
        fontSize: 10,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
        zIndex: 1,
    }
});

const lightStyles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
    },
    text: {
        color: '#333',
    },
    fileItem: {
        borderBottomColor: '#f0f0f0',
    }
});

const darkStyles = StyleSheet.create({
    card: {
        backgroundColor: '#1f2937',
    },
    text: {
        color: '#fff',
    },
    fileItem: {
        borderBottomColor: '#374151',
    }
});

export default FileManagementSection;
