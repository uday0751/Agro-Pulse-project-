"use client";

import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useRouter } from "next/navigation";
import { 
  Settings, Globe, Bell, Sun, Sparkles, Moon, ShieldCheck, 
  User, Mail, Smartphone, Volume2, Database, Trash2, RefreshCw, CheckCircle2, DollarSign,
  LogOut, ShieldAlert
} from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const router = useRouter();

  const [notifications, setNotifications] = useState(true);
  const [dailyTips, setDailyTips] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [currency, setCurrency] = useState("₹ INR");
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("agropulse_settings_config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setNotifications(parsed.notifications ?? true);
        setDailyTips(parsed.dailyTips ?? true);
        setSmsAlerts(parsed.smsAlerts ?? true);
        setWeatherAlerts(parsed.weatherAlerts ?? true);
        setCurrency(parsed.currency || "₹ INR");
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleSaveSettings = (key: string, val: any) => {
    const current = { notifications, dailyTips, smsAlerts, weatherAlerts, currency, [key]: val };
    localStorage.setItem("agropulse_settings_config", JSON.stringify(current));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    handleSaveSettings("lang", lng);
  };

  const handleResetSettings = () => {
    if (confirm(t('confirm_reset', 'Reset all platform preferences to factory defaults?'))) {
      localStorage.removeItem("agropulse_settings_config");
      setNotifications(true); setDailyTips(true); setSmsAlerts(true); setWeatherAlerts(true); setCurrency("₹ INR");
      alert(t('reset_success', 'Settings reset to default!'));
    }
  };

  const handleSignOut = async () => {
    if (confirm(t('confirm_signout', 'Are you sure you want to sign out of your AgroPulse account?'))) {
      setIsSigningOut(true);
      try { await signOut(auth); } catch (e) { console.warn("Firebase sign out warning", e); }
      finally {
        localStorage.removeItem("agropulse_current_user_account");
        alert(t('signed_out_msg', 'You have been signed out successfully.'));
        router.push("/auth");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans max-w-5xl mx-auto space-y-8 pt-[78px]">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 md:p-8 shadow-xl border border-green-700/40 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-extrabold text-green-300 border border-white/20">
            <Settings className="w-3.5 h-3.5 text-yellow-400" />
            <span>{t('platform_preferences', 'Platform Preferences & Controls')}</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black text-white">{t('settings_title', 'System & Account Settings')}</h1>
          <p className="text-green-100/90 text-xs font-medium max-w-xl">{t('settings_desc', 'Configure multi-lingual translation, APMC Mandi SMS alerts, dark mode aesthetics, and account sign-out.')}</p>
        </div>
        <div className="bg-black/30 backdrop-blur-md rounded-2xl p-3.5 border border-white/10 text-xs space-y-1 shrink-0 relative z-10">
          <div className="flex items-center gap-2 text-green-300 font-extrabold">
            <User className="w-4 h-4 text-green-400" />
            <span className="text-white font-extrabold">Uday Pratap Singh Chauhan</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-green-200">
            <Mail className="w-3.5 h-3.5 text-green-400" />
            <a href="mailto:udchauhan0987@gmail.com" className="hover:underline font-bold text-white">udchauhan0987@gmail.com</a>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {savedSuccess && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-green-100 dark:bg-green-950 text-green-800 dark:text-green-300 p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border border-green-300">
            <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
            <span>{t('settings_saved', 'Settings saved successfully to local configuration.')}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">

        {/* SECTION 1: LANGUAGE */}
        <div className="space-y-4">
          <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            <Globe className="w-4 h-4" /> {t('language_currency_settings', 'Language & Currency Settings')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block font-bold text-xs text-gray-700 dark:text-gray-300 mb-1.5">{t('ui_language', 'UI Language Translation:')}</label>
              <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}
                className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-white/5 cursor-pointer">
                <option value="en">English (Global)</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="mr">मराठी (Marathi)</option>
                <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
                <option value="ta">தமிழ் (Tamil)</option>
                <option value="te">తెలుగు (Telugu)</option>
                <option value="bn">বাংলা (Bengali)</option>
                <option value="gu">ગુજરાતી (Gujarati)</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-xs text-gray-700 dark:text-gray-300 mb-1.5">{t('preferred_currency', 'Preferred Crop Currency:')}</label>
              <select onChange={(e) => { setCurrency(e.target.value); handleSaveSettings("currency", e.target.value); }} value={currency}
                className="w-full border border-gray-200 dark:border-white/10 rounded-xl px-4 py-3 text-xs text-gray-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-50 dark:bg-white/5 cursor-pointer">
                <option value="₹ INR">₹ {t('currency_inr', 'Indian Rupee (INR)')}</option>
                <option value="$ USD">$ {t('currency_usd', 'US Dollar (USD)')}</option>
                <option value="€ EUR">€ {t('currency_eur', 'Euro (EUR)')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: NOTIFICATIONS */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            <Bell className="w-4 h-4" /> {t('alerts_notifications', 'Alerts & Notifications')}
          </h2>
          <div className="space-y-4">
            {[
              { icon: Bell, titleKey: 'mandi_alert_title', descKey: 'mandi_alert_desc', titleDefault: 'Mandi Rate Drop & Surge Alerts', descDefault: 'Receive real-time notifications on APMC rate spikes for Wheat, Basmati, & Soybean.', state: notifications, setter: setNotifications, key: 'notifications' },
              { icon: Smartphone, titleKey: 'weather_alert_title', descKey: 'weather_alert_desc', titleDefault: 'Satellite Weather Storm Alerts', descDefault: 'Get high-priority rainfall alerts tailored to your GPS location.', state: weatherAlerts, setter: setWeatherAlerts, key: 'weatherAlerts' },
              { icon: Sparkles, titleKey: 'daily_tips_title', descKey: 'daily_tips_desc', titleDefault: 'Daily Smart Farming Tips', descDefault: 'Receive daily sowing and organic fertilizer suggestions on Dashboard.', state: dailyTips, setter: setDailyTips, key: 'dailyTips' },
            ].map(({ icon: Icon, titleKey, descKey, titleDefault, descDefault, state, setter, key: settingKey }) => (
              <div key={settingKey} className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex gap-3 items-center">
                  <Icon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">{t(titleKey, titleDefault)}</h3>
                    <p className="text-[11px] text-gray-400 font-semibold">{t(descKey, descDefault)}</p>
                  </div>
                </div>
                <button onClick={() => { const val = !state; setter(val); handleSaveSettings(settingKey, val); }}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${state ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}>
                  <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${state ? "translate-x-5" : "translate-x-0"}`} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: THEME */}
        <div className="space-y-4 pt-2">
          <h2 className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            {darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />} {t('theme_aesthetics', 'Theme & Aesthetics')}
          </h2>
          <div className="flex justify-between items-center p-3.5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5">
            <div className="flex gap-3 items-center">
              {darkMode ? <Moon className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" /> : <Sun className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />}
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">{t('dark_mode_interface', 'Dark Mode Interface')}</h3>
                <p className="text-[11px] text-gray-400 font-semibold">{t('dark_mode_desc', 'Switch between sleek dark glassmorphism and clean light themes.')}</p>
              </div>
            </div>
            <button onClick={toggleDarkMode} className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${darkMode ? "bg-green-600" : "bg-gray-200 dark:bg-gray-700"}`}>
              <span className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform shadow-sm ${darkMode ? "translate-x-5" : "translate-x-0"}`} />
            </button>
          </div>
        </div>

        {/* SECTION 4: SIGN OUT */}
        <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-4">
          <h2 className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-white/10">
            <ShieldAlert className="w-4 h-4" /> {t('account_privacy', 'Account Session & Privacy')}
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-red-50/70 dark:bg-red-950/40 rounded-2xl border border-red-200 dark:border-red-900/60">
            <div className="flex gap-3 items-center">
              <LogOut className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <h3 className="font-extrabold text-gray-900 dark:text-white text-xs">{t('signout_title', 'Sign Out of AgroPulse Account')}</h3>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold">{t('signout_desc', 'Safely log out of your e-Farmer session and return to authentication desk.')}</p>
              </div>
            </div>
            <button onClick={handleSignOut} disabled={isSigningOut}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-2 transition-all shrink-0">
              <LogOut className="w-4 h-4" /> {isSigningOut ? t('signing_out', 'Signing Out...') : t('sign_out', 'Sign Out')}
            </button>
          </div>
          <div className="flex justify-between items-center pt-2">
            <div>
              <h3 className="font-black text-xs text-gray-900 dark:text-white">{t('reset_preferences', 'Reset Preferences')}</h3>
              <p className="text-[11px] text-gray-400 font-medium">{t('reset_preferences_desc', 'Revert all custom preferences back to factory defaults.')}</p>
            </div>
            <button onClick={handleResetSettings}
              className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-bold text-xs rounded-xl flex items-center gap-1.5 hover:bg-gray-200 transition-colors">
              <RotateCcw className="w-3.5 h-3.5" /> {t('reset_defaults', 'Reset Defaults')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function RotateCcw(props: any) {
  return <RefreshCw {...props} />;
}
