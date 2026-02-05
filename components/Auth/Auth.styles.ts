import { Dimensions, StyleSheet } from 'react-native';

const { width, height } = Dimensions.get('window');

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
    },
    contentContainer: {
        width: '100%',
        maxWidth: 420,
        alignItems: 'center',
    },
    headerSection: {
        alignItems: 'center',
        marginBottom: 48,
    },
    welcomeText: {
        fontSize: 36,
        fontWeight: '900',
        marginBottom: 12,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: 18,
        textAlign: 'center',
        lineHeight: 24,
        paddingHorizontal: 30,
    },
    buttonContainer: {
        width: '100%',
        gap: 16,
    },
    button: {
        width: '100%',
        borderRadius: 20,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.15,
        shadowRadius: 20,
        elevation: 8,
    },
    activeButton: {
        borderWidth: 2,
        borderColor: '#8a3ffc',
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
    guestButton: {
        marginTop: 8,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    buttonLabel: {
        fontSize: 19,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    box: {
        width: '100%',
        overflow: 'hidden',
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.08)',
        marginVertical: 12,
        padding: 4,
    },
});
