import { db } from '@/config/firebase';
import { collection, getDocs, addDoc, } from 'firebase/firestore';
import { IEvent } from '@/interface/events.interface';

const getEventsList = async () => {
    console.log(`fetching events lsit from DB...`)
    try {

        const querySnapshot = await getDocs(collection(db, "events"));

        const events: IEvent[] = []

        querySnapshot.forEach((doc) => {
            events.push(doc.data() as IEvent);
        });

        return events
    } catch (error) {
        // do something
    }
}


const insertEvet = async (newEvent: Partial<IEvent>) => {
    try {
        const result = await addDoc(collection(db, 'events'), newEvent);
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
    getEventsList,
    insertEvet,
    //migrationFunc,
}