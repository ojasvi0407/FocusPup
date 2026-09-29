import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { PixelPomeranianNative } from '../components/PixelPomeranianNative';

const { width } = Dimensions.get('window');

export function StudySanctuaryScreen() {
  const [focusRunning, setFocusRunning] = useState(false);
  const [secondsRemaining, setSecondsRemaining] = useState(50 * 60);
  const [selectedTrack, setSelectedTrack] = useState('Rainfall');
  const [objectives, setObjectives] = useState([
    { id: '1', title: 'Read Chapter 8: Aldehydes & Ketones', completed: true },
    { id: '2', title: 'Practice 15 synthesis problems', completed: false, duration: '30m' },
    { id: '3', title: 'Implement binary min-heap test', completed: false, duration: '50m' },
  ]);
  const [newGoal, setNewGoal] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleFocus = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setFocusRunning(!focusRunning);
  };

  const toggleObjective = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setObjectives((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const addObjective = () => {
    if (!newGoal.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setObjectives((prev) => [
      ...prev,
      { id: Date.now().toString(), title: newGoal.trim(), completed: false, duration: '30m' },
    ]);
    setNewGoal('');
    setIsAdding(false);
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Bar Header */}
        <View style={styles.headerRow}>
          <View style={styles.userContainer}>
            <View style={styles.avatarWrap}>
              <Text style={{ fontSize: 18 }}>🐶</Text>
            </View>
            <View>
              <Text style={styles.brandTitle}>FocusPup</Text>
              <Text style={styles.subTitle}>Hi, Alex · Organic Chem ▾</Text>
            </View>
          </View>
          <View style={styles.streakBadge}>
            <Text style={{ fontSize: 12 }}>🔥</Text>
            <Text style={styles.streakText}>14 Days Streak</Text>
          </View>
        </View>

        {/* Isometric Sanctuary Stage */}
        <View style={styles.stageCard}>
          <View style={styles.stageHeader}>
            <View style={styles.roomTag}>
              <Text style={styles.roomTagText}>Room Lv. 4: Rainy Loft</Text>
            </View>
            <Text style={styles.vibeBonus}>+15% Focus Vibe</Text>
          </View>

          {/* Pixel Companion Display Frame */}
          <View style={styles.pixelFrame}>
            <PixelPomeranianNative state={focusRunning ? 'studying' : 'idle'} size={150} />
            <View style={styles.soundIndicator}>
              <Text style={styles.soundIndicatorText}>🌧️ {selectedTrack}</Text>
            </View>
          </View>

          {/* Soundscape Chips */}
          <View style={styles.trackRow}>
            {['Rainfall', 'Campfire', 'Lo-Fi Café', 'White Noise'].map((track) => (
              <TouchableOpacity
                key={track}
                onPress={() => {
                  Haptics.selectionAsync();
                  setSelectedTrack(track);
                }}
                style={[styles.trackChip, selectedTrack === track && styles.trackChipActive]}
              >
                <Text
                  style={[
                    styles.trackChipText,
                    selectedTrack === track && styles.trackChipTextActive,
                  ]}
                >
                  {track}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Focus Timer Section */}
        <View style={styles.timerCard}>
          <View style={styles.timerSegment}>
            <TouchableOpacity style={styles.segmentBtn}>
              <Text style={styles.segmentText}>Pomodoro (25m)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.segmentBtn, styles.segmentActive]}>
              <Text style={[styles.segmentText, styles.segmentActiveText]}>Deep Focus (50m)</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.segmentBtn}>
              <Text style={styles.segmentText}>Stopwatch</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.timerDial}>
            <Text style={styles.timerCountdown}>{timeFormatted}</Text>
            <Text style={styles.sessionCounter}>Session 2 of 4</Text>
          </View>

          <TouchableOpacity style={styles.ctaButton} onPress={toggleFocus}>
            <Text style={styles.ctaText}>{focusRunning ? 'Pause Focus' : 'Begin Focus'}</Text>
          </TouchableOpacity>

          <View style={styles.habitRow}>
            <Text style={styles.habitText}>Today's Target: 3.5h / 4h</Text>
            <Text style={styles.kibbleText}>+80 Kibble 🦴</Text>
          </View>
        </View>

        {/* Objectives Section */}
        <View style={styles.objectivesCard}>
          <View style={styles.objectivesHeader}>
            <Text style={styles.objectivesTitle}>Active Session Objectives</Text>
            <TouchableOpacity onPress={() => setIsAdding(!isAdding)}>
              <Text style={styles.newGoalBtn}>{isAdding ? 'Cancel' : '+ New Goal'}</Text>
            </TouchableOpacity>
          </View>

          {isAdding && (
            <View style={styles.addInputRow}>
              <TextInput
                style={styles.addInput}
                placeholder="Enter objective..."
                placeholderTextColor="#A7A9A4"
                value={newGoal}
                onChangeText={setNewGoal}
              />
              <TouchableOpacity style={styles.addConfirmBtn} onPress={addObjective}>
                <Text style={styles.addConfirmText}>Add</Text>
              </TouchableOpacity>
            </View>
          )}

          {objectives.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.objectiveItem, item.completed && styles.objectiveItemCompleted]}
              onPress={() => toggleObjective(item.id)}
            >
              <Text style={{ fontSize: 16 }}>{item.completed ? '☑' : '☐'}</Text>
              <Text
                style={[
                  styles.objectiveText,
                  item.completed && styles.objectiveTextCompleted,
                ]}
              >
                {item.title}
              </Text>
              <Text style={styles.objectiveMeta}>{item.completed ? 'Done' : item.duration}</Text>
            </TouchableOpacity>
          ))}
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FAECE1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#211A15',
  },
  subTitle: {
    fontSize: 11,
    color: '#536251',
    fontWeight: '500',
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFDDB5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#F5BC71',
  },
  streakText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#805613',
  },
  stageCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    alignItems: 'center',
  },
  stageHeader: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  roomTag: {
    backgroundColor: '#FFF1E8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  roomTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#536251',
  },
  vibeBonus: {
    fontSize: 10,
    fontWeight: '700',
    color: '#536251',
    backgroundColor: '#D7E7D1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  pixelFrame: {
    width: 250,
    height: 200,
    backgroundColor: '#F5E5DC',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#EFE9E0',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  soundIndicator: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(33, 26, 21, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  soundIndicatorText: {
    fontSize: 10,
    color: '#FDEEE4',
    fontWeight: '500',
  },
  trackRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 12,
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  trackChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  trackChipActive: {
    backgroundColor: '#8A9A86',
    borderColor: '#536251',
  },
  trackChipText: {
    fontSize: 11,
    color: '#444842',
    fontWeight: '500',
  },
  trackChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  timerCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    alignItems: 'center',
  },
  timerSegment: {
    flexDirection: 'row',
    backgroundColor: '#FAECE1',
    borderRadius: 20,
    padding: 3,
    width: '100%',
    marginBottom: 16,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    borderRadius: 16,
  },
  segmentActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  segmentText: {
    fontSize: 11,
    color: '#747871',
    fontWeight: '500',
  },
  segmentActiveText: {
    color: '#536251',
    fontWeight: '700',
  },
  timerDial: {
    alignItems: 'center',
    marginVertical: 12,
  },
  timerCountdown: {
    fontSize: 48,
    fontWeight: '700',
    color: '#211A15',
    fontFamily: Platform.select({ ios: 'SpaceGrotesk-Bold', android: 'monospace' }),
  },
  sessionCounter: {
    fontSize: 11,
    color: '#747871',
    marginTop: 4,
    fontWeight: '500',
  },
  ctaButton: {
    width: '80%',
    backgroundColor: '#536251',
    paddingVertical: 14,
    borderRadius: 24,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#536251',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 4 },
  },
  ctaText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  habitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 1,
    borderTopColor: '#EFE9E0',
    paddingTop: 12,
    marginTop: 14,
  },
  habitText: {
    fontSize: 12,
    color: '#747871',
  },
  kibbleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#805613',
  },
  objectivesCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    gap: 8,
  },
  objectivesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  objectivesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#211A15',
  },
  newGoalBtn: {
    fontSize: 11,
    fontWeight: '700',
    color: '#536251',
  },
  addInputRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 6,
  },
  addInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#8A9A86',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#211A15',
  },
  addConfirmBtn: {
    backgroundColor: '#536251',
    paddingHorizontal: 14,
    borderRadius: 12,
    justifyContent: 'center',
  },
  addConfirmText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  objectiveItemCompleted: {
    backgroundColor: '#FAECE1',
    opacity: 0.8,
  },
  objectiveText: {
    flex: 1,
    fontSize: 12,
    color: '#211A15',
    fontWeight: '500',
  },
  objectiveTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#747871',
  },
  objectiveMeta: {
    fontSize: 11,
    fontWeight: '600',
    color: '#8A9A86',
  },
});
