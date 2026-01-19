import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    signupFormContainer: {
        backgroundColor: '#1a1a1a',
        borderRadius: 12,
        margin: 2,
        padding: 16,
        width: 320,
    },
    inputContainer: {
        marginTop: 10,
        gap: 12,
        alignItems: 'center',
    },
    input: {
        backgroundColor: '#0d0d0d',
        paddingHorizontal: 16,
        color: '#fff',
        borderRadius: 12,
        width: '100%',
        height: 48,
        borderWidth: 1,
        borderColor: '#333',
    },
    submitButton: {
        backgroundColor: '#8a3ffc',
        width: '95%',
        borderRadius: 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonHovered: {
        backgroundColor: '#7433d4',
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    donationMessage: {
        color: '#aaa',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 20,
        lineHeight: 20,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 15,
        width: '100%',
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#333',
    },
    dividerText: {
        color: '#666',
        paddingHorizontal: 10,
        fontSize: 12,
    },
    guestButton: {
        backgroundColor: 'transparent',
        width: '95%',
        borderRadius: 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#8a3ffc',
    },
    guestButtonLabel: {
        color: '#8a3ffc',
        fontSize: 16,
        fontWeight: '500',
    },
});
