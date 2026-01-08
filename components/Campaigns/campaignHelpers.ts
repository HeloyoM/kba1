import { CampaignTypeEnum } from '@/interface/campaign.interface';
import { Feather } from "@expo/vector-icons";
import React from 'react';

export const calculateProgress = (current: number | undefined, goal: number | undefined): number => {
    if (!current || !goal || goal === 0) return 0;

    else return (current / goal) * 100;
};

type CampaignActionHandlers = {
    onDonate: () => void;
    onParticipate: () => void;
};

export const getCampaignActionConfig = (type: CampaignTypeEnum, handlers: CampaignActionHandlers) => {
    switch (type) {
        case CampaignTypeEnum.DONATE:
            return {
                icon: 'dollar-sign' as React.ComponentProps<typeof Feather>['name'],
                text: 'Donate Now',
                onPress: handlers.onDonate,
            };
        case CampaignTypeEnum.VOLUNTEER:
        case CampaignTypeEnum.EVENT:
            return {
                icon: 'heart' as React.ComponentProps<typeof Feather>['name'],
                text: 'Join Campaign',
                onPress: handlers.onParticipate,
            };
        case CampaignTypeEnum.AWARENESS:
            return {
                icon: 'bell' as React.ComponentProps<typeof Feather>['name'],
                text: 'Spread Awareness',
                onPress: handlers.onParticipate,
            };
        default:
            return null;
    }
};
