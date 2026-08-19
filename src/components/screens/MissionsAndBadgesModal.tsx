import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Flame,
  Star,
  CheckCircle2,
  Trophy,
  Sparkles,
  Gift,
  Award
} from 'lucide-react';
import { DailyMission, AchievementBadge, StreakData } from '../../types';
import { sound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';

interface MissionsAndBadgesModalProps {
  isOpen: boolean;
  streakData: StreakData;
  missions: DailyMission[];
  achievements: AchievementBadge[];
  onClaimMission: (missionId: string) => void;
  onClose: () => void;
}

export const MissionsAndBadgesModal: React.FC<MissionsAndBadgesModalProps> = ({
  isOpen,
  streakData,
  missions,
  achievements,
  onClaimMission,
  onClose
}) => {
  const [tab, setTab] = useState<'missions' | 'badges'>('missions');

  if (!isOpen) return null;

  const handleClaim = (m: DailyMission) => {
    if (!m.completed || m.claimed) return;
    sound.playFanfare();
    sound.speak(`Awesome! Claimed ${m.rewardStars} stars!`);
    try { confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } }); } catch {}
    onClaimMission(m.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3 select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-[32px] p-3.5 sm:p-4 w-full max-w-xl shadow-2xl border-4 border-purple-200 border-b-[8px] border-b-purple-500 relative flex flex-col justify-between max-h-[90vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-1 border-b border-purple-100 shrink-0">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 bg-amber-50 px-2.5 py-0.5 rounded-xl border border-amber-200 text-xs font-black text-amber-800">
              <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              {streakData.currentStreak} Day Streak 🔥
            </span>
            <div className="flex gap-1 bg-purple-50 p-1 rounded-xl">
              <button
                onClick={() => { sound.playPop(); setTab('missions'); }}
                className={`px-3 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  tab === 'missions' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Daily Missions 🎁
              </button>
              <button
                onClick={() => { sound.playPop(); setTab('badges'); }}
                className={`px-3 py-0.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  tab === 'badges' ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-600'
                }`}
              >
                Badges 🏆
              </button>
            </div>
          </div>

          <button
            onClick={() => { sound.playPop(); onClose(); }}
            className="p-1.5 rounded-full bg-purple-50 hover:bg-rose-50 text-slate-400 hover:text-rose-500 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 py-2 overflow-y-auto no-scrollbar">
          {tab === 'missions' ? (
            <div className="space-y-2">
              <div className="text-center mb-1">
                <span className="text-[10px] font-bold text-slate-500">
                  Complete today's 3 missions to unlock the Daily Super Chest!
                </span>
              </div>
              {missions.map(m => (
                <div
                  key={m.id}
                  className="bg-purple-50/70 p-2.5 rounded-2xl border border-purple-200 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{m.icon}</span>
                    <div>
                      <h4 className="text-xs font-black text-purple-950 font-['Fredoka']">{m.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-28 h-2 bg-purple-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-purple-600 rounded-full"
                            style={{ width: `${Math.min(100, (m.current / m.target) * 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-extrabold text-slate-500">
                          {m.current} / {m.target}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    {m.claimed ? (
                      <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                      </span>
                    ) : m.completed ? (
                      <button
                        onClick={() => handleClaim(m)}
                        className="px-3 py-1 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-900 font-black text-xs shadow cursor-pointer active:scale-95 animate-bounce-gentle border border-white"
                      >
                        Claim +{m.rewardStars} ⭐
                      </button>
                    ) : (
                      <span className="text-[10px] font-black text-purple-900 bg-white px-2.5 py-1 rounded-xl border border-purple-100">
                        +{m.rewardStars} ⭐
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {achievements.map(ach => (
                <div
                  key={ach.id}
                  className={`p-2 rounded-2xl border-2 flex flex-col justify-between text-center ${
                    ach.unlocked
                      ? 'bg-amber-50/80 border-amber-300 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div className="flex justify-center my-1">
                    <span className="text-3xl drop-shadow">{ach.iconEmoji}</span>
                  </div>
                  <div>
                    <h5 className="text-[11px] font-black text-purple-950 font-['Fredoka'] leading-tight">
                      {ach.title}
                    </h5>
                    <p className="text-[8px] font-medium text-slate-500 mt-0.5 line-clamp-1">
                      {ach.description}
                    </p>
                  </div>
                  <span className="text-[9px] font-black text-purple-600 mt-1">
                    {ach.unlocked ? '✓ Unlocked' : `${ach.current}/${ach.target}`}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center pt-1 border-t border-purple-100 shrink-0">
          <span className="text-[9px] font-bold text-slate-400">
            Streak and missions refresh every calendar day at midnight!
          </span>
        </div>
      </motion.div>
    </div>
  );
};
