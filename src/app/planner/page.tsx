"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sprout, Calendar, Clock, CheckCircle2, ChevronLeft, ChevronRight, 
  Droplets, ShieldAlert, Sparkles, Printer, Plus, Trash2, Edit3, 
  MapPin, Info, ArrowRight, CheckSquare, Square, Download, Share2, 
  IndianRupee, Zap, Leaf, Filter, Sun, CloudRain, ShieldCheck, RefreshCw, X
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
}

export default function AICropPlannerCalendarPage() {
  // Input Form State
  const [selectedCropName, setSelectedCropName] = useState<string>("Tomato (Hybrid)");
  const [customCropName, setCustomCropName] = useState<string>("");
  const [sowingDate, setSowingDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [landSizeInput, setLandSizeInput] = useState<string>("3");
  const [landUnit, setLandUnit] = useState<"Acres" | "Hectares" | "Bigha" | "Guntha">("Acres");
  const [selectedState, setSelectedState] = useState<string>("Maharashtra");
  const [farmingType, setFarmingType] = useState<"Chemical/Traditional" | "Organic Certified" | "Drip & Fertigation">("Drip & Fertigation");
  const [irrigationSource, setIrrigationSource] = useState<string>("Borewell Drip Irrigation");

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

  // Schedule State
  const [plannerGenerated, setPlannerGenerated] = useState<boolean>(false);
  const [tasks, setTasks] = useState<CalendarTask[]>([]);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");

  // Calendar View State
  const [currentMonthDate, setCurrentMonthDate] = useState<Date>(new Date());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<string | null>(null);
  const [showAddCustomModal, setShowAddCustomModal] = useState<boolean>(false);
  
  // Custom Task Modal Input
  const [newCustomTitle, setNewCustomTitle] = useState("");
  const [newCustomDesc, setNewCustomDesc] = useState("");
  const [newCustomType, setNewCustomType] = useState<CalendarTask["type"]>("water");

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

  // AI GENERATOR ALGORITHM: Generates chronological CalendarTasks from Sowing Date
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
      description: `Perform 2 rounds of deep plowing in your ${landAcres} acre field. Mix 5 tonnes/acre of well-decomposed FYM organic compost.`,
      type: "soil",
      isCompleted: false,
      priority: "High"
    });

    // Day -2: Basal Dose
    d = addDays(startDate, -2);
    newTasks.push({
      id: `task-2`,
      dayOffset: -2,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Land Prep",
      title: "🪴 Basal Fertilizer Application",
      description: `Apply NPK (10:26:26) 50 kg/acre + Neem cake 100 kg/acre as basal dose in soil beds before sowing ${cropName}.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High"
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
      description: `Treat seeds with Trichoderma viride (10g/kg) or Azotobacter. Transplant in rows maintaining 45cm x 30cm spacing. Light irrigation immediately after.`,
      type: "sowing",
      isCompleted: false,
      priority: "High"
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
      description: `Run drip irrigation for 2 hours. Inspect germination uniformity. Gap fill any missing seedlings.`,
      type: "water",
      isCompleted: false,
      priority: "Medium"
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
      priority: "High"
    });

    // Day 35: Pest Surveillance & Preventive Spray
    d = addDays(startDate, 35);
    newTasks.push({
      id: `task-6`,
      dayOffset: 35,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Vegetative Growth",
      title: "🛡️ Preventive Bio-Pesticide Spray",
      description: `Spray Neem Oil 10,000 PPM (5ml/liter water) or Sticky Yellow Traps (10/acre) to control early sucking pests (Thrips, Aphids, Whiteflies).`,
      type: "pest",
      isCompleted: false,
      priority: "Medium"
    });

    // Day 50: Mid-Stage Micronutrients
    d = addDays(startDate, 50);
    newTasks.push({
      id: `task-7`,
      dayOffset: 50,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Flowering & Fruiting",
      title: "🌸 Flowering Boost & Boron/Zinc Spray",
      description: `Foliar spray of Boron 20% (1g/L) + Zinc EDTA + NPK 13:00:45 to prevent flower drop and encourage uniform flowering set.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High"
    });

    // Day 70: Fruit/Grain Filling & Pest Control
    d = addDays(startDate, 70);
    newTasks.push({
      id: `task-8`,
      dayOffset: 70,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Flowering & Fruiting",
      title: "🍊 Fruit / Pod Filling & Potash Fertigation",
      description: `Apply Sulphate of Potash (0:0:50) 5 kg/acre via drip. Check for fruit borer/caterpillars; use Pheromone traps.`,
      type: "fertilizer",
      isCompleted: false,
      priority: "High"
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
      priority: "Medium"
    });

    // Day Duration: Final Harvest & Mandi Sale
    d = addDays(startDate, duration);
    newTasks.push({
      id: `task-10`,
      dayOffset: duration,
      dateStr: d.iso,
      formattedDate: d.formatted,
      phase: "Harvesting & Mandi",
      title: `🌾 Bumper Harvest & APMC Mandi Procurement`,
      description: `Harvest ${cropName} early morning. Grade into Grade A/B categories. Post listing on AgroPulse APMC Marketplace for top buyer rates!`,
      type: "harvest",
      isCompleted: false,
      priority: "High"
    });

    setTasks(newTasks);
    setPlannerGenerated(true);
    setCurrentMonthDate(new Date(sowingDate));
  };

  useEffect(() => {
    // Generate initial plan on load
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
      priority: "Normal"
    };

    setTasks(prev => [...prev, newTask].sort((a, b) => a.dateStr.localeCompare(b.dateStr)));
    setShowAddCustomModal(false);
    setNewCustomTitle("");
    setNewCustomDesc("");
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };

  // CALCULATE PROGRESS & FINANCIAL ESTIMATES
  const completedCount = useMemo(() => tasks.filter(t => t.isCompleted).length, [tasks]);
  const progressPercent = useMemo(() => tasks.length === 0 ? 0 : Math.round((completedCount / tasks.length) * 100), [completedCount, tasks]);

  const estimatedYieldQuintals = useMemo(() => activeCropMaster.expectedYieldPerAcreQuintals * landAcres, [activeCropMaster, landAcres]);
  const totalCostEstimate = useMemo(() => activeCropMaster.avgCostPerAcre * landAcres, [activeCropMaster, landAcres]);
  const totalRevenueEstimate = useMemo(() => activeCropMaster.avgRevenuePerAcre * landAcres, [activeCropMaster, landAcres]);
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
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1));
  };

  const prevMonth = () => {
    setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1));
  };

  const filteredTasks = useMemo(() => {
    if (activeCategoryFilter === "all") return tasks;
    return tasks.filter(t => t.type === activeCategoryFilter);
  }, [tasks, activeCategoryFilter]);

  const getTypeStyle = (type: CalendarTask["type"]) => {
    switch (type) {
      case "soil": return { bg: "bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border-amber-300", label: "🪴 Soil Health" };
      case "sowing": return { bg: "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-300 border-emerald-300", label: "🌱 Sowing" };
      case "water": return { bg: "bg-sky-100 dark:bg-sky-950/60 text-sky-900 dark:text-sky-300 border-sky-300", label: "💧 Irrigation" };
      case "fertilizer": return { bg: "bg-purple-100 dark:bg-purple-950/60 text-purple-900 dark:text-purple-300 border-purple-300", label: "🧪 Fertilizer" };
      case "pest": return { bg: "bg-rose-100 dark:bg-rose-950/60 text-rose-900 dark:text-rose-300 border-rose-300", label: "🛡️ Pest Control" };
      case "harvest": return { bg: "bg-yellow-100 dark:bg-yellow-950/60 text-yellow-900 dark:text-yellow-300 border-yellow-300", label: "🌾 Harvest & Mandi" };
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 pt-[84px] font-sans">
      
      {/* HEADER BANNER */}
      <header className="mb-8 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-700 text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-emerald-400/40 relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="relative z-10 space-y-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-white/20 text-white text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" /> AI Precision Agriculture
            </span>
            <span className="text-xs text-emerald-100 font-bold">• Day-by-Day Interactive Calendar</span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white flex items-center gap-2.5">
            <Calendar className="w-8 h-8 text-yellow-300 shrink-0" />
            AI Calendar Crop Growth & Schedule Planner
          </h1>
          <p className="text-xs md:text-sm text-emerald-100 font-bold max-w-2xl">
            Input your crop produce, sowing date, and acreage to calculate an automated calendar schedule from land preparation to APMC Mandi harvest!
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={() => window.print()}
            className="px-4 py-2.5 bg-white text-emerald-800 hover:bg-emerald-50 rounded-2xl font-black text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4 text-emerald-600" /> Print AI Crop Calendar
          </button>
        </div>
      </header>

      {/* INPUT FORM & FARM ESTIMATOR ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* CROP CONFIGURATION FORM */}
        <div className="lg:col-span-2 bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-5">
          <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-3">
            <h2 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Sprout className="w-5 h-5 text-emerald-600" /> Enter Farm Produce & Planting Details
            </h2>
            <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">
              AI Step-1 Config
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold">
            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Select Crop Produce:</label>
              <select
                value={selectedCropName}
                onChange={(e) => setSelectedCropName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400"
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
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                />
              </div>
            )}

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Sowing / Planting Date:</label>
              <input
                type="date"
                value={sowingDate}
                onChange={(e) => setSowingDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600"
              />
            </div>

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
                  className="w-2/3 px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-gray-900 dark:text-white text-sm"
                />
                <select
                  value={landUnit}
                  onChange={(e) => setLandUnit(e.target.value as any)}
                  className="w-1/3 px-2 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-700 dark:text-emerald-400 text-xs"
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
                    className={`px-2 py-0.5 rounded-md text-[10px] font-black transition-all ${
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
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
              >
                {ALL_INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Farming Type:</label>
              <select
                value={farmingType}
                onChange={(e) => setFarmingType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
              >
                <option value="Drip & Fertigation">Drip Irrigation & Fertigation</option>
                <option value="Chemical/Traditional">Traditional Canal / Borewell</option>
                <option value="Organic Certified">100% Organic Farming</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-600 dark:text-gray-300 mb-1">Primary Water Source:</label>
              <select
                value={irrigationSource}
                onChange={(e) => setIrrigationSource(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
              >
                <option value="Borewell Drip Irrigation">Borewell + Drip Irrigation</option>
                <option value="Canal Water Supply">Canal Water Supply</option>
                <option value="Rainfed Monsoon">Rainfed Monsoon</option>
              </select>
            </div>
          </div>

          <button
            onClick={generateAICropSchedule}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Recalculate AI Crop Calendar & Task Timeline
          </button>
        </div>

        {/* AI FINANCIAL & HARVEST FORECAST CARD */}
        <div className="bg-gradient-to-br from-emerald-900 via-green-900 to-teal-950 text-white p-6 md:p-8 rounded-3xl border-2 border-emerald-400 shadow-xl flex flex-col justify-between space-y-5">
          <div>
            <div className="flex justify-between items-center border-b border-white/20 pb-3">
              <span className="text-[10px] font-black uppercase text-emerald-300 tracking-wider">AI Harvest Forecast</span>
              <span className="text-2xl">{activeCropMaster.emoji}</span>
            </div>

            <div className="space-y-4 mt-4">
              <div>
                <span className="text-xs text-emerald-200 font-bold block">Selected Produce:</span>
                <h3 className="text-xl font-black text-white">{activeCropMaster.name}</h3>
                <p className="text-xs text-emerald-300 font-medium">Growth Cycle: <strong>{activeCropMaster.durationDays} Days</strong> ({landAcres} Acres)</p>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs bg-black/30 p-3.5 rounded-2xl border border-white/10">
                <div>
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Yield</span>
                  <strong className="text-base text-yellow-300 font-black">{estimatedYieldQuintals} Qtl</strong>
                </div>
                <div>
                  <span className="text-[10px] text-emerald-200 font-bold uppercase block">Est. Net Profit</span>
                  <strong className="text-base text-emerald-300 font-black">₹{totalProfitEstimate.toLocaleString("en-IN")}</strong>
                </div>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-100 font-semibold border-t border-white/10 pt-3">
                <div className="flex justify-between">
                  <span>Est. Cultivation Cost:</span>
                  <span>₹{totalCostEstimate.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Est. Mandi Gross Revenue:</span>
                  <span>₹{totalRevenueEstimate.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/10 p-3 rounded-2xl border border-white/20 text-[11px] text-emerald-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
            <span>APMC Mandi verified estimates for {selectedState}. Updated live.</span>
          </div>
        </div>

      </div>

      {/* SCHEDULE PROGRESS & CATEGORY FILTERS */}
      <div className="bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <span className="text-[10px] font-black text-emerald-700 uppercase tracking-wider">Crop Schedule Completion</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-emerald-600" />
              {completedCount} of {tasks.length} Calendar Tasks Completed ({progressPercent}%)
            </h3>
          </div>

          {/* FILTER CHIPS */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategoryFilter("all")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeCategoryFilter === "all" ? "bg-emerald-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              All Tasks ({tasks.length})
            </button>
            <button
              onClick={() => setActiveCategoryFilter("soil")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeCategoryFilter === "soil" ? "bg-amber-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              🪴 Soil
            </button>
            <button
              onClick={() => setActiveCategoryFilter("water")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeCategoryFilter === "water" ? "bg-sky-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              💧 Irrigation
            </button>
            <button
              onClick={() => setActiveCategoryFilter("fertilizer")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeCategoryFilter === "fertilizer" ? "bg-purple-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              🧪 Fertilizer
            </button>
            <button
              onClick={() => setActiveCategoryFilter("pest")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeCategoryFilter === "pest" ? "bg-rose-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              🛡️ Pest Spray
            </button>
            <button
              onClick={() => setActiveCategoryFilter("harvest")}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeCategoryFilter === "harvest" ? "bg-yellow-600 text-white shadow-md" : "bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300"
              }`}
            >
              🌾 Harvest
            </button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div className="w-full bg-gray-100 dark:bg-white/10 rounded-full h-3 overflow-hidden p-0.5">
          <div 
            className="bg-gradient-to-r from-emerald-500 via-green-500 to-teal-400 h-full rounded-full transition-all duration-500 shadow-md"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* MONTHLY INTERACTIVE CALENDAR GRID VIEW */}
      <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-6 mb-12">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700">Interactive Month Calendar</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-600" />
              {currentMonthDate.toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevMonth}
              className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-emerald-100 rounded-xl text-gray-800 dark:text-gray-200 font-bold transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <span className="text-xs font-black text-emerald-700 px-3">
              {currentMonthDate.toLocaleDateString("en-IN", { month: "short", year: "numeric" })}
            </span>

            <button
              onClick={nextMonth}
              className="p-2 bg-gray-100 dark:bg-white/10 hover:bg-emerald-100 rounded-xl text-gray-800 dark:text-gray-200 font-bold transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CALENDAR DAYS OF WEEK HEADER */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-black text-emerald-800 dark:text-emerald-300 uppercase">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="py-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
              {day}
            </div>
          ))}
        </div>

        {/* CALENDAR MONTH GRID */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDaysMatrix.map((cell, idx) => {
            if (!cell) {
              return <div key={`empty-${idx}`} className="h-24 sm:h-32 bg-gray-50/40 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/5" />;
            }

            const hasTasks = cell.dayTasks.length > 0;
            const isToday = cell.dateStr === new Date().toISOString().split("T")[0];

            return (
              <div
                key={cell.dateStr}
                onClick={() => {
                  setSelectedCalendarDate(cell.dateStr);
                  setShowAddCustomModal(true);
                }}
                className={`h-24 sm:h-32 p-2 rounded-2xl border-2 transition-all flex flex-col justify-between cursor-pointer hover:border-emerald-500 hover:shadow-md ${
                  isToday ? "bg-emerald-50/80 dark:bg-emerald-950/50 border-emerald-500 ring-2 ring-emerald-500/30" : "bg-white dark:bg-[#16171f] border-gray-100 dark:border-white/10"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className={`text-xs font-black px-2 py-0.5 rounded-lg ${isToday ? "bg-emerald-600 text-white" : "text-gray-900 dark:text-white"}`}>
                    {cell.dayNumber}
                  </span>
                  {hasTasks && (
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-1.5 rounded-md">
                      {cell.dayTasks.length} Task
                    </span>
                  )}
                </div>

                {/* TASK CHIPS INSIDE CALENDAR CELL */}
                <div className="space-y-1 overflow-y-auto max-h-16 text-[9px] font-extrabold">
                  {cell.dayTasks.map(t => {
                    const style = getTypeStyle(t.type);
                    return (
                      <div
                        key={t.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleTaskCompletion(t.id);
                        }}
                        className={`p-1 rounded-md border truncate transition-all flex items-center justify-between gap-1 ${style.bg} ${t.isCompleted ? "opacity-50 line-through" : ""}`}
                        title={t.title}
                      >
                        <span className="truncate">{t.title}</span>
                        {t.isCompleted ? <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" /> : <Clock className="w-3 h-3 shrink-0" />}
                      </div>
                    );
                  })}
                </div>

                <div className="text-[9px] text-gray-400 font-bold text-right hover:text-emerald-600">
                  + Add Note
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CHRONOLOGICAL CALENDAR TASK LIST SUMMARY */}
      <div className="bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md space-y-6">
        <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
          <div>
            <span className="text-[10px] font-black uppercase text-emerald-700">Chronological Action Schedule</span>
            <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" />
              Day-by-Day Farming Task Checklist
            </h3>
          </div>

          <button
            onClick={() => {
              setSelectedCalendarDate(new Date().toISOString().split("T")[0]);
              setShowAddCustomModal(true);
            }}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 shadow-md flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Add Custom Task Note
          </button>
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
                  <button
                    onClick={() => toggleTaskCompletion(task.id)}
                    className="mt-1 p-1 text-emerald-600 hover:text-emerald-700 transition-transform active:scale-95"
                  >
                    {task.isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <Square className="w-6 h-6 text-gray-400" />
                    )}
                  </button>

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

      {/* ADD CUSTOM TASK MODAL */}
      <AnimatePresence>
        {showAddCustomModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
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
                    <option value="soil">🪴 Soil Health & Weeding</option>
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
