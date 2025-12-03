// ActivityOverview.js
import { useAppUser } from '@/context/auth.context';
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
// import { MessageSquare, Calendar, Users, FileText, ChevronRight } from 'lucide-react-native';

export default function ActivityOverview() {
  const { user } = useAppUser();
  const activities = [
    { icon: <></>, label: "Posts Created", count: 42, color: "#2563eb" },
    { icon: <></>, label: "Events Joined", count: 15, color: "#16a34a" },
    { icon: <></>, label: "Groups Followed", count: 8, color: "#7c3aed" },
    { icon: <></>, label: "Messages Received", count: 127, color: "#ea580c" },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activity Overview</Text>

      <View style={styles.grid}>
        {activities.map((item, index) => {
          const Icon = item.icon;
          return (
            <View key={index} style={styles.statCard}>
              {/* <Icon size={22} color={item.color} style={{ marginBottom: 6 }} /> */}
              <Text style={styles.count}>{item.count}</Text>
              <Text style={styles.label}>{item.label}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.quickLinks}>
        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>View All Activity</Text>
          {/* <ChevronRight size={20} color="#9ca3af" /> */}
        </TouchableOpacity>

        <TouchableOpacity style={styles.link}>
          <Text style={styles.linkText}>Activity History</Text>
          {/* <ChevronRight size={20} color="#9ca3af" /> */}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 12,
    fontWeight: "600",
    color: "#111827",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    justifyContent: "space-between",
  },
  statCard: {
    width: "48%",
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },
  count: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },
  label: {
    color: "#6b7280",
  },
  quickLinks: {
    marginTop: 14,
  },
  link: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f3f4f6",
    padding: 12,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  linkText: {
    color: "#374151",
    fontSize: 15,
  },
});
