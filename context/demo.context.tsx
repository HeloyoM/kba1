import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePathname, useRouter } from 'expo-router';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export interface DemoStep {
    targetId: string;
    text: string;
    page: string;
    onBefore?: () => void | Promise<void>;
    position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

interface LayoutInfo {
    x: number;
    y: number;
    width: number;
    height: number;
}

interface DemoContextType {
    isTourActive: boolean;
    currentStepIndex: number;
    steps: DemoStep[];
    targetLayouts: Record<string, LayoutInfo>;
    startTour: () => void;
    nextStep: () => void;
    stopTour: () => void;
    registerLayout: (id: string, layout: LayoutInfo) => void;
    hasCompletedTour: boolean;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const STORAGE_KEY = '@kba_tour_completed';

export const steps: DemoStep[] = [
    {
        targetId: 'home_fast_buttons',
        text: 'Welcome! These are your fast access buttons to create events and join campaigns.',
        page: '/',
        position: 'bottom',
    },
    {
        targetId: 'messages_plus',
        text: 'Click here to create a new message for the community.',
        page: '/messages',
        position: 'bottom',
    },
    {
        targetId: 'messages_feed',
        text: 'Here you can make long press on the messages and mark it as read/unread.',
        page: '/messages',
        position: 'bottom',
    },
    {
        targetId: 'messages_load_more',
        text: 'Use this to see older messages.',
        page: '/messages',
        position: 'top',
    },
    {
        targetId: 'community_header',
        text: 'This is the Community section where all active campaigns are displayed.',
        page: '/community',
        position: 'bottom',
    },
    {
        targetId: 'community_new_campaign',
        text: 'Start your own campaign here!',
        page: '/community',
        position: 'bottom',
    },
    {
        targetId: 'community_filters',
        text: 'Use these filters to find specific types of campaigns or sort them.',
        page: '/community',
        position: 'bottom',
        onBefore: () => {
            // This will be handled in the component side if possible or via context
        }
    },
    {
        targetId: 'events_create',
        text: 'Organize your own community event here!',
        page: '/events',
        position: 'bottom',
    }
];

export const DemoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isTourActive, setIsTourActive] = useState(false);
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [targetLayouts, setTargetLayouts] = useState<Record<string, LayoutInfo>>({});
    const [hasCompletedTour, setHasCompletedTour] = useState(false);

    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkTourStatus = async () => {
            const completed = await AsyncStorage.getItem(STORAGE_KEY);
            if (completed === 'true') {
                setHasCompletedTour(true);
            } else {
                // Automatically start for new users
                // setIsTourActive(true); // We'll trigger this from the Home screen to ensure app is ready
            }
        };
        checkTourStatus();
    }, []);

    const startTour = useCallback(() => {
        setCurrentStepIndex(0);
        setIsTourActive(true);
        router.replace(steps[0].page as any);
    }, [router]);

    const stopTour = useCallback(async () => {
        setIsTourActive(false);
        setHasCompletedTour(true);
        await AsyncStorage.setItem(STORAGE_KEY, 'true');
    }, []);

    const nextStep = useCallback(async () => {
        if (currentStepIndex < steps.length - 1) {
            const nextIdx = currentStepIndex + 1;
            const nextStepData = steps[nextIdx];

            if (nextStepData.onBefore) {
                await nextStepData.onBefore();
            }

            if (pathname !== nextStepData.page) {
                router.push(nextStepData.page as any);
            }

            setCurrentStepIndex(nextIdx);
        } else {
            stopTour();
        }
    }, [currentStepIndex, pathname, router, stopTour]);

    const registerLayout = useCallback((id: string, layout: LayoutInfo) => {
        setTargetLayouts((prev) => ({ ...prev, [id]: layout }));
    }, []);

    return (
        <DemoContext.Provider
            value={{
                isTourActive,
                currentStepIndex,
                steps,
                targetLayouts,
                startTour,
                nextStep,
                stopTour,
                registerLayout,
                hasCompletedTour,
            }}
        >
            {children}
        </DemoContext.Provider>
    );
};

export const useDemo = () => {
    const context = useContext(DemoContext);
    if (context === undefined) {
        throw new Error('useDemo must be used within a DemoProvider');
    }
    return context;
};
