import { ICampaign } from '@/interface/campaign.interface';
import React from 'react';
import { AboutTabContent } from './tabs/AboutTabContent';
import { CommentsTabContent } from './tabs/CommentsTabContent';
import { ParticipantsTabContent } from './tabs/ParticipantsTabContent';

export type TabId = 'about' | 'participants' | 'comments';

export interface TabConfig {
    id: TabId;
    label: string;
    getBadgeCount?: (campaign: ICampaign) => number;
    renderContent: (
        campaign: ICampaign,
        commentInputText: string,
        onCommentTextChange: (text: string) => void,
        onPostComment: () => void
    ) => React.ReactNode;
}

export const TABS: TabConfig[] = [
    {
        id: 'about',
        label: 'About',
        renderContent: (campaign) => (
            <AboutTabContent
                description={campaign.fullDescription}
                mediaGallery={campaign.mediaGallery}
            />
        ),
    },
    {
        id: 'participants',
        label: 'Participants',
        getBadgeCount: (campaign) => campaign.participants.length,
        renderContent: (campaign) => (
            <ParticipantsTabContent participants={campaign.participants} />
        ),
    },
    {
        id: 'comments',
        label: 'Comments',
        getBadgeCount: (campaign) => campaign.comments.length,
        renderContent: (campaign, commentInputText, onCommentTextChange, onPostComment) => (
            <CommentsTabContent
                comments={campaign.comments}
                commentInputText={commentInputText}
                onCommentTextChange={onCommentTextChange}
                onPostComment={onPostComment}
            />
        ),
    },
    
];
