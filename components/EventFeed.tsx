import React, { useState, useMemo, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { IEvent } from "@/interface/events.interface";
import { getEventsList } from "@/api/events/events";

type ViewMode = "list" | "calendar";
type DateFilter = "all" | "today" | "week" | "upcoming";
type SortOption = "newest" | "trending" | "popular";

interface EventFeedProps {
    onEventClick: (event: IEvent) => void;
}


export function EventFeed({ onEventClick }: EventFeedProps) {
    const [events, setEvents] = useState<IEvent[]>([]);
    const [viewMode, setViewMode] = useState<ViewMode>("list");
    const [searchQuery, setSearchQuery] = useState("");
    const [dateFilter, setDateFilter] = useState<DateFilter>("all");
    const [categoryFilter, setCategoryFilter] = useState<string>("all");
    const [sortBy, setSortBy] = useState<SortOption>("newest");


    useEffect(() => {
        if (events.length) return

        else {
            fetchEvents()
        }
    }, [events])

    const fetchEvents = async () => {
        try {
            const eventsList = await getEventsList();

            if (eventsList) {
                setEvents(eventsList)
            }
        } catch (error) {

        }
    }
    const categories = useMemo(() => {
        const cats = new Set(events.map((e) => e.category));
        return ["all", ...Array.from(cats)];
    }, [events]);

    const filteredAndSortedEvents = useMemo(() => {
        let filtered = events.filter((event) => {
            const lower = searchQuery.toLowerCase();

            if (
                searchQuery &&
                !event.title.toLowerCase().includes(lower) &&
                !event.description.toLowerCase().includes(lower)
            ) {
                return false;
            }

            if (categoryFilter !== "all" && event.category !== categoryFilter) {
                return false;
            }

            const now = new Date();
            const eventDate = new Date(event.date);

            if (dateFilter === "today") {
                return eventDate.toDateString() === now.toDateString();
            } else if (dateFilter === "week") {
                const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                return eventDate >= now && eventDate <= weekFromNow;
            } else if (dateFilter === "upcoming") {
                return eventDate >= now;
            }

            return true;
        });
        console.log({ filtered })
        filtered.sort((a, b) => {
            if (sortBy === "newest") { // Todo: invalid date Timesamp is arraving from db
                return new Date(b.date).getUTCMilliseconds() - new Date(a.date).getUTCMilliseconds();
            } else if (sortBy === "trending") {
                return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
            } else if (sortBy === "popular") {
                return b.attendees - a.attendees;
            }
            return 0;
        });

        return filtered;
    }, [events, searchQuery, dateFilter, categoryFilter, sortBy]);

    const featuredEvents = events.filter((e) => e.featured);
    const upcomingUserEvents = events.filter(
        (e) => e.userRSVP === "joined" && e.date > new Date()
    );

    return (
        <ScrollView
            style={{
                padding: 16,
                backgroundColor: "#ffffff",
            }}
        >
            {upcomingUserEvents.length > 0 && (
                <View
                    style={{
                        backgroundColor: "#faf1ff",
                        borderWidth: 1,
                        borderColor: "#d8b4fe",
                        padding: 12,
                        borderRadius: 12,
                        marginBottom: 16,
                    }}
                >
                    <View style={{ flexDirection: "row", gap: 12 }}>
                        <View
                            style={{
                                padding: 10,
                                backgroundColor: "#f3e8ff",
                                borderRadius: 10,
                            }}
                        >
                            <Feather name="bell" size={20} color="#a855f7" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ color: "#111", fontSize: 16 }}>
                                Upcoming Events
                            </Text>
                            <Text
                                style={{
                                    color: "#555",
                                    marginTop: 4,
                                    fontSize: 13,
                                }}
                            >
                                You have {upcomingUserEvents.length} upcoming event
                                {upcomingUserEvents.length !== 1 ? "s" : ""}.
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            {/* Search Bar */}
            <View style={{ position: "relative", marginBottom: 16 }}>
                <Feather
                    name="search"
                    size={20}
                    color={"#999"}
                    style={{ position: "absolute", left: 12, top: 14 }}
                />

                <TextInput
                    placeholder="Search events..."
                    placeholderTextColor={"#999"}
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    style={{
                        backgroundColor: "#f3f3f3",
                        borderWidth: 1,
                        borderColor: "#ddd",
                        paddingVertical: 12,
                        paddingLeft: 42,
                        paddingRight: 12,
                        borderRadius: 10,
                        color: "#111",
                    }}
                />
            </View>

            {/* View Mode Toggle */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    marginBottom: 16,
                }}
            >
                <TouchableOpacity
                    onPress={() => setViewMode("list")}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor:
                            viewMode === "list" ? ("#fff") : "transparent",
                        borderWidth: 1,
                        borderColor: viewMode === "list" ? "#a855f7" : "transparent",
                    }}
                >
                    <Feather
                        name="grid"
                        size={18}
                        color={viewMode === "list" ? "#a855f7" : "#555"}
                    />
                    <Text
                        style={{
                            marginLeft: 6,
                            color: viewMode === "list" ? "#a855f7" : "#333",
                        }}
                    >
                        List
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => setViewMode("calendar")}
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingVertical: 8,
                        paddingHorizontal: 16,
                        borderRadius: 8,
                        backgroundColor:
                            viewMode === "calendar" ? ("#fff") : "transparent",
                        borderWidth: 1,
                        borderColor: viewMode === "calendar" ? "#a855f7" : "transparent",
                    }}
                >
                    <Feather
                        name="calendar"
                        size={18}
                        color={viewMode === "calendar" ? "#a855f7" : "#555"}
                    />
                    <Text
                        style={{
                            marginLeft: 6,
                            color:
                                viewMode === "calendar" ? "#a855f7" : "#333",
                        }}
                    >
                        Calendar
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Results Count */}
            <Text style={{ marginBottom: 12, color: "#555" }}>
                {filteredAndSortedEvents.length} event
                {filteredAndSortedEvents.length !== 1 ? "s" : ""} found
            </Text>

            {/* EVENT LIST (you will plug in EventCard RN version later) */}
            {viewMode === "list" && (
                <View style={{ gap: 16 }}>
                    {filteredAndSortedEvents.map((event) => (
                        <TouchableOpacity
                            key={event.id}
                            onPress={() => onEventClick(event)}
                            style={{
                                padding: 16,
                                backgroundColor: "#fafafa",
                                borderRadius: 12,
                                borderWidth: 1,
                                borderColor: "#eee",
                            }}
                        >
                            <Text
                                style={{ color: "#111", fontSize: 16, marginBottom: 4 }}
                            >
                                {event.title}
                            </Text>
                            <Text style={{ color: "#666" }}>
                                {new Date(event.date).toLocaleDateString()} — {event.location}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}

            {/* CALENDAR VIEW (placeholder until you build your RN version) */}
            {viewMode === "calendar" && (
                <View
                    style={{
                        padding: 20,
                        marginTop: 20,
                        backgroundColor: "#f3f3f3",
                        borderRadius: 12,
                        alignItems: "center",
                    }}
                >
                    <Text style={{ color: "#666" }}>
                        Calendar view coming soon…
                    </Text>
                </View>
            )}

            {/* Empty State */}
            {filteredAndSortedEvents.length === 0 && (
                <View style={{ alignItems: "center", padding: 40 }}>
                    <Feather
                        name="calendar"
                        size={40}
                        color={"#bbb"}
                    />
                    <Text style={{ color: "#111", marginTop: 12 }}>
                        No events found
                    </Text>
                    <Text style={{ color: "#666", marginTop: 4 }}>
                        Try adjusting your filters or search query
                    </Text>
                </View>
            )}
        </ScrollView>
    );
}
