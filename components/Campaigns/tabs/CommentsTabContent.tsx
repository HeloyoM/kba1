import React from 'react';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Comment {
    id: string;
    author: string;
    avatar: string;
    content: string;
    timestamp: string;
}

interface CommentsTabContentProps {
    comments: Comment[];
    commentInputText: string;
    onCommentTextChange: (text: string) => void;
    onPostComment: () => void;
}

const COMMENTS_TAB_TEXT = {
    COMMENT_PLACEHOLDER: 'Write a comment...',
    POST_BUTTON_TEXT: 'Post Comment',
};

const CURRENT_USER_AVATAR = 'https:api.dicebear.com/7.x/avataaars/svg?seed=You';

export function CommentsTabContent({
    comments,
    commentInputText,
    onCommentTextChange,
    onPostComment,
    header,
}: CommentsTabContentProps & { header: React.ReactNode }) {
    return (
        <View style={styles.container}>
            <FlatList
                data={comments}
                ListHeaderComponent={
                    <>
                        {header}
                        <View style={styles.commentInputRow}>
                            <Image
                                source={{ uri: CURRENT_USER_AVATAR }}
                                style={styles.commentAvatar}
                            />
                            <View style={styles.inputContainer}>
                                <TextInput
                                    value={commentInputText}
                                    onChangeText={onCommentTextChange}
                                    placeholder={COMMENTS_TAB_TEXT.COMMENT_PLACEHOLDER}
                                    style={styles.commentInput}
                                    multiline
                                />
                                <TouchableOpacity
                                    style={styles.postCommentButton}
                                    onPress={onPostComment}
                                >
                                    <Text style={styles.postCommentButtonText}>
                                        {COMMENTS_TAB_TEXT.POST_BUTTON_TEXT}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </>
                }
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <View style={styles.commentRow}>
                        <Image source={{ uri: item.avatar }} style={styles.commentAvatar} />
                        <View style={styles.commentContent}>
                            <View style={styles.commentBubble}>
                                <Text style={styles.commentAuthor}>{item.author}</Text>
                                <Text style={styles.commentText}>{item.content}</Text>
                            </View>
                            <Text style={styles.commentTimestamp}>{item.timestamp}</Text>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    commentInputRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    inputContainer: {
        flex: 1,
    },
    commentAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 8,
    },
    commentInput: {
        flex: 1,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 8,
        minHeight: 60,
    },
    postCommentButton: {
        alignSelf: 'flex-end',
        marginTop: 4,
        backgroundColor: '#3b82f6',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    postCommentButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    commentRow: {
        flexDirection: 'row',
        marginBottom: 12,
    },
    commentContent: {
        flex: 1,
    },
    commentBubble: {
        backgroundColor: '#f3f4f6',
        padding: 8,
        borderRadius: 12,
        flex: 1,
    },
    commentAuthor: {
        fontWeight: 'bold',
        marginBottom: 2,
        color: '#333',
    },
    commentText: {
        color: '#555',
    },
    commentTimestamp: {
        fontSize: 12,
        color: '#888',
        marginTop: 2,
        marginLeft: 48,
    },
});
