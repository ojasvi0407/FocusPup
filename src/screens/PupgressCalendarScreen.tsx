import React, { useState } from 'react';
import { ExamEvent, SessionObjective } from '../types';
import { Haptics } from '../services/hapticsService';

interface PupgressCalendarScreenProps {
  exams: ExamEvent[];
  onAddExam: (exam: ExamEvent) => void;
  onStartSessionForExam: (examTitle: string) => void;
}

export const PupgressCalendarScreen: React.FC<PupgressCalendarScreenProps> = ({
  exams,
  onAddExam,
  onStartSessionForExam
}) => {
  const [selectedDayIndex, setSelectedDayIndex] = useState(2); // Wednesday (Today)
  const [showPlanModal, setShowPlanModal] = useState(false);

  // Form states for new plan
  const [newTitle, setNewTitle] = useState('');
  const [newCourseCode, setNewCourseCode] = useState('');
  const [newDaysLeft, setNewDaysLeft] = useState('7');
  const [newTargetHours, setNewTargetHours] = useState('15');

  const daysOfWeek = [
    { name: 'Mon', date: 14, dots: ['study'] },
    { name: 'Tue', date: 15, dots: ['hw'] },
    { name: 'Wed', date: 16, dots: ['exam', 'study'], isToday: true },
    { name: 'Thu', date: 17, dots: ['study', 'hw'] },
    { name: 'Fri', date: 18, dots: ['study'] },
    { name: 'Sat', date: 19, dots: ['study'] },
    { name: 'Sun', date: 20, dots: ['exam'], isExamDay: true }
  ];

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    Haptics.notificationAsync('success');
    const newExam: ExamEvent = {
      id: `exam_${Date.now()}`,
      title: newTitle.trim(),
      courseCode: newCourseCode.trim() || 'ACAD 101',
      date: new Date(Date.now() + parseInt(newDaysLeft) * 86400000).toISOString().split('T')[0],
      time: '10:00 AM',
      location: 'Main Hall',
      daysLeft: parseInt(newDaysLeft) || 5,
      prepTargetHours: parseInt(newTargetHours) || 20,
      prepCompletedHours: 0,
      color: '#D4836A'
    };

    onAddExam(newExam);
    setShowPlanModal(false);
    setNewTitle('');
    setNewCourseCode('');
  };

  const primaryExam = exams[0] || {
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
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-28">
      {/* Header & Month Banner */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="font-['Space_Grotesk'] text-[24px] font-bold text-[#211A15] dark:text-[#FDEEE4] tracking-tight">
              Academic Planner
            </h1>
            <p className="text-[12px] text-[#747871] dark:text-[#A7A9A4] font-medium">
              Semester Spring 2026 • <span className="text-[#D4836A] font-semibold">{exams.length} Exams Upcoming</span>
            </p>
          </div>
          <button
            onClick={() => {
              Haptics.selectionAsync();
              setShowPlanModal(true);
            }}
            className="w-8 h-8 rounded-full bg-white dark:bg-[#25211E] border border-[#EFE9E0] dark:border-[#38312B] flex items-center justify-center text-[#747871] hover:bg-[#FAECE1] transition-colors shadow-xs"
            title="Plan Study Session"
          >
            ＋
          </button>
        </div>

        {/* Month Selector Strip */}
        <div className="flex items-center justify-between bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EFE9E0] dark:border-[#38312B] shadow-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#536251] dark:text-[#A7C1A2] text-sm">📅</span>
            <span className="font-['Space_Grotesk'] text-[13px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              October 2026
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAECE1] dark:bg-[#322923] text-[#536251] dark:text-[#A7C1A2]">
              W42
            </span>
          </div>
        </div>
      </section>

      {/* Hero Exam Countdown Widget (Terracotta Banner) */}
      <section className="relative overflow-hidden rounded-3xl bg-[#D4836A] text-white p-4 shadow-md border border-[#FDA68B]/30 select-none">
        {/* Subtle decorative glow */}
        <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />

        <div className="relative z-10 flex flex-col gap-3">
          <div className="flex items-start justify-between">
            <span className="px-2.5 py-0.5 rounded-md bg-white/20 backdrop-blur-sm text-[10px] uppercase font-bold tracking-wider text-white flex items-center gap-1">
              <span>🔔</span> Next Exam in {primaryExam.daysLeft} Days
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-sm">
              🐾
            </div>
          </div>

          <div>
            <h2 className="text-[20px] font-bold leading-snug tracking-tight">
              {primaryExam.title}
            </h2>
            <p className="text-[12px] text-white/90 flex items-center gap-2 mt-0.5 font-medium">
              <span>{primaryExam.courseCode}</span>
              <span>•</span>
              <span>⏱ {primaryExam.time}</span>
              <span>•</span>
              <span>📍 {primaryExam.location}</span>
            </p>
          </div>

          {/* Preparation Goal Meter */}
          <div className="pt-1 flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-[11px] text-white/90">
              <span className="font-medium">Preparation Goal</span>
              <span className="font-['Space_Grotesk'] font-bold tracking-tight">
                {primaryExam.prepCompletedHours} / {primaryExam.prepTargetHours} Study Hrs Completed
              </span>
            </div>
            <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-[#F5BC71] h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${Math.min(100, Math.round((primaryExam.prepCompletedHours / primaryExam.prepTargetHours) * 100))}%`
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Minimalist Horizontal Weekly Strip Calendar */}
      <section className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#747871] dark:text-[#A7A9A4] tracking-wide">
            OCTOBER 14 – 20
          </span>
          <div className="flex items-center gap-2.5 text-[10px] text-[#747871] dark:text-[#A7A9A4]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#D4836A]" /> Exam
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#8A9A86]" /> Study
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#E6AF65]" /> HW
            </span>
          </div>
        </div>

        {/* 7 Day Strip */}
        <div className="grid grid-cols-7 gap-1.5 p-2 rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] shadow-xs">
          {daysOfWeek.map((day, idx) => {
            const isSelected = selectedDayIndex === idx;
            return (
              <button
                key={day.name}
                onClick={() => {
                  Haptics.selectionAsync();
                  setSelectedDayIndex(idx);
                }}
                className={`flex flex-col items-center py-2 px-1 rounded-2xl transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#8A9A86] text-white shadow-sm scale-105 font-bold'
                    : day.isExamDay
                    ? 'bg-[#FFDBD0]/50 dark:bg-[#904B36]/30 text-[#904B36] dark:text-[#FDA68B]'
                    : 'hover:bg-[#FAECE1]/40 text-[#444842] dark:text-[#C4C8BF]'
                }`}
              >
                <span className="text-[10px] tracking-tight">{day.name}</span>
                <span className="font-['Space_Grotesk'] text-[14px] font-bold mt-0.5">
                  {day.date}
                </span>

                {/* Dots indicator */}
                <div className="flex gap-0.5 mt-1.5 h-1.5 items-center">
                  {day.dots.includes('exam') && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#D4836A]'}`} />
                  )}
                  {day.dots.includes('study') && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#8A9A86]'}`} />
                  )}
                  {day.dots.includes('hw') && (
                    <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-[#E6AF65]'}`} />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Today's Schedule Agenda */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <h3 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              Today's Schedule
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-[#FAECE1] dark:bg-[#322923] text-[#536251] dark:text-[#A7C1A2] rounded-full">
              3 Blocks
            </span>
          </div>
          <span className="text-[11px] text-[#747871] dark:text-[#A7A9A4]">
            Total: 4.5 hrs planned
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {/* Block 1: Completed */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#25211E]/70 border border-[#EFE9E0] dark:border-[#38312B] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#536251] dark:text-[#A7C1A2] flex items-center gap-1">
                ⏱ 09:00 AM – 10:30 AM
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#D7E7D1] dark:bg-[#3C4B3A] text-[#111F11] dark:text-[#D7E7D1]">
                Completed ✓
              </span>
            </div>
            <h4 className="text-[14px] font-bold text-[#211A15] dark:text-[#FDEEE4] line-through opacity-75">
              Organic Chemistry: Carbonyl Reactions
            </h4>
            <p className="text-[11px] text-[#747871] dark:text-[#9A938C]">
              90m deep focus completed with Rain Ambient • Zero distractions
            </p>
          </div>

          {/* Block 2: In-Progress / Next Up */}
          <div className="p-3.5 rounded-2xl bg-white dark:bg-[#2A2420] border-2 border-[#8A9A86] shadow-sm flex flex-col gap-2 relative">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#D4836A] flex items-center gap-1">
                ⏱ 02:00 PM – 03:30 PM
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFDBD0] text-[#904B36]">
                NEXT UP • 50m block
              </span>
            </div>
            <h4 className="text-[14px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              Data Structures: Heap & Priority Queue
            </h4>
            <p className="text-[11px] text-[#747871] dark:text-[#9A938C]">
              Implement binary min-heap and practice 3 LeetCode problems before CS 201 Midterm.
            </p>
            <div className="flex items-center justify-between pt-1 border-t border-[#EFE9E0] dark:border-[#38312B]">
              <span className="text-[11px] text-[#747871] dark:text-[#9A938C] flex items-center gap-1">
                🎧 Coffee Grinder Track
              </span>
              <button
                onClick={() => {
                  Haptics.impactAsync('medium');
                  onStartSessionForExam('Data Structures');
                }}
                className="px-3.5 py-1.5 rounded-full bg-[#536251] text-white text-[11px] font-bold active:scale-95 transition-transform shadow-xs"
              >
                ▶ Start Session
              </button>
            </div>
          </div>

          {/* Block 3: Study Group */}
          <div className="p-3.5 rounded-2xl bg-white/70 dark:bg-[#25211E]/70 border border-[#EFE9E0] dark:border-[#38312B] flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#747871] dark:text-[#A7A9A4]">
                ⏱ 07:00 PM – 08:30 PM
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FAECE1] dark:bg-[#322923] text-[#747871] dark:text-[#C4C8BF]">
                Study Group
              </span>
            </div>
            <h4 className="text-[14px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              Linear Algebra: Eigenvalues Review
            </h4>
            <p className="text-[11px] text-[#747871] dark:text-[#9A938C]">
              Co-working with Sarah and Kenji in Library Pod 4B. Diagonalization practice.
            </p>
          </div>
        </div>
      </section>

      {/* Floating Action Button to Plan New Session */}
      <div className="flex justify-center mt-2">
        <button
          onClick={() => {
            Haptics.impactAsync('light');
            setShowPlanModal(true);
          }}
          className="px-5 py-3 rounded-full bg-[#536251] text-white font-['Space_Grotesk'] text-[13px] font-bold shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center gap-2 border border-[#8A9A86]/50"
        >
          <span>＋</span>
          <span>Plan Study Session & Exam</span>
        </button>
      </div>

      {/* Bottom Sheet Modal for Planning */}
      {showPlanModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-[#25211E] rounded-t-3xl sm:rounded-3xl p-5 border border-[#EFE9E0] dark:border-[#38312B] shadow-2xl flex flex-col gap-4 animate-in slide-in-from-bottom-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">📅</span>
                <div>
                  <h3 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
                    Add Academic Milestone
                  </h3>
                  <p className="text-[11px] text-[#747871] dark:text-[#A7A9A4]">
                    Track exams, midterms, and study goals
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPlanModal(false)}
                className="w-7 h-7 rounded-full bg-[#FAECE1] dark:bg-[#322923] flex items-center justify-center text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePlanSubmit} className="flex flex-col gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[#747871] dark:text-[#A7A9A4] block mb-1">
                  Exam / Subject Title
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Molecular Biology Final"
                  className="w-full px-3 py-2 text-[13px] rounded-xl bg-[#FAECE1]/50 dark:bg-[#1E1A17] border border-[#C4C8BF]/60 text-[#211A15] dark:text-white focus:outline-none focus:border-[#8A9A86]"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-semibold text-[#747871] dark:text-[#A7A9A4] block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    placeholder="BIO 240"
                    className="w-full px-3 py-2 text-[13px] rounded-xl bg-[#FAECE1]/50 dark:bg-[#1E1A17] border border-[#C4C8BF]/60 text-[#211A15] dark:text-white focus:outline-none focus:border-[#8A9A86]"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#747871] dark:text-[#A7A9A4] block mb-1">
                    Days Left
                  </label>
                  <input
                    type="number"
                    value={newDaysLeft}
                    onChange={(e) => setNewDaysLeft(e.target.value)}
                    className="w-full px-3 py-2 text-[13px] rounded-xl bg-[#FAECE1]/50 dark:bg-[#1E1A17] border border-[#C4C8BF]/60 text-[#211A15] dark:text-white focus:outline-none focus:border-[#8A9A86]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[#747871] dark:text-[#A7A9A4] block mb-1">
                  Target Study Hours
                </label>
                <input
                  type="number"
                  value={newTargetHours}
                  onChange={(e) => setNewTargetHours(e.target.value)}
                  className="w-full px-3 py-2 text-[13px] rounded-xl bg-[#FAECE1]/50 dark:bg-[#1E1A17] border border-[#C4C8BF]/60 text-[#211A15] dark:text-white focus:outline-none focus:border-[#8A9A86]"
                />
              </div>

              <div className="flex gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowPlanModal(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#FAECE1] dark:bg-[#322923] text-[#747871] font-semibold text-[12px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full bg-[#536251] text-white font-semibold text-[12px] shadow-sm"
                >
                  Save Milestone
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
