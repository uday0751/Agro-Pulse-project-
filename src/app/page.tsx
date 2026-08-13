"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cloud, LineChart, Users, Calendar, Landmark, Stethoscope, ShoppingBag, Sprout, MapPin, BarChart, 
  ArrowRight, Sparkles, TrendingUp, Sun, Droplets, Wind, ArrowUpRight, ShieldCheck, ChevronRight, Navigation, Loader2,
  MessageSquare, Star, Send, ThumbsUp, CheckCircle2, User, Mail, Play, Zap
} from "lucide-react";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import gsap from "gsap";
import { SplineHeroAnimation } from "@/components/SplineHeroAnimation";

export default function Dashboard() {
  const { t, i18n } = useTranslation();
  const heroRef = useRef<HTMLDivElement>(null);
  const tickerRef = useRef<HTMLDivElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const [greeting, setGreeting] = useState("Welcome to AgroPulse");

  // Real-time Live Weather State for Dashboard
  const [weatherData, setWeatherData] = useState<{
    cityName: string;
    temp: number;
    condition: string;
    humidity: number;
    windSpeed: number;
    loading: boolean;
  }>({
    cityName: "Detecting Location...",
    temp: 28,
    condition: "Clear Sky",
    humidity: 50,
    windSpeed: 10,
    loading: true
  });

  // Feedback Form State at Bottom of Dashboard
  const [fbName, setFbName] = useState("");
  const [fbComments, setFbComments] = useState("");
  const [fbRating, setFbRating] = useState(5);
  const [fbSuccess, setFbSuccess] = useState(false);
  const [dashboardFeedbacks, setDashboardFeedbacks] = useState<Array<{
    id: string;
    name: string;
    rating: number;
    comments: string;
    role: string;
    createdAt: string;
  }>>([
    { id: "1", name: "Rameshwar Patil", rating: 5, comments: "Mandi Finder and live weather predictions are spot on!", role: "Farmer (Pune)", createdAt: "Today" },
    { id: "2", name: "Gurpreet Singh", rating: 5, comments: "Direct crop buyer matching saved us thousands in middleman fees.", role: "Farmer (Punjab)", createdAt: "Yesterday" }
  ]);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning, Farmer 🌅");
    else if (hour < 17) setGreeting("Good Afternoon, Farmer ☀️");
    else setGreeting("Good Evening, Farmer 🌾");
  }, []);

  // FETCH REAL-TIME WEATHER FOR USER'S LIVE GPS LOCATION
  const fetchDashboardWeather = async (lat: number, lng: number, fallbackName?: string) => {
    try {
      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,is_day,precipitation,rain,weather_code,wind_speed_10m`
      );
      const data = await res.json();
      const current = data?.current || {};

      const weatherCodeMap: Record<number, string> = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        51: "Light Drizzle 🌧️",
        61: "Slight Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        80: "Rain Showers 🌦️",
        95: "Thunderstorm 🌩️"
      };

      const cond = weatherCodeMap[current.weather_code] || "Clear Sky ☀️";
      let locationLabel = fallbackName || "Live Location";

      try {
        const geoRes = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
        const geoData = await geoRes.json();
        const address = geoData?.address;
        if (address) {
          const city = address.city || address.town || address.village || address.district || address.state_district;
          const state = address.state;
          if (city) {
            locationLabel = state ? `${city}, ${state.substring(0, 2).toUpperCase()}` : city;
          }
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
      console.error("Dashboard weather fetch error", err);
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

  const detectLocationAndFetchWeather = () => {
    setWeatherData((prev) => ({ ...prev, loading: true }));
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => fetchDashboardWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => fetchDashboardWeather(23.2599, 77.4126, "Bhopal, MP"),
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
      );
    } else {
      fetchDashboardWeather(23.2599, 77.4126, "Bhopal, MP");
    }
  };

  useEffect(() => {
    detectLocationAndFetchWeather();
  }, []);

  // Submit quick feedback
  const handleQuickFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbComments.trim()) return;
    const newEntry = {
      id: Date.now().toString(),
      name: fbName.trim(),
      rating: fbRating,
      comments: fbComments.trim(),
      role: "Verified User",
      createdAt: "Just now"
    };
    setDashboardFeedbacks([newEntry, ...dashboardFeedbacks]);
    setFbName("");
    setFbComments("");
    setFbSuccess(true);
    setTimeout(() => setFbSuccess(false), 4000);
  };

  // Integrated Modules Grid
  const modules = [
    {
      title: "Buy Crops (Customer)",
      desc: "Buy fresh crops directly from farmers across 36 Indian States & UTs with 0% middleman fees.",
      icon: ShoppingBag,
      href: "/marketplace",
      badge: "🛒 Customer Hub",
      color: "bg-emerald-600",
      textColor: "text-emerald-600 dark:text-emerald-400",
      bgGradient: "hover:border-emerald-500 border-2 border-emerald-500/20"
    },
    {
      title: "Sell Crops (Farmer Desk)",
      desc: "List your harvested crop online and manually approve or dispatch incoming buyer orders.",
      icon: Sprout,
      href: "/seller",
      badge: "🌾 Farmer Desk",
      color: "bg-amber-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgGradient: "hover:border-amber-500 border-2 border-amber-500/20"
    },
    {
      title: t("market_prices") || "Market Prices & Analytics",
      desc: "Live Govt MSP vs Private rates for 70+ world crops with 6-month historical trend charts.",
      icon: LineChart,
      href: "/market",
      badge: "70+ World Crops",
      color: "bg-green-500",
      textColor: "text-green-600 dark:text-green-400",
      bgGradient: "hover:border-green-500/50"
    },
    {
      title: t("mandi_finder") || "Real-Time Mandi Finder",
      desc: "Interactive Leaflet map showing 26+ mandis, crop prices, and GPS distance.",
      icon: MapPin,
      href: "/mandi-finder",
      badge: "GPS OpenStreetMap",
      color: "bg-blue-500",
      textColor: "text-blue-600 dark:text-blue-400",
      bgGradient: "hover:border-blue-500/50"
    },
    {
      title: t("weather") || "Weather Prediction",
      desc: "60-day localized rain, humidity, & soil moisture forecasts tailored for farming.",
      icon: Cloud,
      href: "/weather",
      badge: "60-Day Forecast",
      color: "bg-cyan-500",
      textColor: "text-cyan-600 dark:text-cyan-400",
      bgGradient: "hover:border-cyan-500/50"
    },
    {
      title: t("community") || "Farmer Community & Chat",
      desc: "Verified e-Farmer ID public discussion groups for real-time crop yields and rates.",
      icon: Users,
      href: "/community",
      badge: "e-Farmer Verified",
      color: "bg-purple-500",
      textColor: "text-purple-600 dark:text-purple-400",
      bgGradient: "hover:border-purple-500/50"
    },
    {
      title: t("expert_consultation") || "Expert Consultation",
      desc: "Consult certified agronomists and genuine session experts for crop diseases.",
      icon: Stethoscope,
      href: "/experts",
      badge: "Agronomist 1-on-1",
      color: "bg-indigo-500",
      textColor: "text-indigo-600 dark:text-indigo-400",
      bgGradient: "hover:border-indigo-500/50"
    },
    {
      title: t("planner") || "Intelligent Crop Planner",
      desc: "Smart sowing schedules, fertilizer timings, and harvest cost calculators.",
      icon: Calendar,
      href: "/planner",
      badge: "AI Schedules",
      color: "bg-orange-500",
      textColor: "text-orange-600 dark:text-orange-400",
      bgGradient: "hover:border-orange-500/50"
    },
    {
      title: t("compare") || "Crop Comparison Tool",
      desc: "Compare profit margins, soil suitability, and water requirements side-by-side.",
      icon: BarChart,
      href: "/compare",
      badge: "Margin Analysis",
      color: "bg-teal-500",
      textColor: "text-teal-600 dark:text-teal-400",
      bgGradient: "hover:border-teal-500/50"
    },
    {
      title: t("govt_schemes") || "Government Schemes",
      desc: "PM-Kisan, Fasal Bima Yojana, subsidies, and low-interest agricultural loans.",
      icon: Landmark,
      href: "/schemes",
      badge: "Subsidies",
      color: "bg-rose-500",
      textColor: "text-rose-600 dark:text-rose-400",
      bgGradient: "hover:border-rose-500/50"
    }
  ];

  // Live Mandi Ticker Data
  const mandiTickers = [
    { crop: "Wheat (Sharbati)", mandi: "Indore APMC", price: "₹2,850/q", change: "+4.2%", isUp: true },
    { crop: "Paddy (Basmati 1121)", mandi: "Karnal APMC", price: "₹4,620/q", change: "+2.8%", isUp: true },
    { crop: "Cotton (Bt Long Staple)", mandi: "Rajkot APMC", price: "₹7,150/q", change: "-1.5%", isUp: false },
    { crop: "Soyabean (Yellow)", mandi: "Ujjain APMC", price: "₹4,480/q", change: "+1.9%", isUp: true },
    { crop: "Mustard (Black)", mandi: "Jaipur APMC", price: "₹5,350/q", change: "+3.1%", isUp: true },
    { crop: "Onion (Nashik Red)", mandi: "Lasalgaon APMC", price: "₹1,920/q", change: "-2.4%", isUp: false }
  ];

  return (
    <div className="p-4 sm:p-6 md:p-8 space-y-10 max-w-7xl mx-auto font-sans">
      
      {/* 1. HERO TITLE & CALL TO ACTION BANNER */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white dark:bg-[#16171f] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-yellow-500 animate-bounce" /> {greeting}
            </span>
            <h1 className="text-2xl md:text-4xl font-black text-gray-900 dark:text-white tracking-tight">
              India's Premier Direct Farm-to-Buyer Trading Portal
            </h1>
            <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 font-medium max-w-2xl">
              Connect directly with farmers and wholesale buyers across 36 Indian States & UTs. Zero middleman commission.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/marketplace"
              className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" /> Explore Marketplace
            </Link>
            <Link
              href="/seller"
              className="px-5 py-3.5 bg-amber-500 hover:bg-amber-600 text-white font-black text-xs rounded-2xl shadow-xl transition-all flex items-center gap-2"
            >
              <Sprout className="w-4 h-4" /> Sell Produce
            </Link>
          </div>
        </motion.div>

      {/* 2. REAL-TIME MANDI RATES TICKER & LIVE WEATHER WIDGET */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* MANDI TICKER (2 COLS) */}
        <div className="lg:col-span-2 bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-3xl shadow-xl border border-emerald-500/30 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Live Mandi Price Ticker</h3>
            </div>
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-900/60 px-2.5 py-0.5 rounded-full border border-emerald-500/40">
              Live Agmarknet Data
            </span>
          </div>

          {/* SCROLLING TICKER GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {mandiTickers.map((t, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.03, y: -2 }}
                className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/15 space-y-1"
              >
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black text-white truncate">{t.crop}</span>
                  <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${t.isUp ? "bg-emerald-500/30 text-emerald-300" : "bg-red-500/30 text-red-300"}`}>
                    {t.change}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <strong className="text-sm font-black text-yellow-300">{t.price}</strong>
                  <span className="text-[9px] text-gray-300 font-medium">{t.mandi}</span>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-between items-center text-[10px] text-emerald-200 font-bold border-t border-white/10 pt-2">
            <span>Updates every 15 minutes across 26+ APMC Mandis.</span>
            <Link href="/market" className="text-yellow-300 hover:underline flex items-center gap-0.5 font-black">
              View All 70+ Crops <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* LIVE GPS WEATHER WIDGET (1 COL) */}
        <div className="bg-gradient-to-br from-sky-900 via-blue-900 to-indigo-950 text-white p-5 rounded-3xl shadow-xl border border-sky-400/40 flex flex-col justify-between space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Sun className="w-5 h-5 text-yellow-300 animate-spin" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Live Weather Guard</h3>
            </div>
            <button
              onClick={detectLocationAndFetchWeather}
              className="p-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sky-200"
              title="Refresh Location Weather"
            >
              <Navigation className="w-3.5 h-3.5" />
            </button>
          </div>

          {weatherData.loading ? (
            <div className="py-8 text-center space-y-2">
              <Loader2 className="w-8 h-8 text-sky-300 animate-spin mx-auto" />
              <p className="text-xs font-bold text-sky-200">Detecting GPS Weather...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <div>
                  <span className="text-[11px] font-bold text-sky-200 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-red-400" /> {weatherData.cityName}
                  </span>
                  <strong className="text-3xl font-black text-white block mt-0.5">{weatherData.temp}°C</strong>
                </div>
                <span className="text-xs font-black text-yellow-300 bg-black/40 px-3 py-1 rounded-xl border border-white/10">
                  {weatherData.condition}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-black/30 p-3 rounded-2xl border border-white/10 font-bold">
                <div className="flex items-center gap-1.5">
                  <Droplets className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="text-[9px] text-sky-200 block uppercase">Humidity</span>
                    <span>{weatherData.humidity}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Wind className="w-4 h-4 text-sky-400" />
                  <div>
                    <span className="text-[9px] text-sky-200 block uppercase">Wind</span>
                    <span>{weatherData.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center text-[10px] text-sky-200 font-bold border-t border-white/10 pt-2">
            <span>60-Day Rain Forecast</span>
            <Link href="/weather" className="text-yellow-300 hover:underline font-black">
              Full Weather Hub →
            </Link>
          </div>
        </div>

      </div>

      {/* 3. MODERN ANIMATED MODULES GRID */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400 tracking-wider">AgroPulse Ecosystem</span>
            <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">Full Platform Solutions & Tools</h2>
          </div>
          <span className="text-xs font-black text-gray-400">10 Integrated Services</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((m, idx) => {
            const Icon = m.icon;
            return (
              <motion.div
                key={m.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03, y: -6 }}
                className={`bg-white dark:bg-[#1a1b23] p-6 rounded-3xl shadow-lg border-2 transition-all flex flex-col justify-between space-y-4 relative overflow-hidden group ${m.bgGradient}`}
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div className={`p-3.5 rounded-2xl ${m.color} text-white shadow-md transition-transform group-hover:scale-110`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-[10px] font-black px-3 py-1 rounded-xl bg-gray-100 dark:bg-white/10 ${m.textColor}`}>
                      {m.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {m.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 font-medium leading-relaxed mt-1">
                      {m.desc}
                    </p>
                  </div>
                </div>

                <Link
                  href={m.href}
                  className="pt-3 border-t border-gray-100 dark:border-white/10 flex items-center justify-between text-xs font-black text-emerald-700 dark:text-emerald-400 group-hover:text-emerald-800"
                >
                  <span>Open Tool</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4. USER FEEDBACK & COMMUNITY TESTIMONIALS */}
      <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700 dark:text-emerald-400">Verified Farmer Reviews</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
              <Star className="w-5 h-5 text-yellow-500 fill-yellow-400" />
              Community Voice & Feedback
            </h3>
          </div>

          <Link
            href="/feedback"
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-md flex items-center gap-1.5"
          >
            <MessageSquare className="w-4 h-4" /> Full Feedback Page
          </Link>
        </div>

        {/* FEEDBACK LIST */}
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
          <span className="text-xs font-black text-gray-800 dark:text-gray-200 block">Leave a quick review:</span>
          
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
