import { CampaignDetails } from '@/components/Campaigns/CampaignDetails';
import { CampaignFeed } from '@/components/Campaigns/CampaignFeed';
import { CampaignForm } from '@/components/Campaigns/CampaignForm';
import { useDemo } from '@/context/demo.context';
import { CampaignTypeEnum, ICampaign } from '@/interface/campaign.interface';
import { useLocalSearchParams } from 'expo-router';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';

type ViewType = 'feed' | 'details' | 'create' | 'edit';

export default function Community() {
    const { type } = useLocalSearchParams<{ type: CampaignTypeEnum | 'all' }>();
    const [currentView, setCurrentView] = useState<ViewType>('feed');
    const [selectedCampaign, setSelectedCampaign] = useState<ICampaign | null>(null);
    const { registerLayout } = useDemo();

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
        <SafeAreaView style={styles.container}
            onLayout={(e) => {
                const layout = e.nativeEvent.layout;
                registerLayout('community_header', {
                    x: layout.x,
                    y: layout.y + 110, // Approximate header offset
                    width: layout.width,
                    height: layout.height
                });
            }}>
            {currentView === 'feed' && (
                <CampaignFeed
                    onViewCampaign={handleViewCampaign}
                    onCreateCampaign={handleCreateCampaign}
                    initialType={type}
                />
            )}

            {currentView === 'details' && selectedCampaign && (
                <CampaignDetails
                    campaign={selectedCampaign}
                    onBack={handleBackToFeed}
                    onEdit={handleEditCampaign}
                />
            )}

            {(currentView === 'create' || currentView === 'edit') && (
                <CampaignForm
                    campaign={selectedCampaign}
                    onSave={() => handleSaveCampaign(null as any)}
                    onCancel={handleBackToFeed}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
});
