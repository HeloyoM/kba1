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
        onPostComment: () => void,
        header: React.ReactNode
    ) => React.ReactNode;
}

export const TABS: TabConfig[] = [
    {
        id: 'about',
        label: 'About',
        renderContent: (campaign, _1, _2, _3, header) => (
            <AboutTabContent
                description={campaign.fullDescription}
                mediaGallery={campaign.mediaGallery}
                header={header}
            />
        ),
    },
    {
        id: 'participants',
        label: 'Participants',
        getBadgeCount: (campaign) => campaign.participants.length,
        renderContent: (campaign, _1, _2, _3, header) => (
            <ParticipantsTabContent participants={campaign.participants} header={header} />
        ),
    },
    {
        id: 'comments',
        label: 'Comments',
        getBadgeCount: (campaign) => campaign.comments.length,
        renderContent: (campaign, commentInputText, onCommentTextChange, onPostComment, header) => (
            <CommentsTabContent
                comments={campaign.comments}
                commentInputText={commentInputText}
                onCommentTextChange={onCommentTextChange}
                onPostComment={onPostComment}
                header={header}
            />
        ),
    },

];
