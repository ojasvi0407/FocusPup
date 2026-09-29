import React, { useState } from 'react';
import { IsometricRoom, soundTracks } from '../components/IsometricRoom';
import { CircularProgressTimer } from '../components/CircularProgressTimer';
import { PixelPomeranian } from '../components/PixelPomeranian';
import { PomeranianState, AmbientTrack, Subject, SessionObjective } from '../types';
import { soundService } from '../services/soundService';
import { Haptics } from '../services/hapticsService';

interface StudySanctuaryScreenProps {
  subjects: Subject[];
  selectedSubject: Subject;
  onSelectSubject: (sub: Subject) => void;
  objectives: SessionObjective[];
  onToggleObjective: (id: string) => void;
  onAddObjective: (title: string) => void;
  onSessionComplete: (minutes: number) => void;
  streakDays: number;
}

export const StudySanctuaryScreen: React.FC<StudySanctuaryScreenProps> = ({
  subjects,
  selectedSubject,
  onSelectSubject,
  objectives,
  onToggleObjective,
  onAddObjective,
  onSessionComplete,
  streakDays
}) => {
  const [pupState, setPupState] = useState<PomeranianState>('idle');
  const [activeTrack, setActiveTrack] = useState<AmbientTrack>(soundTracks[0]);
  const [newGoalText, setNewGoalText] = useState('');
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [showSubjectDropdown, setShowSubjectDropdown] = useState(false);

  // Handle ambient track change
  const handleTrackChange = (track: AmbientTrack) => {
    setActiveTrack(track);
    soundService.playAmbient(track.soundType);
  };

  // Handle pup tap interaction
  const handleTapPup = () => {
    Haptics.impactAsync('light');
    const states: PomeranianState[] = ['wagging', 'happy', 'studying', 'sleeping', 'idle'];
    const nextState = states[Math.floor(Math.random() * states.length)];
    setPupState(nextState);
  };

  const handleTimerRunningChange = (running: boolean) => {
    if (running) {
      setPupState('studying');
      if (activeTrack && activeTrack.soundType) {
        soundService.playAmbient(activeTrack.soundType);
      }
    } else {
      setPupState('sleeping');
      soundService.stopAmbient();
    }
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGoalText.trim()) return;
    Haptics.notificationAsync('success');
    onAddObjective(newGoalText.trim());
    setNewGoalText('');
    setIsAddingGoal(false);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-28">
      {/* Top Welcome & Subject Selector Bar */}
      <div className="w-full flex items-center justify-between px-1">
        <div className="relative">
          <button
            onClick={() => {
              Haptics.selectionAsync();
              setShowSubjectDropdown(!showSubjectDropdown);
            }}
            className="flex items-center gap-1.5 text-left bg-white/70 dark:bg-[#25211E]/70 px-3 py-1.5 rounded-2xl border border-[#EFE9E0] dark:border-[#38312B] backdrop-blur-md shadow-xs active:scale-95 transition-all"
          >
            <div
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: selectedSubject.color }}
            />
            <div className="flex flex-col">
              <span className="text-[10px] text-[#747871] dark:text-[#A7A9A4] leading-tight">Focusing on</span>
              <span className="text-[13px] font-bold text-[#211A15] dark:text-[#FDEEE4] flex items-center gap-1 leading-tight">
                {selectedSubject.name}
                <span className="text-[11px] opacity-60">▼</span>
              </span>
            </div>
          </button>

          {/* Subject Dropdown Menu */}
          {showSubjectDropdown && (
            <div className="absolute top-full left-0 mt-1.5 z-40 w-56 rounded-2xl bg-white dark:bg-[#25211E] border border-[#EFE9E0] dark:border-[#38312B] shadow-xl p-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95">
              <span className="text-[10px] font-bold px-2 py-1 text-[#747871] uppercase tracking-wider block">
                Select Study Course
              </span>
              {subjects.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => {
                    Haptics.selectionAsync();
                    onSelectSubject(sub);
                    setShowSubjectDropdown(false);
                  }}
                  className={`w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-[12px] font-medium transition-colors ${
                    sub.id === selectedSubject.id
                      ? 'bg-[#8A9A86]/20 text-[#536251] dark:text-[#A7C1A2] font-bold'
                      : 'text-[#211A15] dark:text-[#EFE0D6] hover:bg-[#FAECE1]/50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span className="truncate flex-1">{sub.name}</span>
                  <span className="text-[10px] text-[#747871] dark:text-[#A7A9A4]">
                    {sub.weeklyCompletedHours}h
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Streak Counter Pill */}
        <div className="flex items-center gap-1.5 bg-[#FFDDB5]/70 dark:bg-[#805613]/40 border border-[#F5BC71]/60 rounded-full px-3 py-1 shadow-xs">
          <span className="text-[#805613] dark:text-[#F5BC71] text-xs">🔥</span>
          <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#805613] dark:text-[#F5BC71] tabular-nums">
            {streakDays} Days Streak
          </span>
        </div>
      </div>

      {/* Screen 1 Component A: Isometric Room Viewport */}
      <IsometricRoom
        pupState={pupState}
        activeTrack={activeTrack}
        onTrackChange={handleTrackChange}
        roomLevel={4}
        onTapPup={handleTapPup}
      />

      {/* Screen 1 Component B: Circular Progress Focus Timer */}
      <CircularProgressTimer
        onSessionComplete={onSessionComplete}
        onStateChange={handleTimerRunningChange}
      />

      {/* Screen 1 Component C: Active Session Objectives (Quick Task Dock) */}
      <section className="w-full rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] p-4 flex flex-col gap-2.5 shadow-sm transition-colors">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-[#536251] dark:text-[#A7C1A2] text-[15px]">📋</span>
            <h3 className="font-['Space_Grotesk'] text-[14px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              Active Session Objectives
            </h3>
          </div>
          <button
            onClick={() => {
              Haptics.selectionAsync();
              setIsAddingGoal(!isAddingGoal);
            }}
            className="text-[11px] font-bold text-[#536251] dark:text-[#A7C1A2] hover:underline"
          >
            {isAddingGoal ? 'Cancel' : '+ New Goal'}
          </button>
        </div>

        {/* New Goal Form */}
        {isAddingGoal && (
          <form onSubmit={handleCreateGoal} className="flex items-center gap-2 mt-1">
            <input
              type="text"
              value={newGoalText}
              onChange={(e) => setNewGoalText(e.target.value)}
              placeholder="e.g. Complete 5 practice questions..."
              className="flex-1 text-[13px] px-3 py-2 rounded-xl bg-white dark:bg-[#1E1A17] border border-[#8A9A86] text-[#211A15] dark:text-[#FDEEE4] focus:outline-none focus:ring-1 focus:ring-[#8A9A86]"
              autoFocus
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-[#536251] text-white text-[12px] font-bold shadow-xs active:scale-95 transition-transform"
            >
              Add
            </button>
          </form>
        )}

        {/* Objectives Checklist Items */}
        <div className="flex flex-col gap-2">
          {objectives.map((obj) => (
            <label
              key={obj.id}
              className={`flex items-center gap-3 p-3 rounded-2xl border cursor-pointer transition-all active:scale-[0.99] ${
                obj.completed
                  ? 'bg-[#FAECE1]/50 dark:bg-[#1F1B18]/50 border-[#C4C8BF]/30'
                  : 'bg-white dark:bg-[#28231F] border-[#EFE9E0] dark:border-[#38312B] shadow-xs'
              }`}
            >
              <input
                type="checkbox"
                checked={obj.completed}
                onChange={() => {
                  Haptics.impactAsync('light');
                  onToggleObjective(obj.id);
                }}
                className="w-5 h-5 rounded-lg text-[#536251] focus:ring-0 border-[#C4C8BF] cursor-pointer accent-[#536251]"
              />
              <span
                className={`text-[13px] flex-1 leading-snug ${
                  obj.completed
                    ? 'line-through text-[#747871] dark:text-[#9A938C]'
                    : 'text-[#211A15] dark:text-[#FDEEE4] font-medium'
                }`}
              >
                {obj.title}
              </span>
              <span className="text-[11px] font-semibold text-[#8A9A86] dark:text-[#A7C1A2] shrink-0">
                {obj.completed ? 'Done ✓' : `${obj.durationMinutes || 30}m`}
              </span>
            </label>
          ))}
        </div>
      </section>
    </div>
  );
};
