import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f8f8'
    },
    section: {
        marginBottom: 16,
        paddingHorizontal: 12
    },
    sectionTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10
    },
    emptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
        marginTop: 20,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#555',
        marginBottom: 4,
    },
    emptySubText: {
        fontSize: 14,
        color: '#999',
    },
});
