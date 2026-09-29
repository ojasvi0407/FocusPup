import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Rect, Circle, Ellipse, Polygon, Path } from 'react-native-svg';

interface PixelPomeranianNativeProps {
  state?: 'studying' | 'idle' | 'sleeping' | 'wagging' | 'happy';
  size?: number;
}

export function PixelPomeranianNative({ state = 'studying', size = 140 }: PixelPomeranianNativeProps) {
  const isSleeping = state === 'sleeping';
  const isStudying = state === 'studying';
  const isWagging = state === 'wagging' || state === 'happy';

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox="0 0 64 64">
        {/* Soft shadow */}
        <Ellipse cx="32" cy="56" rx="20" ry="4" fill="#2E2620" opacity={0.15} />

        {/* Rug */}
        <Rect x="12" y="52" width="40" height="5" rx="2" fill="#E8DEC8" />
        <Rect x="14" y="53" width="36" height="3" fill="#DFD2B8" />

        {/* Tail */}
        <Rect x="46" y="32" width="6" height="8" fill="#E6AF65" />
        <Rect x="48" y="28" width="6" height="6" fill="#F4CA88" />
        <Rect x="52" y="30" width="4" height="6" fill="#FFF2DC" />

        {/* Body */}
        <Rect x="20" y="34" width="26" height="18" rx="4" fill="#E6AF65" />
        <Rect x="22" y="36" width="22" height="14" fill="#F4CA88" />
        <Rect x="36" y="38" width="8" height="12" fill="#D49544" />
        <Rect x="24" y="44" width="16" height="6" fill="#FFF2DC" />

        {/* Paws */}
        <Rect x="22" y="48" width="6" height="5" rx="1" fill="#FFF2DC" />
        <Rect x="30" y="48" width="6" height="5" rx="1" fill="#FFF2DC" />
        <Rect x="40" y="47" width="5" height="5" rx="1" fill="#D49544" />

        {/* Scarf */}
        <Rect x="18" y="32" width="18" height="4" rx="1" fill="#8A9A86" />
        <Rect x="16" y="33" width="5" height="6" rx="1" fill="#6B7E67" />
        <Circle cx="18" cy="36" r="1.5" fill="#E6AF65" />

        {/* Head */}
        <Rect x="16" y="16" width="22" height="18" rx="6" fill="#E6AF65" />
        <Rect x="18" y="18" width="18" height="14" rx="4" fill="#F4CA88" />
        <Rect x="15" y="24" width="4" height="6" fill="#FFF2DC" />
        <Rect x="35" y="24" width="4" height="6" fill="#FFF2DC" />
        <Rect x="20" y="25" width="14" height="7" rx="3" fill="#FFF2DC" />

        {/* Ears */}
        <Polygon points="17,17 21,9 25,17" fill="#D49544" />
        <Polygon points="19,16 21,11 23,16" fill="#F8C3B8" />
        <Polygon points="29,17 33,9 37,17" fill="#D49544" />
        <Polygon points="31,16 33,11 35,16" fill="#F8C3B8" />

        {/* Eyes */}
        {isSleeping ? (
          <Path d="M 21 24 Q 23 26 25 24 M 29 24 Q 31 26 33 24" stroke="#3D2B1F" strokeWidth="1.5" fill="none" />
        ) : (
          <>
            <Rect x="21" y="23" width="3" height="4" rx="1" fill="#2E2620" />
            <Rect x="21" y="23" width="1" height="1" fill="#FFFFFF" />
            <Rect x="30" y="23" width="3" height="4" rx="1" fill="#2E2620" />
            <Rect x="30" y="23" width="1" height="1" fill="#FFFFFF" />
          </>
        )}

        {/* Button Nose & Cheeks */}
        <Ellipse cx="27" cy="27" rx="2" ry="1.4" fill="#2E2620" />
        <Ellipse cx="19" cy="27" rx="2" ry="1" fill="#FFAAA6" opacity={0.6} />
        <Ellipse cx="35" cy="27" rx="2" ry="1" fill="#FFAAA6" opacity={0.6} />

        {/* Steaming Mug if Studying */}
        {isStudying && (
          <>
            <Rect x="48" y="45" width="6" height="7" rx="1" fill="#FFFFFF" stroke="#8A9A86" strokeWidth="0.8" />
            <Rect x="49" y="46" width="4" height="2" fill="#805613" />
            <Path d="M 50 43 Q 51 41 50 40" stroke="#A7C1A2" strokeWidth="0.8" fill="none" />
          </>
        )}
      </Svg>
    </View>
  );
}
