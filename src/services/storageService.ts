import { Subject, SessionObjective, ExamEvent, PupgradeItem, UserStats } from '../types';

const STORAGE_KEYS = {
  STATS: 'focuspup_stats',
  SUBJECTS: 'focuspup_subjects',
  OBJECTIVES: 'focuspup_objectives',
  EXAMS: 'focuspup_exams',
  PUPGRADES: 'focuspup_pupgrades',
  SETTINGS: 'focuspup_settings'
};

export const defaultSubjects: Subject[] = [
  {
    id: 'sub_org_chem',
    name: 'Organic Chemistry',
    category: 'Pre-Med',
    priority: 'Priority 1',
    weeklyTargetHours: 15,
    weeklyCompletedHours: 12.5,
    allTimeHours: 54.5,
    color: '#8A9A86', // Matcha Sage
    tierName: 'Gold Beaker Tier III',
    tierRank: 'gold',
    icon: 'flask'
  },
  {
    id: 'sub_dsa',
    name: 'Data Structures & Algorithms',
    category: 'CS Core',
    priority: 'Exam In 4 Days',
    weeklyTargetHours: 14,
    weeklyCompletedHours: 14,
    allTimeHours: 48.0,
    color: '#D4836A', // Terracotta
    tierName: 'Diamond Byte Tier II',
    tierRank: 'diamond',
    icon: 'cpu'
  },
  {
    id: 'sub_linear_algebra',
    name: 'Linear Algebra',
    category: 'Math',
    priority: 'Midterms Prep',
    weeklyTargetHours: 10,
    weeklyCompletedHours: 6.0,
    allTimeHours: 28.0,
    color: '#E6AF65', // Amber
    tierName: 'Silver Matrix Tier I',
    tierRank: 'silver',
    icon: 'grid'
  },
  {
    id: 'sub_world_lit',
    name: 'World Literature',
    category: 'Elective',
    priority: 'Goal Achieved',
    weeklyTargetHours: 4,
    weeklyCompletedHours: 4.0,
    allTimeHours: 18.0,
    color: '#8A9A86',
    tierName: 'Bronze Quill Tier II',
    tierRank: 'bronze',
    icon: 'book'
  }
];

export const defaultObjectives: SessionObjective[] = [
  {
    id: 'obj_1',
    title: 'Read Chapter 8: Aldehydes & Ketones',
    completed: true,
    durationMinutes: 45,
    subjectId: 'sub_org_chem'
  },
  {
    id: 'obj_2',
    title: 'Practice 15 synthesis problems',
    completed: false,
    durationMinutes: 30,
    subjectId: 'sub_org_chem'
  },
  {
    id: 'obj_3',
    title: 'Implement binary min-heap and test LeetCode',
    completed: false,
    durationMinutes: 50,
    subjectId: 'sub_dsa'
  }
];

export const defaultExams: ExamEvent[] = [
  {
    id: 'exam_dsa',
    title: 'Data Structures & Algorithms',
    courseCode: 'CS 201',
    date: '2026-10-02',
    time: '9:00 AM',
    location: 'Room 304',
    daysLeft: 4,
    prepTargetHours: 25,
    prepCompletedHours: 18,
    color: '#D4836A'
  },
  {
    id: 'exam_chem',
    title: 'Organic Chemistry Midterm II',
    courseCode: 'CHEM 220',
    date: '2026-10-08',
    time: '11:30 AM',
    location: 'Science Hall 101',
    daysLeft: 10,
    prepTargetHours: 30,
    prepCompletedHours: 14.5,
    color: '#8A9A86'
  },
  {
    id: 'exam_algebra',
    title: 'Linear Algebra Final Review',
    courseCode: 'MATH 310',
    date: '2026-10-14',
    time: '2:00 PM',
    location: 'Pod 4B',
    daysLeft: 16,
    prepTargetHours: 20,
    prepCompletedHours: 8,
    color: '#E6AF65'
  }
];

export const defaultPupgrades: PupgradeItem[] = [
  {
    id: 'decor_bonsai',
    name: 'Potted Bonsai Lv. 2',
    category: 'desk',
    icon: '🌱',
    costKibbles: 0,
    unlocked: true,
    equipped: true,
    description: 'A serene miniature Juniper Bonsai resting on the study table. +5% Focus Vibe.',
    level: 2
  },
  {
    id: 'decor_lamp',
    name: 'Vintage Brass Desk Lamp',
    category: 'desk',
    icon: '💡',
    costKibbles: 0,
    unlocked: true,
    equipped: true,
    description: 'Warm incandescent glow that banishes eye strain and shadows.',
    level: 1
  },
  {
    id: 'decor_teacup',
    name: 'Steaming Matcha Teacup',
    category: 'desk',
    icon: '🍵',
    costKibbles: 120,
    unlocked: true,
    equipped: true,
    description: 'Ceramic cup with gentle aroma of ceremonial grade Uji matcha.',
    level: 1
  },
  {
    id: 'decor_vinyl',
    name: 'Lo-Fi Vinyl Turntable',
    category: 'room',
    icon: '📻',
    costKibbles: 250,
    unlocked: false,
    equipped: false,
    description: 'Plays soothing analog crackle and jazz-hop beats on repeat.',
    level: 1
  },
  {
    id: 'decor_monstera',
    name: 'Giant Monstera Deliciosa',
    category: 'room',
    icon: '🌿',
    costKibbles: 180,
    unlocked: true,
    equipped: true,
    description: 'Lush tropical foliage purifying your study loft air.',
    level: 1
  },
  {
    id: 'decor_cat_buddy',
    name: 'Calico Cat Study Buddy',
    category: 'companion',
    icon: '🐈',
    costKibbles: 400,
    unlocked: false,
    equipped: false,
    description: 'A sleepy visiting kitten that naps quietly next to the Pomeranian.',
    level: 1
  }
];

export const defaultStats: UserStats = {
  streakDays: 14,
  totalFocusHours: 148.5,
  todayTargetHours: 4.0,
  todayCompletedHours: 3.5,
  currentKibbles: 240,
  currentSeeds: 1420,
  rankTitle: 'Master Scholar Pup 🎓',
  percentile: 'Top 4%'
};

export const Storage = {
  getStats: (): UserStats => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.STATS);
      return data ? JSON.parse(data) : defaultStats;
    } catch {
      return defaultStats;
    }
  },
  saveStats: (stats: UserStats) => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch {
      // ignore
    }
  },
  getSubjects: (): Subject[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return data ? JSON.parse(data) : defaultSubjects;
    } catch {
      return defaultSubjects;
    }
  },
  saveSubjects: (subjects: Subject[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
    } catch {
      // ignore
    }
  },
  getObjectives: (): SessionObjective[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.OBJECTIVES);
      return data ? JSON.parse(data) : defaultObjectives;
    } catch {
      return defaultObjectives;
    }
  },
  saveObjectives: (objs: SessionObjective[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.OBJECTIVES, JSON.stringify(objs));
    } catch {
      // ignore
    }
  },
  getExams: (): ExamEvent[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.EXAMS);
      return data ? JSON.parse(data) : defaultExams;
    } catch {
      return defaultExams;
    }
  },
  saveExams: (exams: ExamEvent[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXAMS, JSON.stringify(exams));
    } catch {
      // ignore
    }
  },
  getPupgrades: (): PupgradeItem[] => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PUPGRADES);
      return data ? JSON.parse(data) : defaultPupgrades;
    } catch {
      return defaultPupgrades;
    }
  },
  savePupgrades: (items: PupgradeItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEYS.PUPGRADES, JSON.stringify(items));
    } catch {
      // ignore
    }
  }
};
