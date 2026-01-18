import { CampaignTypeEnum, ICampaign } from '@/interface/campaign.interface';

export interface CampaignFeedProps {
    onViewCampaign: (campaign: ICampaign) => void;
    onCreateCampaign: () => void;
    initialType?: CampaignTypeEnum | 'all';
}

export type SortOption = 'deadline' | 'popularity' | 'recent' | 'donate' | 'volunteer' | 'awareness' | 'petition' | 'event';

export interface FilterOption {
    value: CampaignTypeEnum | 'all';
    label: string;
}
