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

export function HourVaultScreen() {
  const [selectedCell, setSelectedCell] = useState('Best Day: 6.2 hrs · 82% Daily Consistency');

  const subjects = [
    {
      name: 'Organic Chemistry',
      cat: 'Pre-Med',
      tier: 'Gold Beaker Tier III',
      done: 12.5,
      goal: 15,
      allTime: 54.5,
      color: '#8A9A86',
    },
    {
      name: 'Data Structures & Algos',
      cat: 'CS Core',
      tier: 'Diamond Byte Tier II',
      done: 14.0,
      goal: 14,
      allTime: 48.0,
      color: '#D4836A',
    },
    {
      name: 'Linear Algebra',
      cat: 'Math',
      tier: 'Silver Matrix Tier I',
      done: 6.0,
      goal: 10,
      allTime: 28.0,
      color: '#E6AF65',
    },
    {
      name: 'World Literature',
      cat: 'Elective',
      tier: 'Bronze Quill Tier II',
      done: 4.0,
      goal: 4,
      allTime: 18.0,
      color: '#8A9A86',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>Subject Vault</Text>
          <Text style={styles.subtitle}>Track mastery, study hours & growth</Text>
        </View>

        {/* Master Total Hours Banner */}
        <View style={styles.masterBanner}>
          <View style={styles.trophyBox}>
            <Text style={{ fontSize: 20 }}>🎓</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.masterHours}>148.5 Total Hours</Text>
            <Text style={styles.masterRank}>Rank: Master Scholar Pup</Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={styles.topPct}>Top 4%</Text>
            <Text style={styles.wkGain}>+12h this wk</Text>
          </View>
        </View>

        {/* Activity Heatmap Card */}
        <View style={styles.heatmapCard}>
          <View style={styles.heatmapHeader}>
            <Text style={styles.heatmapTitle}>Study Activity Heatmap</Text>
            <Text style={styles.weeksBadge}>12 Weeks</Text>
          </View>

          {/* 7 rows grid */}
          <View style={styles.gridContainer}>
            {['M', '', 'W', '', 'F', '', 'S'].map((label, r) => (
              <View key={r} style={styles.row}>
                <Text style={styles.rowLabel}>{label}</Text>
                <View style={styles.cellsRow}>
                  {Array.from({ length: 12 }).map((_, c) => {
                    const colors = ['#FAECE1', '#E2EBDC', '#A7C1A2', '#8A9A86', '#4F634B'];
                    const col = colors[(r * 3 + c * 7) % 5];
                    return (
                      <TouchableOpacity
                        key={c}
                        style={[styles.heatCell, { backgroundColor: col }]}
                        onPress={() => {
                          Haptics.selectionAsync();
                          setSelectedCell(`Week ${c + 1} Log: Active Study Session`);
                        }}
                      />
                    );
                  })}
                </View>
              </View>
            ))}
          </View>

          <View style={styles.heatmapFooter}>
            <Text style={styles.cellTooltip}>{selectedCell}</Text>
          </View>
        </View>

        {/* Focus Seeds Bank */}
        <View style={styles.bankCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.bankTitle}>🌱 Focus Seeds Bank</Text>
            <Text style={styles.bankSeeds}>1,420</Text>
            <Text style={styles.bankDesc}>Gained from uninterrupted study blocks</Text>
          </View>
          <View style={styles.miniPupBox}>
            <Text style={{ fontSize: 28 }}>🐕</Text>
          </View>
        </View>

        {/* Subject Hour Ledger */}
        <View style={styles.ledgerSection}>
          <Text style={styles.ledgerTitle}>Subject Hour Ledger</Text>
          {subjects.map((sub, i) => {
            const pct = Math.min(100, Math.round((sub.done / sub.goal) * 100));
            return (
              <View key={i} style={styles.subjectCard}>
                <View style={styles.subjectTop}>
                  <View>
                    <Text style={styles.subCat}>{sub.cat}</Text>
                    <Text style={styles.subName}>{sub.name}</Text>
                  </View>
                  <View style={styles.tierBadge}>
                    <Text style={styles.tierText}>🏆 {sub.tier}</Text>
                  </View>
                </View>

                {/* Progress bar */}
                <View style={styles.progContainer}>
                  <View style={styles.progLabels}>
                    <Text style={styles.progText}>
                      Weekly: {sub.done} / {sub.goal} hrs
                    </Text>
                    <Text style={[styles.progText, { fontWeight: '700' }]}>{pct}%</Text>
                  </View>
                  <View style={styles.progTrack}>
                    <View
                      style={[
                        styles.progFill,
                        { width: `${pct}%`, backgroundColor: sub.color },
                      ]}
                    />
                  </View>
                </View>

                <View style={styles.subjectBottom}>
                  <Text style={styles.allTimeText}>All-time: {sub.allTime} hrs</Text>
                  <Text style={{ fontSize: 11, color: '#536251', fontWeight: '600' }}>
                    {pct >= 100 ? 'Goal Met 🔥' : 'On Track'}
                  </Text>
                </View>
              </View>
            );
          })}
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
  },
  masterBanner: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  trophyBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: '#FFDDB5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  masterHours: {
    fontSize: 16,
    fontWeight: '700',
    color: '#211A15',
  },
  masterRank: {
    fontSize: 11,
    color: '#805613',
    fontWeight: '600',
  },
  topPct: {
    fontSize: 10,
    color: '#747871',
  },
  wkGain: {
    fontSize: 12,
    fontWeight: '700',
    color: '#536251',
  },
  heatmapCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  heatmapHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  heatmapTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#211A15',
  },
  weeksBadge: {
    fontSize: 10,
    backgroundColor: '#FAECE1',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    color: '#747871',
  },
  gridContainer: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rowLabel: {
    width: 14,
    fontSize: 10,
    color: '#747871',
  },
  cellsRow: {
    flexDirection: 'row',
    gap: 4,
    flex: 1,
    justifyContent: 'space-between',
  },
  heatCell: {
    width: 18,
    height: 18,
    borderRadius: 4,
  },
  heatmapFooter: {
    marginTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EFE9E0',
    paddingTop: 8,
  },
  cellTooltip: {
    fontSize: 11,
    color: '#747871',
  },
  bankCard: {
    backgroundColor: '#FAECE1',
    borderRadius: 24,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#EFE9E0',
  },
  bankTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#536251',
  },
  bankSeeds: {
    fontSize: 28,
    fontWeight: '700',
    color: '#211A15',
    marginVertical: 2,
    fontFamily: Platform.select({ ios: 'SpaceGrotesk-Bold', android: 'monospace' }),
  },
  bankDesc: {
    fontSize: 11,
    color: '#747871',
  },
  miniPupBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ledgerSection: {
    gap: 10,
  },
  ledgerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#211A15',
  },
  subjectCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    gap: 8,
  },
  subjectTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subCat: {
    fontSize: 10,
    color: '#747871',
    fontWeight: '600',
  },
  subName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#211A15',
    marginTop: 1,
  },
  tierBadge: {
    backgroundColor: '#FAECE1',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  tierText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#805613',
  },
  progContainer: {
    gap: 4,
  },
  progLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progText: {
    fontSize: 11,
    color: '#747871',
  },
  progTrack: {
    height: 6,
    backgroundColor: '#FAECE1',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progFill: {
    height: '100%',
    borderRadius: 3,
  },
  subjectBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EFE9E0',
    paddingTop: 6,
  },
  allTimeText: {
    fontSize: 11,
    color: '#747871',
  },
});
