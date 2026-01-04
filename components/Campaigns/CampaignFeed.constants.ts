import { CampaignTypeEnum } from '@/interface/campaign.interface';
import { FilterOption, SortOption } from './CampaignFeed.types';

export const CAMPAIGN_TYPES: FilterOption[] = [
    { value: 'all', label: 'All' },
    { value: CampaignTypeEnum.DONATE, label: 'Donate' },
    { value: CampaignTypeEnum.VOLUNTEER, label: 'Volunteer' },
    { value: CampaignTypeEnum.AWARENESS, label: 'Awareness' },
    { value: CampaignTypeEnum.PETITION, label: 'Petition' },
    { value: CampaignTypeEnum.EVENT, label: 'Event' },
];

export const SORT_OPTIONS: SortOption[] = [
    'deadline',
    'popularity',
    'recent',
    'donate',
    'volunteer',
    'awareness',
    'petition',
    'event'
];
