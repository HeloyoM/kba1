import { db } from '@/config/firebase';
import { mockMessages } from '@/data/mock-messages';
import { IAuthor, IMessage } from '@/interface/message.interface';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DBcollections } from '../../constants/DBcollections';
import { getUserById, getUsersList } from '../auth/users';
import { handleError } from '../error-handler';

const messagesRef = collection(db, DBcollections.MESSAGES);

const getMessagesList = async (): Promise<IMessage[]> => {
    console.log(`fetching messages list from DB...`)
    try {
        const [messagesSnapshot, users] = await Promise.all([
            getDocs(messagesRef),
            getUsersList()
        ]);

        const authorsMap: Record<string, IAuthor> = {};

        // Build a map of all users for quick lookup
        if (users) {
            users.forEach(user => {
                const authorId = user.uid || user.id;
                authorsMap[authorId] = {
                    id: authorId,
                    name: user.givenName || user.name || 'Anonymous',
                    avatar: user.photoUrl || 'https://via.placeholder.com/150'
                };
            });
        }

        const messages: IMessage[] = []

        messagesSnapshot.forEach((doc) => {
            const data = doc.data();
            const authorId = data.author;

            const resolvedAuthor: IAuthor = typeof authorId === 'string'
                ? (authorsMap[authorId] || {
                    id: authorId,
                    name: 'Unknown User',
                    avatar: 'https://via.placeholder.com/150'
                })
                : authorId; // In case it's already an object (legacy/mock)

            messages.push({ ...data, id: doc.id, author: resolvedAuthor } as IMessage);
        });

        console.log({ messages })
        return messages
    } catch (error) {
        handleError(error, 'Fetch Messages Error');
        return [];
    }
}


const addMessage = async (message: Omit<IMessage, 'id'>): Promise<IMessage> => {
    try {
        // Convert IAuthor back to string (id) for storage
        const authorId = typeof message.author === 'object' ? message.author.id : message.author;
        const firestoreData = { ...message, author: authorId };

        const docRef = await addDoc(messagesRef, firestoreData);
        console.log("Message created with ID: ", docRef.id);

        // Resolve author detail for the returned object
        let resolvedAuthor = message.author as IAuthor;
        if (typeof message.author === 'string') {
            const user = await getUserById(message.author);
            resolvedAuthor = {
                id: message.author,
                name: user?.givenName || user?.name || 'Anonymous',
                avatar: user?.photoUrl || 'https://via.placeholder.com/150'
            };
        }

        return { id: docRef.id, ...message, author: resolvedAuthor } as IMessage;
    } catch (error) {
        handleError(error, 'Add Message Error');
        throw error;
    }
}

const updateMessage = async (id: string, data: Partial<IMessage>): Promise<void> => {
    try {
        const messageRef = doc(db, DBcollections.MESSAGES, id);
        await updateDoc(messageRef, data);
        console.log("Message updated successfully");
    } catch (error) {
        handleError(error, 'Update Message Error');
        throw error;
    }
}

const deleteMessage = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, DBcollections.MESSAGES, id));
        console.log("Message deleted successfully");
    } catch (error) {
        handleError(error, 'Delete Message Error');
        throw error;
    }
}

const migrationFunc = async (): Promise<void> => {
    try {
        console.log("Starting messages migration...");
        for (const msg of mockMessages) {
            console.log(`Pushing message ${msg.id} to firestore...`)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...messageData } = msg;

            // Ensure author is stored as an ID string
            const firestoreData = {
                ...messageData,
                author: typeof msg.author === 'object' ? msg.author.id : msg.author
            };

            const result = await addDoc(messagesRef, firestoreData);
            if (result.id) {
                console.log(`Message ${msg.id} successfully migrated to Firestore with new ID: ${result.id}`)
            }
        }
        console.log("Messages migration completed successfully.");
    } catch (error) {
        console.error("Migration failed!", error);
    }
}

export {
    addMessage, deleteMessage, getMessagesList, migrationFunc, updateMessage
};

