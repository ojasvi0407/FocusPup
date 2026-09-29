import React, { useState } from 'react';
import { PupgradeItem, UserStats } from '../types';
import { Haptics } from '../services/hapticsService';
import { soundService } from '../services/soundService';

interface PupGradeCenterScreenProps {
  pupgrades: PupgradeItem[];
  stats: UserStats;
  onEquipItem: (id: string) => void;
  onBuyItem: (id: string, cost: number) => boolean;
  themeMode: 'system' | 'light' | 'dark';
  onThemeModeChange: (mode: 'system' | 'light' | 'dark') => void;
}

export const PupGradeCenterScreen: React.FC<PupGradeCenterScreenProps> = ({
  pupgrades,
  stats,
  onEquipItem,
  onBuyItem,
  themeMode,
  onThemeModeChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'desk' | 'room' | 'companion'>('all');
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'desk', label: 'Desk Decor' },
    { id: 'room', label: 'Room Vibe' },
    { id: 'companion', label: 'Companions' }
  ];

  const filteredItems = pupgrades.filter(
    (item) => selectedCategory === 'all' || item.category === selectedCategory
  );

  const handleBuy = (item: PupgradeItem) => {
    if (stats.currentKibbles < item.costKibbles) {
      Haptics.notificationAsync('warning');
      setPurchaseNotification(`Need ${item.costKibbles - stats.currentKibbles} more Kibbles! Keep studying!`);
      setTimeout(() => setPurchaseNotification(null), 2500);
      return;
    }

    const success = onBuyItem(item.id, item.costKibbles);
    if (success) {
      Haptics.notificationAsync('success');
      soundService.playChime('complete');
      setPurchaseNotification(`Unlocked ${item.name}! 🎉`);
      setTimeout(() => setPurchaseNotification(null), 2500);
    }
  };

  const handleEquip = (item: PupgradeItem) => {
    Haptics.impactAsync('light');
    onEquipItem(item.id);
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-28">
      {/* Header & Wallet Banner */}
      <section className="flex flex-col gap-2 pt-1">
        <div>
          <h1 className="font-['Space_Grotesk'] text-[24px] font-bold text-[#211A15] dark:text-[#FDEEE4] tracking-tight">
            PUP-grade Center
          </h1>
          <p className="text-[12px] text-[#747871] dark:text-[#A7A9A4]">
            Furnish your study sanctuary with cozy lo-fi rewards
          </p>
        </div>

        {/* Currency Display Cards */}
        <div className="grid grid-cols-2 gap-2.5 mt-1">
          <div className="p-3 rounded-2xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#FFDDB5]/70 dark:bg-[#805613]/40 flex items-center justify-center text-lg">
              🦴
            </div>
            <div>
              <span className="text-[10px] font-medium text-[#747871] dark:text-[#A7A9A4]">
                Pup Kibbles
              </span>
              <div className="font-['Space_Grotesk'] text-[18px] font-bold text-[#805613] dark:text-[#F5BC71] tabular-nums">
                {stats.currentKibbles}
              </div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] flex items-center gap-3 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#D7E7D1]/70 dark:bg-[#3C4B3A]/40 flex items-center justify-center text-lg">
              🌱
            </div>
            <div>
              <span className="text-[10px] font-medium text-[#747871] dark:text-[#A7A9A4]">
                Focus Seeds
              </span>
              <div className="font-['Space_Grotesk'] text-[18px] font-bold text-[#536251] dark:text-[#A7C1A2] tabular-nums">
                {stats.currentSeeds}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Temporary Toast Alert */}
      {purchaseNotification && (
        <div className="w-full p-2.5 rounded-2xl bg-[#536251] text-white text-center text-[12px] font-bold shadow-md animate-in fade-in duration-200">
          {purchaseNotification}
        </div>
      )}

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#FAECE1]/70 dark:bg-[#1E1A17]/80 rounded-2xl border border-[#EFE9E0] dark:border-[#38312B] overflow-x-auto no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              Haptics.selectionAsync();
              setSelectedCategory(cat.id as 'all' | 'desk' | 'room' | 'companion');
            }}
            className={`px-3 py-1.5 rounded-xl text-[11px] font-medium shrink-0 transition-all ${
              selectedCategory === cat.id
                ? 'bg-white dark:bg-[#2E2824] text-[#536251] dark:text-[#A7C1A2] font-bold shadow-xs'
                : 'text-[#747871] dark:text-[#9A938C] hover:text-[#211A15]'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Upgrades Store Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className={`p-3.5 rounded-3xl border transition-all flex flex-col justify-between gap-3 ${
              item.equipped
                ? 'bg-white/90 dark:bg-[#2A2420] border-[#8A9A86] shadow-sm'
                : item.unlocked
                ? 'bg-white/70 dark:bg-[#25211E]/70 border-[#EFE9E0] dark:border-[#38312B]'
                : 'bg-[#FAECE1]/40 dark:bg-[#1E1A17]/40 border-[#EFE9E0] dark:border-[#322923] opacity-90'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FAECE1] dark:bg-[#322923] border border-[#C4C8BF]/30 flex items-center justify-center text-2xl shrink-0">
                {item.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-['Space_Grotesk'] text-[13px] font-bold text-[#211A15] dark:text-[#FDEEE4] leading-snug">
                    {item.name}
                  </h3>
                  {item.equipped && (
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#D7E7D1] text-[#111F11]">
                      Equipped
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-[#747871] dark:text-[#A7A9A4] mt-0.5 line-clamp-2 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-[#EFE9E0]/60 dark:border-[#38312B]">
              <span className="font-['Space_Grotesk'] text-[12px] font-bold text-[#805613] dark:text-[#F5BC71] flex items-center gap-1">
                {item.unlocked ? (
                  <span className="text-[#536251] dark:text-[#A7C1A2]">Owned ✓</span>
                ) : (
                  <>
                    <span>{item.costKibbles}</span>
                    <span className="text-xs">🦴</span>
                  </>
                )}
              </span>

              {item.unlocked ? (
                <button
                  onClick={() => handleEquip(item)}
                  className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all active:scale-95 ${
                    item.equipped
                      ? 'bg-[#FAECE1] dark:bg-[#322923] text-[#747871]'
                      : 'bg-[#536251] text-white shadow-xs'
                  }`}
                >
                  {item.equipped ? 'Unequip' : 'Equip to Loft'}
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(item)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#D4836A] hover:bg-[#B96A53] text-white text-[11px] font-bold active:scale-95 transition-all shadow-xs"
                >
                  Unlock
                </button>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* Settings & Appearance Panel */}
      <section className="p-4 rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] shadow-xs flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">🎨</span>
          <h2 className="font-['Space_Grotesk'] text-[15px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
            App Theme & Glassmorphism
          </h2>
        </div>

        <p className="text-[12px] text-[#747871] dark:text-[#A7A9A4]">
          Warm Linen by day, rich Mocha Roast by night. Matches your system or choice.
        </p>

        <div className="grid grid-cols-3 gap-2 mt-1">
          <button
            onClick={() => {
              Haptics.selectionAsync();
              onThemeModeChange('system');
            }}
            className={`py-2 px-2 rounded-2xl text-[11px] font-bold transition-all ${
              themeMode === 'system'
                ? 'bg-[#536251] text-white shadow-xs'
                : 'bg-[#FAECE1] dark:bg-[#322923] text-[#747871] dark:text-[#C4C8BF]'
            }`}
          >
            Auto System
          </button>
          <button
            onClick={() => {
              Haptics.selectionAsync();
              onThemeModeChange('light');
            }}
            className={`py-2 px-2 rounded-2xl text-[11px] font-bold transition-all ${
              themeMode === 'light'
                ? 'bg-[#536251] text-white shadow-xs'
                : 'bg-[#FAECE1] dark:bg-[#322923] text-[#747871] dark:text-[#C4C8BF]'
            }`}
          >
            ☀️ Warm Linen
          </button>
          <button
            onClick={() => {
              Haptics.selectionAsync();
              onThemeModeChange('dark');
            }}
            className={`py-2 px-2 rounded-2xl text-[11px] font-bold transition-all ${
              themeMode === 'dark'
                ? 'bg-[#536251] text-white shadow-xs'
                : 'bg-[#FAECE1] dark:bg-[#322923] text-[#747871] dark:text-[#C4C8BF]'
            }`}
          >
            🌙 Mocha Dark
          </button>
        </div>
      </section>
    </div>
  );
};
