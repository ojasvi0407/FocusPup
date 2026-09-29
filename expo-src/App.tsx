import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, useColorScheme, Platform, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';

import { StudySanctuaryScreen } from './screens/StudySanctuaryScreen';
import { PupgressCalendarScreen } from './screens/PupgressCalendarScreen';
import { HourVaultScreen } from './screens/HourVaultScreen';
import { PupGradeCenterScreen } from './screens/PupGradeCenterScreen';

const Tab = createBottomTabNavigator();

// Stitch Design Tokens
const FocusPupTheme = {
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: '#FAF7F2',
      card: 'rgba(255, 255, 255, 0.85)',
      text: '#211A15',
      border: '#EFE9E0',
      primary: '#8A9A86',
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: '#1C1917',
      card: 'rgba(37, 33, 30, 0.85)',
      text: '#FDEEE4',
      border: '#38312B',
      primary: '#A7C1A2',
    },
  },
};

export default function App() {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'system' | 'light' | 'dark'>('system');

  const isDark = themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const theme = isDark ? FocusPupTheme.dark : FocusPupTheme.light;

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={theme}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: 'absolute',
              bottom: 20,
              left: 20,
              right: 20,
              elevation: 0,
              backgroundColor: isDark ? 'rgba(30, 26, 23, 0.88)' : 'rgba(255, 255, 255, 0.88)',
              borderRadius: 32,
              height: 64,
              borderTopWidth: 0,
              borderColor: isDark ? '#38312B' : '#EFE9E0',
              borderWidth: 1,
              shadowColor: '#2E2620',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.12,
              shadowRadius: 20,
            },
            tabBarBackground: () => (
              <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={StyleSheet.absoluteFill}
              />
            ),
            tabBarActiveTintColor: isDark ? '#A7C1A2' : '#536251',
            tabBarInactiveTintColor: isDark ? '#8A847E' : '#747871',
            tabBarLabelStyle: {
              fontFamily: Platform.select({ ios: 'SpaceGrotesk-Medium', android: 'monospace' }),
              fontSize: 10,
              fontWeight: '600',
              marginBottom: 8,
            },
          }}
          screenListeners={{
            tabPress: () => {
              Haptics.selectionAsync();
            },
          }}
        >
          <Tab.Screen
            name="Desk"
            component={StudySanctuaryScreen}
            options={{
              tabBarLabel: 'Desk',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🪑</Text>,
            }}
          />
          <Tab.Screen
            name="Calendar"
            component={PupgressCalendarScreen}
            options={{
              tabBarLabel: 'Calendar',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📅</Text>,
            }}
          />
          <Tab.Screen
            name="Vault"
            component={HourVaultScreen}
            options={{
              tabBarLabel: 'Vault',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>📈</Text>,
            }}
          />
          <Tab.Screen
            name="Pupgrade"
            children={() => (
              <PupGradeCenterScreen
                themeMode={themeMode}
                onThemeModeChange={setThemeMode}
              />
            )}
            options={{
              tabBarLabel: 'Upgrades',
              tabBarIcon: ({ color }) => <Text style={{ fontSize: 18 }}>🐾</Text>,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
