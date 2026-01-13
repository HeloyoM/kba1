import { db } from '@/config/firebase';
import { DBcollections } from '@/constants/DBcollections';
import { IEvent } from '@/interface/events.interface';
import { addDoc, arrayUnion, collection, doc, getDocs, updateDoc, } from 'firebase/firestore';

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
        console.error('getEventsList error:', error);
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
        console.error(`Error adding comment to event ${eventId}:`, error);
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
        console.log(`something went wrong while adding event:  ${error}`)
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
