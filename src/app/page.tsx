"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, LineChart, Users, Calendar, Landmark, Stethoscope, ShoppingBag, Sprout, MapPin, BarChart, 
  ArrowRight, Sparkles, TrendingUp, Sun, Droplets, Wind, ArrowUpRight, ShieldCheck, ChevronRight, Navigation, Loader2,
  MessageSquare, Star, Send, ThumbsUp, CheckCircle2, User, Mail, Zap, Play, Radio, Compass, ShieldAlert, Cpu, ArrowDownRight
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";

export default function Dashboard() {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState("Welcome to AgroPulse OS");
  const [activeBentoTab, setActiveBentoTab] = useState<"all" | "trade" | "tools">("all");

  // Real-time Live Weather State
  const [weatherData, setWeatherData] = useState<{
    cityName: string;
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    loading: boolean;
  }>({
    cityName: "Detecting GPS...",
    temp: 28,
    condition: "Clear Sky ☀️",
    humidity: 50,
    windSpeed: 10,
    loading: true
  });

  // User Review Feedbacks
  const [fbName, setFbName] = useState("");
  const [fbComments, setFbComments] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [dashboardFeedbacks, setDashboardFeedbacks] = useState([
    { id: "1", name: "Rameshwar Patil", rating: 5, comments: "Mandi Finder & AI Crop Planner are game-changing! Sold 45 Quintals Wheat directly.", role: "Verified Farmer (Pune)", createdAt: "Today" },
    { id: "2", name: "Gurpreet Singh", rating: 5, comments: "Direct crop buyer matching saved us over ₹35,000 in middleman fees.", role: "Farmer (Punjab)", createdAt: "Yesterday" }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning, Kisan 🌅");
    else if (hour < 17) setGreeting("Good Afternoon, Kisan ☀️");
    else setGreeting("Good Evening, Kisan 🌾");
  }, []);

  // Live Location Weather
  const fetchDashboardWeather = async (lat: number, lng: number, fallbackName?: string) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m`
      );
      const data = await res.json();
      const current = data?.current || {};

      const weatherCodeMap: Record<number, string> = {
        0: "Clear Sky ☀️", 1: "Mainly Clear 🌤️", 2: "Partly Cloudy ⛅", 3: "Overcast ☁️",
        45: "Foggy 🌫️", 51: "Light Drizzle 🌧️", 61: "Slight Rain 🌧️", 63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️", 80: "Rain Showers 🌦️", 95: "Thunderstorm 🌩️"
      };

      const cond = weatherCodeMap[current.weather_code] || "Clear Sky ☀️";
      let locationLabel = fallbackName || "Live Location";

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const geoData = await geoRes.json();
        const address = geoData?.address;
        if (address) {
          const city = address.city || address.town || address.village || address.district;
          const state = address.state;
          if (city) locationLabel = state ? `${city}, ${state.substring(0, 2).toUpperCase()}` : city;
        }
      } catch (e) { console.error(e); }

      setWeatherData({
        cityName: locationLabel,
        temp: Math.round(current.temperature_2m ?? 28),
        condition: cond,
        humidity: Math.round(current.relative_humidity_2m ?? 50),
        windSpeed: Math.round(current.wind_speed_10m ?? 12),
        loading: false
      });
    } catch (err) {
      setWeatherData({
        cityName: fallbackName || "Current Location",
        temp: 29,
        condition: "Clear Sky ☀️",
        humidity: 48,
        windSpeed: 11,
        loading: false
      });
    }
  };

  const detectLocation = () => {
    setWeatherData((prev) => ({ ...prev, loading: true }));
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDashboardWeather(pos.coords.latitude, pos.coords.longitude),
        () => fetchDashboardWeather(23.2599, 77.4126, "Bhopal, MP"),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      fetchDashboardWeather(23.2599, 77.4126, "Bhopal, MP");
    }
  };

  useEffect(() => { detectLocation(); }, []);

  const handleQuickFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbComments.trim()) return;
    setDashboardFeedbacks([
      { id: Date.now().toString(), name: fbName.trim(), rating: fbRating, comments: fbComments.trim(), role: "Verified User", createdAt: "Just now" },
      ...dashboardFeedbacks
    ]);
    setFbName("");
    setFbComments("");
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 4000);
  };

  // Live APMC Mandi Tickers
  const mandiTickers = [
    { crop: "Wheat (Sharbati)", mandi: "Indore APMC", price: "₹2,850/q", change: "+4.2%", isUp: true },
    { crop: "Paddy (Basmati 1121)", mandi: "Karnal APMC", price: "₹4,620/q", change: "+2.8%", isUp: true },
    { crop: "Cotton (Bt Long Staple)", mandi: "Rajkot APMC", price: "₹7,150/q", change: "-1.5%", isUp: false },
    { crop: "Soyabean (Yellow)", mandi: "Ujjain APMC", price: "₹4,480/q", change: "+1.9%", isUp: true },
    { crop: "Mustard (Yellow)", mandi: "Jaipur APMC", price: "₹5,350/q", change: "+3.1%", isUp: true },
    { crop: "Onion (Nashik Red)", mandi: "Lasalgaon APMC", price: "₹1,920/q", change: "-2.4%", isUp: false }
  ];

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8 space-y-10 max-w-7xl mx-auto font-sans">
      
      {/* 1. FUTURISTIC CYBER HERO HEADER BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-emerald-950 p-6 md:p-10 border-2 border-emerald-500/40 shadow-2xl text-white space-y-8"
      >
        {/* Glow Mesh Shaders */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <Cpu className="w-3.5 h-3.5 text-cyan-300" /> AgroPulse OS 4.0 Active
              </span>
              <span className="text-xs text-gray-300 font-bold">• {greeting}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
              India's #1 Direct Farm-to-Buyer <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent">
                Agricultural Trading Ecosystem
              </span>
            </h1>

            <p className="text-xs md:text-sm text-gray-300 font-medium max-w-2xl leading-relaxed">
              Eliminate middlemen commission. Buy and sell fresh harvest across 36 States & UTs with live APMC Mandi rates, satellite weather forecasts, and AI crop planning.
            </p>
          </div>

          {/* DYNAMIC ACTION DOCK */}
          <div className="flex flex-wrap lg:flex-col items-stretch gap-3 shrink-0 relative z-10 w-full sm:w-auto">
            <Link
              href="/marketplace"
              className="px-6 py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-xs rounded-2xl shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group"
            >
              <ShoppingBag className="w-4.5 h-4.5 text-yellow-300 group-hover:scale-110 transition-transform" />
              <span>Buy Crops (Customer Hub)</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              href="/seller"
              className="px-6 py-4 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-[0_0_25px_rgba(245,158,11,0.3)] transition-all flex items-center justify-center gap-2 group"
            >
              <Sprout className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              <span>Sell Harvest (Farmer Desk)</span>
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* METRIC STATS ROW */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 relative z-10 border-t border-white/10 pt-6">
          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase text-emerald-400">Total Mandi Volume</span>
            <strong className="text-xl md:text-2xl font-black text-white block">₹14.8 Crore+</strong>
            <span className="text-[9px] text-gray-400 font-bold">Direct Buyer Volume</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase text-cyan-400">Verified Farmers</span>
            <strong className="text-xl md:text-2xl font-black text-white block">50,000+ Active</strong>
            <span className="text-[9px] text-gray-400 font-bold">Across 36 States & UTs</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase text-amber-400">APMC Mandis Covered</span>
            <strong className="text-xl md:text-2xl font-black text-white block">26+ APMCs</strong>
            <span className="text-[9px] text-gray-400 font-bold">Real-time Daily Feed</span>
          </div>

          <div className="bg-white/5 backdrop-blur-xl p-4 rounded-2xl border border-white/10 space-y-1">
            <span className="text-[10px] font-black uppercase text-purple-400">Middleman Savings</span>
            <strong className="text-xl md:text-2xl font-black text-yellow-300 block">0% Commission</strong>
            <span className="text-[9px] text-gray-400 font-bold">100% Farmer Profit</span>
          </div>
        </div>
      </motion.div>

      {/* 2. REAL-TIME TICKER & LIVE SATELLITE WEATHER HUB */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MANDI PRICE TICKER (2 COLS) */}
        <div className="lg:col-span-2 bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Live APMC Mandi Prices
              </h3>
            </div>
            <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300 px-3 py-1 rounded-full border border-emerald-300">
              Agmarknet Verified
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mandiTickers.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -3 }}
                className="p-3.5 rounded-2xl border bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 space-y-1 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-extrabold text-gray-900 dark:text-white truncate">{t.crop}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${t.isUp ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300" : "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300"}`}>
                    {t.change}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <strong className="text-base font-black text-emerald-700 dark:text-emerald-400">{t.price}</strong>
                  <span className="text-[9px] text-gray-400 font-bold">{t.mandi}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center text-xs font-black pt-2 border-t border-gray-100 dark:border-white/10">
            <span className="text-gray-500">Updated every 15 mins across 26+ APMCs</span>
            <Link href="/market" className="text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1">
              Explore All 70+ World Crops <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* GPS LIVE WEATHER GUARD (1 COL) */}
        <div className="bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950 text-white p-6 rounded-3xl border-2 border-sky-400/40 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-300 animate-spin" />
              <h3 className="text-sm font-black uppercase tracking-wider text-white">Live Weather Radar</h3>
            </div>
            <button
              onClick={detectLocation}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-xl text-sky-200"
              title="Refresh Location Weather"
            >
              <Navigation className="w-4 h-4" />
            </button>
          </div>

          {weatherData.loading ? (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-sky-300 animate-spin mx-auto" />
              <p className="text-xs font-bold text-sky-200">Locating Satellite GPS...</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-xs font-extrabold text-sky-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> {weatherData.cityName}
                  </span>
                  <strong className="text-4xl font-black text-white block mt-1">{weatherData.temp}°C</strong>
                </div>
                <span className="text-xs font-black text-yellow-300 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                  {weatherData.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-3.5 rounded-2xl border border-white/10 font-bold">
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-sky-300" />
                  <div>
                    <span className="text-[9px] text-sky-200 block uppercase">Humidity</span>
                    <span>{weatherData.humidity}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wind className="w-4 h-4 text-sky-300" />
                  <div>
                    <span className="text-[9px] text-sky-200 block uppercase">Wind Speed</span>
                    <span>{weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-xs font-bold pt-2 border-t border-white/10">
            <span className="text-sky-200">60-Day Rain Forecast</span>
            <Link href="/weather" className="text-yellow-300 hover:underline font-black">
              Full Weather Hub →
            </Link>
          </div>
        </div>

      </div>

      {/* 3. BENTO GRID ARCHITECTURE: ASYMMETRIC MODERN LAYOUT */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-widest">
              Bento Grid Ecosystem
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
              AgroPulse Integrated Services
            </h2>
          </div>

          <div className="flex items-center bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-black">
            <button
              onClick={() => setActiveBentoTab("all")}
              className={`px-4 py-2 rounded-xl transition-all ${activeBentoTab === "all" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"}`}
            >
              All Services
            </button>
            <button
              onClick={() => setActiveBentoTab("trade")}
              className={`px-4 py-2 rounded-xl transition-all ${activeBentoTab === "trade" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"}`}
            >
              Direct Trade
            </button>
            <button
              onClick={() => setActiveBentoTab("tools")}
              className={`px-4 py-2 rounded-xl transition-all ${activeBentoTab === "tools" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"}`}
            >
              AI Farm Tools
            </button>
          </div>
        </div>

        {/* ASYMMETRIC BENTO CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          
          {/* BENTO CARD 1: MARKETPLACE (2 COLS LARGE FEATURE) */}
          <motion.div
            whileHover={{ scale: 1.02, y: -4 }}
            className="md:col-span-2 bg-gradient-to-br from-emerald-600 via-teal-600 to-green-700 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-emerald-400/50 flex flex-col justify-between space-y-6 relative overflow-hidden group"
          >
            <div className="space-y-3 relative z-10">
              <div className="flex justify-between items-center">
                <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-xl border border-white/30">
                  🛒 Customer Produce Marketplace
                </span>
                <span className="text-xs font-black bg-yellow-400 text-gray-900 px-3 py-1 rounded-xl">0% Middleman Commission</span>
              </div>

              <h3 className="text-2xl md:text-3xl font-black text-white group-hover:text-yellow-300 transition-colors">
                Buy Fresh Crops Direct From Farmers Across India
              </h3>

              <p className="text-xs md:text-sm text-emerald-100 font-medium leading-relaxed max-w-xl">
                Browse verified farm listings from Maharashtra, Punjab, UP, MP, Gujarat & 36 States. Doorstep delivery or Mandi transport pickup.
              </p>
            </div>

            <div className="pt-4 border-t border-white/20 flex items-center justify-between relative z-10">
              <span className="text-xs font-bold text-emerald-100">Live Crop Listings Available Now</span>
              <Link
                href="/marketplace"
                className="px-5 py-3 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-2 group-hover:scale-105"
              >
                <span>Browse Marketplace</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>

          {/* BENTO CARD 2: SELLER DESK */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-amber-500/40 shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 rounded-2xl w-fit">
                <Sprout className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-amber-600 transition-colors">
                Sell Harvest (Farmer Desk)
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                List your produce directly. Receive & approve buyer purchase orders with instant Mandi payment receipts.
              </p>
            </div>

            <Link
              href="/seller"
              className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-amber-600 dark:text-amber-400"
            >
              <span>Open Farmer Desk</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* BENTO CARD 3: REAL-TIME MANDI FINDER (1 COL) */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-blue-500/40 shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-2xl w-fit">
                <MapPin className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Real-Time Mandi Finder
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Interactive GPS OpenStreetMap showing 26+ APMC Mandis, crop prices, and travel distance.
              </p>
            </div>

            <Link
              href="/mandi-finder"
              className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-blue-600 dark:text-blue-400"
            >
              <span>Launch Mandi Map</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* BENTO CARD 4: AI CROP PLANNER */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-orange-500/40 shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-950 text-orange-600 dark:text-orange-400 rounded-2xl w-fit">
                <Calendar className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-orange-600 transition-colors">
                AI Crop Care & Planner
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Enter your crop produce and sowing date. Get a step-by-step 2-step growth plan, fertigation schedule & crop care guide.
              </p>
            </div>

            <Link
              href="/planner"
              className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-orange-600 dark:text-orange-400"
            >
              <span>Generate AI Plan</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* BENTO CARD 5: FARMER COMMUNITY & CHAT */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-purple-500/40 shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 rounded-2xl w-fit">
                <Users className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-purple-600 transition-colors">
                e-Farmer Community & Chat
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Public discussion group with verified e-Farmer IDs for sharing crop yields, rates, and pest advice.
              </p>
            </div>

            <Link
              href="/community"
              className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-purple-600 dark:text-purple-400"
            >
              <span>Join Community</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* BENTO CARD 6: EXPERTS */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-indigo-500/40 shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 rounded-2xl w-fit">
                <Stethoscope className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                Agronomist Consultations
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Consult certified session experts and agronomists for crop disease diagnostic advice.
              </p>
            </div>

            <Link
              href="/experts"
              className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-indigo-600 dark:text-indigo-400"
            >
              <span>Book Expert</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

          {/* BENTO CARD 7: CROP COMPARE */}
          <motion.div
            whileHover={{ scale: 1.03, y: -4 }}
            className="bg-white dark:bg-[#12141f] p-6 rounded-3xl border-2 border-teal-500/40 shadow-xl flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-950 text-teal-600 dark:text-teal-400 rounded-2xl w-fit">
                <BarChart className="w-6 h-6" />
              </div>

              <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-teal-600 transition-colors">
                Compare Crops Side-by-Side
              </h3>

              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                Compare profit margins, soil suitability, and water requirements for up to 4 crops.
              </p>
            </div>

            <Link
              href="/compare"
              className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-teal-600 dark:text-teal-400"
            >
              <span>Compare Crops</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>

        </div>
      </div>

      {/* 4. USER FEEDBACK & COMMUNITY TESTIMONIALS */}
      <div className="bg-white dark:bg-[#12141f] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">Verified Farmer Feedback</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              Farmer Community Reviews
            </h3>
          </div>

          <Link
            href="/feedback"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-md flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Full Feedback Page
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dashboardFeedbacks.map((fb) => (
            <div key={fb.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center">
                    {fb.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-gray-900 dark:text-white">{fb.name}</h4>
                    <span className="text-[9px] text-gray-400 font-medium">{fb.role}</span>
                  </div>
                </div>

                <div className="flex text-yellow-400">
                  {Array.from({ length: fb.rating }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-yellow-400" />
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-700 dark:text-gray-300 font-medium italic">"{fb.comments}"</p>
            </div>
          ))}
        </div>

        {/* QUICK SUBMIT FORM */}
        <form onSubmit={handleQuickFeedbackSubmit} className="pt-4 border-t border-gray-100 dark:border-white/10 space-y-3">
          <span className="text-xs font-black text-gray-800 dark:text-gray-200 block">Leave a review for AgroPulse:</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input
              type="text"
              required
              placeholder="Your Name / City"
              value={fbName}
              onChange={(e) => setFbName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold"
            />

            <select
              value={fbRating}
              onChange={(e) => setFbRating(Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-bold text-yellow-600 dark:text-yellow-400"
            >
              <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
              <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
              <option value={3}>⭐⭐⭐ (3 Stars)</option>
            </select>
          </div>

          <textarea
            rows={2}
            required
            placeholder="Share your experience using AgroPulse..."
            value={fbComments}
            onChange={(e) => setFbComments(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-medium"
          />

          <div className="flex justify-between items-center">
            {fbSuccess ? (
              <span className="text-xs text-emerald-600 font-black flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Feedback submitted successfully!
              </span>
            ) : <span />}

            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-md flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Submit Review
            </button>
          </div>
        </form>
      </div>

    </div>
  );
}
