"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight, 
  Droplets, ShieldAlert, Sparkles, Printer, Plus, Trash2, Edit3, 
  MapPin, Info, ArrowRight, CheckSquare, Square, Download, Share2, 
  IndianRupee, Zap, Leaf, Filter, Sun, CloudRain, ShieldCheck, RefreshCw, X,
  Layers, ListFilter, CalendarDays, BarChart3, AlertCircle, Sparkle, Tag,
  Lightbulb, AlertTriangle, TrendingUp, Thermometer, Compass, ChevronRight as ChevronIcon,
  Activity, Star, Check
} from "lucide-react";
import Link from "next/link";
import { ALL_INDIAN_STATES_AND_UTS } from "@/app/marketplace/page";

// CROP TYPES WITH BASE GROWING DURATION (DAYS) & EMOJI
interface CropMaster {
  name: string;
  category: string;
  emoji: string;
  durationDays: number;
  expectedYieldPerAcreQuintals: number;
  avgCostPerAcre: number;
  avgRevenuePerAcre: number;
}

const PRESET_CROPS: CropMaster[] = [
  { name: "Tomato (Hybrid)", category: "Vegetables", emoji: "🍅", durationDays: 110, expectedYieldPerAcreQuintals: 250, avgCostPerAcre: 35000, avgRevenuePerAcre: 180000 },
  { name: "Wheat (Lokwan / Sharbati)", category: "Cereals", emoji: "🌾", durationDays: 120, expectedYieldPerAcreQuintals: 22, avgCostPerAcre: 18000, avgRevenuePerAcre: 56000 },
  { name: "Paddy / Rice (Basmati)", category: "Cereals", emoji: "🍚", durationDays: 135, expectedYieldPerAcreQuintals: 28, avgCostPerAcre: 22000, avgRevenuePerAcre: 75000 },
  { name: "Onion (Nashik Red)", category: "Vegetables", emoji: "🧅", durationDays: 125, expectedYieldPerAcreQuintals: 120, avgCostPerAcre: 40000, avgRevenuePerAcre: 160000 },
  { name: "Cotton (Bt Cotton)", category: "Commercial", emoji: "☁️", durationDays: 160, expectedYieldPerAcreQuintals: 15, avgCostPerAcre: 28000, avgRevenuePerAcre: 95000 },
  { name: "Sugarcane (Co 86032)", category: "Commercial", emoji: "🎋", durationDays: 360, expectedYieldPerAcreQuintals: 450, avgCostPerAcre: 65000, avgRevenuePerAcre: 240000 },
  { name: "Potato (Jyoti)", category: "Vegetables", emoji: "🥔", durationDays: 95, expectedYieldPerAcreQuintals: 180, avgCostPerAcre: 32000, avgRevenuePerAcre: 140000 },
  { name: "Soyabean (JS 335)", category: "Oilseeds", emoji: "🫘", durationDays: 100, expectedYieldPerAcreQuintals: 12, avgCostPerAcre: 15000, avgRevenuePerAcre: 52000 },
  { name: "Mustard (Yellow / Black)", category: "Oilseeds", emoji: "🌼", durationDays: 110, expectedYieldPerAcreQuintals: 10, avgCostPerAcre: 12000, avgRevenuePerAcre: 48000 },
  { name: "Chilli (Guntur Red)", category: "Spices", emoji: "🌶️", durationDays: 140, expectedYieldPerAcreQuintals: 40, avgCostPerAcre: 45000, avgRevenuePerAcre: 210000 },
  { name: "Maize / Corn", category: "Cereals", emoji: "🌽", durationDays: 105, expectedYieldPerAcreQuintals: 30, avgCostPerAcre: 16000, avgRevenuePerAcre: 58000 },
  { name: "Watermelon", category: "Fruits", emoji: "🍉", durationDays: 85, expectedYieldPerAcreQuintals: 200, avgCostPerAcre: 25000, avgRevenuePerAcre: 120000 }
];

export interface CalendarTask {
  id: string;
  dayOffset: number; // Days after sowing
  dateStr: string; // ISO date YYYY-MM-DD
  formattedDate: string; // "15 Aug 2026"
  phase: "Land Prep" | "Sowing" | "Vegetative Growth" | "Flowering & Fruiting" | "Harvesting & Mandi";
  title: string;
  description: string;
  type: "soil" | "sowing" | "water" | "fertilizer" | "pest" | "harvest";
  isCompleted: boolean;
  priority: "High" | "Medium" | "Normal";
  aiProTip?: string; // AI Agronomist Tip
  exactDosage?: string; // Recommended dosage per acre
  weatherAdvisory?: string; // Weather advice
}

