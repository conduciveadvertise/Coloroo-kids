import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  ChevronLeft,
  BookOpen,
  Gamepad2,
  Clock,
  Trophy,
  Settings,
  Star,
  Flame,
  CheckCircle2,
  AlertCircle,
  Volume2,
  RotateCcw,
  Sparkles,
  Lock,
  Heart,
  Calendar,
  Layers,
  Save,
  Check
} from 'lucide-react';
import {
  ChildProfile,
  ParentSettings,
  SavedArtwork,
  BuddyState,
  StreakData,
  AchievementBadge,
  ParentActivityLog,
  ActivityCategory
} from '../../types';
import { BUDDY_LIST } from '../../data/buddyAndMissionsData';
import {
  getStoredActivityLogs,
  getScreenTimeSummary,
  resetAllChildProgress
} from '../../services/storage';
import { sound } from '../../services/soundEffects';

interface ParentDashboardProps {
  profile: ChildProfile;
  settings: ParentSettings;
  buddy: BuddyState;
  streakData: StreakData;
  achievements: AchievementBadge[];
  savedArtworks: SavedArtwork[];
  onUpdateSettings: (newSettings: ParentSettings) => void;
  onUpdateProfile: (newProfile: ChildProfile) => void;
  onBack: () => void;
  onTriggerFullReset: () => void;
}

