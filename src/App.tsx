import React, { useState, useEffect } from 'react';
import { StudySanctuaryScreen } from './screens/StudySanctuaryScreen';
import { PupgressCalendarScreen } from './screens/PupgressCalendarScreen';
import { HourVaultScreen } from './screens/HourVaultScreen';
import { PupGradeCenterScreen } from './screens/PupGradeCenterScreen';
import { GlassTabBar, TabKey } from './components/GlassTabBar';
import {
  Subject,
  SessionObjective,
  ExamEvent,
  PupgradeItem,
  UserStats,
  ThemeMode
} from './types';
import { Storage } from './services/storageService';
import { Haptics } from './services/hapticsService';

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabKey>('desk');

  // Device Container State (Simulator View)
  const [deviceFrame, setDeviceFrame] = useState<'iphone' | 'pixel' | 'fluid'>('iphone');
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [selectedFileForInspection, setSelectedFileForInspection] = useState<string>('App.tsx');
  const [copySuccess, setCopySuccess] = useState(false);

  // App Theme State
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isSystemDark, setIsSystemDark] = useState(false);

  // App Data & Persistence
  const [stats, setStats] = useState<UserStats>(Storage.getStats());
  const [subjects, setSubjects] = useState<Subject[]>(Storage.getSubjects());
  const [selectedSubject, setSelectedSubject] = useState<Subject>(subjects[0]);
  const [objectives, setObjectives] = useState<SessionObjective[]>(Storage.getObjectives());
  const [exams, setExams] = useState<ExamEvent[]>(Storage.getExams());
  const [pupgrades, setPupgrades] = useState<PupgradeItem[]>(Storage.getPupgrades());

  // Listen to system dark mode
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      const matcher = window.matchMedia('(prefers-color-scheme: dark)');
      setIsSystemDark(matcher.matches);
      const listener = (e: MediaQueryListEvent) => setIsSystemDark(e.matches);
      matcher.addEventListener('change', listener);
      return () => matcher.removeEventListener('change', listener);
    }
  }, []);

  const isDarkMode = themeMode === 'system' ? isSystemDark : themeMode === 'dark';

  // Apply dark class to document element
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Objective Toggling
  const handleToggleObjective = (id: string) => {
    const updated = objectives.map((obj) =>
      obj.id === id ? { ...obj, completed: !obj.completed } : obj
    );
    setObjectives(updated);
    Storage.saveObjectives(updated);
  };

  const handleAddObjective = (title: string) => {
    const newObj: SessionObjective = {
      id: `obj_${Date.now()}`,
      title,
      completed: false,
      durationMinutes: 30,
      subjectId: selectedSubject.id
    };
    const updated = [...objectives, newObj];
    setObjectives(updated);
    Storage.saveObjectives(updated);
  };

  // Session Completion Callback
  const handleSessionComplete = (minutes: number) => {
    const earnedKibbles = Math.max(10, Math.round(minutes * 1.5));
    const earnedSeeds = Math.max(2, Math.round(minutes * 0.4));

    const updatedStats: UserStats = {
      ...stats,
      todayCompletedHours: Number((stats.todayCompletedHours + minutes / 60).toFixed(1)),
      totalFocusHours: Number((stats.totalFocusHours + minutes / 60).toFixed(1)),
      currentKibbles: stats.currentKibbles + earnedKibbles,
      currentSeeds: stats.currentSeeds + earnedSeeds
    };
    setStats(updatedStats);
    Storage.saveStats(updatedStats);

    // Also increment subject time
    const updatedSubjects = subjects.map((sub) =>
      sub.id === selectedSubject.id
        ? {
            ...sub,
            weeklyCompletedHours: Number((sub.weeklyCompletedHours + minutes / 60).toFixed(1)),
            allTimeHours: Number((sub.allTimeHours + minutes / 60).toFixed(1))
          }
        : sub
    );
    setSubjects(updatedSubjects);
    Storage.saveSubjects(updatedSubjects);
  };

  // Add Exam
  const handleAddExam = (exam: ExamEvent) => {
    const updated = [exam, ...exams];
    setExams(updated);
    Storage.saveExams(updated);
  };

  // Buy Shop Item
  const handleBuyItem = (id: string, cost: number) => {
    if (stats.currentKibbles < cost) return false;
    const updatedKibbles = stats.currentKibbles - cost;
    const updatedStats = { ...stats, currentKibbles: updatedKibbles };
    setStats(updatedStats);
    Storage.saveStats(updatedStats);

    const updatedItems = pupgrades.map((item) =>
      item.id === id ? { ...item, unlocked: true, equipped: true } : item
    );
    setPupgrades(updatedItems);
    Storage.savePupgrades(updatedItems);
    return true;
  };

  // Equip Shop Item
  const handleEquipItem = (id: string) => {
    const updatedItems = pupgrades.map((item) =>
      item.id === id ? { ...item, equipped: !item.equipped } : item
    );
    setPupgrades(updatedItems);
    Storage.savePupgrades(updatedItems);
  };

  // Expo Native Code Snippets for inspection
  const expoCodeFiles: Record<string, { desc: string; code: string }> = {
    'App.tsx': {
      desc: 'Expo Root Application Entry with NavigationContainer, ThemeProvider & BottomTab.Navigator',
      code: `import React, { useState } from 'react';
import { StyleSheet, View, Text, useColorScheme, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { StudySanctuaryScreen } from './screens/StudySanctuaryScreen';
import { PupgressCalendarScreen } from './screens/PupgressCalendarScreen';
import { HourVaultScreen } from './screens/HourVaultScreen';
import { PupGradeCenterScreen } from './screens/PupGradeCenterScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              height: 64,
              borderRadius: 32,
              backgroundColor: isDark ? 'rgba(30, 26, 23, 0.88)' : 'rgba(255, 255, 255, 0.88)',
              borderWidth: 1,
              borderColor: isDark ? '#38312B' : '#EFE9E0',
            },
            tabBarBackground: () => <BlurView intensity={80} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill} />
          }}
        >
          <Tab.Screen name="Desk" component={StudySanctuaryScreen} options={{ tabBarLabel: 'Desk', tabBarIcon: () => <Text>🪑</Text> }} />
          <Tab.Screen name="Calendar" component={PupgressCalendarScreen} options={{ tabBarLabel: 'Calendar', tabBarIcon: () => <Text>📅</Text> }} />
          <Tab.Screen name="Vault" component={HourVaultScreen} options={{ tabBarLabel: 'Vault', tabBarIcon: () => <Text>📈</Text> }} />
          <Tab.Screen name="Pupgrade" component={PupGradeCenterScreen} options={{ tabBarLabel: 'Upgrades', tabBarIcon: () => <Text>🐾</Text> }} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}`
    },
    'app.json': {
      desc: 'Expo Application Configuration for iOS (bundleIdentifier) and Android (package)',
      code: `{
  "expo": {
    "name": "FocusPUP",
    "slug": "focuspup",
    "version": "1.0.0",
    "orientation": "portrait",
    "userInterfaceStyle": "automatic",
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.focuspup.app",
      "infoPlist": { "UIBackgroundModes": ["audio"] }
    },
    "android": {
      "package": "com.focuspup.app",
      "permissions": ["VIBRATE", "WAKE_LOCK"]
    },
    "plugins": ["expo-haptics", "expo-av"]
  }
}`
    },
    'PixelPomeranian.tsx': {
      desc: 'Self-Contained Pixel Pomeranian SVG Mascot Sprite (Crisp Pixel Art Rendering)',
      code: `import React from 'react';
import { View } from 'react-native';
import Svg, { Rect, Ellipse, Polygon, Path, Circle } from 'react-native-svg';

export function PixelPomeranianNative({ state = 'studying', size = 140 }) {
  const isSleeping = state === 'sleeping';
  const isStudying = state === 'studying';

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Soft shadow & Cushion */}
        <Ellipse cx="32" cy="56" rx="20" ry="4" fill="#2E2620" opacity={0.15} />
        <Rect x="12" y="52" width="40" height="5" rx="2" fill="#E8DEC8" />
        {/* Fluffy Body */}
        <Rect x="20" y="34" width="26" height="18" rx="4" fill="#E6AF65" />
        <Rect x="22" y="36" width="22" height="14" fill="#F4CA88" />
        {/* Matcha Scarf */}
        <Rect x="18" y="32" width="18" height="4" rx="1" fill="#8A9A86" />
        {/* Fox Ears */}
        <Polygon points="17,17 21,9 25,17" fill="#D49544" />
        <Polygon points="29,17 33,9 37,17" fill="#D49544" />
        {/* Fluffy Head */}
        <Rect x="16" y="16" width="22" height="18" rx="6" fill="#E6AF65" />
        <Rect x="18" y="18" width="18" height="14" rx="4" fill="#F4CA88" />
        <Rect x="20" y="25" width="14" height="7" rx="3" fill="#FFF2DC" />
        {/* Button Nose & Eyes */}
        <Ellipse cx="27" cy="27" rx="2" ry="1.4" fill="#2E2620" />
        {isSleeping ? (
          <Path d="M 21 24 Q 23 26 25 24 M 29 24 Q 31 26 33 24" stroke="#3D2B1F" strokeWidth="1.5" fill="none" />
        ) : (
          <>
            <Rect x="21" y="23" width="3" height="4" rx="1" fill="#2E2620" />
            <Rect x="30" y="23" width="3" height="4" rx="1" fill="#2E2620" />
          </>
        )}
      </Svg>
    </View>
  );
}`
    },
    'types.ts': {
      desc: 'TypeScript Definitions for Sessions, Exams, Subjects, and Pupgrades',
      code: `export type RootTabParamList = {
  Desk: undefined;
  Calendar: undefined;
  Vault: undefined;
  Pupgrade: undefined;
};

export type PomeranianState = 'studying' | 'idle' | 'sleeping' | 'wagging' | 'happy';
export type FocusMode = 'pomodoro' | 'deep' | 'stopwatch';

export interface Subject {
  id: string;
  name: string;
  category: string;
  weeklyTargetHours: number;
  weeklyCompletedHours: number;
  allTimeHours: number;
  color: string;
  tierName: string;
}

export interface ExamEvent {
  id: string;
  title: string;
  courseCode: string;
  date: string;
  daysLeft: number;
  prepTargetHours: number;
  prepCompletedHours: number;
}`
    }
  };

  const handleCopyCode = () => {
    const file = expoCodeFiles[selectedFileForInspection];
    if (file && navigator.clipboard) {
      navigator.clipboard.writeText(file.code);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0ECE1] dark:bg-[#12100E] text-[#211A15] dark:text-[#FDEEE4] flex flex-col items-center justify-start py-4 sm:py-8 px-2 sm:px-4 font-['Plus_Jakarta_Sans'] transition-colors duration-300">
      {/* Top Simulator Control Bar */}
      <header className="w-full max-w-[440px] flex items-center justify-between mb-3 px-2 z-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#536251] flex items-center justify-center text-white text-xs shadow-xs font-bold">
            🐶
          </div>
          <span className="font-['Space_Grotesk'] text-sm font-bold tracking-tight text-[#211A15] dark:text-[#FDEEE4]">
            FocusPUP Mobile
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5">
          {/* Theme Toggle */}
          <button
            onClick={() => {
              Haptics.selectionAsync();
              setThemeMode(isDarkMode ? 'light' : 'dark');
            }}
            className="px-2.5 py-1 rounded-full bg-white/80 dark:bg-[#25211E]/80 border border-[#EFE9E0] dark:border-[#38312B] text-xs font-medium text-[#747871] dark:text-[#C4C8BF] shadow-xs hover:opacity-85 transition-opacity"
            title="Toggle Dark / Light Theme"
          >
            {isDarkMode ? '🌙 Dark' : '☀️ Warm'}
          </button>

          {/* Expo Code Inspector Trigger */}
          <button
            onClick={() => {
              Haptics.selectionAsync();
              setShowCodeModal(true);
            }}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#536251] text-white text-xs font-bold shadow-xs hover:bg-[#3C4B3A] transition-colors"
            title="View React Native / Expo Source Code"
          >
            <span>📱</span>
            <span>Expo Code</span>
          </button>
        </div>
      </header>

      {/* Mobile Device Chassis Frame */}
      <div
        className={`w-full max-w-[420px] bg-[#FAF7F2] dark:bg-[#1C1917] relative flex flex-col shadow-2xl transition-all duration-300 overflow-hidden ${
          deviceFrame === 'iphone'
            ? 'rounded-[48px] border-[10px] border-[#2E2824] dark:border-[#36302B] ring-1 ring-black/10'
            : deviceFrame === 'pixel'
            ? 'rounded-[40px] border-[8px] border-[#1A1816] ring-1 ring-black/10'
            : 'rounded-2xl border border-[#EFE9E0]'
        }`}
        style={{ minHeight: '840px', maxHeight: '92vh' }}
      >
        {/* Dynamic Island / Device Notch */}
        {deviceFrame === 'iphone' && (
          <div className="w-full pt-3 pb-1 flex justify-center z-50 pointer-events-none sticky top-0 bg-[#FAF7F2]/90 dark:bg-[#1C1917]/90 backdrop-blur-md">
            <div className="w-24 h-5 bg-[#2E2824] dark:bg-[#12100E] rounded-full flex items-center justify-between px-2 shadow-inner">
              <div className="w-2.5 h-2.5 rounded-full bg-[#1A1614] border border-white/5" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#3C4B3A]" />
            </div>
          </div>
        )}

        {/* Scrollable Screen Canvas */}
        <div className="flex-1 overflow-y-auto px-4 pt-2 no-scrollbar">
          {activeTab === 'desk' && (
            <StudySanctuaryScreen
              subjects={subjects}
              selectedSubject={selectedSubject}
              onSelectSubject={setSelectedSubject}
              objectives={objectives}
              onToggleObjective={handleToggleObjective}
              onAddObjective={handleAddObjective}
              onSessionComplete={handleSessionComplete}
              streakDays={stats.streakDays}
            />
          )}

          {activeTab === 'calendar' && (
            <PupgressCalendarScreen
              exams={exams}
              onAddExam={handleAddExam}
              onStartSessionForExam={(examName) => {
                setActiveTab('desk');
              }}
            />
          )}

          {activeTab === 'vault' && (
            <HourVaultScreen
              subjects={subjects}
              stats={stats}
              onNavigateToShop={() => setActiveTab('pupgrade')}
            />
          )}

          {activeTab === 'pupgrade' && (
            <PupGradeCenterScreen
              pupgrades={pupgrades}
              stats={stats}
              onEquipItem={handleEquipItem}
              onBuyItem={handleBuyItem}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
            />
          )}
        </div>

        {/* Native Blurred Bottom Tab Bar */}
        <GlassTabBar activeTab={activeTab} onSelectTab={setActiveTab} />
      </div>

      {/* Expo Native Code & Project Export Modal */}
      {showCodeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-2xl bg-[#FAF7F2] dark:bg-[#25211E] rounded-3xl border border-[#EFE9E0] dark:border-[#38312B] shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#EFE9E0] dark:border-[#38312B] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📱</span>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-lg font-bold text-[#211A15] dark:text-[#FDEEE4]">
                    React Native & Expo Project Code
                  </h3>
                  <p className="text-xs text-[#747871] dark:text-[#A7A9A4]">
                    Full cross-platform iOS & Android Expo SDK codebase
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCodeModal(false)}
                className="w-8 h-8 rounded-full bg-[#FAECE1] dark:bg-[#322923] flex items-center justify-center text-sm font-bold text-[#747871] hover:opacity-85"
              >
                ✕
              </button>
            </div>

            {/* File Switcher Tabs */}
            <div className="px-5 pt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-b border-[#EFE9E0] dark:border-[#38312B] pb-2">
              {Object.keys(expoCodeFiles).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setSelectedFileForInspection(fileName)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-['Space_Grotesk'] font-bold transition-all shrink-0 ${
                    selectedFileForInspection === fileName
                      ? 'bg-[#536251] text-white shadow-xs'
                      : 'bg-white dark:bg-[#1E1A17] text-[#747871] dark:text-[#A7A9A4] border border-[#EFE9E0] dark:border-[#38312B]'
                  }`}
                >
                  {fileName}
                </button>
              ))}
            </div>

            {/* File Description & Copy Button */}
            <div className="px-5 py-2.5 flex items-center justify-between bg-[#FAECE1]/50 dark:bg-[#1E1A17]/50">
              <span className="text-xs text-[#747871] dark:text-[#A7A9A4] truncate pr-2">
                {expoCodeFiles[selectedFileForInspection]?.desc}
              </span>
              <button
                onClick={handleCopyCode}
                className="px-3 py-1 rounded-xl bg-white dark:bg-[#2E2824] border border-[#C4C8BF]/40 text-xs font-bold text-[#536251] dark:text-[#A7C1A2] hover:bg-[#FAECE1] transition-colors shrink-0 shadow-xs"
              >
                {copySuccess ? 'Copied ✓' : 'Copy Code 📋'}
              </button>
            </div>

            {/* Code Content Viewer */}
            <div className="flex-1 p-4 overflow-y-auto bg-[#1C1917] text-[#EFE0D6] font-mono text-xs leading-relaxed select-all">
              <pre className="whitespace-pre-wrap">
                {expoCodeFiles[selectedFileForInspection]?.code}
              </pre>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#EFE9E0] dark:border-[#38312B] flex items-center justify-between bg-white dark:bg-[#25211E]">
              <span className="text-xs text-[#747871]">
                Target: iOS 16+ & Android 12+ · Expo SDK · NativeWind/StyleSheet
              </span>
              <button
                onClick={() => setShowCodeModal(false)}
                className="px-4 py-2 rounded-full bg-[#536251] text-white text-xs font-bold hover:bg-[#3C4B3A]"
              >
                Back to Simulator
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
