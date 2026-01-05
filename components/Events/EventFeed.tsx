import { IEvent } from "@/interface/events.interface";
import React from "react";
import { RefreshControl, ScrollView, Text } from "react-native";
import { CalendarView } from "./CalendarView";
import { EventEmptyState } from "./EventEmptyState";
import { styles } from "./EventFeed.styles";
import { EventFeedHeader } from "./EventFeedHeader";
import { EventList } from "./EventList";
import { UpcomingEventsBanner } from "./UpcomingEventsBanner";
import { useEvents } from "./useEvents";

export function EventFeed({ onEventClick }: { onEventClick: (e: IEvent) => void }) {
    const {
        viewMode, setViewMode, searchQuery, setSearchQuery,
        refreshing, onRefresh, filteredEvents, upcomingUserEvents
    } = useEvents();

    const count = filteredEvents.length;
    const resultsText = `${count} event${count === 1 ? "" : "s"} found`;

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            style={styles.container}
        >
            <UpcomingEventsBanner count={upcomingUserEvents.length} />

            <EventFeedHeader
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
            />

            <Text style={styles.resultsCountText}>{resultsText}</Text>

            {viewMode === "list" ? (
                <EventList events={filteredEvents} onEventClick={onEventClick} />
            ) : (
                <CalendarView />
            )}

            {count === 0 && <EventEmptyState />}
        </ScrollView>
    );
}