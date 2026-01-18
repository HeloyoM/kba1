import { Timestamp } from "firebase/firestore";

export type EventRSVPStatus = "joined" | "interested" | null;

export type IEvent = {
    id: string;
    title: string;
    date: Timestamp;
    time: Timestamp;
    location: string;
    isOnline: boolean;
    description: string;
    fullDescription: string;
    coverImage: string;
    category: string;
    organizer: EventOrganizer;
    attendees: number;
    capacity?: number;
    interested: number;
    schedule: EventSchedule[];
    pastPhotos: string[];
    comments: EventComment[];
    featured?: boolean;
    trending?: boolean;
    userRSVP?: EventRSVPStatus;
};

export interface EventComment {
    user: string;
    avatar: string;
    comment: string;
    time: Timestamp
}

interface EventOrganizer {
    name: string;
    avatar: string;
    contact: string;
}

interface EventSchedule {
    time: Timestamp;
    activity: string
}