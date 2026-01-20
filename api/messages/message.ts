import { db } from '@/config/firebase';
import { mockMessages } from '@/data/mock-messages';
import { IMessage } from '@/interface/message.interface';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DBcollections } from '../../constants/DBcollections';
import { handleError } from '../error-handler';


const getMessagesList = async (): Promise<IMessage[]> => {
    console.log(`fetching messages list from DB...`)
    try {
        const querySnapshot = await getDocs(collection(db, DBcollections.MESSAGES));
        const messages: IMessage[] = []

        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() } as IMessage);
        });

        return messages
    } catch (error) {
        handleError(error, 'Fetch Messages Error');
        return [];
    }
}


const addMessage = async (message: Omit<IMessage, 'id'>): Promise<IMessage> => {
    try {
        const docRef = await addDoc(collection(db, DBcollections.MESSAGES), message);
        console.log("Message created with ID: ", docRef.id);
        return { id: docRef.id, ...message };
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
            const result = await addDoc(collection(db, DBcollections.MESSAGES), messageData);
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
