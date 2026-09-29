import React from 'react';
import { Haptics } from '../services/hapticsService';

export type TabKey = 'desk' | 'calendar' | 'vault' | 'pupgrade';

interface GlassTabBarProps {
  activeTab: TabKey;
  onSelectTab: (tab: TabKey) => void;
}

export const GlassTabBar: React.FC<GlassTabBarProps> = ({
  activeTab,
  onSelectTab
}) => {
  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'desk', label: 'Desk', icon: '🪑' },
    { key: 'calendar', label: 'Calendar', icon: '📅' },
    { key: 'vault', label: 'Vault', icon: '📈' },
    { key: 'pupgrade', label: 'Upgrades', icon: '🐾' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex justify-center items-center pb-safe pointer-events-none px-4 pb-4">
      <div className="w-full max-w-[400px] mx-auto rounded-full bg-white/85 dark:bg-[#1E1A17]/90 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] shadow-lg dark:shadow-black/40 flex items-center justify-around px-3 py-2 pointer-events-auto transition-colors">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => {
                Haptics.selectionAsync();
                onSelectTab(tab.key);
              }}
              className={`flex flex-col items-center justify-center transition-all duration-150 active:scale-95 cursor-pointer ${
                isActive
                  ? 'bg-[#8A9A86] text-white rounded-full px-4 py-1.5 shadow-xs font-semibold'
                  : 'text-[#747871] dark:text-[#A7A9A4] hover:text-[#211A15] dark:hover:text-white px-3 py-1.5'
              }`}
            >
              <span className="text-base leading-none select-none">{tab.icon}</span>
              <span className="text-[10px] tracking-tight mt-0.5 select-none font-medium">
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
