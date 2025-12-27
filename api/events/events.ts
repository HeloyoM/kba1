import { db, auth } from '@/config/firebase';
import { collection, getDoc, doc, getDocs, addDoc, serverTimestamp, query, where, setDoc, } from 'firebase/firestore';
import { mockEvents } from '@/data/mock-events';
import { IEvent } from '@/interface/events.interface';


const getEventsList = async () => {
    console.log(`fetching events lsit from DB`)
    try {

        const querySnapshot = await getDocs(collection(db, "events"));

        console.log(`Events list stanpShot: ${querySnapshot}`)
        console.log('extracting...')
        const events: IEvent[] = []

        querySnapshot.forEach((doc) => {
            events.push(doc.data() as IEvent);
        });

        console.log(`Final events list: ${events}`)
        return events
    } catch (error) {
        console.log(`something went wrong... ${error}`)
    }
}


const insertEvet = async (newEvent: Partial<IEvent>) => {
    try {
        console.log(`the new event is about to pushed`)
        console.log(`event title: ${newEvent.title}`)
        console.log(`save the date ${newEvent.date}`)
        const result = await addDoc(collection(db, 'events'), newEvent);
        if (result.id) {
            console.log(`new events is inserted successfully, with the given id: ${result.id}`)
        }
    } catch (error) {
        console.log(`something went wrong while adding event:  ${error}`)
    }
}

const migrationFunc = async (): Promise<void> => {
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
}


export {
    migrationFunc,
    getEventsList,
    insertEvet
}