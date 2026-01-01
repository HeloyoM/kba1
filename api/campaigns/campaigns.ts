import { db } from '@/config/firebase';
import { mockCampaigns } from '@/data/mock-campaigns';
import { ICampaign } from '@/interface/campaign.interface';
import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { DBcollections } from '../../constants/DBcollections';

const getCampaignsList = async (): Promise<ICampaign[]> => {
    console.log(`fetching campaigns list from DB...`)
    try {
        const querySnapshot = await getDocs(collection(db, DBcollections.CAMPAIGNS));
        const campaigns: ICampaign[] = []

        querySnapshot.forEach((doc) => {
            campaigns.push({ id: doc.id, ...doc.data() } as ICampaign);
        });

        return campaigns
    } catch (error) {
        console.error("Error fetching campaigns:", error);
        return [];
    }
}

const addCampaign = async (campaign: Omit<ICampaign, 'id'>): Promise<ICampaign> => {
    try {
        const docRef = await addDoc(collection(db, DBcollections.CAMPAIGNS), campaign);
        console.log("Document written with ID: ", docRef.id);
        return { id: docRef.id, ...campaign };
    } catch (error) {
        console.error("Error adding campaign: ", error);
        throw error;
    }
}

const updateCampaign = async (id: string, data: Partial<ICampaign>): Promise<void> => {
    try {
        const campaignRef = doc(db, DBcollections.CAMPAIGNS, id);
        await updateDoc(campaignRef, data);
        console.log("Campaign updated successfully");
    } catch (error) {
        console.error("Error updating campaign: ", error);
        throw error;
    }
}

const deleteCampaign = async (id: string): Promise<void> => {
    try {
        await deleteDoc(doc(db, DBcollections.CAMPAIGNS, id));
        console.log("Campaign deleted successfully");
    } catch (error) {
        console.error("Error deleting campaign: ", error);
        throw error;
    }
}

const migrationFunc = async (): Promise<void> => {
    try {
        mockCampaigns.forEach(async (e: ICampaign) => {
            console.log(`pushing e ${e.id} to firestore...`)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...campaignData } = e; // Let Firestore generate the ID or use custom logic if needed, but usually we don't want to push 'id' field if it's the doc ID. 
            // However, previous code was pushing 'e'. Let's stick to simple spread, but typically we omit ID. 
            // If we want to preserve specific IDs, we'd use setDoc. modify if needed.
            // For now, adhering to previous pattern but cleaner.

            const result = await addDoc(collection(db, DBcollections.CAMPAIGNS), e);
            if (result.id) {
                console.log(`campaign ${e.id} successfully pushed to firestore...`)
            }
        });

    } catch (error) {
        console.log(`migation failed!, ${error}`)
    }
}

export {
    addCampaign, deleteCampaign, getCampaignsList, migrationFunc, updateCampaign
};
