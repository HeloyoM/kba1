import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
        gap: 12, // Increased gap for better spacing
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        width: '95%',
        borderRadius: 12,
        height: 48,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginButton: {
        backgroundColor: '#8a3ffc',
    },
    loginButtonHovered: {
        backgroundColor: '#7433d4',
    },
    secondaryButton: {
        backgroundColor: '#3a3a3a',
    },
    buttonLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    box: {
        width: '100%',
        overflow: 'hidden',
        marginTop: 8,
        alignItems: 'center',
    },
});
