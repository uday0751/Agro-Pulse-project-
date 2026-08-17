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
  Activity, Star, Check, BookOpen, Shield, HelpCircle, FileText, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";
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
  howToDoInstructions: string; // Step-by-step how to execute
  howToTakeCareTips: string; // How to care, prevent disease, nutrient advice
  type: "soil" | "sowing" | "water" | "fertilizer" | "pest" | "harvest";
  isCompleted: boolean;
  priority: "High" | "Medium" | "Normal";
  exactDosage?: string;
  weatherAdvisory?: string;
}

export default function AICropPlannerPage() {
  const { t } = useTranslation();
  // Step 1: Input Form | Step 2: Generated AI Plan Dashboard
  const [currentStep, setCurrentStep] = useState<"input" | "plan">("input");

  // Step 1 Input Form State
  const [selectedCropName, setSelectedCropName] = useState<string>("Tomato (Hybrid)");
  const [customCropName, setCustomCropName] = useState<string>("");
  const [sowingDate, setSowingDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [landSizeInput, setLandSizeInput] = useState<string>("3");
  const [landUnit, setLandUnit] = useState<"Acres" | "Hectares" | "Bigha" | "Guntha">("Acres");
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [soilType, setSoilType] = useState<string>("Black Cotton Soil");
  const [farmingType, setFarmingType] = useState<"Chemical/Traditional" | "Organic Certified" | "Drip & Fertigation">("Drip & Fertigation");
  const [irrigationSource, setIrrigationSource] = useState<string>("Borewell Drip Irrigation");

  // Plan Dashboard Navigation Tab: "calendar" | "care_guide" | "fertilizers" | "checklist"
  const [planTab, setPlanTab] = useState<"calendar" | "care_guide" | "fertilizers" | "checklist">("calendar");

  // Generated Plan Tasks & State
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(new Date().toISOString().split("T")[0]);
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [monthSlideDirection, setMonthSlideDirection] = useState<number>(1);
  const [selectedTaskDetail, setSelectedTaskDetail] = useState<CalendarTask | null>(null);

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

  // Active Crop Info
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

  // AI CROP PLAN GENERATOR ENGINE
  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
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

    // Day -7: Land Prep
    let d = addDays(startDate, -7);
    newTasks.push({
      id: "task-1",
      dayOffset: -7,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Land Prep",
      title: "🚜 Step 1: Deep Plowing & FYM Compost Bed Preparation",
      description: `Perform 2 rounds of deep plowing in your ${landSizeInput} ${landUnit} (${soilType}) field. Mix 5 tonnes/acre of well-decomposed FYM compost.`,
      howToDoInstructions: "1. Plow field to a depth of 30cm to break hard soil pan.\n2. Spread 5 tonnes/acre organic FYM manure evenly.\n3. Make raised beds 90cm wide with 30cm irrigation channels.",
      howToTakeCareTips: "💡 Soil Care Tip: Deep plowing 7 days before sowing solarizes soil and kills 85% of soil-borne fungi & nematodes in " + selectedState + ".",
      type: "soil",
      isCompleted: false,
      priority: "High",
      exactDosage: "FYM Compost: 5 Tonnes / Acre + Trichoderma: 2.5 kg / Acre",
      weatherAdvisory: "☀️ Perform on dry sunny days for best solarization."
    });

    // Day -2: Basal Dose
    d = addDays(startDate, -2);
    newTasks.push({
      id: "task-2",
      dayOffset: -2,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Land Prep",
      title: "🪴 Step 2: Basal NPK & Neem Cake Soil Application",
      description: `Apply NPK (10:26:26) 50 kg/acre + Neem cake 100 kg/acre as basal fertilizer dose before sowing ${cropName}.`,
      howToDoInstructions: "1. Broadcast NPK 10:26:26 evenly over raised beds.\n2. Mix Neem cake to protect against root rot.\n3. Lightly irrigate beds to absorb nutrients.",
      howToTakeCareTips: "💡 Plant Care Tip: Neem cake acts as a natural nitrification inhibitor, preventing Nitrogen leaching loss by 40%.",
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      exactDosage: "NPK (10:26:26): 50 kg / Acre | Neem Cake: 100 kg / Acre",
      weatherAdvisory: "🌤️ Soil should have light moisture."
    });

    // Day 0: Sowing / Planting
    d = addDays(startDate, 0);
    newTasks.push({
      id: "task-3",
      dayOffset: 0,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Sowing",
      title: `🌱 Step 3: Seed Treatment & Planting of ${cropName}`,
      description: `Treat seeds with Trichoderma (10g/kg). Transplant seedlings maintaining 45cm x 30cm row spacing. Light drip irrigation immediately after.`,
      howToDoInstructions: "1. Mix seeds with Trichoderma viride in 50ml water, shade dry for 30 mins.\n2. Plant seedlings at 45cm x 30cm spacing.\n3. Run drip irrigation for 1.5 hours.",
      howToTakeCareTips: "💡 Crop Care Tip: Plant in late afternoon (after 3 PM) to prevent seedling transplant shock from harsh noon heat.",
      type: "sowing",
      isCompleted: false,
      priority: "High",
      exactDosage: "Trichoderma Seed Treatment: 10g / kg seeds",
      weatherAdvisory: "💧 Provide immediate 1.5-hour drip irrigation after planting."
    });

    // Day 7: Root Establishment
    d = addDays(startDate, 7);
    newTasks.push({
      id: "task-4",
      dayOffset: 7,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "💧 Step 4: First Drip Fertigation & Germination Check",
      description: "Run drip irrigation for 2 hours. Inspect germination uniformity. Gap fill any missing seedlings.",
      howToDoInstructions: "1. Run drip irrigation with Humic Acid 98% (1 kg/acre).\n2. Walk through beds to inspect seedling mortality.\n3. Replace dead seedlings immediately.",
      howToTakeCareTips: "💡 Crop Care Tip: Humic Acid stimulates rapid root branching, increasing nutrient intake by 30% during Week 1.",
      type: "water",
      isCompleted: false,
      priority: "Medium",
      exactDosage: "Humic Acid 98%: 1 kg / Acre via Drip",
      weatherAdvisory: "☀️ Clear sunny conditions."
    });

    // Day 21: Weed & Top-Dressing
    d = addDays(startDate, 21);
    newTasks.push({
      id: "task-5",
      dayOffset: 21,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "🧪 Step 5: Weed Removal & NPK 19:19:19 Fertigation",
      description: "Manual weeding. Apply 25 kg/acre Urea (or 19:19:19 water soluble via drip) to boost shoot & leaf growth.",
      howToDoInstructions: "1. Remove weeds manually near plant roots.\n2. Dissolve 5 kg NPK 19:19:19 per acre in venturi tank.\n3. Run drip fertigation for 45 mins.",
      howToTakeCareTips: "💡 Crop Care Tip: Keep 15cm radius around main stem clear of weeds to prevent competition for Nitrogen.",
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      exactDosage: "NPK 19:19:19: 5 kg / Acre via Drip (or Urea 25 kg/acre)",
      weatherAdvisory: "🌤️ Apply in morning after dew dries."
    });

    // Day 35: Pest Protection
    d = addDays(startDate, 35);
    newTasks.push({
      id: "task-6",
      dayOffset: 35,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "🛡️ Step 6: Preventive Neem Spray & Sticky Pest Traps",
      description: "Spray Neem Oil 10,000 PPM (5ml/L water). Install 10 Yellow Sticky Traps/acre for sucking pests (Thrips, Whiteflies).",
      howToDoInstructions: "1. Mix 5ml Neem oil + 1ml liquid soap per liter of water.\n2. Spray thoroughly under leaves.\n3. Install yellow sticky traps at canopy height.",
      howToTakeCareTips: "💡 Crop Care Tip: Yellow traps capture adult whiteflies before egg laying, saving ₹1,800/acre in chemical sprays.",
      type: "pest",
      isCompleted: false,
      priority: "Medium",
      exactDosage: "Neem Oil 10,000 PPM: 5 ml / Liter water + Yellow Traps 10/Acre",
      weatherAdvisory: "🌬️ Spray during calm evening hours."
    });

    // Day 50: Flowering Care
    d = addDays(startDate, 50);
    newTasks.push({
      id: "task-7",
      dayOffset: 50,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Flowering & Fruiting",
      title: "🌸 Step 7: Flowering Boost & Boron/Zinc Spray",
      description: "Foliar spray of Boron 20% (1g/L) + Zinc EDTA + NPK 13:00:45 to prevent flower drop and boost fruit setting.",
      howToDoInstructions: "1. Prepare spray tank with Boron (1g/L) + NPK 13:0:45 (5g/L).\n2. Spray during early flowering stage.\n3. Ensure uniform coverage on flower clusters.",
      howToTakeCareTips: "💡 Crop Care Tip: Boron deficiency causes up to 30% flower drop. Boron spray increases fruit set efficiency by 24%.",
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      exactDosage: "Boron 20%: 1g / Liter + NPK 13:0:45: 5g / Liter water",
      weatherAdvisory: "☀️ Spray during calm morning."
    });

    // Day 70: Fruit Filling
    d = addDays(startDate, 70);
    newTasks.push({
      id: "task-8",
      dayOffset: 70,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Flowering & Fruiting",
      title: "🍊 Step 8: Fruit Filling & Potash Fertigation",
      description: "Apply Sulphate of Potash (0:0:50) 5 kg/acre via drip. Check for fruit borer/caterpillars; install Pheromone traps.",
      howToDoInstructions: "1. Inject Potash (0:0:50) 5 kg/acre via drip system.\n2. Hang 5 Pheromone borer traps per acre.\n3. Inspect fruit surfaces for pest damage.",
      howToTakeCareTips: "💡 Crop Care Tip: Potassium gives fruit glossy shine, firmness, and weight, fetching Grade-A Mandi prices!",
      type: "fertilizer",
      isCompleted: false,
      priority: "High",
      exactDosage: "Potash (0:0:50): 5 kg / Acre via Drip",
      weatherAdvisory: "💧 Maintain constant moisture to avoid fruit cracking."
    });

    // Day Duration-15: Irrigation Tapering
    d = addDays(startDate, Math.max(duration - 15, 80));
    newTasks.push({
      id: "task-9",
      dayOffset: Math.max(duration - 15, 80),
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Harvesting & Mandi",
      title: "☀️ Step 9: Tapering Water & Pre-Harvest Ripening",
      description: "Reduce drip watering by 50% to allow natural fruit/grain sugar buildup and prepare for harvest.",
      howToDoInstructions: "1. Cut drip runtime from 2 hours to 45 minutes.\n2. Inspect fruit color maturity (75% red/ripe stage).\n3. Arrange harvest crates & labor.",
      howToTakeCareTips: "💡 Crop Care Tip: Tapering water 10 days before harvest increases Brix sugar content and prevents fruit rotting in transport.",
      type: "water",
      isCompleted: false,
      priority: "Medium",
      exactDosage: "Reduce drip runtime by 50%",
      weatherAdvisory: "☀️ High sunshine speeds ripening."
    });

    // Day Duration: Final Harvest
    d = addDays(startDate, duration);
    newTasks.push({
      id: "task-10",
      dayOffset: duration,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Harvesting & Mandi",
      title: `🌾 Step 10: Harvest & AgroPulse Mandi Procurement`,
      description: `Harvest ${cropName} early morning. Grade into Grade A/B crates. Post listing on AgroPulse Marketplace for top Mandi rates!`,
      howToDoInstructions: "1. Harvest early morning (6 AM - 9 AM).\n2. Grade into Grade A (unblemished, large) and Grade B.\n3. Post direct buyer listing on AgroPulse Marketplace.",
      howToTakeCareTips: "💡 Mandi Care Tip: Morning harvesting retains 95% moisture freshness during Mandi transport.",
      type: "harvest",
      isCompleted: false,
      priority: "High",
      exactDosage: "Harvest & Sort into Grade A Crates",
      weatherAdvisory: "☀️ Harvest early before noon heat."
    });

    setTasks(newTasks);
    setCurrentMonthDate(new Date(sowingDate));
    setCurrentStep("plan");
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t));
  };

  // CALCULATE PROGRESS & FINANCIAL ESTIMATES
  const completedCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  const progressPercent = useMemo(() => tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100), [completedCount, tasks]);

  const estimatedYieldQuintals = useMemo(() => Math.round(activeCropMaster.expectedYieldPerAcreQuintals * landAcres), [activeCropMaster, landAcres]);
  const totalCostEstimate = useMemo(() => Math.round(activeCropMaster.avgCostPerAcre * landAcres), [activeCropMaster, landAcres]);
  const totalRevenueEstimate = useMemo(() => Math.round(activeCropMaster.avgRevenuePerAcre * landAcres), [activeCropMaster, landAcres]);
  const totalProfitEstimate = useMemo(() => totalRevenueEstimate - totalCostEstimate, [totalRevenueEstimate, totalCostEstimate]);

  // MONTHLY CALENDAR MATRIX
  const calendarDaysMatrix = useMemo(() => {
    const year = currentMonthDate.getFullYear();
    const month = currentMonthDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
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

  const tasksForSelectedDate = useMemo(() => {
    if (!selectedCalendarDate) return [];
    return tasks.filter(t => t.dateStr === selectedCalendarDate);
  }, [tasks, selectedCalendarDate]);

  const getTypeStyle = (type: CalendarTask["type"]) => {
    switch (type) {
      case "soil": return { bg: "bg-amber-100 dark:bg-amber-950/80 text-amber-950 dark:text-amber-200 border-amber-300 dark:border-amber-700", badgeBg: "bg-amber-600 text-white", dotColor: "bg-amber-500", label: "🪴 Soil & Prep" };
      case "sowing": return { bg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-950 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700", badgeBg: "bg-emerald-600 text-white", dotColor: "bg-emerald-500", label: "🌱 Sowing" };
      case "water": return { bg: "bg-sky-100 dark:bg-sky-950/80 text-sky-950 dark:text-sky-200 border-sky-300 dark:border-sky-700", badgeBg: "bg-sky-600 text-white", dotColor: "bg-sky-500", label: "💧 Irrigation" };
      case "fertilizer": return { bg: "bg-purple-100 dark:bg-purple-950/80 text-purple-950 dark:text-purple-200 border-purple-300 dark:border-purple-700", badgeBg: "bg-purple-600 text-white", dotColor: "bg-purple-500", label: "🧪 Fertilizer" };
      case "pest": return { bg: "bg-rose-100 dark:bg-rose-950/80 text-rose-950 dark:text-rose-200 border-rose-300 dark:border-rose-700", badgeBg: "bg-rose-600 text-white", dotColor: "bg-rose-500", label: "🛡️ Pest Control" };
      case "harvest": return { bg: "bg-yellow-100 dark:bg-yellow-950/80 text-yellow-950 dark:text-yellow-200 border-yellow-400 dark:border-yellow-700", badgeBg: "bg-yellow-600 text-white", dotColor: "bg-yellow-500", label: "🌾 Harvest & Mandi" };
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 pt-[84px] font-sans max-w-7xl mx-auto space-y-8">
      
      {/* HEADER BANNER */}
      <header className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-700 text-white p-6 md:p-8 rounded-3xl shadow-2xl border-2 border-emerald-400/50 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-black uppercase px-3 py-1 rounded-lg border border-white/30 flex items-center gap-1 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" /> AI Agronomist & Care Planner
            </span>
            <span className="text-xs text-emerald-100 font-bold">• Simple 2-Step Custom Crop Guide</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-3 drop-shadow-md">
            <Sprout className="w-9 h-9 text-yellow-300 shrink-0" />
            {t("planner_title", "AI Crop Growth & Care Planner")}
          </h1>
          <p className="text-xs md:text-sm text-emerald-100 font-bold max-w-2xl">
            {currentStep === "input" 
              ? "Enter your crop produce & land details below. The AI will generate a complete calendar plan, step-by-step instructions, and crop care tips!" 
              : `Custom AI Growth Plan generated for ${activeCropMaster.name} (${landSizeInput} ${landUnit} in ${selectedState}).`}
          </p>
        </div>

        {currentStep === "plan" && (
          <div className="flex items-center gap-3 shrink-0 relative z-10">
            <button
              onClick={() => setCurrentStep("input")}
              className="px-4 py-2.5 bg-white/20 hover:bg-white/30 text-white rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-1.5 border border-white/30"
            >
              <ArrowLeft className="w-4 h-4" /> Change Crop Details
            </button>
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-black text-xs shadow-xl transition-all flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4 text-emerald-600" /> Print Care Plan
            </button>
          </div>
        )}
      </header>

      {/* STEP 1: ENTER CROP DETAILS FORM */}
      {currentStep === "input" && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto bg-white dark:bg-[#1a1b23] p-6 md:p-10 rounded-3xl border-2 border-emerald-500/40 shadow-2xl space-y-6"
        >
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
              <Sprout className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700">{t("step1", "Step 1 of 2")}</span>
              <h2 className="text-xl md:text-2xl font-black text-gray-900 dark:text-white">{t("enter_crop_farm_details", "Enter Your Crop & Farm Details")}</h2>
            </div>
          </div>

          <form onSubmit={handleGeneratePlan} className="space-y-5 text-xs font-bold">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">{t("select_crop", "Select Crop Produce:")}</label>
                <select
                  value={selectedCropName}
                  onChange={(e) => setSelectedCropName(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400 text-sm"
                >
                  {PRESET_CROPS.map(c => (
                    <option key={c.name} value={c.name}>{c.emoji} {c.name} ({c.durationDays} Days)</option>
                  ))}
                  <option value="Other Custom Crop">➕ Other Custom Crop Produce</option>
                </select>
              </div>

              {selectedCropName === "Other Custom Crop" && (
                <div>
                  <label className="block text-gray-700 dark:text-gray-200 mb-1">Custom Crop Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Garlic / Turmeric"
                    value={customCropName}
                    onChange={(e) => setCustomCropName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-sm"
                  />
                </div>
              )}

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">{t("sowing_date", "Sowing / Planting Date:")}</label>
                <input
                  type="date"
                  required
                  value={sowingDate}
                  onChange={(e) => setSowingDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600 text-sm"
                />
              </div>
            </div>

            {/* FLUID LAND SIZE ENTRY + UNIT SELECTOR */}
            <div className="space-y-1">
              <label className="block text-gray-700 dark:text-gray-200 mb-1">{t("land_size", "Total Land Size & Unit:")}</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  placeholder="e.g. 5"
                  value={landSizeInput}
                  onChange={(e) => setLandSizeInput(e.target.value)}
                  className="w-2/3 px-4 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-gray-900 dark:text-white text-sm"
                />
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as any)}
                  className="w-1/3 px-3 py-3.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400 text-xs"
                >
                  <option value="Acres">Acres (एकड़)</option>
                  <option value="Hectares">Hectares</option>
                  <option value="Bigha">Bigha (बीघा)</option>
                  <option value="Guntha">Guntha</option>
                </select>
              </div>

              {/* QUICK PRESET CHIPS */}
              <div className="flex items-center gap-2 pt-1.5 flex-wrap">
                <span className="text-[10px] text-gray-400 font-bold">Quick Select:</span>
                {["1", "2", "3", "5", "10", "20"].map(size => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setLandSizeInput(size)}
                    className={`px-3 py-1 rounded-lg text-[11px] font-black transition-all ${
                      landSizeInput === size ? "bg-emerald-600 text-white shadow-sm" : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
                    }`}
                  >
                    {size} {landUnit}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">State / Location:</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                >
                  {ALL_INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">Soil Type:</label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                >
                  <option value="Black Cotton Soil">Black Cotton Soil</option>
                  <option value="Loamy / Alluvial Soil">Loamy / Alluvial Soil</option>
                  <option value="Red / Clay Soil">Red / Clay Soil</option>
                  <option value="Sandy Soil">Sandy Soil</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-200 mb-1">{t("farming_style", "Farming Style:")}</label>
                <select
                  value={farmingType}
                  onChange={(e) => setFarmingType(e.target.value as any)}
                  className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                >
                  <option value="Drip & Fertigation">Drip Irrigation & Fertigation</option>
                  <option value="Chemical/Traditional">Traditional Canal / Borewell</option>
                  <option value="Organic Certified">100% Organic Certified</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 mt-4"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" /> Generate AI Crop Care & Action Plan (Step 2)
            </button>
          </form>
        </motion.div>
      )}

      {/* STEP 2: GENERATED AI CROP CARE & ACTION PLAN DASHBOARD */}
      {currentStep === "plan" && (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* TOP SUMMARY & FINANCIAL FORECAST DASHBOARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* CROP DETAILS BADGE */}
            <div className="bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Active Plan Summary</span>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1 flex items-center gap-2">
                  <span>{activeCropMaster.emoji}</span> {activeCropMaster.name}
                </h3>
                <p className="text-xs text-gray-500 font-bold mt-1">
                  Sowing: <strong>{sowingDate}</strong> • Duration: <strong>{activeCropMaster.durationDays} Days</strong>
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs font-bold">
                  <span className="bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-md">
                    {landSizeInput} {landUnit} ({landAcres.toFixed(1)} Acres)
                  </span>
                  <span className="bg-blue-100 text-blue-800 px-2.5 py-0.5 rounded-md">
                    {selectedState}
                  </span>
                  <span className="bg-purple-100 text-purple-800 px-2.5 py-0.5 rounded-md">
                    {soilType}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-100 dark:border-white/10 flex justify-between items-center text-xs">
                <span className="font-extrabold text-gray-600 dark:text-gray-300">Overall Care Progress:</span>
                <span className="font-black text-emerald-600">{progressPercent}% Completed</span>
              </div>
            </div>

            {/* FINANCIAL PROFIT FORECAST */}
            <div className="lg:col-span-2 bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950 text-white p-6 rounded-3xl border-2 border-emerald-400 shadow-xl flex flex-col justify-between space-y-4">
              <div className="flex justify-between items-center border-b border-white/20 pb-3">
                <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">AI Yield & Mandi Profit Blueprint</span>
                <span className="text-xs font-bold text-yellow-300">APMC Mandi Verified</span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Yield</span>
                  <strong className="text-lg text-yellow-300 font-black">{estimatedYieldQuintals} Qtl</strong>
                </div>
                <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Expense</span>
                  <strong className="text-base text-white font-black">₹{totalCostEstimate.toLocaleString("en-IN")}</strong>
                </div>
                <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Revenue</span>
                  <strong className="text-base text-white font-black">₹{totalRevenueEstimate.toLocaleString("en-IN")}</strong>
                </div>
                <div className="bg-black/30 p-3.5 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Net Profit</span>
                  <strong className="text-lg text-emerald-300 font-black">₹{totalProfitEstimate.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="text-[11px] text-emerald-100 flex items-center justify-between">
                <span>Calculated for {landSizeInput} {landUnit} under {farmingType} conditions in {selectedState}.</span>
                <button onClick={() => setCurrentStep("input")} className="text-yellow-300 font-extrabold hover:underline">Edit Inputs</button>
              </div>
            </div>

          </div>

          {/* PLAN NAVIGATION TABS */}
          <div className="flex bg-white dark:bg-[#1a1b23] p-2 rounded-2xl border-2 border-emerald-500/30 shadow-sm gap-2 overflow-x-auto text-xs font-black">
            <button
              onClick={() => setPlanTab("calendar")}
              className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
                planTab === "calendar" ? "bg-emerald-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
              }`}
            >
              <Calendar className="w-4 h-4" /> 1. Interactive Calendar Schedule
            </button>

            <button
              onClick={() => setPlanTab("care_guide")}
              className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
                planTab === "care_guide" ? "bg-emerald-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
              }`}
            >
              <BookOpen className="w-4 h-4" /> 2. Step-by-Step "How To Do" Guide
            </button>

            <button
              onClick={() => setPlanTab("fertilizers")}
              className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
                planTab === "fertilizers" ? "bg-emerald-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
              }`}
            >
              <Shield className="w-4 h-4" /> 3. Crop Care & Pest Defense
            </button>

            <button
              onClick={() => setPlanTab("checklist")}
              className={`px-5 py-3 rounded-xl transition-all flex items-center gap-2 ${
                planTab === "checklist" ? "bg-emerald-600 text-white shadow-md" : "text-gray-700 dark:text-gray-300 hover:bg-emerald-50"
              }`}
            >
              <CheckSquare className="w-4 h-4" /> 4. Full Action Checklist ({tasks.length})
            </button>
          </div>

          {/* TAB 1: INTERACTIVE COMPACT CALENDAR SCHEDULER */}
          {planTab === "calendar" && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* COMPACT MONTH WIDGET */}
              <div className="lg:col-span-5 bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-4">
                <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <h3 className="text-base font-black text-gray-900 dark:text-white">
                      {currentMonthDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
                    </h3>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button onClick={prevMonth} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-lg"><ChevronLeft className="w-4 h-4" /></button>
                    <button onClick={nextMonth} className="p-1.5 bg-gray-100 dark:bg-white/10 rounded-lg"><ChevronRight className="w-4 h-4" /></button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black text-emerald-800 dark:text-emerald-300 uppercase">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map(day => (
                    <div key={day} className="py-1 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg border border-emerald-200 dark:border-emerald-800/40">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-1.5">
                  {calendarDaysMatrix.map((cell, idx) => {
                    if (!cell) return <div key={`empty-${idx}`} className="h-10 sm:h-12 bg-gray-50/20 dark:bg-white/5 rounded-xl border border-dashed border-gray-100" />;
                    const hasTasks = cell.dayTasks.length > 0;
                    const isSelected = selectedCalendarDate === cell.dateStr;

                    return (
                      <button
                        key={cell.dateStr}
                        onClick={() => setSelectedCalendarDate(cell.dateStr)}
                        className={`h-10 sm:h-12 w-full rounded-xl border-2 transition-all flex flex-col items-center justify-between p-1 ${
                          isSelected 
                            ? "bg-emerald-600 text-white border-emerald-400 shadow-md font-black" 
                            : "bg-white dark:bg-[#16171f] border-gray-200 dark:border-white/10 hover:border-emerald-400"
                        }`}
                      >
                        <span className="text-xs font-black">{cell.dayNumber}</span>
                        {hasTasks && (
                          <div className="flex gap-0.5 mt-0.5">
                            {cell.dayTasks.slice(0, 3).map((t, tIdx) => {
                              const style = getTypeStyle(t.type);
                              return <span key={tIdx} className={`w-1.5 h-1.5 rounded-full ${isSelected ? "bg-white" : style.dotColor}`} />;
                            })}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="pt-2 text-[10px] text-gray-400 font-bold flex justify-between">
                  <span>🟢 Sowing | 🔵 Water | 🟣 Fert | 🔴 Spray</span>
                  <button onClick={() => setSelectedCalendarDate(sowingDate)} className="text-emerald-600 font-extrabold hover:underline">Jump to Sowing Date</button>
                </div>
              </div>

              {/* SELECTED DAY DUTY BRIEFING */}
              <div className="lg:col-span-7 bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-5">
                <div className="border-b border-gray-100 dark:border-white/10 pb-3">
                  <span className="text-[10px] font-black uppercase text-emerald-700">Scheduled Date Briefing</span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2 mt-0.5">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    {selectedCalendarDate ? new Date(selectedCalendarDate).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }) : "Selected Date"}
                  </h3>
                </div>

                <div className="space-y-4">
                  {tasksForSelectedDate.length === 0 ? (
                    <div className="bg-emerald-50/40 dark:bg-emerald-950/20 border-2 border-dashed border-emerald-200 dark:border-emerald-800 p-8 rounded-2xl text-center space-y-2">
                      <Sprout className="w-8 h-8 text-emerald-600 mx-auto" />
                      <h4 className="text-sm font-black text-gray-800 dark:text-gray-200">No special duties scheduled for this exact day</h4>
                      <p className="text-xs text-gray-500 font-medium">Your crop is growing steadily according to plan.</p>
                    </div>
                  ) : (
                    tasksForSelectedDate.map(t => {
                      const style = getTypeStyle(t.type);
                      return (
                        <div key={t.id} className={`p-5 rounded-2xl border-2 space-y-3 ${style.bg}`}>
                          <div className="flex justify-between items-center">
                            <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${style.badgeBg}`}>{style.label}</span>
                            <button onClick={() => toggleTaskCompletion(t.id)} className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-600 text-white shadow-sm">
                              {t.isCompleted ? "Completed ✅" : "Mark Completed"}
                            </button>
                          </div>

                          <h4 className="text-base font-black">{t.title}</h4>
                          <p className="text-xs font-medium leading-relaxed">{t.description}</p>

                          {t.howToDoInstructions && (
                            <div className="bg-white/80 dark:bg-black/30 p-3 rounded-xl text-xs space-y-1 border">
                              <span className="font-black text-emerald-800 dark:text-emerald-300 block">🛠️ How To Do:</span>
                              <p className="text-xs whitespace-pre-line font-medium text-gray-800 dark:text-gray-200">{t.howToDoInstructions}</p>
                            </div>
                          )}

                          {t.howToTakeCareTips && (
                            <div className="bg-amber-100/70 dark:bg-amber-950/50 p-3 rounded-xl text-xs font-semibold text-amber-950 dark:text-amber-200 border border-amber-300 flex items-start gap-2">
                              <Lightbulb className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                              <span>{t.howToTakeCareTips}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: STEP-BY-STEP HOW TO DO GUIDE */}
          {planTab === "care_guide" && (
            <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-6">
              <div className="border-b border-gray-100 dark:border-white/10 pb-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-emerald-600" />
                  Step-by-Step "How To Do" Cultivation Blueprint for {activeCropMaster.name}
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Detailed execution guide from field preparation to harvesting for your {landSizeInput} {landUnit} in {selectedState}.</p>
              </div>

              <div className="space-y-6">
                {tasks.map((t, idx) => (
                  <div key={t.id} className="bg-gray-50 dark:bg-white/5 p-5 md:p-6 rounded-2xl border border-gray-200 dark:border-white/10 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-7 h-7 bg-emerald-600 text-white font-black text-xs rounded-xl flex items-center justify-center shadow-md">
                        {idx + 1}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-0.5 rounded-md">
                        📅 {t.formattedDate} (Day {t.dayOffset})
                      </span>
                      <span className="text-[10px] font-bold text-gray-400">Phase: {t.phase}</span>
                    </div>

                    <h4 className="text-base font-black text-gray-900 dark:text-white">{t.title}</h4>
                    <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{t.description}</p>

                    <div className="bg-white dark:bg-[#16171f] p-4 rounded-xl border border-emerald-200 dark:border-emerald-800/40 space-y-1">
                      <span className="text-xs font-black text-emerald-800 dark:text-emerald-300 block">🛠️ Step-by-Step Instructions (How to do):</span>
                      <p className="text-xs text-gray-800 dark:text-gray-200 font-medium whitespace-pre-line leading-relaxed">{t.howToDoInstructions}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CROP CARE, FERTILIZER & PEST DEFENSE */}
          {planTab === "fertilizers" && (
            <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-6">
              <div className="border-b border-gray-100 dark:border-white/10 pb-4">
                <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <Shield className="w-6 h-6 text-emerald-600" />
                  Crop Care, Fertilizer Schedule & Disease Defense
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Exact fertilizer dosages per acre, nutrient timings, and bio-pesticide spray recipes for {activeCropMaster.name}.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.filter(t => t.type === "fertilizer" || t.type === "pest" || t.type === "soil").map((t) => {
                  const style = getTypeStyle(t.type);
                  return (
                    <div key={t.id} className={`p-6 rounded-2xl border-2 space-y-4 ${style.bg}`}>
                      <div className="flex justify-between items-center">
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-md ${style.badgeBg}`}>{style.label}</span>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Day {t.dayOffset} ({t.formattedDate})</span>
                      </div>

                      <h4 className="text-base font-black">{t.title}</h4>

                      {t.exactDosage && (
                        <div className="bg-white/80 dark:bg-black/30 p-3 rounded-xl text-xs font-bold text-purple-900 dark:text-purple-200 border border-purple-200">
                          🧪 Exact Recommended Dosage: <strong>{t.exactDosage}</strong>
                        </div>
                      )}

                      {t.howToTakeCareTips && (
                        <div className="bg-amber-100/80 dark:bg-amber-950/50 p-3.5 rounded-xl text-xs font-semibold text-amber-950 dark:text-amber-200 border border-amber-300 space-y-1">
                          <span className="font-black flex items-center gap-1"><Lightbulb className="w-4 h-4 text-yellow-500" /> Crop Care Advisory:</span>
                          <p className="text-xs italic font-medium">{t.howToTakeCareTips}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: FULL ACTION CHECKLIST */}
          {planTab === "checklist" && (
            <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-6">
              <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Full Season Duty Checklist ({tasks.length} Tasks)</h3>
                  <p className="text-xs text-gray-500 font-medium">Check off tasks as you perform them on your farm.</p>
                </div>
                <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1 rounded-xl">{progressPercent}% Progress</span>
              </div>

              <div className="space-y-3">
                {tasks.map(t => (
                  <div key={t.id} className="p-4 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleTaskCompletion(t.id)} className="p-1 text-emerald-600">
                        {t.isCompleted ? <CheckCircle2 className="w-6 h-6 fill-emerald-100" /> : <Square className="w-6 h-6 text-gray-400" />}
                      </button>
                      <div>
                        <h4 className={`font-black ${t.isCompleted ? "line-through text-gray-400" : "text-gray-900 dark:text-white"}`}>{t.title}</h4>
                        <span className="text-[10px] text-gray-400">Scheduled: {t.formattedDate} (Day {t.dayOffset})</span>
                      </div>
                    </div>

                    <button onClick={() => toggleTaskCompletion(t.id)} className={`px-3 py-1.5 rounded-xl font-black ${t.isCompleted ? "bg-gray-200 text-gray-700" : "bg-emerald-600 text-white"}`}>
                      {t.isCompleted ? "Completed ✅" : "Mark Done"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </motion.div>
      )}

    </div>
  );
}