type TabType = 'progress' | 'activities' | 'screen-time' | 'rewards' | 'settings';

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  settings,
  buddy,
  streakData,
  achievements,
  savedArtworks,
  onUpdateSettings,
  onUpdateProfile,
  onBack,
  onTriggerFullReset
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('progress');
  const [currentSettings, setCurrentSettings] = useState<ParentSettings>(settings);
  const [currentProfile, setCurrentProfile] = useState<ChildProfile>(profile);
  const [newPin, setNewPin] = useState(settings.pinCode || '1234');
  const [saveToast, setSaveToast] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const buddyDef = BUDDY_LIST.find(b => b.type === buddy.type) || BUDDY_LIST[0];
  const logs = useMemo(() => getStoredActivityLogs(), []);
  const screenTime = useMemo(() => getScreenTimeSummary(), []);

  // Calculate real progress percentages across 6 core categories
  const categoryStats = useMemo(() => {
    const counts: Record<ActivityCategory, number> = {
      abc: 0,
      math: 0,
      colors: 0,
      shapes: 0,
      memory: 0,
      vocab: 0,
      adventure: 0,
      art: savedArtworks.length
    };

    logs.forEach(l => {
      if (counts[l.category] !== undefined) {
        counts[l.category] += 1;
      }
    });

    const calcPercent = (count: number, baseline = 6) => {
      if (count === 0) return null;
      return Math.min(100, Math.round((count / baseline) * 100));
    };

    return [
      { key: 'abc', name: '🔤 ABC & Phonics', percent: calcPercent(counts.abc, 5), count: counts.abc },
      { key: 'math', name: '🔢 Mathematics & Counting', percent: calcPercent(counts.math, 5), count: counts.math },
      { key: 'colors', name: '🌈 Color Recognition', percent: calcPercent(counts.colors, 6), count: counts.colors },
      { key: 'shapes', name: '🔷 Shapes & Visual Logic', percent: calcPercent(counts.shapes, 4), count: counts.shapes },
      { key: 'memory', name: '🧠 Memory & Association', percent: calcPercent(counts.memory, 4), count: counts.memory },
      { key: 'vocab', name: '📚 Vocabulary & Words', percent: calcPercent(counts.vocab, 5), count: counts.vocab }
    ];
  }, [logs, savedArtworks]);

  // Derive Insights: Strong vs More Practice Areas
  const insights = useMemo(() => {
    const strong: string[] = [];
    const practice: string[] = [];

    categoryStats.forEach(cat => {
      if (cat.percent !== null) {
        if (cat.percent >= 75) strong.push(cat.name);
        else if (cat.percent < 60) practice.push(cat.name);
      }
    });

    if (strong.length === 0) strong.push('🌈 Color Recognition', '🔤 ABC & Phonics');
    if (practice.length === 0) practice.push('🔢 Mathematics & Counting', '🔷 Shapes & Visual Logic');

    return { strong, practice };
  }, [categoryStats]);

  const handleSaveAllSettings = () => {
    const updated: ParentSettings = {
      ...currentSettings,
      pinCode: newPin.length === 4 ? newPin : currentSettings.pinCode
    };
    onUpdateSettings(updated);
    onUpdateProfile(currentProfile);
    sound.playCorrect();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2000);
  };

  const handleExecuteReset = () => {
    sound.playPop();
    resetAllChildProgress();
    setShowResetConfirm(false);
    onTriggerFullReset();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF] text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 shrink-0 mb-1">
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playPop(); onBack(); }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 cursor-pointer flex items-center gap-1 border-2 border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-black text-purple-900">Back to App</span>
          </button>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-sm sm:text-base font-black text-purple-950 font-['Fredoka']">
              👨‍👩‍👧 Parent Dashboard & Insights
            </h1>
          </div>
        </div>

        {/* Child Summary Badges */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-2xl border border-purple-100 shadow-sm text-xs font-bold text-purple-900">
            <span>{buddyDef.emoji}</span>
            <span className="font-black">Lv.{buddy.level} {buddy.name.split(' ')[0]}</span>
          </div>
          <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-2xl border border-amber-200 text-xs font-black text-amber-800">
            <Flame className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
            <span>{streakData.currentStreak}d Streak</span>
          </div>
          <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-2xl border border-purple-100 shadow-sm text-xs font-black text-purple-950">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{profile.stars} ⭐</span>
          </div>
        </div>
      </div>

      {/* Main Dashboard Landscape Body */}
      <div className="flex-1 min-h-0 bg-white rounded-[26px] p-3 border-2 border-purple-100 shadow-xl flex flex-row gap-3 relative overflow-hidden">
        
        {/* Left Vertical Navigation Menu */}
        <div className="w-48 sm:w-52 flex flex-col justify-between border-r border-purple-100 pr-2 shrink-0">
          <div className="space-y-1">
            {[
              { id: 'progress' as TabType, label: '📚 Learning & Skills', icon: BookOpen },
              { id: 'activities' as TabType, label: '🎮 Activity Log', icon: Layers },
              { id: 'screen-time' as TabType, label: '⏱️ Time & Limits', icon: Clock },
              { id: 'rewards' as TabType, label: '🏆 Rewards & Buddy', icon: Trophy },
              { id: 'settings' as TabType, label: '⚙️ Settings & Safety', icon: Settings }
            ].map(t => {
              const Icon = t.icon;
              const isSelected = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => { sound.playPop(); setActiveTab(t.id); }}
                  className={`w-full py-2 px-3 rounded-2xl font-black text-xs flex items-center gap-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'text-slate-600 hover:bg-purple-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="truncate">{t.label}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-purple-50/70 p-2.5 rounded-2xl border border-purple-100 text-center">
            <span className="text-[9px] font-black text-purple-950 block">Child Profile</span>
            <span className="text-xs font-black text-purple-700 mt-0.5 block">{profile.name} ({profile.age} yrs)</span>
            <span className="text-[8px] text-slate-400 font-bold block mt-0.5">100% Local & Kid-Safe</span>
          </div>
        </div>

        {/* Right Tab Content Viewport */}
        <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar pl-1">
          
          {/* ================= TAB 1: LEARNING & SKILLS PROGRESS ================= */}
          {activeTab === 'progress' && (
            <div className="space-y-3">
              <div>
                <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-2">
                  Category Learning Progress
                </h3>
                <div className="grid grid-cols-2 gap-2.5">
                  {categoryStats.map(cat => (
                    <div key={cat.key} className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200">
                      <div className="flex justify-between items-center text-xs font-black mb-1">
                        <span>{cat.name}</span>
                        <span className={cat.percent ? 'text-purple-600' : 'text-slate-400 text-[10px]'}>
                          {cat.percent ? `${cat.percent}%` : 'Not started'}
                        </span>
                      </div>
                      <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${cat.percent || 0}%` }}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-slate-400 mt-1 block">
                        {cat.count} activities completed
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths & Practice Areas Insights */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <div className="bg-emerald-50/80 p-3 rounded-2xl border border-emerald-200">
                  <div className="flex items-center gap-1.5 text-emerald-800 font-black text-xs mb-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>🌟 Doing Great (Strong Areas)</span>
                  </div>
                  <ul className="space-y-1">
                    {insights.strong.map((s, idx) => (
                      <li key={idx} className="text-[10px] font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-amber-50/80 p-3 rounded-2xl border border-amber-200">
                  <div className="flex items-center gap-1.5 text-amber-900 font-black text-xs mb-1.5">
                    <AlertCircle className="w-4 h-4 text-amber-600" />
                    <span>💡 Recommended Practice</span>
                  </div>
                  <ul className="space-y-1">
                    {insights.practice.map((p, idx) => (
                      <li key={idx} className="text-[10px] font-bold text-amber-900 flex items-center gap-1.5">
                        <span className="text-amber-500">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                  <span className="text-[8px] font-medium text-slate-400 block mt-1">
                    More practice may help in these domains.
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 2: ACTIVITY LOG ================= */}
          {activeTab === 'activities' && (
            <div className="space-y-2">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider">
                  Recent Educational Activity
                </h3>
                <span className="text-[9px] font-bold text-slate-400">Total Logged: {logs.length}</span>
              </div>

              {logs.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <BookOpen className="w-8 h-8 mx-auto mb-1 opacity-50" />
                  <p className="text-xs font-bold">No activity logged yet today.</p>
                  <p className="text-[9px]">Activity will automatically appear as your child learns!</p>
                </div>
              ) : (
                <div className="space-y-1.5 max-h-[220px] overflow-y-auto no-scrollbar pr-1">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="bg-slate-50 p-2 rounded-2xl border border-slate-200 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{log.iconEmoji || '🎯'}</span>
                        <div>
                          <h4 className="text-xs font-black text-purple-950 font-['Fredoka'] leading-tight">
                            {log.title}
                          </h4>
                          <span className="text-[9px] font-bold text-slate-500">
                            {log.categoryName} • {log.date} at {log.timestamp}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded-xl border border-amber-200">
                        +{log.starsEarned} ⭐
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ================= TAB 3: SCREEN TIME & LIMITS ================= */}
          {activeTab === 'screen-time' && (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 text-center">
                  <span className="text-[9px] uppercase font-black text-purple-800 block">Today's Screen Time</span>
                  <span className="text-xl font-black text-purple-950 mt-0.5 block">{screenTime.todayMinutes} mins</span>
                  <span className="text-[8px] font-bold text-emerald-600">Active app usage</span>
                </div>
                <div className="bg-cyan-50 p-2.5 rounded-2xl border border-cyan-200 text-center">
                  <span className="text-[9px] uppercase font-black text-cyan-800 block">This Week's Total</span>
                  <span className="text-xl font-black text-cyan-950 mt-0.5 block">{screenTime.weekMinutes} mins</span>
                  <span className="text-[8px] font-bold text-slate-500">Past 7 days active</span>
                </div>
                <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200 text-center">
                  <span className="text-[9px] uppercase font-black text-amber-800 block">Current Daily Limit</span>
                  <span className="text-xl font-black text-amber-900 mt-0.5 block">
                    {currentSettings.dailyLimitMinutes === 0 ? 'OFF' : `${currentSettings.dailyLimitMinutes} mins`}
                  </span>
                  <span className="text-[8px] font-bold text-slate-500">Friendly reminder mode</span>
                </div>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-1">
                  Adjust Daily Play Limit
                </h4>
                <p className="text-[9px] text-slate-500 mb-2">
                  When reached, Coloroo displays a gentle child-friendly break reminder.
                </p>
                <div className="grid grid-cols-6 gap-1.5">
                  {[0, 15, 30, 45, 60, 90].map(mins => (
                    <button
                      key={mins}
                      onClick={() => {
                        sound.playPop();
                        setCurrentSettings({ ...currentSettings, dailyLimitMinutes: mins });
                      }}
                      className={`py-2 rounded-xl text-xs font-black border transition-all cursor-pointer ${
                        currentSettings.dailyLimitMinutes === mins
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-white text-slate-700 border-purple-100 hover:bg-purple-50'
                      }`}
                    >
                      {mins === 0 ? 'OFF' : `${mins}m`}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: REWARDS & BUDDY ================= */}
          {activeTab === 'rewards' && (
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2.5">
                {/* Buddy Info */}
                <div className="bg-pink-50 p-3 rounded-2xl border border-pink-200 flex items-center gap-3">
                  <span className="text-4xl">{buddyDef.emoji}</span>
                  <div>
                    <h4 className="text-xs font-black text-purple-950 font-['Fredoka']">{buddy.name}</h4>
                    <span className="text-[10px] font-extrabold text-pink-700 block">Level {buddy.level} • {buddy.xp}/{buddy.xpToNextLevel} XP</span>
                    <span className="text-[8px] font-bold text-slate-500">Mood: {buddy.happiness} • Fed: {buddy.timesFed} times</span>
                  </div>
                </div>

                {/* Streak & Stars */}
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-around">
                  <div className="text-center">
                    <span className="text-[9px] font-black text-amber-800 uppercase block">Current Streak</span>
                    <span className="text-lg font-black text-amber-900">{streakData.currentStreak} Days 🔥</span>
                  </div>
                  <div className="text-center">
                    <span className="text-[9px] font-black text-amber-800 uppercase block">Total Stars</span>
                    <span className="text-lg font-black text-amber-900">{profile.stars} ⭐</span>
                  </div>
                </div>
              </div>

              {/* Achievement Badges Overview */}
              <div>
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-1.5">
                  Unlocked Badges & Milestones
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  {achievements.map(ach => (
                    <div
                      key={ach.id}
                      className={`p-2 rounded-2xl border flex items-center gap-2 ${
                        ach.unlocked ? 'bg-amber-50/70 border-amber-300' : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <span className="text-2xl">{ach.iconEmoji}</span>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-[10px] font-black text-purple-950 truncate">{ach.title}</h5>
                        <span className="text-[8px] font-bold text-slate-400 block">{ach.unlocked ? '✓ Unlocked' : `${ach.current}/${ach.target}`}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 5: SETTINGS & SAFETY ================= */}
          {activeTab === 'settings' && (
            <div className="space-y-2.5">
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 space-y-2">
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider">Audio & Narration</h4>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer">
                  <div>
                    <span className="block">Voice Speech Narrator</span>
                    <span className="text-[8px] text-slate-500 font-normal">Pronounces phonics, numbers and encouragement</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={currentSettings.speechNarratorEnabled}
                    onChange={(e) => setCurrentSettings({ ...currentSettings, speechNarratorEnabled: e.target.checked })}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer">
                  <div>
                    <span className="block">Master Volume</span>
                    <span className="text-[8px] text-slate-500 font-normal">Controls overall sound effects and music</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1.0"
                    step="0.1"
                    value={currentSettings.soundVolume}
                    onChange={(e) => setCurrentSettings({ ...currentSettings, soundVolume: parseFloat(e.target.value) })}
                    className="w-28 accent-purple-600 cursor-pointer"
                  />
                </label>
              </div>

              {/* Parent PIN */}
              <div className="bg-slate-50 p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-purple-950 uppercase">Parent 4-Digit PIN</h4>
                  <span className="text-[8px] text-slate-500">Used to secure the Parents Zone gate</span>
                </div>
                <input
                  type="password"
                  maxLength={4}
                  value={newPin}
                  onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                  className="w-20 bg-white border border-purple-200 rounded-xl px-2.5 py-1 text-center font-black tracking-widest text-xs"
                />
              </div>

              {/* Danger Zone: Reset Progress */}
              <div className="bg-rose-50/60 p-2.5 rounded-2xl border border-rose-200 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-rose-900 uppercase">Reset Child Progress</h4>
                  <span className="text-[8px] text-rose-700">Resets stars, levels, buddy and adventure progress</span>
                </div>
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-3 py-1 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-sm cursor-pointer active:scale-95"
                >
                  Reset...
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Save Settings Footer Bar */}
      <div className="mt-1 pt-1 border-t border-purple-100 flex items-center justify-between shrink-0">
        <span className="text-[10px] text-emerald-600 font-black">
          {saveToast ? '✓ Settings and profile saved successfully!' : 'Kid-Safe Local Sandbox Active'}
        </span>
        <button
          onClick={handleSaveAllSettings}
          className="px-5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow active:scale-95 border-2 border-white"
        >
          <Save className="w-3.5 h-3.5" /> Save Changes
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      <AnimatePresence>
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-3">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] p-5 max-w-sm w-full text-center shadow-2xl border-4 border-rose-200 border-b-[8px] border-b-rose-500"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-rose-600 mx-auto mb-2">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-black text-purple-950 font-['Fredoka']">Are you sure?</h3>
              <p className="text-xs font-bold text-slate-500 mt-1">
                This will permanently reset your child's local learning progress, stars, buddy level, streaks, and achievements.
              </p>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-100 text-slate-700 font-black text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExecuteReset}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md cursor-pointer"
                >
                  Reset Progress
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
