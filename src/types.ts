export type RootTabParamList = {
  Desk: undefined;
  Calendar: undefined;
  Vault: undefined;
  Pupgrade: undefined;
};

export type ThemeMode = 'system' | 'light' | 'dark';

export type PomeranianState = 'studying' | 'idle' | 'sleeping' | 'wagging' | 'happy';

export type FocusMode = 'pomodoro' | 'deep' | 'stopwatch';

export interface Subject {
  id: string;
  name: string;
  category: string;
  priority: string;
  weeklyTargetHours: number;
  weeklyCompletedHours: number;
  allTimeHours: number;
  color: string;
  tierName: string;
  tierRank: 'bronze' | 'silver' | 'gold' | 'diamond';
  icon: string;
}

export interface SessionObjective {
  id: string;
  title: string;
  completed: boolean;
  durationMinutes?: number;
  subjectId?: string;
}

export interface ExamEvent {
  id: string;
  title: string;
  courseCode: string;
  date: string; // ISO string or YYYY-MM-DD
  time: string;
  location: string;
  daysLeft: number;
  prepTargetHours: number;
  prepCompletedHours: number;
  color: string;
}

export interface HeatmapDay {
  date: string;
  dayOfWeek: number; // 0-6
  minutes: number;
  level: 0 | 1 | 2 | 3 | 4;
}

export interface PupgradeItem {
  id: string;
  name: string;
  category: 'room' | 'desk' | 'companion' | 'sound';
  icon: string;
  costKibbles: number;
  unlocked: boolean;
  equipped: boolean;
  description: string;
  level?: number;
  effect?: string;
}

export interface AmbientTrack {
  id: string;
  name: string;
  emoji: string;
  soundType: 'rain' | 'campfire' | 'cafe' | 'whitenoise';
}

export interface UserStats {
  streakDays: number;
  totalFocusHours: number;
  todayTargetHours: number;
  todayCompletedHours: number;
  currentKibbles: number;
  currentSeeds: number;
  rankTitle: string;
  percentile: string;
}
