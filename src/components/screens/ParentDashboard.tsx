import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  ChevronLeft, 
  Clock, 
  BarChart2, 
  User, 
  Volume2, 
  Printer, 
  Sparkles, 
  Settings, 
  Check, 
  Lock
} from 'lucide-react';
import { ChildProfile, ParentSettings, SavedArtwork } from '../../types';
import { COLORING_PAGES } from '../../data/coloringPages';
import { sound } from '../../services/soundEffects';

interface ParentDashboardProps {
  profile: ChildProfile;
  settings: ParentSettings;
  savedArtworks: SavedArtwork[];
  onUpdateSettings: (newSettings: ParentSettings) => void;
  onUpdateProfile: (newProfile: ChildProfile) => void;
  onBack: () => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  profile,
  settings,
  savedArtworks,
  onUpdateSettings,
  onUpdateProfile,
  onBack
}) => {
  const [activeTab, setActiveTab] = useState<'analytics' | 'limits' | 'profiles' | 'print'>('analytics');
  const [currentSettings, setCurrentSettings] = useState<ParentSettings>(settings);
  const [currentProfile, setCurrentProfile] = useState<ChildProfile>(profile);
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSaveSettings = () => {
    sound.playCorrect();
    onUpdateSettings(currentSettings);
    onUpdateProfile(currentProfile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  const handlePrintSheet = (pageTitle: string) => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="flex-1 h-full flex flex-col justify-between p-3 sm:p-5 select-none overflow-hidden text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-2 shrink-0">
        <div className="flex items-center gap-2">
          <button
            id="parent-back-btn"
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 cursor-pointer flex items-center gap-1 border-2 border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-5 h-5 text-purple-700" />
            <span className="text-xs font-bold hidden sm:inline text-purple-900">Back to Kids App</span>
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-emerald-600" />
            <h1 className="text-lg sm:text-xl font-black text-purple-900 font-['Fredoka']">
              Parent Insights & Safety Zone
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 sm:gap-2 bg-white p-1.5 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'analytics', label: '📊 Insights', icon: BarChart2 },
            { id: 'limits', label: '⏰ Screen Time', icon: Clock },
            { id: 'profiles', label: '👶 Profiles & Age', icon: User },
            { id: 'print', label: '🖨️ Printable Sheets', icon: Printer }
          ].map(t => (
            <button
              key={t.id}
              id={`parent-tab-${t.id}`}
              onClick={() => {
                sound.playPop();
                setActiveTab(t.id as any);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-md scale-105 border border-white'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-white rounded-[32px] sm:rounded-[36px] p-4 sm:p-5 border-2 border-purple-100 border-b-[8px] border-b-purple-500 shadow-xl flex flex-col justify-between overflow-y-auto kids-scrollbar">
        {/* TAB 1: ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-4">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-purple-50 p-3 rounded-2xl border border-purple-200">
                <span className="text-[10px] uppercase font-black text-purple-800 block">
                  Today's Screen Time
                </span>
                <span className="text-2xl font-black text-purple-900 mt-1 block">
                  {profile.todayMinutes} mins
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  Safe within daily limit
                </span>
              </div>

              <div className="bg-rose-50 p-3 rounded-2xl border border-rose-200">
                <span className="text-[10px] uppercase font-black text-rose-800 block">
                  Artworks Created
                </span>
                <span className="text-2xl font-black text-rose-600 mt-1 block">
                  {profile.completedColorings + savedArtworks.length} Pieces
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Fine motor skills growth
                </span>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                <span className="text-[10px] uppercase font-black text-amber-800 block">
                  Total Stars Earned
                </span>
                <span className="text-2xl font-black text-amber-500 mt-1 block">
                  {profile.stars} ⭐
                </span>
                <span className="text-[10px] text-slate-500 font-medium">
                  Level {profile.level} Master
                </span>
              </div>

              <div className="bg-cyan-50 p-3 rounded-2xl border border-cyan-200">
                <span className="text-[10px] uppercase font-black text-cyan-800 block">
                  Learning Accuracy
                </span>
                <span className="text-2xl font-black text-cyan-700 mt-1 block">
                  94%
                </span>
                <span className="text-[10px] text-emerald-600 font-bold">
                  High engagement
                </span>
              </div>
            </div>

            {/* Learning Skill Breakdown Progress Bars */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider mb-3">
                Developmental Skills Breakdown
              </h3>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Fine Motor & Stroke Precision</span>
                    <span className="text-rose-500 font-black">88% Mastery</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-400 rounded-full w-[88%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Color Recognition & Aesthetics</span>
                    <span className="text-purple-600 font-black">95% Mastery</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full w-[95%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Phonics & Letter Association</span>
                    <span className="text-cyan-600 font-black">78% Mastery</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 rounded-full w-[78%]" />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Number Counting & Shapes</span>
                    <span className="text-amber-500 font-black">92% Mastery</span>
                  </div>
                  <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-400 rounded-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCREEN TIME LIMITS */}
        {activeTab === 'limits' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider mb-2">
                Daily Screen Time Limit
              </h3>
              <p className="text-xs text-slate-500 mb-4">
                When the timer expires, Coloroo gently shows bedtime stars and locks the screen.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[15, 30, 45, 60].map(mins => (
                  <button
                    key={mins}
                    id={`limit-min-${mins}`}
                    onClick={() => {
                      sound.playPop();
                      setCurrentSettings({ ...currentSettings, dailyLimitMinutes: mins });
                    }}
                    className={`py-3 px-4 rounded-2xl border-2 font-black text-sm transition-all cursor-pointer ${
                      currentSettings.dailyLimitMinutes === mins
                        ? 'bg-purple-600 border-white text-white shadow-md scale-105'
                        : 'bg-white border-purple-100 text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    {mins} Minutes / Day
                  </button>
                ))}
              </div>
            </div>

            {/* Audio / Narrator Voice Toggles */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider">
                Sound & Voice Preferences
              </h3>

              <div className="flex items-center justify-between py-2 border-b border-slate-200">
                <div>
                  <span className="text-xs font-bold block text-slate-800">Voice Speech Narrator</span>
                  <span className="text-[10px] text-slate-500">Reads letter sounds and positive encouragement</span>
                </div>
                <input
                  type="checkbox"
                  checked={currentSettings.speechNarratorEnabled}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, speechNarratorEnabled: e.target.checked })}
                  className="w-5 h-5 accent-purple-600 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between py-2">
                <div>
                  <span className="text-xs font-bold block text-slate-800">Master Volume</span>
                  <span className="text-[10px] text-slate-500">Adjust overall game sound effects</span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={currentSettings.soundVolume}
                  onChange={(e) => setCurrentSettings({ ...currentSettings, soundVolume: parseFloat(e.target.value) })}
                  className="w-32 accent-purple-600 cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILES & AGE */}
        {activeTab === 'profiles' && (
          <div className="space-y-4">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h3 className="text-sm font-black text-purple-950 uppercase tracking-wider mb-3">
                Child Profile Details
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Child's Name</label>
                  <input
                    type="text"
                    value={currentProfile.name}
                    onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:border-purple-600"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Age</label>
                  <select
                    value={currentProfile.age}
                    onChange={(e) => setCurrentProfile({ ...currentProfile, age: parseInt(e.target.value, 10) })}
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-2 text-slate-900 font-bold text-sm focus:outline-none focus:border-purple-600"
                  >
                    <option value={2}>2 Years Old (Toddler Mode)</option>
                    <option value={3}>3 Years Old (Early Preschool)</option>
                    <option value={4}>4 Years Old (Preschool Star)</option>
                    <option value={5}>5 Years Old (Kindergarten)</option>
                    <option value={6}>6+ Years Old (Primary Artist)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Sibling Quick Switcher */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <span className="text-xs font-black text-purple-950 uppercase tracking-wider block mb-2">
                Profiles in this household
              </span>
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentProfile({ ...currentProfile, name: 'Leo', age: 4, avatar: '🎨' })}
                  className="px-4 py-2 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="text-xl">🎨</span>
                  <span className="text-xs font-bold text-slate-800">Leo (Age 4)</span>
                </button>
                <button
                  onClick={() => setCurrentProfile({ ...currentProfile, name: 'Maya', age: 3, avatar: '🦄' })}
                  className="px-4 py-2 rounded-xl bg-white border border-purple-200 hover:bg-purple-50 flex items-center gap-2 cursor-pointer shadow-sm"
                >
                  <span className="text-xl">🦄</span>
                  <span className="text-xs font-bold text-slate-800">Maya (Age 3)</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRINTABLE COLORING SHEETS */}
        {activeTab === 'print' && (
          <div className="space-y-3">
            <span className="text-xs font-black text-purple-950 uppercase tracking-wider block">
              🖨️ Offline Coloring Sheets for Crayons & Markers
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {COLORING_PAGES.map(p => (
                <div
                  key={p.id}
                  className="bg-purple-50 p-3 rounded-2xl border border-purple-200 flex flex-col justify-between"
                >
                  <div>
                    <h4 className="text-xs font-black text-purple-900 font-['Fredoka']">
                      {p.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-medium">
                      Category: {p.category}
                    </span>
                  </div>

                  <button
                    onClick={() => handlePrintSheet(p.title)}
                    className="mt-3 py-1.5 px-3 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Sheet</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Settings Footer Bar */}
        <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between">
          <span className="text-xs text-emerald-600 font-black">
            {savedNotice ? '✓ Settings Saved Successfully!' : 'Kid-safe sandbox active'}
          </span>

          <button
            id="save-parent-settings-btn"
            onClick={handleSaveSettings}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow-lg active:scale-95 border-2 border-white"
          >
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};
