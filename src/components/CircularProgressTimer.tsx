import React, { useState, useEffect } from 'react';
import { FocusMode } from '../types';
import { Haptics } from '../services/hapticsService';
import { soundService } from '../services/soundService';

interface CircularProgressTimerProps {
  onSessionComplete?: (minutes: number) => void;
  onStateChange?: (isRunning: boolean) => void;
}

export const CircularProgressTimer: React.FC<CircularProgressTimerProps> = ({
  onSessionComplete,
  onStateChange
}) => {
  const [mode, setMode] = useState<FocusMode>('deep');
  const [totalSeconds, setTotalSeconds] = useState(50 * 60); // default 50m
  const [remainingSeconds, setRemainingSeconds] = useState(50 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionCount, setSessionCount] = useState(2);
  const [showConfig, setShowConfig] = useState(false);
  const [customMinutes, setCustomMinutes] = useState(30);

  // Set mode times
  const handleModeChange = (newMode: FocusMode) => {
    Haptics.selectionAsync();
    setMode(newMode);
    setIsRunning(false);
    if (onStateChange) onStateChange(false);

    if (newMode === 'pomodoro') {
      setTotalSeconds(25 * 60);
      setRemainingSeconds(25 * 60);
    } else if (newMode === 'deep') {
      setTotalSeconds(50 * 60);
      setRemainingSeconds(50 * 60);
    } else {
      setTotalSeconds(customMinutes * 60);
      setRemainingSeconds(customMinutes * 60);
    }
  };

  // Toggle timer
  const handleToggleTimer = () => {
    Haptics.impactAsync('medium');
    const nextState = !isRunning;
    setIsRunning(nextState);
    if (onStateChange) onStateChange(nextState);

    if (nextState) {
      soundService.playChime('start');
    } else {
      soundService.playChime('tick');
    }
  };

  // Reset timer
  const handleReset = () => {
    Haptics.impactAsync('light');
    setIsRunning(false);
    if (onStateChange) onStateChange(false);
    setRemainingSeconds(totalSeconds);
  };

  // Countdown effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning && remainingSeconds > 0) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            // Completed!
            setIsRunning(false);
            if (onStateChange) onStateChange(false);
            soundService.playChime('complete');
            Haptics.notificationAsync('success');
            setSessionCount((s) => s + 1);
            if (onSessionComplete) {
              onSessionComplete(Math.round(totalSeconds / 60));
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, remainingSeconds, totalSeconds, onSessionComplete, onStateChange]);

  // Format time
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const timeFormatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // SVG Circular math
  const radius = 70;
  const circumference = 2 * Math.PI * radius; // ~439.8
  const progressRatio = totalSeconds > 0 ? (totalSeconds - remainingSeconds) / totalSeconds : 0;
  const strokeDashoffset = circumference - progressRatio * circumference;

  return (
    <div className="w-full rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] p-5 flex flex-col items-center relative shadow-sm transition-colors">
      {/* Timer Mode Switcher Segmented Control */}
      <div className="w-full bg-[#FAECE1]/70 dark:bg-[#1E1A17]/80 p-1 rounded-full border border-[#C4C8BF]/30 dark:border-[#38312B] flex items-center justify-between mb-4">
        <button
          onClick={() => handleModeChange('pomodoro')}
          className={`flex-1 py-1.5 text-center text-[11px] rounded-full transition-all font-medium ${
            mode === 'pomodoro'
              ? 'bg-white dark:bg-[#2E2824] text-[#536251] dark:text-[#A7C1A2] font-bold shadow-xs border border-[#C4C8BF]/20'
              : 'text-[#444842] dark:text-[#9A938C] hover:text-[#211A15]'
          }`}
        >
          Pomodoro (25m)
        </button>
        <button
          onClick={() => handleModeChange('deep')}
          className={`flex-1 py-1.5 text-center text-[11px] rounded-full transition-all font-medium ${
            mode === 'deep'
              ? 'bg-white dark:bg-[#2E2824] text-[#536251] dark:text-[#A7C1A2] font-bold shadow-xs border border-[#C4C8BF]/20'
              : 'text-[#444842] dark:text-[#9A938C] hover:text-[#211A15]'
          }`}
        >
          Deep Focus (50m)
        </button>
        <button
          onClick={() => handleModeChange('stopwatch')}
          className={`flex-1 py-1.5 text-center text-[11px] rounded-full transition-all font-medium ${
            mode === 'stopwatch'
              ? 'bg-white dark:bg-[#2E2824] text-[#536251] dark:text-[#A7C1A2] font-bold shadow-xs border border-[#C4C8BF]/20'
              : 'text-[#444842] dark:text-[#9A938C] hover:text-[#211A15]'
          }`}
        >
          Custom ({customMinutes}m)
        </button>
      </div>

      {/* Circular Progress Ring */}
      <div className="relative w-48 h-48 flex items-center justify-center my-1 select-none">
        <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
          {/* Background Track */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="7"
            className="text-[#F5E5DC]/70 dark:text-[#38312B]"
          />
          {/* Matcha Sage / Terracotta Progress Arc */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="7"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className={`transition-all duration-700 ease-out ${
              isRunning ? 'text-[#8A9A86] dark:text-[#A7C1A2]' : 'text-[#8A9A86]/70'
            }`}
          />
        </svg>

        {/* Central Monospace Countdown & Session Counter */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="font-['Space_Grotesk'] text-[46px] font-bold text-[#211A15] dark:text-[#FDEEE4] tracking-tight tabular-nums drop-shadow-xs">
            {timeFormatted}
          </span>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] font-medium text-[#747871] dark:text-[#9A938C]">
            <span className="inline-block w-2 h-2 rounded-full bg-[#8A9A86]" />
            <span>Session {sessionCount} of 4</span>
          </div>
        </div>
      </div>

      {/* Big Tactile CTA Action Button */}
      <div className="w-full mt-4 flex items-center justify-center gap-3">
        <button
          onClick={handleToggleTimer}
          className={`flex-1 max-w-[260px] py-3.5 px-6 rounded-full font-semibold text-[16px] flex items-center justify-center gap-2 shadow-md active:scale-98 transition-all cursor-pointer ${
            isRunning
              ? 'bg-[#D4836A] hover:bg-[#B96A53] text-white shadow-[#D4836A]/20'
              : 'bg-[#536251] hover:bg-[#3C4B3A] text-white shadow-[#536251]/20'
          }`}
        >
          {isRunning ? (
            <>
              <span className="text-xl">⏸</span>
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <span className="text-xl">▶</span>
              <span>Begin Focus</span>
            </>
          )}
        </button>

        {/* Settings / Reset Button */}
        <button
          onClick={() => {
            Haptics.selectionAsync();
            setShowConfig(!showConfig);
          }}
          className="w-12 h-12 rounded-full bg-white dark:bg-[#2D2824] border border-[#EFE9E0] dark:border-[#3E3630] flex items-center justify-center text-[#444842] dark:text-[#C4C8BF] hover:text-[#211A15] dark:hover:text-white active:scale-95 transition-transform shadow-xs"
          title="Adjust Duration or Reset"
        >
          ⚙️
        </button>
      </div>

      {/* Config Drawer for Custom Duration */}
      {showConfig && (
        <div className="w-full mt-3 p-3 rounded-2xl bg-[#FFF8F5] dark:bg-[#1E1A17] border border-[#EFE9E0] dark:border-[#38312B] flex items-center justify-between gap-2">
          <span className="text-[11px] font-medium text-[#444842] dark:text-[#9A938C]">
            Custom Minutes:
          </span>
          <div className="flex items-center gap-1.5">
            {[15, 30, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => {
                  Haptics.selectionAsync();
                  setCustomMinutes(mins);
                  if (mode === 'stopwatch') {
                    setTotalSeconds(mins * 60);
                    setRemainingSeconds(mins * 60);
                  }
                }}
                className={`px-2 py-1 rounded-lg text-[10px] font-semibold transition-all ${
                  customMinutes === mins
                    ? 'bg-[#8A9A86] text-white'
                    : 'bg-white dark:bg-[#2E2824] text-[#444842] dark:text-[#A7A9A4] border border-[#C4C8BF]/30'
                }`}
              >
                {mins}m
              </button>
            ))}
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded-lg bg-[#FFDBD0] dark:bg-[#904B36] text-[#904B36] dark:text-[#FFDBD0] text-[10px] font-bold hover:opacity-85"
            >
              Reset
            </button>
          </div>
        </div>
      )}

      {/* Daily Study Habit Progress Bar */}
      <div className="w-full mt-4 pt-3 border-t border-[#C4C8BF]/20 dark:border-[#38312B] flex items-center justify-between text-[12px] text-[#444842] dark:text-[#A7A9A4]">
        <div className="flex items-center gap-1.5">
          <span>⏱</span>
          <span>Today's Target: <strong className="text-[#211A15] dark:text-white">3.5h / 4h</strong></span>
        </div>
        <div className="flex items-center gap-1 text-[#805613] dark:text-[#F5BC71] font-['Space_Grotesk'] font-bold text-[12px]">
          <span>+80 Kibble</span>
          <span className="text-xs">🦴</span>
        </div>
      </div>
    </div>
  );
};
