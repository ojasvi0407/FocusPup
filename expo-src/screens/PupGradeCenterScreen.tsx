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

interface PupGradeCenterScreenProps {
  themeMode?: 'system' | 'light' | 'dark';
  onThemeModeChange?: (mode: 'system' | 'light' | 'dark') => void;
}

export function PupGradeCenterScreen({
  themeMode = 'system',
  onThemeModeChange,
}: PupGradeCenterScreenProps) {
  const [kibbles, setKibbles] = useState(240);
  const [seeds, setSeeds] = useState(1420);
  const [items, setItems] = useState([
    {
      id: '1',
      name: 'Potted Bonsai Lv. 2',
      desc: 'Serene miniature Juniper Bonsai on study table',
      cost: 0,
      icon: '🌱',
      equipped: true,
      unlocked: true,
    },
    {
      id: '2',
      name: 'Vintage Brass Lamp',
      desc: 'Warm incandescent illumination for late night study',
      cost: 0,
      icon: '💡',
      equipped: true,
      unlocked: true,
    },
    {
      id: '3',
      name: 'Steaming Matcha Teacup',
      desc: 'Ceramic cup of ceremonial grade warm matcha',
      cost: 120,
      icon: '🍵',
      equipped: false,
      unlocked: true,
    },
    {
      id: '4',
      name: 'Lo-Fi Vinyl Turntable',
      desc: 'Analog turntable playing relaxing lo-fi vinyl beats',
      cost: 250,
      icon: '📻',
      equipped: false,
      unlocked: false,
    },
    {
      id: '5',
      name: 'Giant Monstera Deliciosa',
      desc: 'Lush tropical foliage purifying your study loft',
      cost: 180,
      icon: '🌿',
      equipped: true,
      unlocked: true,
    },
    {
      id: '6',
      name: 'Calico Cat Study Buddy',
      desc: 'Sleepy visiting kitten napping beside the pup',
      cost: 400,
      icon: '🐈',
      equipped: false,
      unlocked: false,
    },
  ]);

  const toggleEquip = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, equipped: !item.equipped } : item))
    );
  };

  const buyItem = (id: string, cost: number) => {
    if (kibbles < cost) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setKibbles((k) => k - cost);
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, unlocked: true, equipped: true } : item))
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>PUP-grade Center</Text>
          <Text style={styles.subtitle}>Furnish your study sanctuary with cozy lo-fi rewards</Text>
        </View>

        {/* Wallets */}
        <View style={styles.walletRow}>
          <View style={styles.walletCard}>
            <Text style={{ fontSize: 24 }}>🦴</Text>
            <View>
              <Text style={styles.walletLabel}>Pup Kibbles</Text>
              <Text style={styles.walletValue}>{kibbles}</Text>
            </View>
          </View>
          <View style={styles.walletCard}>
            <Text style={{ fontSize: 24 }}>🌱</Text>
            <View>
              <Text style={styles.walletLabel}>Focus Seeds</Text>
              <Text style={styles.walletValue}>{seeds}</Text>
            </View>
          </View>
        </View>

        {/* Store Items List */}
        <View style={styles.storeSection}>
          <Text style={styles.sectionTitle}>Room & Desk Accessories</Text>
          {items.map((item) => (
            <View
              key={item.id}
              style={[styles.itemCard, item.equipped && styles.itemCardEquipped]}
            >
              <View style={styles.iconWrap}>
                <Text style={{ fontSize: 24 }}>{item.icon}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.itemTitleRow}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  {item.equipped && <Text style={styles.equippedTag}>Equipped</Text>}
                </View>
                <Text style={styles.itemDesc}>{item.desc}</Text>
                <View style={styles.itemActionRow}>
                  <Text style={styles.itemCost}>
                    {item.unlocked ? 'Owned ✓' : `${item.cost} Kibbles 🦴`}
                  </Text>
                  {item.unlocked ? (
                    <TouchableOpacity
                      style={[styles.btnAction, item.equipped ? styles.btnMuted : styles.btnActive]}
                      onPress={() => toggleEquip(item.id)}
                    >
                      <Text
                        style={[
                          styles.btnText,
                          item.equipped ? styles.btnMutedText : styles.btnActiveText,
                        ]}
                      >
                        {item.equipped ? 'Unequip' : 'Equip'}
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.btnAction, styles.btnBuy]}
                      onPress={() => buyItem(item.id, item.cost)}
                    >
                      <Text style={[styles.btnText, styles.btnBuyText]}>Unlock</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Appearance Settings */}
        <View style={styles.themeCard}>
          <Text style={styles.themeTitle}>App Theme (Auto Dark Mode)</Text>
          <Text style={styles.themeDesc}>Matches iOS/Android system appearance</Text>
          <View style={styles.themeBtnRow}>
            {(['system', 'light', 'dark'] as const).map((mode) => (
              <TouchableOpacity
                key={mode}
                style={[styles.modeBtn, themeMode === mode && styles.modeBtnActive]}
                onPress={() => {
                  Haptics.selectionAsync();
                  if (onThemeModeChange) onThemeModeChange(mode);
                }}
              >
                <Text style={[styles.modeBtnText, themeMode === mode && styles.modeBtnTextActive]}>
                  {mode.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
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
  },
  walletRow: {
    flexDirection: 'row',
    gap: 10,
  },
  walletCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  walletLabel: {
    fontSize: 10,
    color: '#747871',
  },
  walletValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#211A15',
    fontFamily: Platform.select({ ios: 'SpaceGrotesk-Bold', android: 'monospace' }),
  },
  storeSection: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#211A15',
  },
  itemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    flexDirection: 'row',
    gap: 12,
  },
  itemCardEquipped: {
    borderColor: '#8A9A86',
    borderWidth: 1.5,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#FAECE1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#211A15',
  },
  equippedTag: {
    fontSize: 9,
    fontWeight: '700',
    backgroundColor: '#D7E7D1',
    color: '#111F11',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itemDesc: {
    fontSize: 11,
    color: '#747871',
    marginTop: 2,
  },
  itemActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFE9E0',
    paddingTop: 6,
  },
  itemCost: {
    fontSize: 11,
    fontWeight: '700',
    color: '#805613',
  },
  btnAction: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },
  btnActive: {
    backgroundColor: '#536251',
  },
  btnActiveText: {
    color: '#FFFFFF',
  },
  btnMuted: {
    backgroundColor: '#FAECE1',
  },
  btnMutedText: {
    color: '#747871',
  },
  btnBuy: {
    backgroundColor: '#D4836A',
  },
  btnBuyText: {
    color: '#FFFFFF',
  },
  btnText: {
    fontSize: 11,
    fontWeight: '700',
  },
  themeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.75)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EFE9E0',
    gap: 6,
  },
  themeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#211A15',
  },
  themeDesc: {
    fontSize: 11,
    color: '#747871',
  },
  themeBtnRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  modeBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: '#FAECE1',
    alignItems: 'center',
  },
  modeBtnActive: {
    backgroundColor: '#536251',
  },
  modeBtnText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#747871',
  },
  modeBtnTextActive: {
    color: '#FFFFFF',
  },
});
