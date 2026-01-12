import { Timestamp } from "firebase/firestore";

export type EventRSVPStatus = "joined" | "interested" | null;

export type IEvent = {
    id: string;
    title: string;
    date: Timestamp;
    time: string;
    location: string;
    isOnline: boolean;
    description: string;
    fullDescription: string;
    coverImage: string;
    category: string;
    organizer: {
        name: string;
        avatar: string;
        contact: string;
    };
    attendees: number;
    capacity?: number;
    interested: number;
    schedule: { time: string; activity: string }[];
    pastPhotos: string[];
    comments: { user: string; avatar: string; comment: string; time: string }[];
    featured?: boolean;
    trending?: boolean;
    userRSVP?: EventRSVPStatus;
};