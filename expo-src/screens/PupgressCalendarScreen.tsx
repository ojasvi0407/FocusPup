import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

export function PupgressCalendarScreen() {
  const [selectedDay, setSelectedDay] = useState(2); // Wednesday

  const days = [
    { name: 'Mon', num: 14, dot: '#8A9A86' },
    { name: 'Tue', num: 15, dot: '#E6AF65' },
    { name: 'Wed', num: 16, dot: '#D4836A', isToday: true },
    { name: 'Thu', num: 17, dot: '#8A9A86' },
    { name: 'Fri', num: 18, dot: '#8A9A86' },
    { name: 'Sat', num: 19, dot: '#8A9A86' },
    { name: 'Sun', num: 20, dot: '#D4836A', isExam: true },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Academic Planner Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Academic Planner</Text>
          <Text style={styles.subtitle}>
            Semester Spring 2026 · <Text style={{ color: '#D4836A', fontWeight: '700' }}>3 Exams Upcoming</Text>
          </Text>
        </View>

        {/* Hero Countdown Terracotta Card */}
        <View style={styles.examBanner}>
          <View style={styles.examTopRow}>
            <View style={styles.examTag}>
              <Text style={styles.examTagText}>🔔 NEXT EXAM IN 4 DAYS</Text>
            </View>
            <Text style={{ fontSize: 16 }}>🐾</Text>
          </View>
          <Text style={styles.examCourse}>Data Structures & Algorithms</Text>
          <Text style={styles.examDetails}>CS 201 · ⏱ 9:00 AM · 📍 Room 304</Text>

          <View style={styles.meterContainer}>
            <View style={styles.meterLabels}>
              <Text style={styles.meterLabelText}>Preparation Goal</Text>
              <Text style={styles.meterLabelText}>18 / 25 Study Hrs</Text>
            </View>
            <View style={styles.meterBarBackground}>
              <View style={[styles.meterBarFill, { width: '72%' }]} />
            </View>
          </View>
        </View>

        {/* Weekly Strip Calendar */}
        <View style={styles.weekCard}>
          <Text style={styles.weekTitle}>OCTOBER 14 – 20</Text>
          <View style={styles.daysRow}>
            {days.map((day, idx) => {
              const active = selectedDay === idx;
              return (
                <TouchableOpacity
                  key={day.name}
                  style={[styles.dayItem, active && styles.dayItemActive]}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSelectedDay(idx);
                  }}
                >
                  <Text style={[styles.dayName, active && styles.dayTextActive]}>{day.name}</Text>
                  <Text style={[styles.dayNum, active && styles.dayTextActive]}>{day.num}</Text>
                  <View
                    style={[
                      styles.dayDot,
                      { backgroundColor: active ? '#FFFFFF' : day.dot },
                    ]}
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Today's Schedule */}
        <View style={styles.scheduleSection}>
          <View style={styles.scheduleHeader}>
            <Text style={styles.scheduleTitle}>Today's Schedule</Text>
            <Text style={styles.scheduleCount}>3 Blocks · 4.5h</Text>
          </View>

          {/* Block 1 */}
          <View style={styles.blockCard}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTime}>⏱ 09:00 AM – 10:30 AM</Text>
              <Text style={styles.blockBadge}>Completed ✓</Text>
            </View>
            <Text style={[styles.blockSubject, { textDecorationLine: 'line-through', opacity: 0.7 }]}>
              Organic Chemistry: Carbonyl Reactions
            </Text>
            <Text style={styles.blockNotes}>90m deep focus completed with Rain Ambient</Text>
          </View>

          {/* Block 2 */}
          <View style={[styles.blockCard, { borderColor: '#8A9A86', borderWidth: 2 }]}>
            <View style={styles.blockHeader}>
              <Text style={[styles.blockTime, { color: '#D4836A' }]}>⏱ 02:00 PM – 03:30 PM</Text>
              <Text style={[styles.blockBadge, { backgroundColor: '#FFDBD0', color: '#904B36' }]}>
                NEXT UP
              </Text>
            </View>
            <Text style={styles.blockSubject}>Data Structures: Heap & Priority Queue</Text>
            <Text style={styles.blockNotes}>Binary min-heap practice before midterm</Text>
          </View>

          {/* Block 3 */}
          <View style={styles.blockCard}>
            <View style={styles.blockHeader}>
              <Text style={styles.blockTime}>⏱ 07:00 PM – 08:30 PM</Text>
              <Text style={styles.blockBadge}>Study Group</Text>
            </View>
            <Text style={styles.blockSubject}>Linear Algebra: Eigenvalues Review</Text>
            <Text style={styles.blockNotes}>Co-working in Library Pod 4B</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF7F2',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 110,
    gap: 14,
  },
  header: {
    marginBottom: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#211A15',
    fontFamily: Platform.select({ ios: 'SpaceGrotesk-Bold', android: 'monospace' }),
  },
  subtitle: {
    fontSize: 12,
    color: '#747871',
    marginTop: 2,
  },
  examBanner: {
    backgroundColor: '#D4836A',
    borderRadius: 24,
    padding: 18,
    shadowColor: '#D4836A',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
  },
  examTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  examTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  examTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  examCourse: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  examDetails: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 4,
  },
  meterContainer: {
    marginTop: 14,
  },
  meterLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  meterLabelText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '600',
  },
  meterBarBackground: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  meterBarFill: {
    height: '100%',
    backgroundColor: '#F5BC71',
    borderRadius: 4,
  },
  weekCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  weekTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#747871',
    marginBottom: 10,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dayItem: {
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  dayItemActive: {
    backgroundColor: '#8A9A86',
  },
  dayName: {
    fontSize: 10,
    color: '#747871',
  },
  dayNum: {
    fontSize: 14,
    fontWeight: '700',
    color: '#211A15',
    marginTop: 2,
  },
  dayTextActive: {
    color: '#FFFFFF',
  },
  dayDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    marginTop: 6,
  },
  scheduleSection: {
    gap: 10,
  },
  scheduleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#211A15',
  },
  scheduleCount: {
    fontSize: 11,
    color: '#747871',
  },
  blockCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  blockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  blockTime: {
    fontSize: 11,
    fontWeight: '700',
    color: '#536251',
  },
  blockBadge: {
    fontSize: 10,
    fontWeight: '600',
    backgroundColor: '#D7E7D1',
    color: '#111F11',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  blockSubject: {
    fontSize: 14,
    fontWeight: '700',
    color: '#211A15',
  },
  blockNotes: {
    fontSize: 11,
    color: '#747871',
    marginTop: 2,
  },
});
