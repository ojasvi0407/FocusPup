import React, { useState, useEffect } from 'react';
import { PixelPomeranian } from './PixelPomeranian';
import { PomeranianState, AmbientTrack } from '../types';
import { soundService } from '../services/soundService';
import { Haptics } from '../services/hapticsService';

interface IsometricRoomProps {
  pupState: PomeranianState;
  activeTrack: AmbientTrack;
  onTrackChange: (track: AmbientTrack) => void;
  roomLevel?: number;
  onTapPup?: () => void;
}

export const soundTracks: AmbientTrack[] = [
  { id: 'track_rain', name: 'Rainfall', emoji: '🌧️', soundType: 'rain' },
  { id: 'track_fire', name: 'Campfire', emoji: '🔥', soundType: 'campfire' },
  { id: 'track_cafe', name: 'Lo-Fi Café', emoji: '☕', soundType: 'cafe' },
  { id: 'track_white', name: 'White Noise', emoji: '🎧', soundType: 'whitenoise' }
];

export const IsometricRoom: React.FC<IsometricRoomProps> = ({
  pupState,
  activeTrack,
  onTrackChange,
  roomLevel = 4,
  onTapPup
}) => {
  const [timeOfDay, setTimeOfDay] = useState<'day' | 'evening' | 'night'>('day');
  const [viewMode, setViewMode] = useState<'art' | 'companion'>('art');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 17) {
      setTimeOfDay('day');
    } else if (hour >= 17 && hour < 20) {
      setTimeOfDay('evening');
    } else {
      setTimeOfDay('night');
    }
  }, []);

  const handleTrackSelect = (track: AmbientTrack) => {
    Haptics.selectionAsync();
    onTrackChange(track);
  };

  return (
    <div className="w-full rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] p-4 flex flex-col items-center relative shadow-sm overflow-hidden transition-colors">
      {/* Room Status Bar */}
      <div className="w-full flex items-center justify-between mb-3 px-1">
        <div className="inline-flex items-center gap-1.5 bg-[#FFF1E8]/90 dark:bg-[#322923]/90 border border-[#C4C8BF]/30 dark:border-[#4B4036]/50 rounded-full px-3 py-1">
          <span className="text-[11px] font-semibold text-[#536251] dark:text-[#A7C1A2] tracking-tight">
            Room Lv. {roomLevel}: Rainy Loft
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              Haptics.selectionAsync();
              setViewMode(viewMode === 'art' ? 'companion' : 'art');
            }}
            className="text-[10px] font-bold text-[#805613] dark:text-[#F5BC71] bg-[#FFDDB5]/60 dark:bg-[#805613]/40 px-2 py-0.5 rounded-md hover:opacity-85 transition-opacity"
            title="Toggle companion focus mode"
          >
            {viewMode === 'art' ? '🔍 View Pup' : '🏠 View Room'}
          </button>
          <span className="text-[10px] font-bold text-[#536251] dark:text-[#A7C1A2] bg-[#D7E7D1]/70 dark:bg-[#536251]/50 px-2 py-0.5 rounded-md">
            +15% Focus Vibe
          </span>
        </div>
      </div>

      {/* Isometric Stage Frame */}
      <div className="relative w-full max-w-[280px] aspect-square rounded-2xl border-2 border-[#EFE9E0] dark:border-[#3E3630] bg-[#F5E5DC]/30 dark:bg-[#1E1A17] overflow-hidden flex items-center justify-center p-1 shadow-inner">
        {viewMode === 'art' ? (
          // Isometric Room Art
          <div className="relative w-full h-full rounded-xl overflow-hidden">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB-ml68qPkBeQ5eWF_xGseXoiemSfjg3q19CMtP-lahGZ3qHSBczuS57lkQH0DrWWDkxY-PLY8DFxrrqEDdN0WaULnvgmMyJkbSX19oygEQ_7lhinVa53BKtOl8z3nmii1X9HpW3enNGYYQCIzb1WdO1DSNcJNuBHLD-G_OggQnHodvVtmQgeHxXyfG6RvB0--DuDRv-Xi6YqhUz74lul2N-ft_v5Z8Gyncy2JpM9MiX1eb8VSvtSXV"
              alt="Cozy Isometric Study Loft with Pomeranian"
              className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 cursor-pointer"
              onClick={onTapPup}
            />

            {/* Time-based ambient tint overlay */}
            <div
              className={`absolute inset-0 pointer-events-none transition-opacity duration-1000 ${
                timeOfDay === 'night'
                  ? 'bg-indigo-950/25 mix-blend-multiply'
                  : timeOfDay === 'evening'
                  ? 'bg-amber-900/15 mix-blend-color-burn'
                  : 'bg-transparent'
              }`}
            />
          </div>
        ) : (
          // Interactive Companion Showcase
          <div className="w-full h-full flex flex-col items-center justify-center bg-radial from-[#FFF8F5] to-[#FAECE1] dark:from-[#25201C] dark:to-[#1A1614] rounded-xl p-2">
            <PixelPomeranian state={pupState} size={150} onTap={onTapPup} />
          </div>
        )}

        {/* Ambient Soundscape Playing Indicator */}
        <div className="absolute bottom-2.5 left-2.5 bg-[#211A15]/80 backdrop-blur-md text-[#FDEEE4] rounded-full px-2.5 py-1 flex items-center gap-1.5 shadow-sm border border-white/10 select-none">
          <span className="text-[11px] text-[#F5BC71]">
            {activeTrack.emoji}
          </span>
          <span className="text-[10px] font-medium tracking-wide">
            {activeTrack.name}
          </span>
          <span className="flex gap-0.5 items-end h-2 ml-0.5">
            <span className="w-0.5 h-1.5 bg-[#D7E7D1] rounded-full animate-pulse" />
            <span className="w-0.5 h-2.5 bg-[#D7E7D1] rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <span className="w-0.5 h-1 bg-[#D7E7D1] rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </span>
        </div>

        {/* Pup Sleep/Awake Badge */}
        <div
          onClick={onTapPup}
          className="absolute top-2.5 right-2.5 bg-white/90 dark:bg-[#2D2824]/90 backdrop-blur-sm rounded-full w-7 h-7 border border-[#C4C8BF]/40 dark:border-[#4E443C] shadow-xs flex items-center justify-center cursor-pointer active:scale-90 transition-transform"
          title="Pup Mood Status"
        >
          <span className="text-xs">
            {pupState === 'studying' ? '☕' : pupState === 'sleeping' ? '💤' : '✨'}
          </span>
        </div>
      </div>

      {/* Ambient Soundscape Selector Pills */}
      <div className="w-full mt-3.5 flex items-center justify-between gap-1.5 px-0.5 overflow-x-auto no-scrollbar py-0.5">
        {soundTracks.map((track) => {
          const isActive = activeTrack.id === track.id;
          return (
            <button
              key={track.id}
              onClick={() => handleTrackSelect(track)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-medium shrink-0 transition-all active:scale-95 duration-150 ${
                isActive
                  ? 'bg-[#8A9A86] text-white shadow-xs border border-[#536251]/30 font-semibold'
                  : 'bg-white/80 dark:bg-[#2D2824]/80 text-[#444842] dark:text-[#C4C8BF] hover:text-[#211A15] dark:hover:text-white border border-[#EFE9E0] dark:border-[#3E3630]'
              }`}
            >
              <span>{track.emoji}</span>
              <span>{track.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
