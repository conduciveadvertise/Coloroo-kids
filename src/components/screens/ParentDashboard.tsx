import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  ChevronLeft,
  Clock,
  BarChart2,
  User,
  Printer,
  Check
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

  useEffect(() => {
    setCurrentProfile(profile);
  }, [profile]);

  const handleSaveSettings = () => {
    sound.playCorrect();
    onUpdateSettings(currentSettings);
    onUpdateProfile(currentProfile);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 2500);
  };

  const handlePrintSheet = (pageTitle: string) => {
    sound.playPop();
    window.print();
  };

  return (
    <div className="w-full h-full flex flex-col justify-between p-2.5 sm:p-3.5 select-none overflow-hidden bg-gradient-to-br from-[#F5F0FF] via-[#F1E8FF] to-[#EBE0FF] text-slate-800">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 mb-1 shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playPop();
              onBack();
            }}
            className="p-1.5 sm:p-2 rounded-2xl bg-white hover:bg-purple-50 active:scale-95 text-slate-700 cursor-pointer flex items-center gap-1 border-2 border-purple-100 shadow-sm"
          >
            <ChevronLeft className="w-4 h-4 text-purple-700" />
            <span className="text-xs font-bold hidden sm:inline text-purple-900">Back to Kids App</span>
          </button>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h1 className="text-sm sm:text-base font-black text-purple-900 font-['Fredoka']">
              Parent Insights & Safety Zone
            </h1>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border-2 border-purple-100 shadow-sm">
          {[
            { id: 'analytics', label: '📊 Insights' },
            { id: 'limits', label: '⏰ Screen Time' },
            { id: 'profiles', label: '👶 Profiles & Age' },
            { id: 'print', label: '🖨️ Printable Sheets' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                sound.playPop();
                setActiveTab(t.id as any);
              }}
              className={`px-2.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all cursor-pointer whitespace-nowrap ${
                activeTab === t.id
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-600 hover:bg-purple-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 min-h-0 bg-white rounded-[28px] p-3 sm:p-4 border-2 border-purple-100 border-b-[6px] border-b-purple-500 shadow-xl flex flex-col justify-between overflow-y-auto no-scrollbar">
        {/* TAB 1: INSIGHTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200">
                <span className="text-[9px] uppercase font-black text-purple-800 block">TODAY'S SCREEN TIME</span>
                <span className="text-xl font-black text-purple-900 mt-0.5 block">{currentProfile.todayMinutes || 14} mins</span>
                <span className="text-[9px] text-emerald-600 font-bold">Safe within daily limit</span>
              </div>
              <div className="bg-rose-50 p-2.5 rounded-2xl border border-rose-200">
                <span className="text-[9px] uppercase font-black text-rose-800 block">ARTWORKS CREATED</span>
                <span className="text-xl font-black text-rose-600 mt-0.5 block">{savedArtworks.length || 5} Pieces</span>
                <span className="text-[9px] text-slate-500 font-medium">Fine motor skills growth</span>
              </div>
              <div className="bg-amber-50 p-2.5 rounded-2xl border border-amber-200">
                <span className="text-[9px] uppercase font-black text-amber-800 block">TOTAL STARS EARNED</span>
                <span className="text-xl font-black text-amber-500 mt-0.5 block">{currentProfile.stars || 21} ⭐</span>
                <span className="text-[9px] text-slate-500 font-medium">Level {currentProfile.level || 3} Master</span>
              </div>
              <div className="bg-cyan-50 p-2.5 rounded-2xl border border-cyan-200">
                <span className="text-[9px] uppercase font-black text-cyan-800 block">LEARNING ACCURACY</span>
                <span className="text-xl font-black text-cyan-700 mt-0.5 block">94%</span>
                <span className="text-[9px] text-emerald-600 font-bold">High engagement</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-2">DEVELOPMENTAL SKILLS BREAKDOWN</h3>
              <div className="space-y-2 text-xs">
                <div>
                  <div className="flex justify-between font-bold text-[10px] mb-0.5">
                    <span>Fine Motor & Stroke Precision</span>
                    <span className="text-rose-500 font-black">88% Mastery</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-rose-500 rounded-full w-[88%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[10px] mb-0.5">
                    <span>Color Recognition & Aesthetics</span>
                    <span className="text-purple-600 font-black">95% Mastery</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full w-[95%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[10px] mb-0.5">
                    <span>Phonics & Letter Association</span>
                    <span className="text-cyan-600 font-black">78% Mastery</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full w-[78%]" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-bold text-[10px] mb-0.5">
                    <span>Number Counting & Shapes</span>
                    <span className="text-amber-500 font-black">92% Mastery</span>
                  </div>
                  <div className="h-2.5 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full w-[92%]" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SCREEN TIME LIMITS */}
        {activeTab === 'limits' && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-1">DAILY SCREEN TIME LIMIT</h3>
              <p className="text-[10px] text-slate-500 mb-2">When the timer expires, Coloroo gently shows bedtime stars and locks the screen.</p>
              <div className="grid grid-cols-4 gap-2">
                {[15, 30, 45, 60].map(mins => (
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
                    {mins} Minutes / Day
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
              <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider">SOUND & VOICE PREFERENCES</h3>
              <label className="flex items-center justify-between text-xs font-bold text-slate-800 cursor-pointer">
                <div>
                  <span className="block">Voice Speech Narrator</span>
                  <span className="text-[9px] text-slate-500 font-normal">Reads letter sounds and positive encouragement</span>
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
                  <span className="text-[9px] text-slate-500 font-normal">Adjust overall game sound effects</span>
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
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: PROFILES & AGE */}
        {activeTab === 'profiles' && (
          <div className="space-y-3">
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <h3 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-2">CHILD PROFILE DETAILS</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Child's Name</label>
                  <input
                    type="text"
                    value={currentProfile.name}
                    onChange={(e) => setCurrentProfile({ ...currentProfile, name: e.target.value })}
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-slate-900 font-bold text-xs focus:outline-none focus:border-purple-600"
                    placeholder="Enter Child's Name"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-700 block mb-1">Age</label>
                  <select
                    value={currentProfile.age}
                    onChange={(e) => setCurrentProfile({ ...currentProfile, age: parseInt(e.target.value, 10) })}
                    className="w-full bg-white border border-purple-200 rounded-xl px-3 py-1.5 text-slate-900 font-bold text-xs"
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

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-black text-purple-950 uppercase tracking-wider block mb-2">QUICK PROFILE SWITCH</span>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    sound.playPop();
                    const p = { ...currentProfile, name: 'Leo', age: 4, avatar: '🎨' };
                    setCurrentProfile(p);
                    onUpdateProfile(p);
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer shadow-sm text-xs font-bold ${
                    currentProfile.name === 'Leo' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-800 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <span>🎨</span> Leo (Age 4)
                </button>
                <button
                  onClick={() => {
                    sound.playPop();
                    const p = { ...currentProfile, name: 'Maya', age: 3, avatar: '🦄' };
                    setCurrentProfile(p);
                    onUpdateProfile(p);
                  }}
                  className={`px-3 py-1.5 rounded-xl border flex items-center gap-1.5 cursor-pointer shadow-sm text-xs font-bold ${
                    currentProfile.name === 'Maya' ? 'bg-purple-600 text-white border-purple-600' : 'bg-white text-slate-800 border-purple-200 hover:bg-purple-50'
                  }`}
                >
                  <span>🦄</span> Maya (Age 3)
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRINTABLE SHEETS */}
        {activeTab === 'print' && (
          <div className="space-y-2">
            <span className="text-xs font-black text-purple-950 uppercase tracking-wider block">🖨️ Offline Coloring Sheets for Crayons & Markers</span>
            <div className="grid grid-cols-3 gap-2">
              {COLORING_PAGES.slice(0, 3).map(p => (
                <div key={p.id} className="bg-purple-50 p-2.5 rounded-2xl border border-purple-200 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-black text-purple-900">{p.title}</h4>
                    <span className="text-[9px] text-slate-500">Category: {p.category}</span>
                  </div>
                  <button
                    onClick={() => handlePrintSheet(p.title)}
                    className="mt-2 py-1 px-2.5 rounded-xl bg-purple-600 text-white font-bold text-[10px] flex items-center justify-center gap-1 cursor-pointer shadow"
                  >
                    <Printer className="w-3 h-3" /> Print Sheet
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Footer Bar */}
        <div className="mt-2 pt-2 border-t border-purple-100 flex items-center justify-between">
          <span className="text-[10px] text-emerald-600 font-black">
            {savedNotice ? '✓ Settings & Profile Saved Successfully!' : 'Kid-safe sandbox active'}
          </span>
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs flex items-center gap-1.5 cursor-pointer shadow active:scale-95 border-2 border-white"
          >
            <Check className="w-3.5 h-3.5 stroke-[3]" /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
};
