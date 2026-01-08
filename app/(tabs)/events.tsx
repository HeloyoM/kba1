
import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { IconSymbol } from '@/components/ui/icon-symbol';
import Toast from "react-native-toast-message";
import { EventFeed } from '@/components/Events/EventFeed';
import { EventDetails } from '@/components/Events/EventDetails';
import EventCreation from '@/components/Events/EventCreation';
import { IEvent } from '@/interface/events.interface';

type ViewType = "feed" | "details" | "create";

export default function Events() {
  const [currentView, setCurrentView] = useState<ViewType>("feed");
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);

  const handleEventClick = (event: IEvent) => {
    setSelectedEvent(event);
    setCurrentView("details");
  };

  const handleBackToFeed = () => {
    setSelectedEvent(null);
    setCurrentView("feed");
  };

  const handleCreateEvent = () => {
    setCurrentView("create");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={"dark-content"}
      />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.iconBox}>
            <IconSymbol name="calendar" size={22} color="#fff" />
          </View>

          <View>
            <Text style={styles.title}>Community Events</Text>

            {(currentView === "details" || currentView === "create") && (
              <TouchableOpacity onPress={handleBackToFeed}>
                <Text style={styles.backBtn}>← Back to events</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.headerRight}>
          {currentView === "feed" && (
            <TouchableOpacity onPress={handleCreateEvent} style={styles.createBtn}>
              <IconSymbol name="plus" size={20} color="#fff" />
              <Text style={styles.createText}>Create Event</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={styles.content}>

        {/* <Pressable onPress={migrationFunc}>
          <Text> Migrate</Text>
        </Pressable> */}

        {currentView === "feed" && (
          <EventFeed onEventClick={handleEventClick} />
        )}
        {currentView === "details" && selectedEvent && (
          <EventDetails event={selectedEvent} onBack={handleBackToFeed} />
        )}
        {currentView === "create" && (
          <EventCreation
            onCancel={handleBackToFeed}
          />
        )}
      </View>

      <Toast />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  darkBackground: {
    backgroundColor: "#0d0d0d",
  },
  header: {
    height: 60,
    borderBottomWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    backgroundColor: "#ffffff",
    elevation: 4,
  },
  headerDark: {
    backgroundColor: "#1a1a1a",
    borderColor: "#333",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
  },
  textWhite: {
    color: "#fff",
  },
  backBtn: {
    fontSize: 14,
    color: "#a855f7",
    marginTop: 2,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#a855f7",
    alignItems: "center",
    justifyContent: "center",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  toggleDarkMode: {
    padding: 8,
  },
  createBtn: {
    flexDirection: "row",
    backgroundColor: "#a855f7",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    gap: 6,
  },
  createText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  content: {
    flex: 1,
    padding: 16,
  },
});