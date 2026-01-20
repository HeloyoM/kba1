import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import { IEvent } from '@/interface/events.interface';
import { addDoc, arrayUnion, collection, doc, getDocs, updateDoc, } from 'firebase/firestore';
import { handleError } from '../error-handler';

const eventsRef = collection(db, DBcollections.EVENTS);

const getEventsList = async () => {
    console.log(`fetching events lsit from DB...`)
    try {

        const querySnapshot = await getDocs(eventsRef);

        const events: IEvent[] = []

        querySnapshot.forEach((doc) => {
            events.push({ id: doc.id, ...doc.data() } as IEvent);
        });

        return events
    } catch (error) {
        handleError(error, 'Fetch Events Error');
    }
}

const addEventComment = async (eventId: string, comment: any) => {
    try {

        console.log({ eventId })
        const eventRef = doc(db, DBcollections.EVENTS, eventId);

        await updateDoc(eventRef, {
            comments: arrayUnion(comment)
        });
        console.log(`Comment added to event ${eventId}`);
    } catch (error) {
        handleError(error, 'Add Comment Error');
        throw error;
    }
}


const insertEvet = async (newEvent: Partial<IEvent>) => {
    try {
        const result = await addDoc(eventsRef, newEvent);
        if (result.id) {
            console.log(`new events is inserted successfully, with the given id: ${result.id}`)
        }
    } catch (error) {
        handleError(error, 'Add Event Error');
    }
}

/*const migrationFunc = async (): Promise<void> => {
    try {
        mockEvents.forEach(async (e: IEvent) => {
            console.log(`pushing e ${e.id} to firestore...`)
            const result = await addDoc(collection(db, 'events'), e);
            if (result.id) {
                console.log(`event ${e.id} successfully pushed to firestore...`)
            }
        });

    } catch (error) {
        console.log('migation failed!')
    }
}*/


export {
    addEventComment,
    getEventsList,
    insertEvet
};
