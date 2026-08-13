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
  // View Mode Switcher: Compact Calendar vs Stage Roadmap vs Checklist
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
          bg: "bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700/60 shadow-sm", 
          badgeBg: "bg-amber-600 text-white",
          dotColor: "bg-amber-500",
          label: "🪴 Soil & Prep" 
        };
      case "sowing": 
        return { 
          bg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700/60 shadow-sm", 
          badgeBg: "bg-emerald-600 text-white",
          dotColor: "bg-emerald-500",
          label: "🌱 Sowing" 
        };
      case "water": 
        return { 
          bg: "bg-sky-100 dark:bg-sky-950/80 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700/60 shadow-sm", 
          badgeBg: "bg-sky-600 text-white",
          dotColor: "bg-sky-500",
          label: "💧 Irrigation" 
        };
      case "fertilizer": 
        return { 
          bg: "bg-purple-100 dark:bg-purple-950/80 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700/60 shadow-sm", 
          badgeBg: "bg-purple-600 text-white",
          dotColor: "bg-purple-500",
          label: "🧪 Fertilizer" 
        };
      case "pest": 
        return { 
          bg: "bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700/60 shadow-sm", 
          badgeBg: "bg-rose-600 text-white",
          dotColor: "bg-rose-500",
          label: "🛡️ Pest Control" 
        };
      case "harvest": 
        return { 
          bg: "bg-yellow-100 dark:bg-yellow-950/80 text-yellow-950 dark:text-yellow-200 border-yellow-400 dark:border-yellow-700/60 shadow-sm", 
          badgeBg: "bg-yellow-600 text-white",
          dotColor: "bg-yellow-500",
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
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 pt-[84px] font-sans max-w-7xl mx-auto space-y-8">
      
      {/* COMPACT & SLEEK HEADER BANNER */}
      <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-6 rounded-3xl shadow-xl border border-emerald-400/50 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" /> AI Kisan Agronomist Engine
            </span>
            <span className="text-xs text-emerald-100 font-bold">• Compact Interactive Schedule</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
            <CalendarDays className="w-7 h-7 text-yellow-300 shrink-0" />
            AI Interactive Crop Growth & Calendar Planner
          </h1>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-white text-emerald-800 hover:bg-emerald-50 rounded-xl font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-600" /> Print Calendar
          </button>
        </div>
      </header>

      {/* TODAY'S ACTION ITEM BANNER */}
      {todayTasks.length > 0 && (
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white p-5 rounded-2xl shadow-md border border-amber-300 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/20 rounded-xl shrink-0">
              <Zap className="w-5 h-5 text-yellow-200 animate-bounce" />
            </div>
            <div>
              <span className="bg-black/30 text-white text-[10px] font-black uppercase px-2 py-0.5 rounded">
                ⚡ TODAY'S ACTION ITEM ({todayDateStr})
              </span>
              <h3 className="text-base font-black text-white mt-0.5">{todayTasks[0].title}</h3>
            </div>
          </div>

          <button
            onClick={() => toggleTaskCompletion(todayTasks[0].id)}
            className="px-4 py-2 rounded-xl font-black text-xs shadow-sm bg-emerald-950 text-white hover:bg-black shrink-0 flex items-center gap-1"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Mark Today Done
          </button>
        </div>
      )}

      {/* 2-COLUMN BALANCED DASHBOARD: LEFT (INPUTS & COMPACT CALENDAR WIDGET) | RIGHT (TODAY & SELECTED DAY TASK INSPECTOR) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: COMPACT CONFIGURATION & COMPACT SLEEK CALENDAR WIDGET (5 COLS) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* STEP 1: FARM INPUT CONFIG CARD */}
          <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border-2 border-emerald-500/30 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-2.5">
              <h2 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Sprout className="w-4 h-4 text-emerald-600" /> Produce & Planting Config
              </h2>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Step 1</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-bold">
              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Crop Produce:</label>
                <select
                  value={selectedCropName}
                  onChange={(e) => {
                    setSelectedCropName(e.target.value);
                    setTimeout(generateAICropSchedule, 100);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400"
                >
                  {PRESET_CROPS.map(c => (
                    <option key={c.name} value={c.name}>{c.emoji} {c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Sowing Date:</label>
                <input
                  type="date"
                  value={sowingDate}
                  onChange={(e) => {
                    setSowingDate(e.target.value);
                    setTimeout(generateAICropSchedule, 100);
                  }}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600"
                />
              </div>

              {/* COMPACT LAND SIZE + UNIT INPUT */}
              <div className="sm:col-span-2">
                <label className="block text-gray-600 dark:text-gray-300 mb-1">Land Size & Unit:</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={landSizeInput}
                    onChange={(e) => setLandSizeInput(e.target.value)}
                    className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-gray-900 dark:text-white"
                  />
                  <select
                    value={landUnit}
                    onChange={(e) => setLandUnit(e.target.value as any)}
                    className="w-1/2 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400 text-xs"
                  >
                    <option value="Acres">Acres (एकड़)</option>
                    <option value="Hectares">Hectares</option>
                    <option value="Bigha">Bigha (बीघा)</option>
                    <option value="Guntha">Guntha</option>
                  </select>
                </div>

                {/* PRESET CHIPS */}
                <div className="flex items-center gap-1.5 pt-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-400 font-bold">Quick:</span>
                  {["1", "2", "3", "5", "10"].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setLandSizeInput(size)}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all ${
                        landSizeInput === size ? "bg-emerald-600 text-white" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {size} {landUnit}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ELEGANT COMPACT CALENDAR SHEET WIDGET (DOES NOT TAKE FULL PAGE!) */}
          <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-4">
            
            {/* MONTH HEADER */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-black text-gray-900 dark:text-white">
                  {currentMonthDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                </h3>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={prevMonth}
                  className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-emerald-100 rounded-lg text-gray-800 dark:text-gray-200"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextMonth}
                  className="p-1.5 bg-gray-100 dark:bg-white/10 hover:bg-emerald-100 rounded-lg text-gray-800 dark:text-gray-200"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* WEEKDAY HEADERS */}
            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                <div key={day} className="py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                  {day}
                </div>
              ))}
            </div>

            {/* COMPACT & BEAUTIFUL 7-COLUMN MONTH GRID (ASPECT SQUARE TILES!) */}
            <AnimatePresence mode="wait" custom={monthSlideDirection}>
              <motion.div
                key={currentMonthDate.toISOString()}
                initial={{ opacity: 0, x: monthSlideDirection > 0 ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: monthSlideDirection > 0 ? -20 : 20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-7 gap-1.5"
              >
                {calendarDaysMatrix.map((cell, idx) => {
                  if (!cell) {
                    return <div key={`empty-${idx}`} className="h-10 sm:h-12 w-full bg-gray-50/20 dark:bg-white/5 rounded-xl border border-dashed border-gray-100 dark:border-white/5" />;
                  }

                  const visibleTasks = activeCategoryFilter === "all" ? cell.dayTasks : cell.dayTasks.filter(t => t.type === activeCategoryFilter);
                  const hasTasks = visibleTasks.length > 0;
                  const isSelected = selectedCalendarDate === cell.dateStr;
                  const isToday = cell.dateStr === todayDateStr;

                  return (
                    <motion.button
                      key={cell.dateStr}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedCalendarDate(cell.dateStr)}
                      className={`h-10 sm:h-12 w-full rounded-xl border-2 transition-all flex flex-col items-center justify-between p-1 relative ${
                        isSelected 
                          ? "bg-emerald-600 text-white border-emerald-400 shadow-md ring-2 ring-emerald-500/40 font-black"
                          : isToday 
                          ? "bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-300 font-extrabold" 
                          : "bg-white dark:bg-[#16171f] border-gray-200/60 dark:border-white/10 text-gray-800 dark:text-gray-200 hover:border-emerald-400"
                      }`}
                    >
                      <span className="text-xs font-black leading-none">{cell.dayNumber}</span>

                      {/* COMPACT TASK INDICATOR DOTS */}
                      {hasTasks && (
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {visibleTasks.slice(0, 3).map((t, tIdx) => {
                            const style = getTypeStyle(t.type);
                            return (
                              <span 
                                key={tIdx} 
                                className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : style.dotColor}`} 
                              />
                            );
                          })}
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            <div className="pt-2 border-t border-gray-100 dark:border-white/10 flex justify-between items-center text-[10px] text-gray-400 font-bold">
              <span>🟢 Sowing | 🔵 Water | 🟣 Fert | 🔴 Spray</span>
              <button 
                onClick={() => setSelectedCalendarDate(todayDateStr)}
                className="text-emerald-600 dark:text-emerald-400 font-extrabold hover:underline"
              >
                Jump to Today
              </button>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: INTERACTIVE DAY COMMAND DESK & AI AGRO BRIEFING (7 COLS) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* SELECTED DAY COMMAND PANEL */}
          <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-5">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase text-emerald-700">Day Briefing & Duty Inspector</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
                  <Calendar className="w-5 h-5 text-emerald-600" />
                  {selectedCalendarDate ? new Date(selectedCalendarDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Selected Date"}
                </h3>
              </div>

              <button
                onClick={() => setShowAddCustomModal(true)}
                className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow-sm flex items-center gap-1"
              >
                <Plus className="w-4 h-4" /> Add Note
              </button>
            </div>

            {/* LIST OF TASKS FOR THE SELECTED DATE */}
            <div className="space-y-4">
              {tasksForSelectedDate.length === 0 ? (
                <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800 p-8 rounded-2xl text-center space-y-2">
                  <Sprout className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="text-sm font-black text-gray-800 dark:text-gray-200">No scheduled duties for this specific day</h4>
                  <p className="text-xs text-gray-500 font-medium max-w-sm mx-auto">
                    Your crop is growing steadily. Click <strong>+ Add Note</strong> to set custom fertilizer or irrigation reminders.
                  </p>
                </div>
              ) : (
                tasksForSelectedDate.map(t => {
                  const style = getTypeStyle(t.type);
                  return (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl border-2 transition-all space-y-3 shadow-sm ${style.bg} ${t.isCompleted ? "opacity-60" : ""}`}
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${style.badgeBg}`}>
                            {style.label}
                          </span>
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                            Growth Day {t.dayOffset} ({t.phase})
                          </span>
                        </div>

                        <button
                          onClick={() => toggleTaskCompletion(t.id)}
                          className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
                            t.isCompleted ? "bg-gray-200 text-gray-700" : "bg-emerald-600 text-white shadow-sm"
                          }`}
                        >
                          {t.isCompleted ? "Completed ✅" : "Mark Done"}
                        </button>
                      </div>

                      <div>
                        <h4 className={`text-base font-black ${t.isCompleted ? "line-through" : ""}`}>{t.title}</h4>
                        <p className="text-xs text-gray-700 dark:text-gray-300 font-medium mt-1 leading-relaxed">{t.description}</p>
                      </div>

                      {t.exactDosage && (
                        <div className="bg-white/80 dark:bg-black/30 p-2.5 rounded-xl text-xs font-bold text-purple-900 dark:text-purple-200 border border-purple-200 dark:border-purple-800">
                          🧪 Dosage: <strong>{t.exactDosage}</strong>
                        </div>
                      )}

                      {t.aiProTip && (
                        <div className="bg-amber-100/70 dark:bg-amber-950/50 p-3 rounded-xl text-xs font-semibold text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-800 flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                          <span>{t.aiProTip}</span>
                        </div>
                      )}
                    </motion.div>
                  );
                })
              )}
            </div>
          </div>

          {/* CHRONOLOGICAL ALL-TASK CHECKLIST PREVIEW */}
          <div className="bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-4">
            <h3 className="text-sm font-black text-gray-900 dark:text-white flex items-center justify-between">
              <span>Full Season Milestones ({tasks.length} Tasks)</span>
              <span className="text-xs font-bold text-emerald-600">{progressPercent}% Progress</span>
            </h3>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {tasks.map(t => (
                <div 
                  key={t.id}
                  onClick={() => {
                    setSelectedCalendarDate(t.dateStr);
                    setSelectedTaskDetail(t);
                  }}
                  className={`p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer hover:border-emerald-500 ${
                    t.isCompleted ? "bg-gray-50 text-gray-400 line-through" : "bg-gray-50 dark:bg-white/5 font-extrabold text-gray-900 dark:text-white"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{t.title}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono">{t.formattedDate}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

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
                  {selectedTaskDetail.type === "soil" ? "pt" : selectedTaskDetail.type === "water" ? "💧" : selectedTaskDetail.type === "fertilizer" ? "🧪" : selectedTaskDetail.type === "pest" ? "🛡️" : "🌾"}
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

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => {
                      toggleTaskCompletion(selectedTaskDetail.id);
                      setSelectedTaskDetail(null);
                    }}
                    className={`flex-1 py-3.5 font-extrabold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5 ${
                      selectedTaskDetail.isCompleted ? "bg-gray-200 text-gray-800" : "bg-emerald-600 text-white hover:bg-emerald-700"
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" /> {selectedTaskDetail.isCompleted ? "Mark Task Pending" : "Mark Task Completed"}
                  </button>

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

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Save Task Note to Calendar
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