export default function AICropPlannerCalendarPage() {
  // View Mode Switcher: Month Grid vs Timeline Roadmap vs Checklist
  const [viewMode, setViewMode] = useState<"calendar" | "timeline" | "checklist">("calendar");

  // Input Form State
  const [selectedCropName, setSelectedCropName] = useState<string>("Tomato (Hybrid)");
  const [customCropName, setCustomCropName] = useState<string>("");
  const [sowingDate, setSowingDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [landSizeInput, setLandSizeInput] = useState<string>("3");
  const [landUnit, setLandUnit] = useState<"Acres" | "Hectares" | "Bigha" | "Guntha">("Acres");
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [farmingType, setFarmingType] = useState<"Chemical/Traditional" | "Organic Certified" | "Drip & Fertigation">("Drip & Fertigation");
  const [irrigationSource, setIrrigationSource] = useState<string>("Borewell Drip Irrigation");

  // Schedule & Filter State
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<CalendarTask | null>(null);

  // Calendar View State & Month Animation Direction (-1 or 1)
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [monthSlideDirection, setMonthSlideDirection] = useState<number>(1);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(new Date().toISOString().split("T")[0]);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  
  // Custom Task Modal Input
  const [newCustomTitle, setNewCustomTitle] = useState("");
  const [newCustomDesc, setNewCustomDesc] = useState("");
  const [newCustomType, setNewCustomType] = useState<CalendarTask["type"]>("water");

  // Normalized Acres for yield calculations
  const landAcres = useMemo(() => {
    const val = parseFloat(landSizeInput);
    if (isNaN(val) || val <= 0) return 1;
    switch (landUnit) {
      case "Hectares": return val * 2.471;
      case "Bigha": return val * 0.625;
      case "Guntha": return val * 0.025;
      case "Acres":
      default: return val;
    }
  }, [landSizeInput, landUnit]);

  // Find active crop master info
  const activeCropMaster = useMemo(() => {
    const found = PRESET_CROPS.find(c => c.name === selectedCropName);
    if (found) return found;
    return {
      name: customCropName || "Custom Produce Crop",
      category: "General Crop",
      emoji: "🌱",
      durationDays: 110,
      expectedYieldPerAcreQuintals: 30,
      avgCostPerAcre: 20000,
      avgRevenuePerAcre: 75000
    };
  }, [selectedCropName, customCropName]);

  // AI AGRONOMIST ENGINE: Generates chronological CalendarTasks with AI Tips & Dosage
  const generateAICropSchedule = () => {
    const startDate = new Date(sowingDate || new Date());
    const cropName = selectedCropName === "Other Custom Crop" ? customCropName || "Custom Crop" : selectedCropName;
    const duration = activeCropMaster.durationDays;

    const addDays = (base: Date, days: number): { iso: string; formatted: string } => {
      const d = new Date(base);
      d.setDate(d.getDate() + days);
      const iso = d.toISOString().split("T")[0];
      const formatted = d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
      return { iso, formatted };
    };

    const newTasks: CalendarTask[] = [];

    // Day -7: Land Preparation
    let d = addDays(startDate, -7);
    newTasks.push({
      id: `task-1`,
      dayOffset: -7,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Land Prep",
      title: "🚜 Deep Plowing & Farm Bed Preparation",
      description: `Perform 2 rounds of deep plowing for your ${landSizeInput} ${landUnit} field. Mix 5 tonnes/acre of well-decomposed FYM organic compost.`,
      type: "soil",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Pro Tip: Deep plowing 7-10 days prior to sowing exposes soil-borne pests to sunlight and increases soil aeration by 35% in ${selectedState}.`,
      exactDosage: "FYM Compost: 5 Tonnes/Acre + Trichoderma 2.5 kg/acre",
      weatherAdvisory: "☀️ Ideal dry sunny weather for soil solarization."
    });

    // Day -2: Basal Dose
    d = addDays(startDate, -2);
    newTasks.push({
      id: `task-2`,
      dayOffset: -2,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Land Prep",
      title: "🪴 Basal NPK & Organic Neem Cake Dose",
      description: `Apply NPK (10:26:26) 50 kg/acre + Neem cake 100 kg/acre as basal dose in soil beds before sowing ${cropName}.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Pro Tip: Mixing Neem Cake with NPK reduces Nitrogen leaching loss by 40% and protects against root-knot nematodes.`,
      exactDosage: "NPK (10:26:26): 50 kg/Acre | Neem Cake: 100 kg/Acre",
      weatherAdvisory: "🌤️ Mild soil moisture recommended for fertilizer absorption."
    });

    // Day 0: Sowing / Transplanting
    d = addDays(startDate, 0);
    newTasks.push({
      id: `task-3`,
      dayOffset: 0,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Sowing",
      title: `🌱 Seed Sowing / Nursery Transplanting of ${cropName}`,
      description: `Treat seeds with Bio-fertilizer Trichoderma viride (10g/kg). Transplant maintaining 45cm x 30cm row spacing. Light irrigation immediately after.`,
      type: "sowing",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Pro Tip: Sow in late afternoon (after 3 PM) to prevent seedling transplant shock caused by high afternoon solar radiation.`,
      exactDosage: "Trichoderma Seed Treatment: 10g / kg seeds",
      weatherAdvisory: "💧 Provide immediate 1.5-hour light drip irrigation after transplanting."
    });

    // Day 7: First Watering & Root Establishment
    d = addDays(startDate, 7);
    newTasks.push({
      id: `task-4`,
      dayOffset: 7,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "💧 First Drip Fertigation & Germination Check",
      description: `Run drip irrigation for 2 hours. Inspect germination uniformity across beds. Gap fill any missing seedlings.`,
      type: "water",
      isCompleted: false,
      priority: "Medium",
      aiProTip: `💡 AI Pro Tip: Root system develops 80% of its anchorage during Week 1. Avoid over-flooding to prevent root asphyxiation.`,
      exactDosage: "Humic Acid 98%: 1 kg/Acre via Drip Fertigation",
      weatherAdvisory: "☀️ Clear sunny conditions."
    });

    // Day 21: Weed Management & First Top-Dressing
    d = addDays(startDate, 21);
    newTasks.push({
      id: `task-5`,
      dayOffset: 21,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "🧪 Weed Control & Urea Top-Dressing",
      description: `Manual weeding or gentle inter-cultivation. Apply 25 kg/acre Urea (or 19:19:19 water soluble via drip) to boost shoot growth.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Pro Tip: Apply 19:19:19 in early morning hours when plant stomata are open for maximum 92% leaf absorption efficiency.`,
      exactDosage: "Urea: 25 kg/Acre (or NPK 19:19:19: 5 kg/Acre via drip)",
      weatherAdvisory: "🌤️ Apply after morning dew evaporates."
    });

    // Day 35: Pest Surveillance & Preventive Spray
    d = addDays(startDate, 35);
    newTasks.push({
      id: `task-6`,
      dayOffset: 35,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "🛡️ Preventive Bio-Pesticide & Sticky Traps",
      description: `Spray Neem Oil 10,000 PPM (5ml/liter water) or installation of Yellow Sticky Traps (10/acre) to control sucking pests (Thrips, Whiteflies).`,
      type: "pest",
      isCompleted: false,
      priority: "Medium",
      aiProTip: `💡 AI Pro Tip: Sticky yellow traps catch 70% of flying adult pests before they lay eggs, reducing chemical spray costs by ₹1,800/acre.`,
      exactDosage: "Neem Oil 10,000 PPM: 5 ml / Liter water + Yellow Traps 10/Acre",
      weatherAdvisory: "🌬️ Avoid spraying if wind speeds exceed 15 km/h."
    });

    // Day 50: Mid-Stage Micronutrients
    d = addDays(startDate, 50);
    newTasks.push({
      id: `task-7`,
      dayOffset: 50,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Flowering & Fruiting",
      title: "🌸 Flowering Boost & Boron/Zinc Foliar Spray",
      description: `Foliar spray of Boron 20% (1g/L) + Zinc EDTA + NPK 13:00:45 to prevent flower drop and encourage uniform fruit set.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Pro Tip: Boron deficiency causes 30% flower drop in ${cropName}. Spraying Boron at early flowering boosts fruit set by 24%.`,
      exactDosage: "Boron 20%: 1g / Liter + NPK 13:0:45: 5g / Liter water",
      weatherAdvisory: "☀️ Spray during calm morning or late evening."
    });

    // Day 70: Fruit/Grain Filling & Potash Fertigation
    d = addDays(startDate, 70);
    newTasks.push({
      id: `task-8`,
      dayOffset: 70,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Flowering & Fruiting",
      title: "🍊 Fruit / Pod Filling & Potash Application",
      description: `Apply Sulphate of Potash (0:0:50) 5 kg/acre via drip. Check for fruit borer/caterpillars; install Pheromone traps.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Pro Tip: Potassium improves fruit skin shine, firmness, shelf-life, and weight by 18%, fetching Grade-A Mandi prices!`,
      exactDosage: "Potash (0:0:50): 5 kg / Acre via Drip Fertigation",
      weatherAdvisory: "💧 Maintain uniform drip soil moisture to prevent fruit cracking."
    });

    // Day (Duration - 15): Stop Heavy Water
    d = addDays(startDate, Math.max(duration - 15, 80));
    newTasks.push({
      id: `task-9`,
      dayOffset: Math.max(duration - 15, 80),
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Harvesting & Mandi",
      title: "☀️ Tapering Irrigation & Pre-Harvest Readiness",
      description: `Reduce watering frequency to allow natural crop ripening and maximize total soluble sugar/dry matter content.`,
      type: "water",
      isCompleted: false,
      priority: "Medium",
      aiProTip: `💡 AI Pro Tip: Stopping irrigation 7-10 days before harvest increases fruit Brix sweetness and prevents post-harvest rot.`,
      exactDosage: "Reduce drip irrigation run time by 50%",
      weatherAdvisory: "☀️ High sunshine accelerates natural ripening."
    });

    // Day Duration: Final Harvest & Mandi Sale
    d = addDays(startDate, duration);
    newTasks.push({
      id: `task-10`,
      dayOffset: duration,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Harvesting & Mandi",
      title: `🌾 Bumper Harvest & AgroPulse APMC Sale`,
      description: `Harvest ${cropName} early morning. Grade into Grade A/B categories. Post listing on AgroPulse APMC Marketplace for top buyer rates!`,
      type: "harvest",
      isCompleted: false,
      priority: "High",
      aiProTip: `💡 AI Mandi Insight: Harvesting early morning (6 AM - 9 AM) preserves 95% crop freshness during Mandi transport.`,
      exactDosage: "Harvest & Sort into Grade A Premium Crates",
      weatherAdvisory: "☀️ Early morning harvest recommended before noon heat."
    });

    setTasks(newTasks);
    setCurrentMonthDate(new Date(sowingDate));
  };

  useEffect(() => {
    generateAICropSchedule();
  }, []);

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  const handleAddCustomTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCalendarDate || !newCustomTitle.trim()) return;

    const dateObj = new Date(selectedCalendarDate);
    const formatted = dateObj.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

    const newTask: CalendarTask = {
      id: `custom-${Date.now()}`,
      dayOffset: 0,
      dateStr: selectedCalendarDate,
      formattedDate: formatted,
      phase: "Vegetative Growth",
      title: newCustomTitle.trim(),
      description: newCustomDesc.trim() || "Farmer custom reminder note.",
      type: newCustomType,
      isCompleted: false,
      priority: "Normal",
      aiProTip: "💡 Farmer Custom Reminder Note added to AgroPulse Crop Calendar."
    };

    setTasks(prev => [...prev, newTask].sort((a, b) => a.dateStr.localeCompare(b.dateStr)));
    setShowAddCustomModal(false);
    setNewCustomTitle("");
    setNewCustomDesc("");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTaskDetail?.id === taskId) setSelectedTaskDetail(null);
  };

  // TASKS FOR THE SELECTED CALENDAR DATE IN INTERACTIVE PANEL
  const tasksForSelectedDate = useMemo(() => {
    if (!selectedCalendarDate) return [];
    return tasks.filter(t => t.dateStr === selectedCalendarDate);
  }, [tasks, selectedCalendarDate]);

  // TODAY'S SCHEDULED TASKS (IF ANY)
  const todayDateStr = useMemo(() => new Date().toISOString().split("T")[0], []);
  const todayTasks = useMemo(() => tasks.filter(t => t.dateStr === todayDateStr), [tasks, todayDateStr]);

  // CALCULATE PROGRESS & FINANCIAL ESTIMATES
  const completedCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  const progressPercent = useMemo(() => tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100), [completedCount, tasks]);

  const estimatedYieldQuintals = useMemo(() => Math.round(activeCropMaster.expectedYieldPerAcreQuintals * landAcres), [activeCropMaster, landAcres]);
  const totalCostEstimate = useMemo(() => Math.round(activeCropMaster.avgCostPerAcre * landAcres), [activeCropMaster, landAcres]);
  const totalRevenueEstimate = useMemo(() => Math.round(activeCropMaster.avgRevenuePerAcre * landAcres), [activeCropMaster, landAcres]);
  const totalProfitEstimate = useMemo(() => totalRevenueEstimate - totalCostEstimate, [totalRevenueEstimate, totalCostEstimate]);

  // MONTHLY INTERACTIVE CALENDAR MATRIX GENERATION
  const calendarDaysMatrix = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0 = Sun
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    // Empty lead cells for previous month padding
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    // Actual month days
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayTasks = tasks.filter(t => t.dateStr === dateStr);
      days.push({ dayNumber: d, dateStr, dayTasks });
    }

    return days;
  }, [currentMonthDate, tasks]);

  const nextMonth = () => {
    setMonthSlideDirection(1);
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setMonthSlideDirection(-1);
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const filteredTasks = useMemo(() => {
    if (activeCategoryFilter === "all") return tasks;
    return tasks.filter(t => t.type === activeCategoryFilter);
  }, [tasks, activeCategoryFilter]);

  const getTypeStyle = (type: CalendarTask["type"]) => {
    switch (type) {
      case "soil": 
        return { 
          bg: "bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-950 dark:text-amber-200 border-amber-500/40 shadow-sm", 
          badgeBg: "bg-amber-600 text-white",
          label: "pt Soil & Prep" 
        };
      case "sowing": 
        return { 
          bg: "bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-950 dark:text-emerald-200 border-emerald-500/40 shadow-sm", 
          badgeBg: "bg-emerald-600 text-white",
          label: "🌱 Sowing" 
        };
      case "water": 
        return { 
          bg: "bg-gradient-to-r from-sky-500/20 to-cyan-500/20 text-sky-950 dark:text-sky-200 border-sky-500/40 shadow-sm", 
          badgeBg: "bg-sky-600 text-white",
          label: "💧 Irrigation" 
        };
      case "fertilizer": 
        return { 
          bg: "bg-gradient-to-r from-purple-500/20 to-indigo-500/20 text-purple-950 dark:text-purple-200 border-purple-500/40 shadow-sm", 
          badgeBg: "bg-purple-600 text-white",
          label: "🧪 Fertilizer" 
        };
      case "pest": 
        return { 
          bg: "bg-gradient-to-r from-rose-500/20 to-pink-500/20 text-rose-950 dark:text-rose-200 border-rose-500/40 shadow-sm", 
          badgeBg: "bg-rose-600 text-white",
          label: "🛡️ Pest Control" 
        };
      case "harvest": 
        return { 
          bg: "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-950 dark:text-yellow-200 border-yellow-500/40 shadow-sm", 
          badgeBg: "bg-yellow-600 text-white",
          label: "🌾 Harvest & Mandi" 
        };
    }
  };

  // Group tasks by phase for Gantt Timeline view
  const tasksByPhase = useMemo(() => {
    const phases = ["Land Prep", "Sowing", "Vegetative Growth", "Flowering & Fruiting", "Harvesting & Mandi"] as const;
    return phases.map(phase => ({
      phase,
      phaseTasks: tasks.filter(t => t.phase === phase)
    }));
  }, [tasks]);

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 pt-[84px] font-sans">
      
      {/* FUTURISTIC ANIMATED GLASSMORPHIC HEADER BANNER */}
      <header className="mb-8 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-emerald-400/50 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        
        {/* Glow Background Elements */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-80 h-80 bg-teal-400/30 rounded-full blur-3xl pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.3, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-400/30 rounded-full blur-3xl pointer-events-none" 
        />

        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg border border-white/30 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" /> AI Kisan Agronomist Engine Active
            </span>
            <span className="text-xs text-emerald-100 font-bold">• Dynamic Animated Calendar & Pro Tips</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow-md">
            <CalendarDays className="w-9 h-9 text-yellow-300 shrink-0" />
            AI Interactive Crop Growth & Calendar Planner
          </h1>
          <p className="text-xs md:text-sm text-emerald-100 font-bold max-w-2xl">
            Input your crop produce, sowing date, and land size. The AI engine plans exact daily tasks, fertilizer schedules, water fertigation, and harvest procurement dates!
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 relative z-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-600" /> Print AI Crop Calendar
          </motion.button>
        </div>
      </header>

      {/* TODAY'S MANDATORY FARMER DUTIES BANNER (IF ANY TASK IS TODAY) */}
      {todayTasks.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white p-5 md:p-6 rounded-3xl shadow-xl border-2 border-amber-300 mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex items-start gap-3">
            <div className="p-3 bg-white/20 rounded-2xl shrink-0">
              <Zap className="w-6 h-6 text-yellow-200 animate-bounce" />
            </div>
            <div>
              <span className="bg-black/30 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md">
                ⚡ TODAY'S ACTION ITEM ({todayDateStr})
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                {todayTasks[0].title}
              </h3>
              <p className="text-xs text-amber-100 font-bold max-w-xl">
                {todayTasks[0].description}
              </p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => toggleTaskCompletion(todayTasks[0].id)}
            className={`px-5 py-3 rounded-2xl font-black text-xs shadow-md shrink-0 flex items-center gap-1.5 transition-all ${
              todayTasks[0].isCompleted ? "bg-white text-gray-800" : "bg-emerald-950 text-white hover:bg-black"
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            {todayTasks[0].isCompleted ? "Marked Completed ✅" : "Complete Today's Duty"}
          </motion.button>
        </motion.div>
      )}

      {/* INPUT FORM & AI HARVEST FORECAST DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* CROP CONFIGURATION FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" /> Enter Produce & Farm Details
            </h2>
            <span className="text-[10px] font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-lg">
              Step 1 AI Inputs
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Select Crop Produce:</label>
              <select
                value={selectedCropName}
                onChange={(e) => {
                  setSelectedCropName(e.target.value);
                  setTimeout(generateAICropSchedule, 100);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400 text-sm"
              >
                {PRESET_CROPS.map(c => (
                  <option key={c.name} value={c.name}>{c.emoji} {c.name} ({c.durationDays} Days)</option>
                ))}
                <option value="Other Custom Crop">➕ Other / Custom Crop Produce</option>
              </select>
            </div>

            {selectedCropName === "Other Custom Crop" && (
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Enter Custom Crop Name:</label>
                <input
                  type="text"
                  placeholder="e.g. Garlic / Turmeric"
                  value={customCropName}
                  onChange={(e) => setCustomCropName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Sowing / Planting Date:</label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => {
                  setSowingDate(e.target.value);
                  setTimeout(generateAICropSchedule, 100);
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600 text-sm"
              />
            </div>

            {/* FLUID LAND SIZE ENTRY + UNIT SELECTOR + PRESET BUTTONS */}
            <div className="space-y-1">
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Total Land Size & Unit:</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 5"
                  value={landSizeInput}
                  onChange={(e) => setLandSizeInput(e.target.value)}
                  className="w-2/3 px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-gray-900 dark:text-white text-sm"
                />
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as any)}
                  className="w-1/3 px-2 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400 text-xs"
                >
                  <option value="Acres">Acres (एकड़)</option>
                  <option value="Hectares">Hectares</option>
                  <option value="Bigha">Bigha (बीघा)</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>

              {/* QUICK PRESET BUTTONS */}
              <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                <span className="text-[10px] text-gray-400 font-bold">Quick:</span>
                {["1", "2", "3", "5", "10", "20"].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setLandSizeInput(size)}
                    className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black transition-all ${
                      landSizeInput === size ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
                    }`}
                  >
                    {size} {landUnit}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">State / Region:</label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
              >
                {ALL_INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Farming Style:</label>
              <select
                value={farmingType}
                onChange={(e) => setFarmingType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
              >
                <option value="Drip & Fertigation">Drip Irrigation & Fertigation</option>
                <option value="Chemical/Traditional">Traditional Canal / Borewell</option>
                <option value="Organic Certified">100% Organic Certified Farming</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Primary Water Source:</label>
              <select
                value={irrigationSource}
                onChange={(e) => setIrrigationSource(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
              >
                <option value="Borewell Drip Irrigation">Borewell + Drip Irrigation</option>
                <option value="Canal Water Supply">Canal Water Supply</option>
                <option value="Rainfed Monsoon">Rainfed Monsoon</option>
              </select>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            onClick={generateAICropSchedule}
            className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 mt-2"
          >
            <RefreshCw className="w-4 h-4" /> Recalculate AI Schedule & Calendar Tasks
          </motion.button>
        </div>

        {/* AI FINANCIAL & HARVEST FORECAST CARD */}
        <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950 text-white p-6 md:p-8 rounded-3xl border-2 border-emerald-400 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">AI Yield & Profit Forecast</span>
              <span className="text-3xl animate-pulse">{activeCropMaster.emoji}</span>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <span className="text-xs text-emerald-200 font-bold block">Selected Produce:</span>
                <h3 className="text-2xl font-black text-white">{activeCropMaster.name}</h3>
                <p className="text-xs text-emerald-300 font-bold mt-0.5">
                  Duration: <strong>{activeCropMaster.durationDays} Days</strong> ({landSizeInput} {landUnit} / {landAcres.toFixed(1)} Acres)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-black/40 p-4 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Total Yield</span>
                  <strong className="text-lg text-yellow-300 font-black">{estimatedYieldQuintals} Qtl</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Net Profit</span>
                  <strong className="text-lg text-emerald-300 font-black">₹{totalProfitEstimate.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-100 font-semibold border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span>Est. Cultivation Expense:</span>
                  <span>₹{totalCostEstimate.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. APMC Gross Revenue:</span>
                  <span>₹{totalRevenueEstimate.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-3.5 rounded-2xl border border-white/20 text-[11px] text-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>APMC Mandi benchmarked estimates for {selectedState}.</span>
          </div>
        </div>

      </div>

      {/* VIEW SWITCHER TABS & COMPLETION PROGRESS BAR */}
      <div className="bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-5 mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Schedule Execution Status</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              {completedCount} of {tasks.length} Calendar Tasks Completed ({progressPercent}%)
            </h3>
          </div>

          {/* DUAL VIEW SWITCHER TABS */}
          <div className="flex items-center bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl border border-gray-200 dark:border-white/10">
            <button
              onClick={() => setViewMode("calendar")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === "calendar" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <CalendarDays className="w-4 h-4" /> Month Grid View
            </button>

            <button
              onClick={() => setViewMode("timeline")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === "timeline" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <Layers className="w-4 h-4" /> Stage Roadmap
            </button>

            <button
              onClick={() => setViewMode("checklist")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                viewMode === "checklist" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <ListFilter className="w-4 h-4" /> Task Checklist
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-3.5 overflow-hidden p-0.5 border border-gray-200 dark:border-white/10">
          <motion.div 
            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-md"
            initial={{ width: "0%" }}
            animate={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* CATEGORY FILTER CHIPS */}
        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-gray-100 dark:border-white/10">
          <span className="text-xs font-black text-gray-500 flex items-center gap-1 mr-2">
            <Filter className="w-3.5 h-3.5 text-emerald-600" /> Category Filter:
          </span>
          <button
            onClick={() => setActiveCategoryFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeCategoryFilter === "all" ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setActiveCategoryFilter("soil")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeCategoryFilter === "soil" ? "bg-amber-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            }`}
          >
            pt Soil & Prep
          </button>
          <button
            onClick={() => setActiveCategoryFilter("water")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeCategoryFilter === "water" ? "bg-sky-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            }`}
          >
            💧 Irrigation
          </button>
          <button
            onClick={() => setActiveCategoryFilter("fertilizer")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeCategoryFilter === "fertilizer" ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            }`}
          >
            🧪 Fertilizer
          </button>
          <button
            onClick={() => setActiveCategoryFilter("pest")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeCategoryFilter === "pest" ? "bg-rose-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            }`}
          >
            🛡️ Pest Control
          </button>
          <button
            onClick={() => setActiveCategoryFilter("harvest")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
              activeCategoryFilter === "harvest" ? "bg-yellow-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-gray-300"
            }`}
          >
            🌾 Harvest & Mandi
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: ULTRA-PREMIUM ANIMATED INTERACTIVE MONTH GRID + SIDE PANEL */}
      {viewMode === "calendar" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          
          {/* 7-COLUMN ANIMATED MONTH GRID SHEET */}
          <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-2xl space-y-6 overflow-hidden">
            
            {/* MONTH NAVIGATION BAR WITH SLIDE CONTROLS */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700">Interactive Month Calendar Sheet</span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-2.5">
                  <CalendarDays className="w-6 h-6 text-emerald-600" />
                  {currentMonthDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={prevMonth}
                  className="p-2.5 bg-gray-100 dark:bg-white/10 hover:bg-emerald-100 dark:hover:bg-emerald-950 rounded-xl text-gray-800 dark:text-gray-200 font-bold transition-all border shadow-sm"
                >
                  <ChevronLeft className="w-5 h-5" />
                </motion.button>

                <span className="text-sm font-black text-emerald-700 dark:text-emerald-400 px-4 py-1.5 bg-emerald-50 dark:bg-emerald-950/60 rounded-xl border border-emerald-300 dark:border-emerald-800 shadow-inner">
                  {currentMonthDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
                </span>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={nextMonth}
                  className="p-2.5 bg-gray-100 dark:bg-white/10 hover:bg-emerald-100 dark:hover:bg-emerald-950 rounded-xl text-gray-800 dark:text-gray-200 font-bold transition-all border shadow-sm"
                >
                  <ChevronRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>

            {/* CALENDAR DAYS OF WEEK HEADER */}
            <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-emerald-900 dark:text-emerald-300 uppercase">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                <div key={day} className="py-2.5 bg-emerald-50/80 dark:bg-emerald-950/50 rounded-xl border border-emerald-200 dark:border-emerald-800/60 shadow-sm">
                  {day}
                </div>
              ))}
            </div>

            {/* ANIMATED MONTH GRID WITH SLIDE TRANSITIONS */}
            <AnimatePresence mode="wait" custom={monthSlideDirection}>
              <motion.div
                key={currentMonthDate.toISOString()}
                initial={{ opacity: 0, x: monthSlideDirection > 0 ? 30 : -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: monthSlideDirection > 0 ? -30 : 30 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="grid grid-cols-7 gap-2"
              >
                {calendarDaysMatrix.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="h-24 sm:h-32 bg-gray-50/30 dark:bg-white/5 rounded-2xl border border-dashed border-gray-100 dark:border-white/5" />;
                  }

                  const visibleTasks = activeCategoryFilter === "all" ? cell.dayTasks : cell.dayTasks.filter(t => t.type === activeCategoryFilter);
                  const hasTasks = visibleTasks.length > 0;
                  const isSelected = selectedCalendarDate === cell.dateStr;
                  const isToday = cell.dateStr === todayDateStr;

                  return (
                    <motion.div
                      key={cell.dateStr}
                      whileHover={{ scale: 1.05, y: -4, transition: { type: "spring", stiffness: 400 } }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCalendarDate(cell.dateStr)}
                      className={`h-24 sm:h-32 p-2 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                        isSelected 
                          ? "bg-emerald-600 text-white border-emerald-300 shadow-[0_10px_25px_rgba(16,185,129,0.4)] scale-[1.04] z-10 ring-4 ring-emerald-500/30"
                          : isToday 
                          ? "bg-emerald-50/90 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30 shadow-md" 
                          : "bg-white dark:bg-[#16171f] border-gray-200/80 dark:border-white/10 hover:border-emerald-500"
                      }`}
                    >
                      <div className="flex justify-between items-center z-10">
                        <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${
                          isSelected 
                            ? "bg-white text-emerald-900 shadow-sm" 
                            : isToday 
                            ? "bg-emerald-600 text-white shadow-sm" 
                            : "text-gray-800 dark:text-gray-200"
                        }`}>
                          {cell.dayNumber}
                        </span>

                        {hasTasks && (
                          <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md border ${
                            isSelected ? "bg-white/20 text-white border-white/30" : "bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border-emerald-300"
                          }`}>
                            {visibleTasks.length}
                          </span>
                        )}
                      </div>

                      {/* HIGH CONTRAST EVENT TASK PILLS */}
                      <div className="space-y-1 overflow-y-auto max-h-16 text-[9px] font-extrabold pr-0.5 z-10">
                        {visibleTasks.map(t => {
                          const style = getTypeStyle(t.type);
                          return (
                            <motion.div
                              key={t.id}
                              whileHover={{ scale: 1.05 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedTaskDetail(t);
                              }}
                              className={`p-1 rounded-lg border shadow-sm transition-transform flex items-center justify-between gap-1 ${
                                isSelected ? "bg-white/20 text-white border-white/30" : style.bg
                              } ${t.isCompleted ? "opacity-50 line-through" : ""}`}
                              title={t.title}
                            >
                              <span className="truncate">{t.title}</span>
                              {t.isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-300 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
                            </motion.div>
                          );
                        })}
                      </div>

                      <div className={`text-[9px] font-bold text-right ${isSelected ? "text-emerald-100" : "text-gray-400"} flex items-center justify-end gap-0.5 z-10`}>
                        <Sparkles className="w-2.5 h-2.5 text-yellow-300" /> Inspect
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* DYNAMIC ANIMATED SIDE PANEL: SELECTED DAY COMMAND CENTER */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gradient-to-b from-white to-gray-50 dark:from-[#1a1b23] dark:to-[#16171f] p-6 rounded-3xl border-2 border-emerald-500/40 shadow-2xl flex flex-col justify-between space-y-6"
          >
            <div>
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700">Selected Day Command Desk</span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    {selectedCalendarDate ? new Date(selectedCalendarDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "Click a Date"}
                  </h3>
                </div>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAddCustomModal(true)}
                  className="p-2 bg-emerald-600 text-white rounded-xl text-xs font-black shadow-md hover:bg-emerald-700"
                  title="Add Note to this Date"
                >
                  <Plus className="w-4 h-4" />
                </motion.button>
              </div>

              {/* LIST OF TASKS FOR SELECTED DATE */}
              <div className="space-y-3 mt-4">
                {tasksForSelectedDate.length === 0 ? (
                  <div className="bg-emerald-50/50 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800 p-6 rounded-2xl text-center space-y-2">
                    <Calendar className="w-8 h-8 text-emerald-600 mx-auto opacity-70" />
                    <h4 className="text-xs font-black text-gray-800 dark:text-gray-200">No scheduled tasks for this date</h4>
                    <p className="text-[11px] text-gray-500 font-medium">Click + to add custom fertilizer, irrigation, or harvest notes.</p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowAddCustomModal(true)}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-sm inline-flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add Task Note
                    </motion.button>
                  </div>
                ) : (
                  tasksForSelectedDate.map(t => {
                    const style = getTypeStyle(t.type);
                    return (
                      <motion.div
                        key={t.id}
                        whileHover={{ scale: 1.02, x: 4 }}
                        onClick={() => setSelectedTaskDetail(t)}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-2 shadow-sm hover:shadow-md ${style.bg} ${t.isCompleted ? "opacity-60" : ""}`}
                      >
                        <div className="flex justify-between items-center">
                          <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${style.badgeBg}`}>
                            {style.label}
                          </span>
                          <span className="text-[10px] font-bold text-gray-500">Day {t.dayOffset}</span>
                        </div>

                        <h4 className={`text-sm font-extrabold ${t.isCompleted ? "line-through" : ""}`}>{t.title}</h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium line-clamp-2">{t.description}</p>

                        {t.aiProTip && (
                          <div className="bg-white/80 dark:bg-black/40 p-2 rounded-xl text-[10px] font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1">
                            <Lightbulb className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
                            <span className="truncate">{t.aiProTip}</span>
                          </div>
                        )}
                      </motion.div>
                    );
                  })
                )}
              </div>
            </div>

            {/* AI AGRONOMIST QUICK SUMMARY FOOTER */}
            <div className="bg-emerald-900 text-white p-4 rounded-2xl space-y-2 shadow-lg border border-emerald-400">
              <div className="flex items-center justify-between text-xs">
                <span className="font-extrabold text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-spin" /> AI Agronomist Status
                </span>
                <span className="text-[10px] bg-emerald-800 px-2 py-0.5 rounded font-black text-emerald-100">
                  {selectedState} Region
                </span>
              </div>
              <p className="text-[11px] text-emerald-100 font-medium">
                Crop schedule is calculated specifically for <strong>{activeCropMaster.name}</strong> under <strong>{farmingType}</strong> conditions.
              </p>
            </div>

          </motion.div>

        </div>
      )}

      {/* VIEW MODE 2: STAGE ROADMAP (GANTT TIMELINE) */}
      {viewMode === "timeline" && (
        <div className="space-y-6 mb-12">
          {tasksByPhase.map((group, pIdx) => (
            <div key={group.phase} className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                    {pIdx + 1}
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">{group.phase} Stage</h3>
                </div>
                <span className="text-xs text-gray-400 font-extrabold">{group.phaseTasks.length} Scheduled Milestones</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {group.phaseTasks.map((task) => {
                  const style = getTypeStyle(task.type);
                  return (
                    <motion.div 
                      key={task.id}
                      whileHover={{ scale: 1.03 }}
                      onClick={() => setSelectedTaskDetail(task)}
                      className={`p-5 rounded-2xl border-2 transition-all cursor-pointer hover:shadow-lg ${style.bg} ${task.isCompleted ? "opacity-60" : ""}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${style.badgeBg}`}>
                          Day {task.dayOffset}
                        </span>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{task.formattedDate}</span>
                      </div>

                      <h4 className={`text-sm font-black ${task.isCompleted ? "line-through" : ""}`}>{task.title}</h4>
                      <p className="text-xs mt-1 opacity-90 line-clamp-2">{task.description}</p>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW MODE 3: TASK CHECKLIST VIEW */}
      {viewMode === "checklist" && (
        <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-6 mb-12">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700">Chronological Action Schedule</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Clock className="w-5 h-5 text-emerald-600" />
                Day-by-Day Farming Task Checklist
              </h3>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setSelectedCalendarDate(new Date().toISOString().split("T")[0]);
                setShowAddCustomModal(true);
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-md flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" /> Add Custom Task Note
            </motion.button>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => {
              const style = getTypeStyle(task.type);
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-5 rounded-3xl border-2 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    task.isCompleted 
                      ? "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 opacity-70" 
                      : "bg-white dark:bg-[#1a1b23] border-emerald-500/40 shadow-sm hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <motion.button
                      whileTap={{ scale: 1.2 }}
                      onClick={() => toggleTaskCompletion(task.id)}
                      className="mt-1 p-1 text-emerald-600 hover:text-emerald-700 transition-transform active:scale-95"
                    >
                      {task.isCompleted ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                      ) : (
                        <Square className="w-6 h-6 text-gray-400" />
                      )}
                    </motion.button>

                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md border ${style.bg}`}>
                          {style.label}
                        </span>
                        <span className="text-xs font-black text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-0.5 rounded-md">
                          📅 {task.formattedDate} (Day {task.dayOffset})
                        </span>
                        <span className="text-[10px] font-bold text-gray-400">Phase: {task.phase}</span>
                      </div>

                      <h4 className={`text-base font-extrabold text-gray-900 dark:text-white ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
                        {task.title}
                      </h4>

                      <p className="text-xs text-gray-600 dark:text-gray-300 font-medium">
                        {task.description}
                      </p>

                      {task.aiProTip && (
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800 text-[11px] text-emerald-800 dark:text-emerald-300 font-extrabold flex items-center gap-1.5 mt-1">
                          <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0" />
                          <span>{task.aiProTip}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end md:self-auto">
                    <button
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all ${
                        task.isCompleted ? "bg-gray-200 text-gray-700" : "bg-emerald-600 text-white shadow-sm"
                      }`}
                    >
                      {task.isCompleted ? "Mark Pending" : "Mark Done"}
                    </button>

                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* TASK DETAIL & AI AGRONOMIST BRIEFING MODAL */}
      <AnimatePresence>
        {selectedTaskDetail && (
          <div className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-5 font-sans"
            >
              <button 
                onClick={() => setSelectedTaskDetail(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl text-2xl shadow-inner">
                  {selectedTaskDetail.type === "soil" ? "🪴" : selectedTaskDetail.type === "water" ? "💧" : selectedTaskDetail.type === "fertilizer" ? "🧪" : selectedTaskDetail.type === "pest" ? "🛡️" : "🌾"}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    AI Agronomist Briefing
                  </span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mt-0.5">{selectedTaskDetail.title}</h3>
                </div>
              </div>

              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-200 dark:border-white/10">
                  <div>
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Scheduled Date</span>
                    <strong className="text-emerald-700 dark:text-emerald-400 text-sm font-black">{selectedTaskDetail.formattedDate}</strong>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-400 font-bold uppercase block">Growth Stage</span>
                    <span className="font-extrabold text-gray-900 dark:text-white">{selectedTaskDetail.phase} (Day {selectedTaskDetail.dayOffset})</span>
                  </div>
                </div>

                <div className="bg-emerald-50/80 dark:bg-emerald-950/40 p-4 rounded-2xl border-2 border-emerald-300 dark:border-emerald-800 space-y-1.5">
                  <span className="text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase block">Farmer Mandatory Instructions:</span>
                  <p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                    {selectedTaskDetail.description}
                  </p>
                </div>

                {selectedTaskDetail.exactDosage && (
                  <div className="bg-purple-50 dark:bg-purple-950/40 p-3.5 rounded-2xl border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 space-y-1">
                    <span className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-300 block">🧪 Exact Recommended Dosage / Acre:</span>
                    <strong className="text-xs font-bold">{selectedTaskDetail.exactDosage}</strong>
                  </div>
                )}

                {selectedTaskDetail.aiProTip && (
                  <div className="bg-amber-50 dark:bg-amber-950/40 p-3.5 rounded-2xl border border-amber-300 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-1">
                    <span className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-300 flex items-center gap-1">
                      <Lightbulb className="w-3.5 h-3.5 text-yellow-500" /> AI Agronomist Pro Tip:
                    </span>
                    <p className="text-xs font-medium italic">{selectedTaskDetail.aiProTip}</p>
                  </div>
                )}

                {selectedTaskDetail.weatherAdvisory && (
                  <div className="bg-sky-50 dark:bg-sky-950/40 p-3 rounded-2xl border border-sky-200 dark:border-sky-800 text-sky-900 dark:text-sky-200 text-[11px] font-bold flex items-center gap-1.5">
                    <Sun className="w-4 h-4 text-sky-500 shrink-0" />
                    <span>{selectedTaskDetail.weatherAdvisory}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      toggleTaskCompletion(selectedTaskDetail.id);
                      setSelectedTaskDetail(null);
                    }}
                    className={`flex-1 py-3.5 font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      selectedTaskDetail.isCompleted ? "bg-gray-200 text-gray-800" : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> {selectedTaskDetail.isCompleted ? "Mark Task Pending" : "Mark Task Completed"}
                  </motion.button>

                  <button
                    onClick={() => handleDeleteTask(selectedTaskDetail.id)}
                    className="px-4 py-3.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold rounded-xl text-xs border border-red-200"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ADD CUSTOM TASK MODAL */}
      <AnimatePresence>
        {showAddCustomModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border-2 border-emerald-500 rounded-3xl max-w-md w-full p-6 shadow-2xl relative space-y-4 font-sans"
            >
              <button 
                onClick={() => setShowAddCustomModal(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-3">
                <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Plus className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700">Custom Reminder</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Add Task Note to Calendar</h3>
                </div>
              </div>

              <form onSubmit={handleAddCustomTask} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1">Scheduled Date:</label>
                  <input
                    type="date"
                    required
                    value={selectedCalendarDate || ""}
                    onChange={(e) => setSelectedCalendarDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1">Task Category:</label>
                  <select
                    value={newCustomType}
                    onChange={(e) => setNewCustomType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  >
                    <option value="water">💧 Irrigation & Water</option>
                    <option value="fertilizer">🧪 Fertilizer & Nutrients</option>
                    <option value="pest">🛡️ Pest & Fungicide Spray</option>
                    <option value="soil">pt Soil Health & Weeding</option>
                    <option value="sowing">🌱 Sowing & Seedling</option>
                    <option value="harvest">🌾 Harvesting & APMC Sales</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1">Task Title:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apply Micro-nutrient Foliar Spray"
                    value={newCustomTitle}
                    onChange={(e) => setNewCustomTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 mb-1">Description / Notes:</label>
                  <textarea
                    rows={3}
                    placeholder="Add specific instructions, dosage per acre..."
                    value={newCustomDesc}
                    onChange={(e) => setNewCustomDesc(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-medium"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Task Note to Calendar
                </motion.button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
