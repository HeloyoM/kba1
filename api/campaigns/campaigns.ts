import { db } from '@/config/firebase';
import { collection, getDocs, addDoc, writeBatch } from 'firebase/firestore';
import { ICampaign } from '@/interface/campaign.interface';
import { mockCampaigns } from '@/data/mock-campaigns';

const getCampaignsList = async () => {
    console.log(`fetching campaigns lsit from DB...`)
    try {

        const querySnapshot = await getDocs(collection(db, "campaigns"));

        console.log({ querySnapshot })
        const campaigns: ICampaign[] = []

        querySnapshot.forEach((doc) => {
            campaigns.push(doc.data() as ICampaign);
        });

        return campaigns
    } catch (error) {
        console.log(error)
        // do something
    }
}

const migrationFunc = async (): Promise<void> => {
    try {
        // console.log(mockCampaigns.length)

        // const snapshot = await getDocs(collection(db, "campaigns"));

        // const batch = writeBatch(db)

        // snapshot.docs.forEach(doc => {
        //     batch.update(doc.ref, {
        //         id: '',
        //         title: '',
        //         description: '',
        //         fullDescription: '',
        //         type: 'donate',
        //         status: 'active',
        //         image: '',
        //         organizer: {
        //             name: '',
        //             avatar: '',
        //             role: ''
        //         },
        //         goal: 0,
        //         current: 0,
        //         unit: '',
        //         startDate: '',
        //         endDate: '',
        //         deadline: '',
        //         participants: [
        //             {
        //                 id: '',
        //                 name: '',
        //                 avatar: '',
        //                 contribution: '',
        //             }
        //         ],
        //         tags: [''],
        //         featured: true,
        //         urgent: true,
        //         trending: true,
        //         mediaGallery: [''],
        //         comments: [{
        //             id: '',
        //             author: '',
        //             avatar: '',
        //             content: '',
        //             timestamp: ''
        //         }]
        //     });
        // });

        // await batch.commit();
        // console.log('Migration completed');

        mockCampaigns.forEach(async (e: ICampaign) => {
            console.log(`pushing e ${e.id} to firestore...`)
            const result = await addDoc(collection(db, 'campaigns'), e);
            if (result.id) {
                console.log(`campaign ${e.id} successfully pushed to firestore...`)
            }
        });

    } catch (error) {
        console.log(`migation failed!, ${error}`)
    }
}

export {
    migrationFunc,
    getCampaignsList
}