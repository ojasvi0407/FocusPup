import React, { useState } from 'react';
import { Subject, UserStats } from '../types';
import { Haptics } from '../services/hapticsService';

interface HourVaultScreenProps {
  subjects: Subject[];
  stats: UserStats;
  onNavigateToShop: () => void;
}

export const HourVaultScreen: React.FC<HourVaultScreenProps> = ({
  subjects,
  stats,
  onNavigateToShop
}) => {
  const [selectedCellInfo, setSelectedCellInfo] = useState<string | null>(null);

  // Generate 7 rows x 12 columns heatmap matrix
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const weeksCount = 12;

  // Preset intensity pattern matching the visual spec in Stitch UI
  const getIntensityColor = (row: number, col: number) => {
    // Semi-deterministic realistic study pattern
    const val = (row * 3 + col * 7) % 5;
    if (val === 0) return 'bg-[#FAECE1] dark:bg-[#322923]'; // 0h
    if (val === 1) return 'bg-[#E2EBDC] dark:bg-[#3C4B3A]/40'; // <1h
    if (val === 2) return 'bg-[#A7C1A2] dark:bg-[#4F634B]/70'; // 1-2h
    if (val === 3) return 'bg-[#8A9A86] dark:bg-[#8A9A86]'; // 2-4h
    return 'bg-[#4F634B] dark:bg-[#A7C1A2]'; // 4h+
  };

  const getCellHours = (row: number, col: number) => {
    const hours = [0, 0.75, 1.5, 3.2, 5.0];
    const val = (row * 3 + col * 7) % 5;
    return hours[val];
  };

  return (
    <div className="w-full flex flex-col gap-4 pb-28">
      {/* Title & Season Pill */}
      <section className="flex flex-col gap-2 pt-1">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="font-['Space_Grotesk'] text-[24px] font-bold text-[#211A15] dark:text-[#FDEEE4] tracking-tight">
              Subject Vault
            </h1>
            <p className="text-[12px] text-[#747871] dark:text-[#A7A9A4]">
              Track mastery, study hours & growth
            </p>
          </div>
          <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-white dark:bg-[#25211E] border border-[#EFE9E0] dark:border-[#38312B] text-[#536251] dark:text-[#A7C1A2] shadow-xs">
            Season 4
          </span>
        </div>

        {/* Master Focus Metric Banner */}
        <div className="mt-1 p-3.5 rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#FFDDB5] dark:bg-[#805613]/50 flex items-center justify-center text-lg shadow-xs">
            🎓
          </div>
          <div className="flex-1">
            <span className="font-['Space_Grotesk'] text-[15px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              {stats.totalFocusHours} Total Hours
            </span>
            <p className="text-[11px] text-[#805613] dark:text-[#F5BC71] font-bold tracking-tight">
              Rank: {stats.rankTitle}
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#747871] dark:text-[#A7A9A4] block">
              {stats.percentile}
            </span>
            <span className="text-[11px] font-bold text-[#536251] dark:text-[#A7C1A2]">
              +12h this wk
            </span>
          </div>
        </div>
      </section>

      {/* Visual Study Heatmap Card */}
      <section className="p-4 rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] shadow-xs flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#536251] dark:text-[#A7C1A2] text-sm">▦</span>
            <h2 className="font-['Space_Grotesk'] text-[15px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
              Study Activity Heatmap
            </h2>
          </div>
          <span className="text-[10px] font-bold text-[#747871] dark:text-[#A7A9A4] bg-[#FAECE1] dark:bg-[#322923] px-2 py-0.5 rounded-full">
            12 Weeks
          </span>
        </div>

        {/* Heatmap Grid */}
        <div className="overflow-x-auto no-scrollbar py-1">
          <div className="inline-flex flex-col gap-1 min-w-[280px]">
            {days.map((dayName, rIdx) => (
              <div key={rIdx} className="flex items-center gap-1.5">
                <span className="text-[10px] font-['Space_Grotesk'] text-[#747871] w-4 text-center">
                  {rIdx % 2 === 0 ? dayName : ''}
                </span>
                <div className="flex items-center gap-1">
                  {Array.from({ length: weeksCount }).map((_, cIdx) => (
                    <button
                      key={cIdx}
                      onClick={() => {
                        Haptics.selectionAsync();
                        const h = getCellHours(rIdx, cIdx);
                        setSelectedCellInfo(`Week ${cIdx + 1}, ${dayName}: ${h}h logged`);
                      }}
                      className={`w-3.5 h-3.5 rounded-[4px] transition-transform active:scale-125 hover:ring-1 hover:ring-[#536251] ${getIntensityColor(
                        rIdx,
                        cIdx
                      )}`}
                      title={`Week ${cIdx + 1}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Selected cell tooltip or summary */}
        <div className="pt-2 border-t border-[#EFE9E0] dark:border-[#38312B] flex items-center justify-between text-[11px]">
          <span className="text-[#444842] dark:text-[#A7A9A4] font-medium">
            {selectedCellInfo || 'Best Day: 6.2 hrs • 82% Daily Consistency'}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-[9px] text-[#747871]">Less</span>
            <span className="w-2.5 h-2.5 rounded-xs bg-[#E2EBDC]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#A7C1A2]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#8A9A86]" />
            <span className="w-2.5 h-2.5 rounded-xs bg-[#4F634B]" />
            <span className="text-[9px] text-[#747871]">More</span>
          </div>
        </div>
      </section>

      {/* Gamified Focus Seeds Bank Widget */}
      <section className="p-4 rounded-3xl bg-gradient-to-br from-[#FAECE1] to-[#F5E5DC] dark:from-[#2A2420] dark:to-[#211A15] border border-[#EFE9E0] dark:border-[#3E3630] shadow-xs relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[#536251] dark:text-[#A7C1A2] text-sm">🌱</span>
              <span className="font-['Space_Grotesk'] text-[14px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
                Focus Seeds Bank
              </span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-['Space_Grotesk'] text-[32px] font-bold text-[#211A15] dark:text-[#FDEEE4] tracking-tight tabular-nums">
                {stats.currentSeeds.toLocaleString()}
              </span>
              <span className="text-[12px] font-bold text-[#536251] dark:text-[#A7C1A2]">
                🌱 Seeds Earned
              </span>
            </div>
            <p className="text-[11px] text-[#747871] dark:text-[#A7A9A4]">
              Gained from uninterrupted Pomodoro study blocks
            </p>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-white/80 dark:bg-[#1E1A17]/80 border border-[#EFE9E0] dark:border-[#38312B] p-1 shadow-inner flex items-center justify-center">
            <img
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGI-FoeOr-fsXY-yscYpfVQ4jGmzMeLGdEUJ9W5xT9imexUT7gIbpBCZtWNoxrsdI1mfv8zM8gEZ0RRwOXzgiSmG1_hAXh2Rv-0Y2OCzd5wp5fyXC7YdOpm0VaLEt6XT7vfqKfQCsyrtpq4TtzZC41JxwlbUqzhsUFi_pZjK6_QRZsArPAdjbbgorUJwMkKtBcoQeC5UtpNuDS2IHB99gRK4lx6nbiJjvQN_Zmij7oQNQueVspynv-"
              alt="Sleeping pup on rug"
              className="w-full h-full object-cover rounded-xl"
              style={{ imageRendering: 'pixelated' }}
            />
          </div>
        </div>

        {/* Action Buttons to Shop */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2">
          <button
            onClick={() => {
              Haptics.impactAsync('light');
              onNavigateToShop();
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/90 dark:bg-[#25211E]/90 border border-[#EFE9E0] dark:border-[#38312B] text-[12px] font-bold text-[#211A15] dark:text-[#FDEEE4] active:scale-95 transition-transform"
          >
            <span>🏪</span>
            <span>Unlock Desk Items</span>
          </button>
          <button
            onClick={() => {
              Haptics.impactAsync('light');
              onNavigateToShop();
            }}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#8A9A86] text-white text-[12px] font-bold shadow-xs active:scale-95 transition-transform"
          >
            <span>🐾</span>
            <span>Pupgrades Store</span>
          </button>
        </div>
      </section>

      {/* Subject Hour Ledger Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h2 className="font-['Space_Grotesk'] text-[16px] font-bold text-[#211A15] dark:text-[#FDEEE4]">
            Subject Hour Ledger
          </h2>
          <span className="text-[11px] text-[#536251] dark:text-[#A7C1A2] font-semibold">
            {subjects.length} Courses
          </span>
        </div>

        <div className="flex flex-col gap-2.5">
          {subjects.map((sub) => {
            const percent = Math.min(100, Math.round((sub.weeklyCompletedHours / sub.weeklyTargetHours) * 100));
            const isCompleted = percent >= 100;

            return (
              <article
                key={sub.id}
                className="p-3.5 rounded-3xl bg-white/75 dark:bg-[#25211E]/80 backdrop-blur-xl border border-[#EFE9E0] dark:border-[#38312B] shadow-xs flex flex-col gap-2.5"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAECE1] dark:bg-[#322923] text-[#747871] dark:text-[#C4C8BF]">
                        {sub.category}
                      </span>
                      <span className="text-[10px] text-[#747871] dark:text-[#9A938C]">
                        {sub.priority}
                      </span>
                    </div>
                    <h3 className="font-['Space_Grotesk'] text-[15px] font-bold text-[#211A15] dark:text-[#FDEEE4] mt-0.5">
                      {sub.name}
                    </h3>
                  </div>

                  {/* Micro Trophy Badge */}
                  <div className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-[#FAECE1]/70 dark:bg-[#322923]/70 border border-[#EFE9E0] dark:border-[#4B4036]">
                    <span className="text-xs">🏆</span>
                    <span className="text-[10px] font-bold text-[#805613] dark:text-[#F5BC71]">
                      {sub.tierName}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex justify-between items-baseline text-[11px]">
                    <span className="text-[#747871] dark:text-[#9A938C]">
                      Weekly Goal: <strong className="text-[#211A15] dark:text-white">{sub.weeklyCompletedHours} / {sub.weeklyTargetHours} hrs</strong>
                    </span>
                    <span className={`font-bold font-['Space_Grotesk'] ${isCompleted ? 'text-[#D4836A]' : 'text-[#536251] dark:text-[#A7C1A2]'}`}>
                      {percent}% {isCompleted ? '🔥' : ''}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[#FAECE1] dark:bg-[#322923] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${percent}%`,
                        backgroundColor: sub.color
                      }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-[#EFE9E0]/50 dark:border-[#38312B] text-[11px]">
                  <span className="text-[#747871] dark:text-[#9A938C]">
                    All-time: <strong className="text-[#211A15] dark:text-white">{sub.allTimeHours} hrs</strong>
                  </span>
                  <span className="text-[#536251] dark:text-[#A7C1A2] font-semibold">
                    {isCompleted ? 'Target completed' : `+${(sub.weeklyTargetHours - sub.weeklyCompletedHours).toFixed(1)}h to weekly goal`}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Companion Study Quote */}
      <div className="p-3.5 rounded-3xl bg-white/50 dark:bg-[#25211E]/50 border border-[#EFE9E0] dark:border-[#38312B] flex items-center gap-3">
        <span className="text-xl">☕</span>
        <p className="text-[12px] text-[#747871] dark:text-[#A7A9A4] italic">
          "Small daily habits compound into grand horizons. Pup is snoozing peacefully next to your notes."
        </p>
      </div>
    </div>
  );
};
