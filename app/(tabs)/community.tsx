import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { CampaignFeed } from '@/components/CampaignFeed';
import { CampaignDetails } from '@/components/CampaignDetails';
import { ICampaign } from '@/interface/campaign.interface';
// import { CampaignForm } from '@/components/CampaignForm';

type ViewType = 'feed' | 'details' | 'create' | 'edit';

export default function Community() {
    const [currentView, setCurrentView] = useState<ViewType>('feed');
    const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);

    const handleViewCampaign = (campaign: ICampaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('details');
    };

    const handleCreateCampaign = () => {
        setSelectedCampaign(null);
        setCurrentView('create');
    };

    const handleEditCampaign = (campaign: ICampaign) => {
        setSelectedCampaign(campaign);
        setCurrentView('edit');
    };

    const handleBackToFeed = () => {
        setCurrentView('feed');
        setSelectedCampaign(null);
    };

    const handleSaveCampaign = (campaign: ICampaign) => {
        // In a real app, this would save to backend
        console.log('Saving campaign:', campaign);
        handleBackToFeed();
    };

    return (
        <SafeAreaView style={styles.container}>
            {currentView === 'feed' && (
                <CampaignFeed
                    onViewCampaign={handleViewCampaign}
                    onCreateCampaign={handleCreateCampaign}
                />
            )}

            {currentView === 'details' && selectedCampaign && (
                <CampaignDetails
                    campaign={selectedCampaign}
                    onBack={handleBackToFeed}
                    onEdit={handleEditCampaign}
                />
            )}

            {/* {(currentView === 'create' || currentView === 'edit') && (
                <CampaignForm
                    campaign={selectedCampaign}
                    onSave={handleSaveCampaign}
                    onCancel={handleBackToFeed}
                />
            )} */}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
