export enum CampaignTypeEnum {
    DONATE = 'donate',
    VOLUNTEER = 'volunteer',
    AWARENESS = 'awareness',
    PETITION = 'petition',
    EVENT = 'event',
}

export type CampaignType = CampaignTypeEnum;

export type CampaignStatus = 'active' | 'completed' | 'upcoming';

export interface ICampaign {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    type: CampaignType;
    status: CampaignStatus;
    image: string;
    organizer: {
        name: string;
        avatar: string;
        role: string;
    };
    goal?: number;
    current?: number;
    unit?: string;
    startDate: string;
    endDate: string;
    deadline: string;
    participants: Array<{
        id: string;
        name: string;
        avatar: string;
        contribution?: string;
    }>;
    tags: string[];
    featured: boolean;
    urgent: boolean;
    trending: boolean;
    mediaGallery?: string[];
    comments: Array<{
        id: string;
        author: string;
        avatar: string;
        content: string;
        timestamp: string;
    }>;
}
