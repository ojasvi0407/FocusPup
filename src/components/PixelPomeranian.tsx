import React, { useState } from 'react';
import { PomeranianState } from '../types';
import { Haptics } from '../services/hapticsService';

interface PixelPomeranianProps {
  state?: PomeranianState;
  size?: number;
  showReactionBubble?: boolean;
  onTap?: () => void;
  className?: string;
}

export const PixelPomeranian: React.FC<PixelPomeranianProps> = ({
  state = 'studying',
  size = 140,
  showReactionBubble = true,
  onTap,
  className = '',
}) => {
  const [bubbleText, setBubbleText] = useState<string | null>(null);

  const handleClick = () => {
    Haptics.impactAsync('light');
    const barks = [
      'Bork! Let\'s focus!',
      'Proud of you!',
      '*Happy tail wag*',
      'Soft cuddle ♡',
      'zzZ snoozing...',
      'Deep study vibe ✨',
      '+1 Focus Paw 🐾'
    ];
    const pick = barks[Math.floor(Math.random() * barks.length)];
    setBubbleText(pick);
    setTimeout(() => setBubbleText(null), 2200);
    if (onTap) onTap();
  };

  const isSleeping = state === 'sleeping';
  const isStudying = state === 'studying';
  const isWagging = state === 'wagging' || state === 'happy';

  return (
    <div
      onClick={handleClick}
      className={`relative inline-flex flex-col items-center justify-center cursor-pointer select-none group ${className}`}
      style={{ width: size, height: size + 20 }}
      title="Tap your Pomeranian companion!"
    >
      {/* Speech / Reaction Bubble */}
      {showReactionBubble && bubbleText && (
        <div className="absolute -top-7 z-30 px-3 py-1 rounded-full bg-white/95 dark:bg-[#2D2824]/95 backdrop-blur-md border border-[#EFE9E0] dark:border-[#443C36] shadow-md text-[11px] font-semibold text-[#536251] dark:text-[#A7C1A2] whitespace-nowrap animate-bounce">
          {bubbleText}
        </div>
      )}

      {/* SVG Pixel Pomeranian Dog */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        style={{
          imageRendering: 'pixelated',
          shapeRendering: 'crispEdges'
        }}
        className="transition-transform duration-300 group-hover:scale-105 active:scale-95"
      >
        <defs>
          <filter id="pixel-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="1" floodColor="#2E2620" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* Soft shadow below puppy */}
        <ellipse cx="32" cy="56" rx="20" ry="4" fill="#2E2620" opacity="0.15" />

        {/* RUG / CUSHION */}
        <rect x="12" y="52" width="40" height="5" rx="2" fill="#E8DEC8" />
        <rect x="14" y="53" width="36" height="3" fill="#DFD2B8" />

        {/* --- POMERANIAN BODY & FUR (Pixelated blocks) --- */}
        {/* Tail (Wagging in happy state) */}
        <g className={isWagging ? 'origin-[48px_44px] animate-pulse' : ''}>
          <rect x="46" y="32" width="6" height="8" fill="#E6AF65" />
          <rect x="48" y="28" width="6" height="6" fill="#F4CA88" />
          <rect x="52" y="30" width="4" height="6" fill="#FFF2DC" />
          <rect x="44" y="36" width="4" height="6" fill="#D49544" />
        </g>

        {/* Fluffy Body */}
        <rect x="20" y="34" width="26" height="18" rx="4" fill="#E6AF65" />
        <rect x="22" y="36" width="22" height="14" fill="#F4CA88" />
        {/* Back shading */}
        <rect x="36" y="38" width="8" height="12" fill="#D49544" />
        <rect x="24" y="44" width="16" height="6" fill="#FFF2DC" />

        {/* Paws */}
        {isSleeping ? (
          // Sleeping curled paws tucked under
          <g>
            <rect x="18" y="48" width="8" height="4" rx="2" fill="#FFF2DC" />
            <rect x="28" y="48" width="8" height="4" rx="2" fill="#FFF2DC" />
          </g>
        ) : (
          // Front and back sitting paws
          <g>
            <rect x="22" y="48" width="6" height="5" rx="1" fill="#FFF2DC" />
            <rect x="30" y="48" width="6" height="5" rx="1" fill="#FFF2DC" />
            <rect x="40" y="47" width="5" height="5" rx="1" fill="#D49544" />
          </g>
        )}

        {/* Scarf (Matcha Sage #8A9A86) */}
        <rect x="18" y="32" width="18" height="4" rx="1" fill="#8A9A86" />
        <rect x="16" y="33" width="5" height="6" rx="1" fill="#6B7E67" />
        <circle cx="18" cy="36" r="1.5" fill="#E6AF65" />

        {/* Fluffy Head */}
        <rect x="16" y="16" width="22" height="18" rx="6" fill="#E6AF65" />
        <rect x="18" y="18" width="18" height="14" rx="4" fill="#F4CA88" />
        {/* Cheeks fluffy white fur */}
        <rect x="15" y="24" width="4" height="6" fill="#FFF2DC" />
        <rect x="35" y="24" width="4" height="6" fill="#FFF2DC" />
        <rect x="20" y="25" width="14" height="7" rx="3" fill="#FFF2DC" />

        {/* Ears (Pointed Pomeranian Fox Ears) */}
        {/* Left Ear */}
        <polygon points="17,17 21,9 25,17" fill="#D49544" />
        <polygon points="19,16 21,11 23,16" fill="#F8C3B8" />
        {/* Right Ear */}
        <polygon points="29,17 33,9 37,17" fill="#D49544" />
        <polygon points="31,16 33,11 35,16" fill="#F8C3B8" />

        {/* Eyes & Expression */}
        {isSleeping ? (
          // Sleeping eyes: curved peaceful slits (^_^)
          <g stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round" fill="none">
            <path d="M 21 24 Q 23 26 25 24" />
            <path d="M 29 24 Q 31 26 33 24" />
          </g>
        ) : isWagging ? (
          // Joyful squint happy eyes (^^)
          <g stroke="#3D2B1F" strokeWidth="1.5" strokeLinecap="round" fill="none">
            <path d="M 21 25 Q 23 23 25 25" />
            <path d="M 29 25 Q 31 23 33 25" />
          </g>
        ) : (
          // Wide curious shiny puppy eyes (●ᴥ●)
          <g>
            <rect x="21" y="23" width="3" height="4" rx="1" fill="#2E2620" />
            <rect x="21" y="23" width="1" height="1" fill="#FFFFFF" />
            <rect x="30" y="23" width="3" height="4" rx="1" fill="#2E2620" />
            <rect x="30" y="23" width="1" height="1" fill="#FFFFFF" />
          </g>
        )}

        {/* Tiny Black Button Nose */}
        <ellipse cx="27" cy="27" rx="2" ry="1.4" fill="#2E2620" />
        {/* Mouth */}
        <path d="M 26 28 Q 27 29.5 28 28" stroke="#2E2620" strokeWidth="0.8" fill="none" />

        {/* Subtle Pink Cheeks */}
        <ellipse cx="19" cy="27" rx="2" ry="1" fill="#FFAAA6" opacity="0.65" />
        <ellipse cx="35" cy="27" rx="2" ry="1" fill="#FFAAA6" opacity="0.65" />

        {/* STUDY ACCESSORY: Mini Laptop / Study Notebook + Steaming Mug */}
        {isStudying && (
          <g transform="translate(36, 40)">
            {/* Ceramic Tea Mug */}
            <rect x="12" y="5" width="6" height="7" rx="1" fill="#FFFFFF" stroke="#8A9A86" strokeWidth="0.8" />
            <rect x="13" y="6" width="4" height="2" fill="#805613" />
            <path d="M 18 7 Q 20 8.5 18 10" stroke="#8A9A86" strokeWidth="0.8" fill="none" />
            {/* Steam curves */}
            <path d="M 14 3 Q 15 1 14 0" stroke="#A7C1A2" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
            <path d="M 16 4 Q 17 2 16 1" stroke="#A7C1A2" strokeWidth="0.8" strokeLinecap="round" opacity="0.75" />
          </g>
        )}

        {/* SLEEPING ACCESSORY: Floating zZz */}
        {isSleeping && (
          <g fill="#8A9A86" className="animate-pulse">
            <text x="38" y="18" fontSize="8" fontWeight="bold" fontFamily="Space Grotesk">z</text>
            <text x="44" y="13" fontSize="10" fontWeight="bold" fontFamily="Space Grotesk">Z</text>
            <text x="51" y="8" fontSize="12" fontWeight="bold" fontFamily="Space Grotesk">Z</text>
          </g>
        )}

        {/* HAPPY ACCESSORY: Floating heart / sparkles */}
        {isWagging && (
          <g fill="#D4836A" className="animate-bounce">
            <path d="M 10 14 C 10 12, 12 11, 13 12 C 14 11, 16 12, 16 14 C 16 16, 13 18, 13 18 C 13 18, 10 16, 10 14 Z" />
            <circle cx="48" cy="18" r="1.5" fill="#E6AF65" />
            <circle cx="52" cy="22" r="1" fill="#8A9A86" />
          </g>
        )}
      </svg>

      {/* Mood Subtitle Tag */}
      <span className="text-[11px] font-semibold text-[#747871] dark:text-[#A7A9A4] mt-1 tracking-tight">
        {isStudying ? 'Studying with you ☕' : isSleeping ? 'Paws up resting 💤' : isWagging ? 'Super proud of you! ✨' : 'Attentive & ready 🐾'}
      </span>
    </div>
  );
};
