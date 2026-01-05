import { getEventsList } from "@/api/events/events";
import { IEvent } from "@/interface/events.interface";
import { useEffect, useMemo, useState } from 'react';

export type ViewMode = "list" | "calendar";

export const useEvents = () => {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [refreshing, setRefreshing] = useState(false);

    const fetchEvents = async () => {
        try {
            const list = await getEventsList();
            setEvents(list || []);
        } catch (error) {
            console.error('Failed to fetch events:', error);
            setEvents([]);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchEvents();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchEvents();
    };

    const filteredEvents = useMemo(() => {
        const query = searchQuery.toLowerCase();
        return events
            .filter(e => !query ||
                e.title.toLowerCase().includes(query) ||
                e.description.toLowerCase().includes(query)
            )
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [events, searchQuery]);

    const upcomingUserEvents = useMemo(() =>
        events.filter(e => e.userRSVP === 'joined' && new Date(e.date) > new Date()),
        [events]);

    return {
        events,
        viewMode,
        setViewMode,
        searchQuery,
        setSearchQuery,
        refreshing,
        onRefresh,
        filteredEvents,
        upcomingUserEvents,
    };
};
