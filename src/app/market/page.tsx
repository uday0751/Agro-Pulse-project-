"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, MapPin, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, 
  X, Globe, Sprout, Info, Calendar, DollarSign, Droplets, ChevronRight, RefreshCw, BarChart2, Zap, Calculator, Landmark, ShieldCheck, ArrowRightLeft, Scale, Award, Eye, SlidersHorizontal, ArrowUpDown, AlertCircle, LineChart as LineChartIcon, ShoppingCart, Check
} from "lucide-react";
import Link from "next/link";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from "recharts";

export interface StatePriceDetail {
  state: string;
  district: string;
  mandiName: string;
  privatePrice: number;
  arrivalQuantity: string;
  trend: "up" | "down";
}

export interface CropItem {
  id: number;
  name: string;
  scientificName: string;
  category: "Cereals & Grains" | "Pulses & Legumes" | "Oilseeds" | "Vegetables" | "Fruits" | "Spices & Herbs" | "Commercial & Plantation";
  iconEmoji: string;
  state: string;
  district: string;
  mandiName: string;
  govt: number; // ₹/quintal (Govt MSP)
  private: number; // ₹/quintal (Private Mandi Rate)
  trend: "up" | "down";
  globalRegion: string;
  season: string;
  durationDays: string;
  avgYieldPerAcre: string;
  costPerAcre: number;
  demandLevel: "High" | "Moderate" | "Extremely High";
  soilType: string;
  moistureContent: string;
  qualityGrade: "Grade A Organic" | "Export Quality Premium" | "Grade A Superior" | "Standard Quality";
  lastUpdated: string;
  history: { month: string; govt: number; private: number }[];
  statePrices: StatePriceDetail[];
  isAvailable?: boolean;
}

export const ALL_INDIAN_STATES = [
  "All States",
  "Andhra Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu & Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi"
];

// EXHAUSTIVE MASTER DATABASE OF ALL CROPS, FRUITS, & VEGETABLES
export const COMPREHENSIVE_CROPS_DATABASE: CropItem[] = [
  // ─── CEREALS & GRAINS ───────────────────────────────────────────
  { id:1, name:"Wheat (Lokwan / Sharbati)", scientificName:"Triticum aestivum", category:"Cereals & Grains", iconEmoji:"🌾", state:"Punjab", district:"Ludhiana", mandiName:"Ludhiana Grain Market", govt:2275, private:2650, trend:"up", globalRegion:"India, USA, Russia", season:"Rabi", durationDays:"110-130 Days", avgYieldPerAcre:"18-22 Quintals", costPerAcre:18000, demandLevel:"High", soilType:"Loamy & Alluvial", moistureContent:"11.2%", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2100,private:2200},{month:"Feb",govt:2150,private:2300},{month:"Mar",govt:2150,private:2450},{month:"Apr",govt:2275,private:2500},{month:"May",govt:2275,private:2580},{month:"Jun",govt:2275,private:2650}], statePrices:[{state:"Punjab",district:"Ludhiana",mandiName:"Ludhiana Yard",privatePrice:2650,arrivalQuantity:"9,200 Quintals",trend:"up"},{state:"Haryana",district:"Karnal",mandiName:"Karnal APMC",privatePrice:2580,arrivalQuantity:"7,400 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Kanpur",mandiName:"Kanpur APMC",privatePrice:2490,arrivalQuantity:"6,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Ujjain",mandiName:"Ujjain Mandi",privatePrice:2680,arrivalQuantity:"5,800 Quintals",trend:"up"},{state:"Rajasthan",district:"Jaipur",mandiName:"Jaipur APMC",privatePrice:2520,arrivalQuantity:"4,100 Quintals",trend:"up"},{state:"Bihar",district:"Patna",mandiName:"Patna Yard",privatePrice:2410,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Maharashtra",district:"Pune",mandiName:"Baramati APMC",privatePrice:2550,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Gujarat",district:"Ahmedabad",mandiName:"Ahmedabad APMC",privatePrice:2600,arrivalQuantity:"2,500 Quintals",trend:"up"}] },
  { id:2, name:"Rice - Basmati 1121", scientificName:"Oryza sativa", category:"Cereals & Grains", iconEmoji:"🌾", state:"Haryana", district:"Karnal", mandiName:"Karnal APMC", govt:2183, private:4620, trend:"up", globalRegion:"India, Pakistan", season:"Kharif", durationDays:"135-145 Days", avgYieldPerAcre:"18-22 Quintals", costPerAcre:24000, demandLevel:"Extremely High", soilType:"Clayey Alluvial", moistureContent:"12.0%", qualityGrade:"Grade A Organic", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2000,private:3800},{month:"Feb",govt:2050,private:4000},{month:"Mar",govt:2100,private:4200},{month:"Apr",govt:2183,private:4350},{month:"May",govt:2183,private:4480},{month:"Jun",govt:2183,private:4620}], statePrices:[{state:"Haryana",district:"Karnal",mandiName:"Karnal APMC",privatePrice:4620,arrivalQuantity:"8,400 Quintals",trend:"up"},{state:"Punjab",district:"Amritsar",mandiName:"Amritsar Mandi",privatePrice:4550,arrivalQuantity:"9,200 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Meerut",mandiName:"Meerut Yard",privatePrice:4210,arrivalQuantity:"5,100 Quintals",trend:"up"},{state:"West Bengal",district:"Kolkata",mandiName:"Kolkata APMC",privatePrice:3980,arrivalQuantity:"6,200 Quintals",trend:"up"},{state:"Bihar",district:"Purnea",mandiName:"Purnea APMC",privatePrice:3850,arrivalQuantity:"4,800 Quintals",trend:"up"},{state:"Odisha",district:"Cuttack",mandiName:"Cuttack APMC",privatePrice:3750,arrivalQuantity:"3,900 Quintals",trend:"up"}] },
  { id:3, name:"Rice - Non-Basmati (Common)", scientificName:"Oryza sativa", category:"Cereals & Grains", iconEmoji:"🌾", state:"West Bengal", district:"Bardhaman", mandiName:"Bardhaman APMC", govt:2183, private:2450, trend:"up", globalRegion:"Asia", season:"Kharif", durationDays:"120 Days", avgYieldPerAcre:"20-25 Quintals", costPerAcre:18000, demandLevel:"Extremely High", soilType:"Alluvial Clay", moistureContent:"12.5%", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2000,private:2100},{month:"Feb",govt:2050,private:2180},{month:"Mar",govt:2100,private:2250},{month:"Apr",govt:2183,private:2320},{month:"May",govt:2183,private:2390},{month:"Jun",govt:2183,private:2450}], statePrices:[{state:"West Bengal",district:"Bardhaman",mandiName:"Bardhaman APMC",privatePrice:2450,arrivalQuantity:"12,000 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Varanasi",mandiName:"Varanasi Yard",privatePrice:2380,arrivalQuantity:"8,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:2420,arrivalQuantity:"9,200 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Thanjavur",mandiName:"Thanjavur APMC",privatePrice:2400,arrivalQuantity:"10,500 Quintals",trend:"up"},{state:"Bihar",district:"Arrah",mandiName:"Arrah APMC",privatePrice:2310,arrivalQuantity:"5,400 Quintals",trend:"up"},{state:"Odisha",district:"Balasore",mandiName:"Balasore APMC",privatePrice:2290,arrivalQuantity:"4,800 Quintals",trend:"up"},{state:"Karnataka",district:"Mandya",mandiName:"Mandya APMC",privatePrice:2360,arrivalQuantity:"5,100 Quintals",trend:"up"},{state:"Kerala",district:"Palakkad",mandiName:"Palakkad APMC",privatePrice:2480,arrivalQuantity:"3,200 Quintals",trend:"up"}] },
  { id:4, name:"Maize / Corn", scientificName:"Zea mays", category:"Cereals & Grains", iconEmoji:"🌽", state:"Bihar", district:"Purnea", mandiName:"Purnea APMC", govt:2090, private:2380, trend:"up", globalRegion:"Global", season:"Kharif & Rabi", durationDays:"100 Days", avgYieldPerAcre:"25 Quintals", costPerAcre:15000, demandLevel:"High", soilType:"Heavy Soil", moistureContent:"13.0%", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:1962,private:2100},{month:"Feb",govt:2000,private:2180},{month:"Mar",govt:2090,private:2240},{month:"Apr",govt:2090,private:2290},{month:"May",govt:2090,private:2340},{month:"Jun",govt:2090,private:2380}], statePrices:[{state:"Bihar",district:"Purnea",mandiName:"Purnea APMC",privatePrice:2380,arrivalQuantity:"8,200 Quintals",trend:"up"},{state:"Karnataka",district:"Davangere",mandiName:"Davangere Yard",privatePrice:2340,arrivalQuantity:"6,400 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Nizamabad",mandiName:"Nizamabad APMC",privatePrice:2310,arrivalQuantity:"5,800 Quintals",trend:"up"},{state:"Rajasthan",district:"Bhilwara",mandiName:"Bhilwara APMC",privatePrice:2290,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Sehore",mandiName:"Sehore APMC",privatePrice:2360,arrivalQuantity:"4,100 Quintals",trend:"up"},{state:"Maharashtra",district:"Jalna",mandiName:"Jalna APMC",privatePrice:2320,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Gujarat",district:"Banaskantha",mandiName:"Deesa APMC",privatePrice:2400,arrivalQuantity:"2,900 Quintals",trend:"up"}] },
  { id:5, name:"Jowar (Sorghum)", scientificName:"Sorghum bicolor", category:"Cereals & Grains", iconEmoji:"🌾", state:"Maharashtra", district:"Solapur", mandiName:"Solapur APMC", govt:3180, private:3450, trend:"up", globalRegion:"India, Africa", season:"Kharif & Rabi", durationDays:"120 Days", avgYieldPerAcre:"12-15 Quintals", costPerAcre:12000, demandLevel:"Moderate", soilType:"Black Cotton Soil", moistureContent:"12.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2800,private:3000},{month:"Feb",govt:2900,private:3100},{month:"Mar",govt:3000,private:3200},{month:"Apr",govt:3100,private:3300},{month:"May",govt:3180,private:3400},{month:"Jun",govt:3180,private:3450}], statePrices:[{state:"Maharashtra",district:"Solapur",mandiName:"Solapur APMC",privatePrice:3450,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Barmer",mandiName:"Barmer Mandi",privatePrice:3380,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Karnataka",district:"Bijapur",mandiName:"Bijapur Yard",privatePrice:3320,arrivalQuantity:"3,100 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Banda",mandiName:"Banda APMC",privatePrice:3280,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Nimar",mandiName:"Khandwa APMC",privatePrice:3360,arrivalQuantity:"2,500 Quintals",trend:"up"}] },
  { id:6, name:"Bajra (Pearl Millet)", scientificName:"Pennisetum glaucum", category:"Cereals & Grains", iconEmoji:"🌾", state:"Rajasthan", district:"Jodhpur", mandiName:"Jodhpur APMC", govt:2500, private:2780, trend:"up", globalRegion:"India, Africa", season:"Kharif", durationDays:"90 Days", avgYieldPerAcre:"10-14 Quintals", costPerAcre:10000, demandLevel:"Moderate", soilType:"Sandy Loam", moistureContent:"11.5%", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2300,private:2400},{month:"Feb",govt:2350,private:2480},{month:"Mar",govt:2400,private:2560},{month:"Apr",govt:2500,private:2630},{month:"May",govt:2500,private:2710},{month:"Jun",govt:2500,private:2780}], statePrices:[{state:"Rajasthan",district:"Jodhpur",mandiName:"Jodhpur APMC",privatePrice:2780,arrivalQuantity:"6,500 Quintals",trend:"up"},{state:"Gujarat",district:"Mehsana",mandiName:"Unjha APMC",privatePrice:2840,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Haryana",district:"Bhiwani",mandiName:"Bhiwani Mandi",privatePrice:2700,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Agra",mandiName:"Agra APMC",privatePrice:2650,arrivalQuantity:"2,900 Quintals",trend:"up"},{state:"Maharashtra",district:"Aurangabad",mandiName:"Aurangabad APMC",privatePrice:2720,arrivalQuantity:"2,100 Quintals",trend:"up"}] },
  { id:7, name:"Barley (Jau)", scientificName:"Hordeum vulgare", category:"Cereals & Grains", iconEmoji:"🌾", state:"Uttar Pradesh", district:"Agra", mandiName:"Agra APMC", govt:1735, private:2050, trend:"up", globalRegion:"India, Russia, Canada", season:"Rabi", durationDays:"100 Days", avgYieldPerAcre:"14-16 Quintals", costPerAcre:12000, demandLevel:"Moderate", soilType:"Sandy Loam", moistureContent:"12.0%", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:1600,private:1750},{month:"Feb",govt:1650,private:1850},{month:"Mar",govt:1700,private:1920},{month:"Apr",govt:1735,private:1980},{month:"May",govt:1735,private:2020},{month:"Jun",govt:1735,private:2050}], statePrices:[{state:"Uttar Pradesh",district:"Agra",mandiName:"Agra APMC",privatePrice:2050,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Jaipur",mandiName:"Jaipur APMC",privatePrice:2080,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Haryana",district:"Rohtak",mandiName:"Rohtak Mandi",privatePrice:2100,arrivalQuantity:"2,400 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Gwalior",mandiName:"Gwalior APMC",privatePrice:1980,arrivalQuantity:"1,800 Quintals",trend:"up"}] },
  { id:8, name:"Ragi (Finger Millet)", scientificName:"Eleusine coracana", category:"Cereals & Grains", iconEmoji:"🌾", state:"Karnataka", district:"Hassan", mandiName:"Hassan APMC", govt:3846, private:4200, trend:"up", globalRegion:"India, Africa", season:"Kharif", durationDays:"110 Days", avgYieldPerAcre:"10-12 Quintals", costPerAcre:11000, demandLevel:"Moderate", soilType:"Red Laterite Soil", moistureContent:"12.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:3500,private:3700},{month:"Feb",govt:3600,private:3850},{month:"Mar",govt:3700,private:3950},{month:"Apr",govt:3800,private:4050},{month:"May",govt:3846,private:4130},{month:"Jun",govt:3846,private:4200}], statePrices:[{state:"Karnataka",district:"Hassan",mandiName:"Hassan APMC",privatePrice:4200,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:4050,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Salem",mandiName:"Salem APMC",privatePrice:4100,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Nashik",mandiName:"Nashik APMC",privatePrice:3980,arrivalQuantity:"1,500 Quintals",trend:"up"}] },

  // ─── PULSES & LEGUMES ───────────────────────────────────────────
  { id:9, name:"Chickpea (Desi Chana)", scientificName:"Cicer arietinum", category:"Pulses & Legumes", iconEmoji:"🫘", state:"Madhya Pradesh", district:"Ujjain", mandiName:"Ujjain Mandi", govt:5440, private:5850, trend:"up", globalRegion:"India, Australia", season:"Rabi", durationDays:"120 Days", avgYieldPerAcre:"8-10 Quintals", costPerAcre:14000, demandLevel:"High", soilType:"Sandy Clay Loam", moistureContent:"10.5%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:5000,private:5200},{month:"Feb",govt:5100,private:5350},{month:"Mar",govt:5200,private:5500},{month:"Apr",govt:5440,private:5650},{month:"May",govt:5440,private:5750},{month:"Jun",govt:5440,private:5850}], statePrices:[{state:"Madhya Pradesh",district:"Ujjain",mandiName:"Ujjain Mandi",privatePrice:5850,arrivalQuantity:"8,400 Quintals",trend:"up"},{state:"Rajasthan",district:"Kota",mandiName:"Kota APMC",privatePrice:5780,arrivalQuantity:"6,200 Quintals",trend:"up"},{state:"Maharashtra",district:"Akola",mandiName:"Akola APMC",privatePrice:5820,arrivalQuantity:"5,100 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Lucknow",mandiName:"Lucknow Yard",privatePrice:5720,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Gujarat",district:"Saurashtra",mandiName:"Rajkot APMC",privatePrice:5890,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:5760,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Karnataka",district:"Bidar",mandiName:"Bidar Yard",privatePrice:5800,arrivalQuantity:"2,900 Quintals",trend:"up"},{state:"Haryana",district:"Hisar",mandiName:"Hisar Mandi",privatePrice:5810,arrivalQuantity:"2,400 Quintals",trend:"up"}] },
  { id:10, name:"Tur Dal (Pigeon Pea / Arhar)", scientificName:"Cajanus cajan", category:"Pulses & Legumes", iconEmoji:"🫘", state:"Maharashtra", district:"Latur", mandiName:"Latur APMC", govt:7000, private:7850, trend:"up", globalRegion:"India", season:"Kharif", durationDays:"150-180 Days", avgYieldPerAcre:"6-8 Quintals", costPerAcre:15000, demandLevel:"Extremely High", soilType:"Black Cotton Soil", moistureContent:"10.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:6200,private:6800},{month:"Feb",govt:6400,private:7000},{month:"Mar",govt:6600,private:7200},{month:"Apr",govt:6800,private:7450},{month:"May",govt:7000,private:7650},{month:"Jun",govt:7000,private:7850}], statePrices:[{state:"Maharashtra",district:"Latur",mandiName:"Latur APMC",privatePrice:7850,arrivalQuantity:"5,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Sagar",mandiName:"Sagar APMC",privatePrice:7780,arrivalQuantity:"4,500 Quintals",trend:"up"},{state:"Karnataka",district:"Gulbarga",mandiName:"Gulbarga Yard",privatePrice:7820,arrivalQuantity:"4,100 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Adilabad",mandiName:"Adilabad APMC",privatePrice:7750,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Gujarat",district:"Anand",mandiName:"Anand APMC",privatePrice:7900,arrivalQuantity:"2,500 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Varanasi",mandiName:"Varanasi APMC",privatePrice:7720,arrivalQuantity:"2,100 Quintals",trend:"up"}] },
  { id:11, name:"Moong Dal (Green Gram)", scientificName:"Vigna radiata", category:"Pulses & Legumes", iconEmoji:"🫘", state:"Rajasthan", district:"Jodhpur", mandiName:"Jodhpur APMC", govt:8558, private:9200, trend:"up", globalRegion:"India, South Asia", season:"Kharif", durationDays:"60-70 Days", avgYieldPerAcre:"4-5 Quintals", costPerAcre:12000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"10.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:7800,private:8200},{month:"Feb",govt:8000,private:8500},{month:"Mar",govt:8200,private:8750},{month:"Apr",govt:8400,private:8950},{month:"May",govt:8558,private:9100},{month:"Jun",govt:8558,private:9200}], statePrices:[{state:"Rajasthan",district:"Jodhpur",mandiName:"Jodhpur APMC",privatePrice:9200,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Vidisha",mandiName:"Vidisha APMC",privatePrice:9150,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Nagpur",mandiName:"Nagpur APMC",privatePrice:9100,arrivalQuantity:"2,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:9050,arrivalQuantity:"2,100 Quintals",trend:"up"},{state:"Gujarat",district:"Banaskantha",mandiName:"Palanpur APMC",privatePrice:9250,arrivalQuantity:"1,800 Quintals",trend:"up"}] },
  { id:12, name:"Masoor Dal (Red Lentil)", scientificName:"Lens culinaris", category:"Pulses & Legumes", iconEmoji:"🫘", state:"Uttar Pradesh", district:"Kanpur", mandiName:"Kanpur APMC", govt:6000, private:6850, trend:"up", globalRegion:"India, Canada", season:"Rabi", durationDays:"110 Days", avgYieldPerAcre:"5-7 Quintals", costPerAcre:12000, demandLevel:"High", soilType:"Loamy Soil", moistureContent:"11.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:5500,private:5800},{month:"Feb",govt:5700,private:6050},{month:"Mar",govt:5900,private:6350},{month:"Apr",govt:6000,private:6550},{month:"May",govt:6000,private:6700},{month:"Jun",govt:6000,private:6850}], statePrices:[{state:"Uttar Pradesh",district:"Kanpur",mandiName:"Kanpur APMC",privatePrice:6850,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Indore",mandiName:"Indore APMC",privatePrice:6800,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Bihar",district:"Bhagalpur",mandiName:"Bhagalpur Mandi",privatePrice:6750,arrivalQuantity:"2,500 Quintals",trend:"up"},{state:"West Bengal",district:"Bardhaman",mandiName:"Bardhaman APMC",privatePrice:6900,arrivalQuantity:"2,100 Quintals",trend:"up"},{state:"Rajasthan",district:"Kota",mandiName:"Kota APMC",privatePrice:6820,arrivalQuantity:"1,900 Quintals",trend:"up"}] },
  { id:13, name:"Urad Dal (Black Gram)", scientificName:"Vigna mungo", category:"Pulses & Legumes", iconEmoji:"🫘", state:"Madhya Pradesh", district:"Gwalior", mandiName:"Gwalior APMC", govt:6950, private:7600, trend:"up", globalRegion:"India, South Asia", season:"Kharif", durationDays:"70-80 Days", avgYieldPerAcre:"4-6 Quintals", costPerAcre:11000, demandLevel:"High", soilType:"Black Soil", moistureContent:"10.5%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:6400,private:6800},{month:"Feb",govt:6600,private:7000},{month:"Mar",govt:6700,private:7150},{month:"Apr",govt:6800,private:7300},{month:"May",govt:6950,private:7450},{month:"Jun",govt:6950,private:7600}], statePrices:[{state:"Madhya Pradesh",district:"Gwalior",mandiName:"Gwalior APMC",privatePrice:7600,arrivalQuantity:"3,400 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Jhansi",mandiName:"Jhansi APMC",privatePrice:7550,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Amravati",mandiName:"Amravati APMC",privatePrice:7520,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur Yard",privatePrice:7480,arrivalQuantity:"1,900 Quintals",trend:"up"},{state:"Karnataka",district:"Raichur",mandiName:"Raichur APMC",privatePrice:7560,arrivalQuantity:"1,700 Quintals",trend:"up"}] },

  // ─── OILSEEDS ───────────────────────────────────────────────────
  { id:14, name:"Soyabean (Yellow)", scientificName:"Glycine max", category:"Oilseeds", iconEmoji:"🌱", state:"Madhya Pradesh", district:"Ujjain", mandiName:"Ujjain APMC", govt:4600, private:4920, trend:"up", globalRegion:"India, USA, Brazil", season:"Kharif", durationDays:"90-100 Days", avgYieldPerAcre:"8-10 Quintals", costPerAcre:14000, demandLevel:"High", soilType:"Black Cotton Soil", moistureContent:"12.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:4200,private:4400},{month:"Feb",govt:4300,private:4550},{month:"Mar",govt:4400,private:4680},{month:"Apr",govt:4500,private:4780},{month:"May",govt:4600,private:4860},{month:"Jun",govt:4600,private:4920}], statePrices:[{state:"Madhya Pradesh",district:"Ujjain",mandiName:"Ujjain APMC",privatePrice:4920,arrivalQuantity:"9,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Latur",mandiName:"Latur APMC",privatePrice:4880,arrivalQuantity:"7,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Kota",mandiName:"Kota APMC",privatePrice:4850,arrivalQuantity:"5,500 Quintals",trend:"up"},{state:"Gujarat",district:"Rajkot",mandiName:"Rajkot APMC",privatePrice:4940,arrivalQuantity:"4,100 Quintals",trend:"up"},{state:"Karnataka",district:"Dharwad",mandiName:"Dharwad APMC",privatePrice:4900,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Adilabad",mandiName:"Adilabad APMC",privatePrice:4870,arrivalQuantity:"2,800 Quintals",trend:"up"}] },
  { id:15, name:"Mustard / Rapeseed (Sarson)", scientificName:"Brassica juncea", category:"Oilseeds", iconEmoji:"🌻", state:"Rajasthan", district:"Jaipur", mandiName:"Jaipur APMC", govt:5650, private:5980, trend:"up", globalRegion:"India, Canada", season:"Rabi", durationDays:"120-130 Days", avgYieldPerAcre:"7-9 Quintals", costPerAcre:13000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"10.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:5200,private:5400},{month:"Feb",govt:5350,private:5550},{month:"Mar",govt:5500,private:5700},{month:"Apr",govt:5650,private:5800},{month:"May",govt:5650,private:5900},{month:"Jun",govt:5650,private:5980}], statePrices:[{state:"Rajasthan",district:"Jaipur",mandiName:"Jaipur APMC",privatePrice:5980,arrivalQuantity:"12,000 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Agra",mandiName:"Agra APMC",privatePrice:5920,arrivalQuantity:"8,500 Quintals",trend:"up"},{state:"Haryana",district:"Rohtak",mandiName:"Rohtak APMC",privatePrice:5900,arrivalQuantity:"6,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Morena",mandiName:"Morena APMC",privatePrice:5950,arrivalQuantity:"4,800 Quintals",trend:"up"},{state:"Gujarat",district:"Banaskantha",mandiName:"Palanpur APMC",privatePrice:5960,arrivalQuantity:"3,600 Quintals",trend:"up"},{state:"Punjab",district:"Muktsar",mandiName:"Muktsar Mandi",privatePrice:5910,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"West Bengal",district:"Murshidabad",mandiName:"Murshidabad APMC",privatePrice:5880,arrivalQuantity:"2,100 Quintals",trend:"up"}] },
  { id:16, name:"Groundnut / Peanut", scientificName:"Arachis hypogaea", category:"Oilseeds", iconEmoji:"🥜", state:"Gujarat", district:"Junagadh", mandiName:"Junagadh APMC", govt:6377, private:6900, trend:"up", globalRegion:"India, China, USA", season:"Kharif", durationDays:"120 Days", avgYieldPerAcre:"12-15 Quintals", costPerAcre:18000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"9.0%", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:5800,private:6100},{month:"Feb",govt:5950,private:6250},{month:"Mar",govt:6100,private:6450},{month:"Apr",govt:6200,private:6600},{month:"May",govt:6377,private:6750},{month:"Jun",govt:6377,private:6900}], statePrices:[{state:"Gujarat",district:"Junagadh",mandiName:"Junagadh APMC",privatePrice:6900,arrivalQuantity:"8,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:6820,arrivalQuantity:"6,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Bikaner",mandiName:"Bikaner APMC",privatePrice:6780,arrivalQuantity:"4,100 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Tirunelveli",mandiName:"Tirunelveli APMC",privatePrice:6850,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Karnataka",district:"Bellary",mandiName:"Bellary Yard",privatePrice:6800,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Maharashtra",district:"Yavatmal",mandiName:"Yavatmal APMC",privatePrice:6750,arrivalQuantity:"2,500 Quintals",trend:"up"}] },
  { id:17, name:"Cotton (Bt Seed / Long Staple)", scientificName:"Gossypium hirsutum", category:"Oilseeds", iconEmoji:"🌿", state:"Gujarat", district:"Rajkot", mandiName:"Rajkot APMC", govt:6620, private:7180, trend:"down", globalRegion:"India, USA, China", season:"Kharif", durationDays:"180-200 Days", avgYieldPerAcre:"8-10 Quintals", costPerAcre:35000, demandLevel:"Extremely High", soilType:"Black Cotton Soil", moistureContent:"8.0%", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:6620,private:7800},{month:"Feb",govt:6620,private:7650},{month:"Mar",govt:6620,private:7500},{month:"Apr",govt:6620,private:7350},{month:"May",govt:6620,private:7250},{month:"Jun",govt:6620,private:7180}], statePrices:[{state:"Gujarat",district:"Rajkot",mandiName:"Rajkot APMC",privatePrice:7180,arrivalQuantity:"6,800 Quintals",trend:"down"},{state:"Maharashtra",district:"Akola",mandiName:"Akola APMC",privatePrice:7050,arrivalQuantity:"5,400 Quintals",trend:"down"},{state:"Telangana",district:"Warangal",mandiName:"Warangal APMC",privatePrice:7100,arrivalQuantity:"4,200 Quintals",trend:"down"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:7120,arrivalQuantity:"3,800 Quintals",trend:"down"},{state:"Madhya Pradesh",district:"Khargone",mandiName:"Khargone APMC",privatePrice:7020,arrivalQuantity:"3,200 Quintals",trend:"down"},{state:"Punjab",district:"Bathinda",mandiName:"Bathinda APMC",privatePrice:7200,arrivalQuantity:"2,800 Quintals",trend:"down"},{state:"Haryana",district:"Sirsa",mandiName:"Sirsa Mandi",privatePrice:7150,arrivalQuantity:"2,400 Quintals",trend:"down"},{state:"Karnataka",district:"Dharwad",mandiName:"Dharwad Yard",privatePrice:7080,arrivalQuantity:"2,100 Quintals",trend:"down"}] },
  { id:18, name:"Sunflower Seeds", scientificName:"Helianthus annuus", category:"Oilseeds", iconEmoji:"🌻", state:"Karnataka", district:"Bijapur", mandiName:"Bijapur Yard", govt:6015, private:6450, trend:"up", globalRegion:"India, Ukraine", season:"Rabi & Kharif", durationDays:"90-100 Days", avgYieldPerAcre:"6-8 Quintals", costPerAcre:13000, demandLevel:"Moderate", soilType:"Loamy Black Soil", moistureContent:"10.0%", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:5800,private:6000},{month:"Feb",govt:5900,private:6100},{month:"Mar",govt:6000,private:6200},{month:"Apr",govt:6015,private:6300},{month:"May",govt:6015,private:6380},{month:"Jun",govt:6015,private:6450}], statePrices:[{state:"Karnataka",district:"Bijapur",mandiName:"Bijapur Yard",privatePrice:6450,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Osmanabad",mandiName:"Osmanabad APMC",privatePrice:6380,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:6420,arrivalQuantity:"1,900 Quintals",trend:"up"},{state:"Telangana",district:"Nizamabad",mandiName:"Nizamabad APMC",privatePrice:6400,arrivalQuantity:"1,600 Quintals",trend:"up"}] },
  { id:19, name:"Sesame (Til / Gingelly)", scientificName:"Sesamum indicum", category:"Oilseeds", iconEmoji:"🌱", state:"Gujarat", district:"Banaskantha", mandiName:"Deesa APMC", govt:8635, private:9800, trend:"up", globalRegion:"India, Sudan, China", season:"Kharif", durationDays:"80-90 Days", avgYieldPerAcre:"3-4 Quintals", costPerAcre:12000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"8.0%", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:8000,private:9000},{month:"Feb",govt:8200,private:9200},{month:"Mar",govt:8400,private:9400},{month:"Apr",govt:8600,private:9600},{month:"May",govt:8635,private:9700},{month:"Jun",govt:8635,private:9800}], statePrices:[{state:"Gujarat",district:"Banaskantha",mandiName:"Deesa APMC",privatePrice:9800,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Barmer",mandiName:"Barmer Mandi",privatePrice:9750,arrivalQuantity:"1,800 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Sehore",mandiName:"Sehore APMC",privatePrice:9680,arrivalQuantity:"1,500 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Jhansi",mandiName:"Jhansi APMC",privatePrice:9600,arrivalQuantity:"1,200 Quintals",trend:"up"}] },

  // ─── VEGETABLES ─────────────────────────────────────────────────
  { id:20, name:"Onion (Nashik Red)", scientificName:"Allium cepa", category:"Vegetables", iconEmoji:"🧅", state:"Maharashtra", district:"Nashik", mandiName:"Lasalgaon APMC", govt:1200, private:2150, trend:"up", globalRegion:"Global Export", season:"Kharif & Rabi", durationDays:"120-140 Days", avgYieldPerAcre:"100 Quintals", costPerAcre:35000, demandLevel:"Extremely High", soilType:"Deep Alluvial Loam", moistureContent:"Cured Fresh", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:1000,private:1100},{month:"Feb",govt:1050,private:1350},{month:"Mar",govt:1100,private:1600},{month:"Apr",govt:1150,private:1850},{month:"May",govt:1200,private:2050},{month:"Jun",govt:1200,private:2150}], statePrices:[{state:"Maharashtra",district:"Nashik",mandiName:"Lasalgaon APMC",privatePrice:2150,arrivalQuantity:"14,000 Quintals",trend:"up"},{state:"Karnataka",district:"Hubli",mandiName:"Hubli Yard",privatePrice:2280,arrivalQuantity:"6,100 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Mandsaur",mandiName:"Mandsaur Mandi",privatePrice:2040,arrivalQuantity:"5,800 Quintals",trend:"up"},{state:"Gujarat",district:"Bhavnagar",mandiName:"Mahuva APMC",privatePrice:2190,arrivalQuantity:"4,500 Quintals",trend:"up"},{state:"Rajasthan",district:"Alwar",mandiName:"Alwar APMC",privatePrice:2100,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool Yard",privatePrice:2200,arrivalQuantity:"4,800 Quintals",trend:"up"},{state:"West Bengal",district:"Hooghly",mandiName:"Hooghly APMC",privatePrice:2250,arrivalQuantity:"3,900 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Farrukhabad",mandiName:"Farrukhabad APMC",privatePrice:2080,arrivalQuantity:"3,500 Quintals",trend:"up"}] },
  { id:21, name:"Tomato (Hybrid Red)", scientificName:"Solanum lycopersicum", category:"Vegetables", iconEmoji:"🍅", state:"Karnataka", district:"Kolar", mandiName:"Kolar APMC", govt:800, private:2200, trend:"up", globalRegion:"Global", season:"All Season", durationDays:"130 Days", avgYieldPerAcre:"150 Quintals", costPerAcre:45000, demandLevel:"Extremely High", soilType:"Loam Soil", moistureContent:"Fresh Farm Pick", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:600,private:900},{month:"Feb",govt:650,private:1100},{month:"Mar",govt:700,private:1450},{month:"Apr",govt:750,private:1800},{month:"May",govt:800,private:2000},{month:"Jun",govt:800,private:2200}], statePrices:[{state:"Karnataka",district:"Kolar",mandiName:"Kolar APMC",privatePrice:2200,arrivalQuantity:"8,200 Quintals",trend:"up"},{state:"Maharashtra",district:"Nashik",mandiName:"Nashik APMC",privatePrice:2150,arrivalQuantity:"6,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Madanapalle",mandiName:"Madanapalle Yard",privatePrice:2280,arrivalQuantity:"7,100 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Varanasi",mandiName:"Varanasi APMC",privatePrice:2100,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Gujarat",district:"Anand",mandiName:"Anand APMC",privatePrice:2180,arrivalQuantity:"3,900 Quintals",trend:"up"},{state:"Himachal Pradesh",district:"Solan",mandiName:"Solan APMC",privatePrice:2350,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Indore",mandiName:"Indore APMC",privatePrice:2120,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"West Bengal",district:"Hooghly",mandiName:"Hooghly APMC",privatePrice:2080,arrivalQuantity:"2,800 Quintals",trend:"up"}] },
  { id:22, name:"Potato (Chandramukhi / Kufri)", scientificName:"Solanum tuberosum", category:"Vegetables", iconEmoji:"🥔", state:"Uttar Pradesh", district:"Agra", mandiName:"Agra APMC", govt:800, private:1450, trend:"up", globalRegion:"Global", season:"Rabi", durationDays:"90 Days", avgYieldPerAcre:"100-120 Quintals", costPerAcre:30000, demandLevel:"Extremely High", soilType:"Loamy Alluvial", moistureContent:"Fresh Market", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:700,private:900},{month:"Feb",govt:750,private:1050},{month:"Mar",govt:800,private:1200},{month:"Apr",govt:800,private:1300},{month:"May",govt:800,private:1380},{month:"Jun",govt:800,private:1450}], statePrices:[{state:"Uttar Pradesh",district:"Agra",mandiName:"Agra APMC",privatePrice:1450,arrivalQuantity:"18,000 Quintals",trend:"up"},{state:"West Bengal",district:"Hoogly",mandiName:"Hooghly APMC",privatePrice:1380,arrivalQuantity:"12,000 Quintals",trend:"up"},{state:"Bihar",district:"Muzaffarpur",mandiName:"Muzaffarpur Yard",privatePrice:1350,arrivalQuantity:"9,500 Quintals",trend:"up"},{state:"Punjab",district:"Jalandhar",mandiName:"Jalandhar APMC",privatePrice:1420,arrivalQuantity:"8,200 Quintals",trend:"up"},{state:"Himachal Pradesh",district:"Shimla",mandiName:"Shimla APMC",privatePrice:1800,arrivalQuantity:"4,500 Quintals",trend:"up"},{state:"Gujarat",district:"Ahmedabad",mandiName:"Ahmedabad APMC",privatePrice:1480,arrivalQuantity:"5,100 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Indore",mandiName:"Indore APMC",privatePrice:1400,arrivalQuantity:"4,800 Quintals",trend:"up"},{state:"Karnataka",district:"Hassan",mandiName:"Hassan APMC",privatePrice:1520,arrivalQuantity:"3,500 Quintals",trend:"up"}] },
  { id:23, name:"Garlic (Madhya Pradesh Desi)", scientificName:"Allium sativum", category:"Vegetables", iconEmoji:"🧄", state:"Madhya Pradesh", district:"Mandsaur", mandiName:"Mandsaur APMC", govt:3000, private:8200, trend:"up", globalRegion:"India, China", season:"Rabi", durationDays:"150 Days", avgYieldPerAcre:"40-50 Quintals", costPerAcre:35000, demandLevel:"Extremely High", soilType:"Sandy Clay Loam", moistureContent:"Cured Dry", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2800,private:5500},{month:"Feb",govt:2900,private:6200},{month:"Mar",govt:3000,private:7000},{month:"Apr",govt:3000,private:7600},{month:"May",govt:3000,private:7950},{month:"Jun",govt:3000,private:8200}], statePrices:[{state:"Madhya Pradesh",district:"Mandsaur",mandiName:"Mandsaur APMC",privatePrice:8200,arrivalQuantity:"5,500 Quintals",trend:"up"},{state:"Gujarat",district:"Rajkot",mandiName:"Rajkot APMC",privatePrice:7900,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Rajasthan",district:"Kota",mandiName:"Kota APMC",privatePrice:7850,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Maharashtra",district:"Pune",mandiName:"Pune APMC",privatePrice:8100,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Lucknow",mandiName:"Lucknow APMC",privatePrice:7800,arrivalQuantity:"2,200 Quintals",trend:"up"}] },
  { id:24, name:"Ginger (Fresh Root)", scientificName:"Zingiber officinale", category:"Vegetables", iconEmoji:"🫚", state:"Kerala", district:"Wayanad", mandiName:"Kalpetta APMC", govt:4000, private:8500, trend:"up", globalRegion:"India, China", season:"Kharif", durationDays:"220 Days", avgYieldPerAcre:"60-80 Quintals", costPerAcre:50000, demandLevel:"High", soilType:"Red Loamy Soil", moistureContent:"Fresh Root", qualityGrade:"Grade A Organic", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:3500,private:6500},{month:"Feb",govt:3700,private:7000},{month:"Mar",govt:3900,private:7500},{month:"Apr",govt:4000,private:8000},{month:"May",govt:4000,private:8200},{month:"Jun",govt:4000,private:8500}], statePrices:[{state:"Kerala",district:"Wayanad",mandiName:"Kalpetta APMC",privatePrice:8500,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Karnataka",district:"Coorg",mandiName:"Madikeri APMC",privatePrice:8350,arrivalQuantity:"1,800 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:8200,arrivalQuantity:"1,500 Quintals",trend:"up"},{state:"Odisha",district:"Koraput",mandiName:"Koraput APMC",privatePrice:8050,arrivalQuantity:"1,200 Quintals",trend:"up"},{state:"West Bengal",district:"Jalpaiguri",mandiName:"Jalpaiguri APMC",privatePrice:8100,arrivalQuantity:"1,000 Quintals",trend:"up"},{state:"Meghalaya",district:"East Khasi Hills",mandiName:"Shillong APMC",privatePrice:8600,arrivalQuantity:"800 Quintals",trend:"up"}] },
  { id:25, name:"Green Chilli (Jwala / Bydagi)", scientificName:"Capsicum annuum", category:"Vegetables", iconEmoji:"🌶️", state:"Andhra Pradesh", district:"Guntur", mandiName:"Guntur APMC", govt:1500, private:4800, trend:"up", globalRegion:"India, Global", season:"All Season", durationDays:"90-120 Days", avgYieldPerAcre:"50-60 Quintals", costPerAcre:32000, demandLevel:"Extremely High", soilType:"Sandy Loam", moistureContent:"Fresh Harvest", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:1400,private:3200},{month:"Feb",govt:1450,private:3600},{month:"Mar",govt:1500,private:4000},{month:"Apr",govt:1500,private:4400},{month:"May",govt:1500,private:4600},{month:"Jun",govt:1500,private:4800}], statePrices:[{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:4800,arrivalQuantity:"8,500 Quintals",trend:"up"},{state:"Karnataka",district:"Byadgi",mandiName:"Byadgi Yard",privatePrice:4650,arrivalQuantity:"5,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Jodhpur",mandiName:"Jodhpur APMC",privatePrice:4500,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Jalna",mandiName:"Jalna APMC",privatePrice:4550,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Telangana",district:"Warangal",mandiName:"Warangal APMC",privatePrice:4700,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Mandsaur",mandiName:"Mandsaur APMC",privatePrice:4420,arrivalQuantity:"2,200 Quintals",trend:"up"}] },
  { id:26, name:"Cauliflower", scientificName:"Brassica oleracea", category:"Vegetables", iconEmoji:"🥦", state:"West Bengal", district:"Hooghly", mandiName:"Hooghly APMC", govt:600, private:1800, trend:"up", globalRegion:"India", season:"Rabi", durationDays:"80 Days", avgYieldPerAcre:"80 Quintals", costPerAcre:28000, demandLevel:"High", soilType:"Loamy Soil", moistureContent:"Fresh", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:500,private:1200},{month:"Feb",govt:550,private:1400},{month:"Mar",govt:580,private:1550},{month:"Apr",govt:600,private:1650},{month:"May",govt:600,private:1720},{month:"Jun",govt:600,private:1800}], statePrices:[{state:"West Bengal",district:"Hooghly",mandiName:"Hooghly APMC",privatePrice:1800,arrivalQuantity:"5,200 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Varanasi",mandiName:"Varanasi APMC",privatePrice:1750,arrivalQuantity:"4,100 Quintals",trend:"up"},{state:"Bihar",district:"Patna",mandiName:"Patna APMC",privatePrice:1720,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Punjab",district:"Ludhiana",mandiName:"Ludhiana APMC",privatePrice:1780,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Pune",mandiName:"Pune APMC",privatePrice:1900,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Gujarat",district:"Anand",mandiName:"Anand APMC",privatePrice:1850,arrivalQuantity:"1,900 Quintals",trend:"up"}] },
  { id:27, name:"Brinjal / Eggplant", scientificName:"Solanum melongena", category:"Vegetables", iconEmoji:"🍆", state:"Andhra Pradesh", district:"Kurnool", mandiName:"Kurnool APMC", govt:500, private:1500, trend:"up", globalRegion:"India", season:"All Season", durationDays:"90 Days", avgYieldPerAcre:"80 Quintals", costPerAcre:22000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Fresh", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:450,private:900},{month:"Feb",govt:480,private:1050},{month:"Mar",govt:500,private:1200},{month:"Apr",govt:500,private:1350},{month:"May",govt:500,private:1430},{month:"Jun",govt:500,private:1500}], statePrices:[{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:1500,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"West Bengal",district:"Bardhaman",mandiName:"Bardhaman APMC",privatePrice:1480,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Maharashtra",district:"Pune",mandiName:"Pune APMC",privatePrice:1550,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Karnataka",district:"Gadag",mandiName:"Gadag Yard",privatePrice:1450,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Coimbatore",mandiName:"Coimbatore APMC",privatePrice:1520,arrivalQuantity:"2,000 Quintals",trend:"up"}] },
  { id:28, name:"Cabbage", scientificName:"Brassica oleracea var. capitata", category:"Vegetables", iconEmoji:"🥬", state:"West Bengal", district:"Bardhaman", mandiName:"Bardhaman APMC", govt:500, private:1400, trend:"up", globalRegion:"India", season:"Rabi", durationDays:"80 Days", avgYieldPerAcre:"100 Quintals", costPerAcre:25000, demandLevel:"High", soilType:"Loamy Soil", moistureContent:"Fresh", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:450,private:900},{month:"Feb",govt:470,private:1050},{month:"Mar",govt:490,private:1150},{month:"Apr",govt:500,private:1250},{month:"May",govt:500,private:1330},{month:"Jun",govt:500,private:1400}], statePrices:[{state:"West Bengal",district:"Bardhaman",mandiName:"Bardhaman APMC",privatePrice:1400,arrivalQuantity:"4,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Nashik",mandiName:"Nashik APMC",privatePrice:1500,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Agra",mandiName:"Agra APMC",privatePrice:1380,arrivalQuantity:"2,900 Quintals",trend:"up"},{state:"Gujarat",district:"Ahmedabad",mandiName:"Ahmedabad APMC",privatePrice:1450,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Karnataka",district:"Kolar",mandiName:"Kolar APMC",privatePrice:1420,arrivalQuantity:"1,900 Quintals",trend:"up"}] },
  { id:29, name:"Okra / Bhindi (Lady Finger)", scientificName:"Abelmoschus esculentus", category:"Vegetables", iconEmoji:"🌿", state:"Gujarat", district:"Anand", mandiName:"Anand APMC", govt:600, private:2200, trend:"up", globalRegion:"India", season:"Kharif", durationDays:"60 Days", avgYieldPerAcre:"40 Quintals", costPerAcre:20000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Fresh Tender", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:550,private:1400},{month:"Feb",govt:570,private:1600},{month:"Mar",govt:590,private:1800},{month:"Apr",govt:600,private:1950},{month:"May",govt:600,private:2100},{month:"Jun",govt:600,private:2200}], statePrices:[{state:"Gujarat",district:"Anand",mandiName:"Anand APMC",privatePrice:2200,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Pune",mandiName:"Pune APMC",privatePrice:2350,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:2150,arrivalQuantity:"1,900 Quintals",trend:"up"},{state:"West Bengal",district:"Kolkata",mandiName:"Kolkata APMC",privatePrice:2280,arrivalQuantity:"1,600 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Lucknow",mandiName:"Lucknow APMC",privatePrice:2100,arrivalQuantity:"1,400 Quintals",trend:"up"}] },

  // ─── FRUITS ─────────────────────────────────────────────────────
  { id:30, name:"Apple (Royal Delicious / Shimla)", scientificName:"Malus domestica", category:"Fruits", iconEmoji:"🍎", state:"Himachal Pradesh", district:"Shimla", mandiName:"Dhalli APMC Shimla", govt:4500, private:9200, trend:"up", globalRegion:"India, USA, China", season:"Autumn", durationDays:"Perennial", avgYieldPerAcre:"80 Quintals", costPerAcre:50000, demandLevel:"Extremely High", soilType:"Hill Loam", moistureContent:"Fresh Orchard", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:4000,private:8200},{month:"Feb",govt:4100,private:8400},{month:"Mar",govt:4200,private:8650},{month:"Apr",govt:4300,private:8900},{month:"May",govt:4500,private:9100},{month:"Jun",govt:4500,private:9200}], statePrices:[{state:"Himachal Pradesh",district:"Shimla",mandiName:"Dhalli APMC",privatePrice:9200,arrivalQuantity:"4,500 Boxes",trend:"up"},{state:"Jammu & Kashmir",district:"Sopore",mandiName:"Sopore Fruit Mandi",privatePrice:8900,arrivalQuantity:"9,800 Boxes",trend:"up"},{state:"Uttarakhand",district:"Nainital",mandiName:"Ramnagar APMC",privatePrice:8750,arrivalQuantity:"2,100 Boxes",trend:"up"},{state:"Delhi",district:"Azadpur",mandiName:"Azadpur APMC",privatePrice:10500,arrivalQuantity:"6,200 Boxes",trend:"up"},{state:"Maharashtra",district:"Mumbai",mandiName:"APMC Vashi",privatePrice:11000,arrivalQuantity:"5,800 Boxes",trend:"up"}] },
  { id:31, name:"Mango (Alphonso / Kesar / Dasheri)", scientificName:"Mangifera indica", category:"Fruits", iconEmoji:"🥭", state:"Maharashtra", district:"Ratnagiri", mandiName:"Ratnagiri APMC", govt:9000, private:18500, trend:"up", globalRegion:"India, Thailand", season:"Summer", durationDays:"Perennial", avgYieldPerAcre:"50 Quintals", costPerAcre:30000, demandLevel:"Extremely High", soilType:"Lateritic Red Soil", moistureContent:"Ripe Fresh", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:7000,private:12000},{month:"Feb",govt:7500,private:14000},{month:"Mar",govt:8000,private:16000},{month:"Apr",govt:8500,private:17500},{month:"May",govt:9000,private:19000},{month:"Jun",govt:9000,private:18500}], statePrices:[{state:"Maharashtra",district:"Ratnagiri",mandiName:"Ratnagiri APMC",privatePrice:18500,arrivalQuantity:"650 Crates",trend:"up"},{state:"Gujarat",district:"Junagadh",mandiName:"Talala Gir Yard",privatePrice:14800,arrivalQuantity:"1,200 Crates",trend:"up"},{state:"Uttar Pradesh",district:"Lucknow",mandiName:"Malihabad APMC",privatePrice:12500,arrivalQuantity:"1,800 Crates",trend:"up"},{state:"Andhra Pradesh",district:"Krishnamurthy",mandiName:"Banganapalle APMC",privatePrice:9800,arrivalQuantity:"2,200 Crates",trend:"up"},{state:"Tamil Nadu",district:"Salem",mandiName:"Salem APMC",privatePrice:9200,arrivalQuantity:"1,500 Crates",trend:"up"},{state:"Karnataka",district:"Ramanagara",mandiName:"Ramanagara Yard",privatePrice:10200,arrivalQuantity:"1,100 Crates",trend:"up"}] },
  { id:32, name:"Banana (Grand Naine / Jalgaon)", scientificName:"Musa acuminata", category:"Fruits", iconEmoji:"🍌", state:"Maharashtra", district:"Jalgaon", mandiName:"Jalgaon Banana Market", govt:1100, private:2250, trend:"up", globalRegion:"India, Ecuador", season:"All Season", durationDays:"350 Days", avgYieldPerAcre:"300 Quintals", costPerAcre:60000, demandLevel:"High", soilType:"Clay Loam", moistureContent:"Fresh Bunch", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:950,private:1800},{month:"Feb",govt:1000,private:1950},{month:"Mar",govt:1050,private:2100},{month:"Apr",govt:1100,private:2180},{month:"May",govt:1100,private:2220},{month:"Jun",govt:1100,private:2250}], statePrices:[{state:"Maharashtra",district:"Jalgaon",mandiName:"Jalgaon APMC",privatePrice:2250,arrivalQuantity:"14,000 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Trichy",mandiName:"Trichy APMC",privatePrice:2180,arrivalQuantity:"8,900 Quintals",trend:"up"},{state:"Gujarat",district:"Anand",mandiName:"Anand Yard",privatePrice:2310,arrivalQuantity:"5,400 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:2200,arrivalQuantity:"6,200 Quintals",trend:"up"},{state:"Karnataka",district:"Haveri",mandiName:"Ranibennur Yard",privatePrice:2150,arrivalQuantity:"4,500 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Burhanpur",mandiName:"Burhanpur APMC",privatePrice:2190,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Kerala",district:"Thrissur",mandiName:"Thrissur APMC",privatePrice:3200,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"West Bengal",district:"Murshidabad",mandiName:"Murshidabad APMC",privatePrice:2100,arrivalQuantity:"2,400 Quintals",trend:"up"}] },
  { id:33, name:"Grapes (Thompson Seedless)", scientificName:"Vitis vinifera", category:"Fruits", iconEmoji:"🍇", state:"Maharashtra", district:"Nasik", mandiName:"Nasik APMC", govt:5000, private:8500, trend:"up", globalRegion:"India, USA, Europe", season:"Winter/Spring", durationDays:"Perennial", avgYieldPerAcre:"80-100 Quintals", costPerAcre:80000, demandLevel:"Extremely High", soilType:"Well-Drained Sandy Loam", moistureContent:"Fresh Cluster", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:4500,private:7000},{month:"Feb",govt:4700,private:7500},{month:"Mar",govt:4900,private:8000},{month:"Apr",govt:5000,private:8200},{month:"May",govt:5000,private:8350},{month:"Jun",govt:5000,private:8500}], statePrices:[{state:"Maharashtra",district:"Nasik",mandiName:"Nasik APMC",privatePrice:8500,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Karnataka",district:"Bijapur",mandiName:"Bijapur Yard",privatePrice:7800,arrivalQuantity:"2,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Anantapur",mandiName:"Anantapur APMC",privatePrice:7600,arrivalQuantity:"1,800 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Dindigul",mandiName:"Dindigul APMC",privatePrice:7900,arrivalQuantity:"1,200 Quintals",trend:"up"}] },
  { id:34, name:"Watermelon", scientificName:"Citrullus lanatus", category:"Fruits", iconEmoji:"🍉", state:"Andhra Pradesh", district:"Kurnool", mandiName:"Kurnool APMC", govt:400, private:1200, trend:"up", globalRegion:"India, China", season:"Summer", durationDays:"90 Days", avgYieldPerAcre:"150 Quintals", costPerAcre:25000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Fresh Ripe", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:350,private:600},{month:"Feb",govt:380,private:800},{month:"Mar",govt:400,private:1000},{month:"Apr",govt:400,private:1100},{month:"May",govt:400,private:1150},{month:"Jun",govt:400,private:1200}], statePrices:[{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:1200,arrivalQuantity:"9,500 Quintals",trend:"up"},{state:"Karnataka",district:"Dharwad",mandiName:"Dharwad APMC",privatePrice:1150,arrivalQuantity:"7,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Jaipur",mandiName:"Jaipur APMC",privatePrice:1100,arrivalQuantity:"5,800 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Lucknow",mandiName:"Lucknow APMC",privatePrice:1080,arrivalQuantity:"4,500 Quintals",trend:"up"},{state:"Maharashtra",district:"Nashik",mandiName:"Nashik APMC",privatePrice:1180,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Gujarat",district:"Banaskantha",mandiName:"Palanpur APMC",privatePrice:1150,arrivalQuantity:"3,200 Quintals",trend:"up"}] },
  { id:35, name:"Pomegranate (Bhagwa / Sinduri)", scientificName:"Punica granatum", category:"Fruits", iconEmoji:"🍒", state:"Maharashtra", district:"Solapur", mandiName:"Solapur APMC", govt:5000, private:9800, trend:"up", globalRegion:"India, Iran, USA", season:"Winter & Summer", durationDays:"Perennial", avgYieldPerAcre:"40-50 Quintals", costPerAcre:45000, demandLevel:"Extremely High", soilType:"Well Drained Sandy Loam", moistureContent:"Fresh Harvest", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:4500,private:8000},{month:"Feb",govt:4700,private:8500},{month:"Mar",govt:4800,private:9000},{month:"Apr",govt:5000,private:9300},{month:"May",govt:5000,private:9600},{month:"Jun",govt:5000,private:9800}], statePrices:[{state:"Maharashtra",district:"Solapur",mandiName:"Solapur APMC",privatePrice:9800,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Gujarat",district:"Anand",mandiName:"Anand APMC",privatePrice:9500,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Karnataka",district:"Bijapur",mandiName:"Bijapur Yard",privatePrice:9200,arrivalQuantity:"1,800 Quintals",trend:"up"},{state:"Rajasthan",district:"Jalore",mandiName:"Jalore APMC",privatePrice:9000,arrivalQuantity:"1,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Kurnool",mandiName:"Kurnool APMC",privatePrice:9100,arrivalQuantity:"1,200 Quintals",trend:"up"},{state:"Himachal Pradesh",district:"Shimla",mandiName:"Shimla APMC",privatePrice:9400,arrivalQuantity:"900 Quintals",trend:"up"}] },
  { id:36, name:"Papaya (Red Lady / Honey Dew)", scientificName:"Carica papaya", category:"Fruits", iconEmoji:"🧃", state:"Gujarat", district:"Bharuch", mandiName:"Bharuch APMC", govt:800, private:2800, trend:"up", globalRegion:"India, Brazil", season:"All Season", durationDays:"9-10 Months", avgYieldPerAcre:"200 Quintals", costPerAcre:35000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Ripe Fresh", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:700,private:1800},{month:"Feb",govt:750,private:2100},{month:"Mar",govt:780,private:2400},{month:"Apr",govt:800,private:2600},{month:"May",govt:800,private:2700},{month:"Jun",govt:800,private:2800}], statePrices:[{state:"Gujarat",district:"Bharuch",mandiName:"Bharuch APMC",privatePrice:2800,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Maharashtra",district:"Jalgaon",mandiName:"Jalgaon APMC",privatePrice:2750,arrivalQuantity:"2,500 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Guntur",mandiName:"Guntur APMC",privatePrice:2650,arrivalQuantity:"2,100 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Salem",mandiName:"Salem APMC",privatePrice:2700,arrivalQuantity:"1,800 Quintals",trend:"up"},{state:"Karnataka",district:"Kolar",mandiName:"Kolar APMC",privatePrice:2720,arrivalQuantity:"1,500 Quintals",trend:"up"}] },

  // ─── SPICES & HERBS ─────────────────────────────────────────────
  { id:37, name:"Turmeric (Sangli / Erode)", scientificName:"Curcuma longa", category:"Spices & Herbs", iconEmoji:"🌿", state:"Maharashtra", district:"Sangli", mandiName:"Sangli APMC", govt:7000, private:9500, trend:"up", globalRegion:"India, Nigeria", season:"Kharif", durationDays:"250-300 Days", avgYieldPerAcre:"20-25 Quintals", costPerAcre:30000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Boiled & Dried", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:6500,private:8000},{month:"Feb",govt:6700,private:8500},{month:"Mar",govt:6800,private:9000},{month:"Apr",govt:7000,private:9200},{month:"May",govt:7000,private:9350},{month:"Jun",govt:7000,private:9500}], statePrices:[{state:"Maharashtra",district:"Sangli",mandiName:"Sangli APMC",privatePrice:9500,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Erode",mandiName:"Erode APMC",privatePrice:9200,arrivalQuantity:"5,800 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Warangal",mandiName:"Warangal APMC",privatePrice:9100,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Karnataka",district:"Dharwad",mandiName:"Dharwad APMC",privatePrice:8900,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Odisha",district:"Kandhamal",mandiName:"Phulbani APMC",privatePrice:8800,arrivalQuantity:"2,200 Quintals",trend:"up"},{state:"Telangana",district:"Nizamabad",mandiName:"Nizamabad APMC",privatePrice:9050,arrivalQuantity:"1,800 Quintals",trend:"up"}] },
  { id:38, name:"Cardamom (Green Elaichi)", scientificName:"Elettaria cardamomum", category:"Spices & Herbs", iconEmoji:"🌿", state:"Kerala", district:"Idukki", mandiName:"Kumily APMC", govt:2000, private:120000, trend:"up", globalRegion:"India, Guatemala", season:"Perennial", durationDays:"Perennial", avgYieldPerAcre:"2-3 Quintals", costPerAcre:80000, demandLevel:"Extremely High", soilType:"Red Laterite", moistureContent:"Sun Dried", qualityGrade:"Grade A Organic", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:2000,private:95000},{month:"Feb",govt:2000,private:100000},{month:"Mar",govt:2000,private:105000},{month:"Apr",govt:2000,private:110000},{month:"May",govt:2000,private:115000},{month:"Jun",govt:2000,private:120000}], statePrices:[{state:"Kerala",district:"Idukki",mandiName:"Kumily APMC",privatePrice:120000,arrivalQuantity:"850 KG",trend:"up"},{state:"Karnataka",district:"Coorg",mandiName:"Madikeri APMC",privatePrice:115000,arrivalQuantity:"620 KG",trend:"up"},{state:"Tamil Nadu",district:"Nilgiris",mandiName:"Ooty APMC",privatePrice:112000,arrivalQuantity:"380 KG",trend:"up"}] },
  { id:39, name:"Black Pepper (Kaali Mirch)", scientificName:"Piper nigrum", category:"Spices & Herbs", iconEmoji:"🌿", state:"Kerala", district:"Wayanad", mandiName:"Wayanad APMC", govt:40000, private:58000, trend:"up", globalRegion:"India, Vietnam", season:"Perennial", durationDays:"Perennial", avgYieldPerAcre:"3-5 Quintals", costPerAcre:60000, demandLevel:"Extremely High", soilType:"Red Laterite", moistureContent:"Sun Dried", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:38000,private:50000},{month:"Feb",govt:39000,private:52000},{month:"Mar",govt:39500,private:54000},{month:"Apr",govt:40000,private:56000},{month:"May",govt:40000,private:57000},{month:"Jun",govt:40000,private:58000}], statePrices:[{state:"Kerala",district:"Wayanad",mandiName:"Wayanad APMC",privatePrice:58000,arrivalQuantity:"1,200 Quintals",trend:"up"},{state:"Karnataka",district:"Coorg",mandiName:"Madikeri APMC",privatePrice:56000,arrivalQuantity:"980 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"East Godavari",mandiName:"Rajamahendravaram APMC",privatePrice:54000,arrivalQuantity:"620 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Nilgiris",mandiName:"Gudalur APMC",privatePrice:55000,arrivalQuantity:"480 Quintals",trend:"up"}] },
  { id:40, name:"Cumin (Jeera)", scientificName:"Cuminum cyminum", category:"Spices & Herbs", iconEmoji:"🌿", state:"Rajasthan", district:"Jodhpur", mandiName:"Jodhpur APMC", govt:22000, private:26500, trend:"up", globalRegion:"India, Iran", season:"Rabi", durationDays:"100 Days", avgYieldPerAcre:"3-5 Quintals", costPerAcre:18000, demandLevel:"Extremely High", soilType:"Sandy Loam", moistureContent:"Sun Dried", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:20000,private:22000},{month:"Feb",govt:21000,private:23500},{month:"Mar",govt:21500,private:24500},{month:"Apr",govt:22000,private:25200},{month:"May",govt:22000,private:25900},{month:"Jun",govt:22000,private:26500}], statePrices:[{state:"Rajasthan",district:"Jodhpur",mandiName:"Jodhpur APMC",privatePrice:26500,arrivalQuantity:"3,800 Quintals",trend:"up"},{state:"Gujarat",district:"Unjha",mandiName:"Unjha APMC",privatePrice:25800,arrivalQuantity:"8,500 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Guna",mandiName:"Guna APMC",privatePrice:25200,arrivalQuantity:"1,200 Quintals",trend:"up"},{state:"Uttar Pradesh",district:"Bareilly",mandiName:"Bareilly APMC",privatePrice:24800,arrivalQuantity:"900 Quintals",trend:"up"}] },
  { id:41, name:"Coriander Seeds (Dhaniya)", scientificName:"Coriandrum sativum", category:"Spices & Herbs", iconEmoji:"🌿", state:"Rajasthan", district:"Kota", mandiName:"Kota APMC", govt:7200, private:8900, trend:"up", globalRegion:"India, Russia", season:"Rabi", durationDays:"90 Days", avgYieldPerAcre:"6-8 Quintals", costPerAcre:12000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Sun Dried", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:6800,private:7800},{month:"Feb",govt:7000,private:8100},{month:"Mar",govt:7100,private:8400},{month:"Apr",govt:7200,private:8600},{month:"May",govt:7200,private:8750},{month:"Jun",govt:7200,private:8900}], statePrices:[{state:"Rajasthan",district:"Kota",mandiName:"Kota APMC",privatePrice:8900,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Madhya Pradesh",district:"Guna",mandiName:"Guna APMC",privatePrice:8750,arrivalQuantity:"3,500 Quintals",trend:"up"},{state:"Gujarat",district:"Unjha",mandiName:"Unjha APMC",privatePrice:8650,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Maharashtra",district:"Nagpur",mandiName:"Nagpur APMC",privatePrice:8800,arrivalQuantity:"1,800 Quintals",trend:"up"}] },
  { id:42, name:"Fennel Seeds (Saunf / Badishep)", scientificName:"Foeniculum vulgare", category:"Spices & Herbs", iconEmoji:"🌿", state:"Gujarat", district:"Mehsana", mandiName:"Unjha APMC", govt:12000, private:16500, trend:"up", globalRegion:"India, Egypt", season:"Rabi", durationDays:"150 Days", avgYieldPerAcre:"5-7 Quintals", costPerAcre:18000, demandLevel:"High", soilType:"Sandy Loam", moistureContent:"Sun Dried", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:11000,private:13500},{month:"Feb",govt:11500,private:14500},{month:"Mar",govt:11800,private:15200},{month:"Apr",govt:12000,private:15800},{month:"May",govt:12000,private:16200},{month:"Jun",govt:12000,private:16500}], statePrices:[{state:"Gujarat",district:"Mehsana",mandiName:"Unjha APMC",privatePrice:16500,arrivalQuantity:"3,200 Quintals",trend:"up"},{state:"Rajasthan",district:"Sirohi",mandiName:"Sirohi APMC",privatePrice:16200,arrivalQuantity:"2,400 Quintals",trend:"up"},{state:"Maharashtra",district:"Nagpur",mandiName:"Nagpur APMC",privatePrice:15800,arrivalQuantity:"1,500 Quintals",trend:"up"}] },

  // ─── COMMERCIAL & PLANTATION ────────────────────────────────────
  { id:43, name:"Sugarcane", scientificName:"Saccharum officinarum", category:"Commercial & Plantation", iconEmoji:"🌿", state:"Uttar Pradesh", district:"Muzaffarnagar", mandiName:"Muzaffarnagar Mill Gate", govt:370, private:420, trend:"up", globalRegion:"India, Brazil", season:"Annual", durationDays:"365 Days", avgYieldPerAcre:"300-400 Quintals", costPerAcre:45000, demandLevel:"Extremely High", soilType:"Heavy Alluvial Loam", moistureContent:"Fresh Cut", qualityGrade:"Standard Quality", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:355,private:390},{month:"Feb",govt:360,private:398},{month:"Mar",govt:365,private:405},{month:"Apr",govt:370,private:410},{month:"May",govt:370,private:415},{month:"Jun",govt:370,private:420}], statePrices:[{state:"Uttar Pradesh",district:"Muzaffarnagar",mandiName:"Mill Gate Rate",privatePrice:420,arrivalQuantity:"45,000 Quintals",trend:"up"},{state:"Maharashtra",district:"Kolhapur",mandiName:"Kolhapur Factory",privatePrice:385,arrivalQuantity:"38,000 Quintals",trend:"up"},{state:"Karnataka",district:"Mandya",mandiName:"Mandya APMC",privatePrice:380,arrivalQuantity:"28,000 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Cuddalore",mandiName:"Cuddalore Factory",privatePrice:395,arrivalQuantity:"22,000 Quintals",trend:"up"},{state:"Bihar",district:"Darbhanga",mandiName:"Darbhanga APMC",privatePrice:370,arrivalQuantity:"18,000 Quintals",trend:"up"},{state:"Gujarat",district:"Surat",mandiName:"Surat APMC",privatePrice:390,arrivalQuantity:"15,000 Quintals",trend:"up"},{state:"Punjab",district:"Jalandhar",mandiName:"Jalandhar Mill",privatePrice:408,arrivalQuantity:"12,000 Quintals",trend:"up"},{state:"Haryana",district:"Panipat",mandiName:"Panipat Mill",privatePrice:405,arrivalQuantity:"10,000 Quintals",trend:"up"}] },
  { id:44, name:"Jute (Long Staple)", scientificName:"Corchorus capsularis", category:"Commercial & Plantation", iconEmoji:"🌿", state:"West Bengal", district:"Murshidabad", mandiName:"Murshidabad APMC", govt:5050, private:5800, trend:"up", globalRegion:"India, Bangladesh", season:"Kharif", durationDays:"120 Days", avgYieldPerAcre:"10-12 Quintals", costPerAcre:20000, demandLevel:"Moderate", soilType:"Alluvial Loam", moistureContent:"Retted & Dried", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:4800,private:5200},{month:"Feb",govt:4900,private:5350},{month:"Mar",govt:5000,private:5500},{month:"Apr",govt:5050,private:5620},{month:"May",govt:5050,private:5720},{month:"Jun",govt:5050,private:5800}], statePrices:[{state:"West Bengal",district:"Murshidabad",mandiName:"Murshidabad APMC",privatePrice:5800,arrivalQuantity:"8,500 Quintals",trend:"up"},{state:"Bihar",district:"Darbhanga",mandiName:"Darbhanga APMC",privatePrice:5650,arrivalQuantity:"4,200 Quintals",trend:"up"},{state:"Odisha",district:"Balasore",mandiName:"Balasore APMC",privatePrice:5500,arrivalQuantity:"2,800 Quintals",trend:"up"},{state:"Assam",district:"Sibsagar",mandiName:"Sibsagar APMC",privatePrice:5600,arrivalQuantity:"2,200 Quintals",trend:"up"}] },
  { id:45, name:"Coconut (Nariyal)", scientificName:"Cocos nucifera", category:"Commercial & Plantation", iconEmoji:"🥥", state:"Kerala", district:"Thrissur", mandiName:"Thrissur APMC", govt:32, private:48, trend:"up", globalRegion:"India, Philippines", season:"Perennial", durationDays:"Perennial", avgYieldPerAcre:"10,000 Nuts", costPerAcre:25000, demandLevel:"High", soilType:"Laterite Sandy Loam", moistureContent:"Fresh Husked", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:28,private:38},{month:"Feb",govt:29,private:40},{month:"Mar",govt:30,private:42},{month:"Apr",govt:31,private:44},{month:"May",govt:32,private:46},{month:"Jun",govt:32,private:48}], statePrices:[{state:"Kerala",district:"Thrissur",mandiName:"Thrissur APMC",privatePrice:48,arrivalQuantity:"85,000 Nuts",trend:"up"},{state:"Karnataka",district:"Tumkur",mandiName:"Tumkur Yard",privatePrice:45,arrivalQuantity:"62,000 Nuts",trend:"up"},{state:"Tamil Nadu",district:"Coimbatore",mandiName:"Coimbatore APMC",privatePrice:46,arrivalQuantity:"52,000 Nuts",trend:"up"},{state:"Andhra Pradesh",district:"West Godavari",mandiName:"Eluru APMC",privatePrice:44,arrivalQuantity:"38,000 Nuts",trend:"up"},{state:"Goa",district:"North Goa",mandiName:"Panaji APMC",privatePrice:52,arrivalQuantity:"18,000 Nuts",trend:"up"}] },
  { id:46, name:"Tea (CTC / Orthodox)", scientificName:"Camellia sinensis", category:"Commercial & Plantation", iconEmoji:"🍵", state:"Assam", district:"Jorhat", mandiName:"Jorhat Tea Auction", govt:18000, private:28000, trend:"up", globalRegion:"India, China", season:"All Season", durationDays:"Perennial", avgYieldPerAcre:"8-10 Quintals", costPerAcre:60000, demandLevel:"High", soilType:"Acidic Loam", moistureContent:"Processed Tea", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:16000,private:24000},{month:"Feb",govt:17000,private:25500},{month:"Mar",govt:17500,private:26500},{month:"Apr",govt:18000,private:27000},{month:"May",govt:18000,private:27500},{month:"Jun",govt:18000,private:28000}], statePrices:[{state:"Assam",district:"Jorhat",mandiName:"Jorhat Auction",privatePrice:28000,arrivalQuantity:"1,200 Quintals",trend:"up"},{state:"West Bengal",district:"Darjeeling",mandiName:"Darjeeling Auction",privatePrice:35000,arrivalQuantity:"680 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Nilgiris",mandiName:"Coonoor Auction",privatePrice:24000,arrivalQuantity:"950 Quintals",trend:"up"},{state:"Kerala",district:"Munnar",mandiName:"Munnar Auction",privatePrice:22000,arrivalQuantity:"420 Quintals",trend:"up"},{state:"Himachal Pradesh",district:"Kangra",mandiName:"Palampur APMC",privatePrice:32000,arrivalQuantity:"180 Quintals",trend:"up"}] },
  { id:47, name:"Coffee (Arabica / Robusta)", scientificName:"Coffea arabica", category:"Commercial & Plantation", iconEmoji:"☕", state:"Karnataka", district:"Coorg", mandiName:"Madikeri APMC", govt:14000, private:22000, trend:"up", globalRegion:"India, Brazil", season:"Perennial", durationDays:"Perennial", avgYieldPerAcre:"6-8 Quintals", costPerAcre:55000, demandLevel:"High", soilType:"Laterite Loam", moistureContent:"Processed Beans", qualityGrade:"Export Quality Premium", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:13000,private:19000},{month:"Feb",govt:13500,private:20000},{month:"Mar",govt:14000,private:21000},{month:"Apr",govt:14000,private:21500},{month:"May",govt:14000,private:21800},{month:"Jun",govt:14000,private:22000}], statePrices:[{state:"Karnataka",district:"Coorg",mandiName:"Madikeri APMC",privatePrice:22000,arrivalQuantity:"980 Quintals",trend:"up"},{state:"Kerala",district:"Wayanad",mandiName:"Wayanad APMC",privatePrice:21500,arrivalQuantity:"620 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Nilgiris",mandiName:"Gudalur APMC",privatePrice:20800,arrivalQuantity:"380 Quintals",trend:"up"},{state:"Andhra Pradesh",district:"Visakhapatnam",mandiName:"Araku APMC",privatePrice:23000,arrivalQuantity:"250 Quintals",trend:"up"}] },
  { id:48, name:"Rubber", scientificName:"Hevea brasiliensis", category:"Commercial & Plantation", iconEmoji:"🌿", state:"Kerala", district:"Kottayam", mandiName:"Kottayam APMC", govt:180, private:210, trend:"up", globalRegion:"India, Thailand", season:"Perennial", durationDays:"Perennial", avgYieldPerAcre:"4-5 Quintals", costPerAcre:35000, demandLevel:"High", soilType:"Laterite Red", moistureContent:"Fresh Latex", qualityGrade:"Grade A Superior", lastUpdated:"Today 09:00 AM", history:[{month:"Jan",govt:165,private:185},{month:"Feb",govt:170,private:190},{month:"Mar",govt:172,private:196},{month:"Apr",govt:175,private:202},{month:"May",govt:178,private:207},{month:"Jun",govt:180,private:210}], statePrices:[{state:"Kerala",district:"Kottayam",mandiName:"Kottayam APMC",privatePrice:210,arrivalQuantity:"4,500 Quintals",trend:"up"},{state:"Karnataka",district:"Coorg",mandiName:"Madikeri APMC",privatePrice:205,arrivalQuantity:"1,200 Quintals",trend:"up"},{state:"Tamil Nadu",district:"Kanyakumari",mandiName:"Nagercoil APMC",privatePrice:200,arrivalQuantity:"800 Quintals",trend:"up"},{state:"Assam",district:"Jorhat",mandiName:"Jorhat APMC",privatePrice:195,arrivalQuantity:"620 Quintals",trend:"up"},{state:"Odisha",district:"Rayagada",mandiName:"Rayagada APMC",privatePrice:192,arrivalQuantity:"380 Quintals",trend:"up"}] }

];

import { useTranslation } from "react-i18next";

const generateSimulatedStatePrice = (crop: any, state: string): StatePriceDetail => {
  // Deterministic hash based on state name and crop ID
  const hash = state.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + crop.id;
  // Variance between -15% and +15%
  const variancePercent = ((hash % 30) - 15) / 100; 
  const simulatedPrice = Math.round(crop.private * (1 + variancePercent));
  const simulatedArrival = Math.round(500 + (hash % 9000));
  const simulatedTrend = (hash % 2 === 0) ? "up" : "down";

  return {
    state: state,
    district: "Major Markets",
    mandiName: `${state} Main APMC`,
    privatePrice: simulatedPrice,
    arrivalQuantity: `${simulatedArrival.toLocaleString("en-IN")} Quintals`,
    trend: simulatedTrend as "up" | "down"
  };
};

export default function MarketPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCropModal, setSelectedCropModal] = useState<CropItem | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"trend" | "state" | "details">("trend");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const [selectedModalStates, setSelectedModalStates] = useState<string[]>([]);

  // Each display row = one crop + one state price entry
  interface DisplayRow {
    crop: CropItem;
    stateName: string;
    district: string;
    mandiName: string;
    price: number;
    arrivalQuantity: string;
    trend: "up" | "down";
    rowKey: string;
  }

  // Build expanded list: when no state selected, one card per statePrices entry
  const displayRows = useMemo((): DisplayRow[] => {
    const term = searchTerm.toLowerCase().trim();
    const rows: DisplayRow[] = [];

    COMPREHENSIVE_CROPS_DATABASE.forEach((crop) => {
      // Match crop name / category / search term
      const matchesSearch =
        !term ||
        crop.name.toLowerCase().includes(term) ||
        crop.scientificName.toLowerCase().includes(term) ||
        crop.category.toLowerCase().includes(term);

      const matchesCategory =
        selectedCategory === "All Categories" ||
        crop.category === selectedCategory;

      if (!matchesSearch || !matchesCategory) return;

      if (selectedState !== "All States") {
        // State filter ON → show only that state's price
        let sp = crop.statePrices.find(s => s.state === selectedState);
        
        // DYNAMICALLY GENERATE PRICE IF STATE DOESN'T EXIST IN DB
        if (!sp) {
          sp = generateSimulatedStatePrice(crop, selectedState);
        }

        if (sp) {
          rows.push({
            crop,
            stateName: sp.state,
            district: sp.district,
            mandiName: sp.mandiName,
            price: sp.privatePrice,
            arrivalQuantity: sp.arrivalQuantity,
            trend: sp.trend,
            rowKey: `${crop.id}-${sp.state}`,
          });
        }
      } else {
        // No state filter → expand into one card per state
        crop.statePrices.forEach((sp) => {
          rows.push({
            crop,
            stateName: sp.state,
            district: sp.district,
            mandiName: sp.mandiName,
            price: sp.privatePrice,
            arrivalQuantity: sp.arrivalQuantity,
            trend: sp.trend,
            rowKey: `${crop.id}-${sp.state}`,
          });
        });
      }
    });

    // Sort: highest price first
    rows.sort((a, b) => b.price - a.price);
    return rows;
  }, [searchTerm, selectedCategory, selectedState]);

  // Generate all 30 states for the modal
  const fullStatePrices = useMemo(() => {
    if (!selectedCropModal) return [];
    const pricesMap = new Map(selectedCropModal.statePrices.map(sp => [sp.state, sp]));
    return ALL_INDIAN_STATES.filter(s => s !== "All States").map(state => {
      if (pricesMap.has(state)) return pricesMap.get(state)!;
      return generateSimulatedStatePrice(selectedCropModal, state);
    });
  }, [selectedCropModal]);

  const filteredModalStatePrices = useMemo(() => {
    if (selectedModalStates.length === 0) {
      return selectedCropModal ? selectedCropModal.statePrices : [];
    }
    return fullStatePrices.filter(sp => selectedModalStates.includes(sp.state));
  }, [fullStatePrices, selectedModalStates, selectedCropModal]);

  // LIVE POP-UP SEARCH DROPDOWN MATCHES
  const searchSuggestions = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const term = searchTerm.toLowerCase().trim();
    return COMPREHENSIVE_CROPS_DATABASE.filter(c => 
      c.name.toLowerCase().includes(term) || 
      c.category.toLowerCase().includes(term) ||
      c.scientificName.toLowerCase().includes(term)
    ).slice(0, 6);
  }, [searchTerm]);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSearchDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-4 md:p-8 font-sans max-w-7xl mx-auto space-y-8 pt-[78px]">
      
      {/* HEADER BANNER WITH SLEEK ORIGINAL BORDER */}
      <div className="bg-gradient-to-r from-green-900 via-emerald-800 to-green-950 text-white rounded-3xl p-6 md:p-10 shadow-xl border border-green-700/30 relative overflow-hidden space-y-4">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-500/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 space-y-2">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-extrabold text-green-300 border border-white/20">
            <Globe className="w-3.5 h-3.5 text-yellow-400" />
            <span>{t('real_time_apmc', 'Real-Time APMC Mandi Rates Across 36 States & UTs')}</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-white">
            {t('market_analytics', 'Market Prices & Analytics')}
          </h1>

          <p className="text-green-100/90 text-xs md:text-sm font-medium max-w-3xl leading-relaxed">
            {t('market_subtitle', 'Search any Crop, Fruit, or Vegetable. Interactive 6-month price comparison graphs & state-by-state APMC rates.')} Engineered by Uday Pratap Singh Chauhan (udchauhan0987@gmail.com).
          </p>
        </div>
      </div>

      {/* SEARCH BAR WITH LIVE POP-UP SUGGESTIONS DROPDOWN */}
      <div className="bg-white dark:bg-[#1a1b23] rounded-3xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-white/10 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* SEARCH INPUT & LIVE POPUP DROPDOWN */}
          <div ref={searchContainerRef} className="relative md:col-span-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3.5 z-10" />
            <input
              type="text"
              placeholder={t('search_placeholder_market', 'Search any crop, fruit (e.g. Apple, Mango), or vegetable...')}
              value={searchTerm}
              onFocus={() => setShowSearchDropdown(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchDropdown(true);
              }}
              className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500"
            />
            {searchTerm && (
              <button onClick={() => { setSearchTerm(""); setShowSearchDropdown(false); }} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 z-10">
                <X className="w-4 h-4" />
              </button>
            )}

            {/* LIVE POP-UP DROPDOWN FOR MATCHING FRUITS, CROPS & VEGGIES */}
            {showSearchDropdown && searchTerm.trim() !== "" && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#16171f] border border-green-500/40 rounded-2xl shadow-2xl z-50 overflow-hidden text-xs">
                {searchSuggestions.length > 0 ? (
                  <div className="p-2 space-y-1">
                    <span className="text-[10px] font-black uppercase text-gray-400 px-3 py-1 block">{t('live_matching', 'Live Matching Commodities:')}</span>
                    {searchSuggestions.map((crop) => (
                      <button
                        key={crop.id}
                        onClick={() => {
                          setSearchTerm(crop.name);
                          setShowSearchDropdown(false);
                          setSelectedCropModal(crop);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/60 flex items-center justify-between transition-colors font-bold"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{crop.iconEmoji}</span>
                          <div>
                            <span className="text-gray-900 dark:text-white block">{crop.name}</span>
                            <span className="text-[10px] text-gray-400 block">{crop.category} • {crop.state}</span>
                          </div>
                        </div>
                        <span className="text-green-600 dark:text-green-400 font-black">₹{crop.private}/q</span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center space-y-1">
                    <AlertCircle className="w-5 h-5 text-amber-500 mx-auto" />
                    <p className="font-extrabold text-xs text-gray-900 dark:text-white">
                      {t('market_price_not_available', 'Market Price Currently Not Available for')} "{searchTerm}"
                    </p>
                    <p className="text-[10px] text-gray-400 font-medium">
                      {t('market_price_update_msg', 'APMC Mandi rates update daily at 09:00 AM. This item may be currently out of season.')}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* CATEGORY SELECTOR */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500 cursor-pointer"
            >
              <option value="All Categories">{t('all_categories', 'All Categories')}</option>
              <option value="Cereals & Grains">🌾 {t('cereals_grains', 'Cereals & Grains')}</option>
              <option value="Pulses & Legumes">🫘 {t('pulses_legumes', 'Pulses & Legumes')}</option>
              <option value="Vegetables">🧅 {t('vegetables_roots', 'Vegetables & Roots')}</option>
              <option value="Fruits">🍎 {t('fruits_orchards', 'Fruits & Orchards')}</option>
              <option value="Oilseeds">🌱 {t('oilseeds', 'Oilseeds')}</option>
              <option value="Spices & Herbs">🫚 {t('spices_herbs', 'Spices & Herbs')}</option>
              <option value="Commercial & Plantation">🌿 {t('commercial_plantation', 'Commercial & Plantation')}</option>
            </select>
          </div>

          {/* STATE SELECTOR */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs text-gray-900 dark:text-white focus:outline-none focus:border-green-500 cursor-pointer"
            >
              {ALL_INDIAN_STATES.map((st, idx) => (
                <option key={idx} value={st}>{st === "All States" ? `📍 ${t('all_indian_states', 'All Indian States')}` : `📍 ${st}`}</option>
              ))}
            </select>
          </div>

        </div>

        <div className="flex justify-between items-center pt-2 text-xs font-black text-gray-500 border-t border-gray-100 dark:border-white/5">
          <span>{t('showing_active', 'Showing active Mandi listings')} ({displayRows.length})</span>
          {(searchTerm || selectedState !== "All States" || selectedCategory !== "All Categories") && (
            <button onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedState("All States"); }} className="text-green-600 dark:text-green-400 hover:underline">
              {t('clear_all_filters', 'Clear All Filters')}
            </button>
          )}
        </div>
      </div>

      {/* NOT AVAILABLE ALERT BANNER IF SEARCH HAS NO MATCHES */}
      {displayRows.length === 0 && (
        <div className="bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 p-6 rounded-3xl text-center space-y-2">
          <AlertCircle className="w-8 h-8 text-amber-600 dark:text-amber-400 mx-auto" />
          <h3 className="font-black text-base text-amber-900 dark:text-amber-200">
            {t('market_price_not_available', 'Market Price Currently Not Available for')} "{searchTerm || selectedState}"
          </h3>
          <p className="text-xs text-amber-800 dark:text-amber-300 font-medium max-w-lg mx-auto">
            {t('crop_fruit_not_listed', 'This crop, fruit, or vegetable is currently not listed in active Mandi arrival logs today. Rates update every morning at 09:00 AM.')}
          </p>
          <button
            onClick={() => { setSearchTerm(""); setSelectedState("All States"); setSelectedCategory("All Categories"); }}
            className="px-4 py-2 bg-amber-600 text-white font-extrabold text-xs rounded-xl shadow-md mt-2"
          >
            {t('show_all_commodities', 'Show All Available Commodities')}
          </button>
        </div>
      )}

      {/* COMMODITY GRID — one card per state listing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayRows.map((row) => {
          const { crop, stateName, district, mandiName: rowMandi, price, arrivalQuantity, trend: rowTrend } = row;
          const isUp = rowTrend === "up";
          return (
            <div
              key={row.rowKey}
              className="bg-white dark:bg-[#1a1b23] rounded-3xl border border-gray-100 dark:border-white/10 p-6 shadow-sm hover:shadow-xl hover:border-green-500/50 transition-all duration-300 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2.5 bg-gray-100 dark:bg-white/10 rounded-2xl border border-gray-200 dark:border-white/10 shadow-sm">
                      {crop.iconEmoji}
                    </span>
                    <div>
                      <h3 className="font-black text-sm text-gray-900 dark:text-white leading-tight">{crop.name}</h3>
                      <span className="text-[10px] text-gray-400 font-bold block italic">{crop.scientificName}</span>
                    </div>
                  </div>
                  <span className="text-[9px] font-black uppercase px-2 py-1 rounded-lg bg-green-100 dark:bg-green-950 text-green-700 dark:text-green-300 border border-green-300 dark:border-green-800 shrink-0 ml-1">
                    {crop.category}
                  </span>
                </div>

                {/* State + Mandi location */}
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold bg-gray-50 dark:bg-white/5 p-2.5 rounded-xl border border-gray-200/60 dark:border-white/5">
                  <MapPin className="w-3.5 h-3.5 text-green-600 shrink-0" />
                  <div className="flex items-center gap-1 overflow-hidden">
                    <span className="truncate">{rowMandi} • {district},</span>
                    <select 
                      value={stateName}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => setSelectedState(e.target.value)}
                      className="bg-transparent border-none text-green-600 dark:text-green-400 font-extrabold outline-none cursor-pointer hover:underline appearance-none px-1"
                    >
                      {ALL_INDIAN_STATES.map(s => (
                        <option key={s} value={s}>{s === "All States" ? "Select State" : s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Arrival quantity badge */}
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-md border border-blue-200 dark:border-blue-800">
                    📦 {t('arrival', 'Arrival')}: {arrivalQuantity}
                  </span>
                  <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-md border flex items-center gap-0.5 ${
                    isUp
                      ? "bg-green-50 dark:bg-green-950/40 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800"
                      : "bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800"
                  }`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {isUp ? t('rising', 'Rising') : t('falling', 'Falling')}
                  </span>
                </div>

                {/* Price display */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-green-50/80 dark:bg-green-950/40 p-3 rounded-2xl border border-green-300 dark:border-green-800 space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-green-800 dark:text-green-300 block">{t('apmc_mandi_rate', 'APMC Mandi Rate')}</span>
                    <span className="text-lg font-black text-green-700 dark:text-green-400 block">₹{price.toLocaleString("en-IN")}<span className="text-[10px] font-bold text-gray-500">/q</span></span>
                  </div>
                  <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/10 space-y-0.5">
                    <span className="text-[10px] font-black uppercase text-gray-400 block">{t('govt_msp_rate', 'Govt MSP Rate')}</span>
                    <span className="text-lg font-black text-gray-900 dark:text-white block">₹{crop.govt.toLocaleString("en-IN")}<span className="text-[10px] font-bold text-gray-400">/q</span></span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 dark:border-white/10 flex justify-between items-center text-xs">
                <span className="text-[10px] font-bold text-gray-400">{crop.season} • {crop.durationDays}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => { 
                      setSelectedCropModal(crop); 
                      setActiveModalTab("state"); 
                      setSelectedModalStates([]);
                    }}
                    className="px-3.5 py-1.5 bg-green-600 hover:bg-green-700 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-1 transition-all"
                  >
                    <BarChart2 className="w-3.5 h-3.5" /> {t('view_graph_analytics', 'All State Prices')}
                  </button>
                  <Link
                    href={`/marketplace?search=${encodeURIComponent(crop.name.split(' ')[0])}&autobuy=true`}
                    className="px-3.5 py-1.5 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-800 text-green-700 dark:text-green-300 font-extrabold text-xs rounded-xl shadow-sm flex items-center gap-1 transition-all"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" /> Buy
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* RICH INTERACTIVE GRAPH ANALYTICS MODAL */}
      {selectedCropModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1a1b23] border border-gray-200 dark:border-white/10 rounded-3xl max-w-3xl w-full p-6 shadow-2xl space-y-5 max-h-[92vh] overflow-y-auto">
            
            {/* MODAL HEADER */}
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-4xl p-2 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-200 dark:border-white/10">
                  {selectedCropModal.iconEmoji}
                </span>
                <div>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
                    {selectedCropModal.name}
                  </h3>
                  <span className="text-xs text-gray-400 font-bold">
                    {selectedCropModal.scientificName} • {selectedCropModal.category}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedCropModal(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* KEY METRICS BAR */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-green-50 dark:bg-green-950/40 p-3 rounded-2xl border border-green-200 dark:border-green-800">
                <span className="text-green-800 dark:text-green-300 font-bold block text-[10px]">{t('apmc_mandi_rate', 'APMC Mandi Price')}</span>
                <span className="text-base font-black text-green-700 dark:text-green-400">₹{selectedCropModal.private}/q</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/10">
                <span className="text-gray-400 font-bold block text-[10px]">{t('govt_msp_rate', 'Govt MSP Rate')}</span>
                <span className="text-base font-black text-gray-900 dark:text-white">₹{selectedCropModal.govt}/q</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/10">
                <span className="text-gray-400 font-bold block text-[10px]">{t('avg_yield_acre', 'Avg Yield / Acre')}</span>
                <span className="text-xs font-black text-gray-900 dark:text-white">{selectedCropModal.avgYieldPerAcre}</span>
              </div>
              <div className="bg-gray-50 dark:bg-white/5 p-3 rounded-2xl border border-gray-200 dark:border-white/10">
                <span className="text-gray-400 font-bold block text-[10px]">{t('quality_grade', 'Quality Grade')}</span>
                <span className="text-xs font-black text-green-600 dark:text-green-400">{selectedCropModal.qualityGrade}</span>
              </div>
            </div>

            {/* GRAPH VIEW TAB TOGGLE */}
            <div className="flex border-b border-gray-200 dark:border-white/10 text-xs font-extrabold gap-4 pt-2">
              <button
                onClick={() => setActiveModalTab("trend")}
                className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeModalTab === "trend"
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <LineChartIcon className="w-4 h-4" /> {t('six_month_trend', '6-Month Price Trend Graph')}
              </button>

              <button
                onClick={() => setActiveModalTab("state")}
                className={`pb-2 flex items-center gap-1.5 border-b-2 transition-all ${
                  activeModalTab === "state"
                    ? "border-green-600 text-green-600 dark:text-green-400"
                    : "border-transparent text-gray-400 hover:text-gray-600"
                }`}
              >
                <BarChart2 className="w-4 h-4" /> {t('state_comparison_chart', 'State Comparison Bar Chart')}
              </button>
            </div>

            {/* GRAPH TAB CONTENT */}
            {activeModalTab === "trend" ? (
              <div className="space-y-3 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-extrabold text-gray-900 dark:text-white">{t('six_month_price_trend', '6-Month Price Trend (Govt MSP vs APMC Rate)')}</span>
                  <span className="text-[10px] text-green-600 font-bold bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-md">{t('live_historical_logs', 'Live Historical Logs')}</span>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={selectedCropModal.history}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fontWeight: "bold" }} />
                      <YAxis tick={{ fontSize: 11, fontWeight: "bold" }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "#1a1b23", borderColor: "#10b981", borderRadius: "12px", color: "#fff", fontSize: "12px", fontWeight: "bold" }} 
                      />
                      <Legend wrapperStyle={{ fontSize: "11px", fontWeight: "bold" }} />
                      <Line type="monotone" dataKey="private" name="APMC Mandi Rate (₹/q)" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="govt" name="Govt MSP Rate (₹/q)" stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-gray-50/50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-extrabold text-gray-900 dark:text-white">{t('state_by_state_mandi_price', 'State-by-State Mandi Price Comparison')}</span>
                    <span className="text-[10px] text-gray-400 font-bold">{t('rates_in_rs_quintal', 'Rates in ₹ per Quintal')}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 custom-scrollbar border border-gray-100 dark:border-white/5 rounded-xl bg-white/50 dark:bg-black/20">
                    {ALL_INDIAN_STATES.filter(s => s !== "All States").map(state => {
                      const isSelected = selectedModalStates.includes(state);
                      return (
                        <button
                          key={state}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedModalStates(prev => prev.filter(s => s !== state));
                            } else {
                              setSelectedModalStates(prev => [...prev, state]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ${
                            isSelected 
                              ? "bg-green-600 text-white border-green-600 shadow-md" 
                              : "bg-white dark:bg-[#1a1b23] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10 hover:border-green-400"
                          }`}
                        >
                          {state} {isSelected && <Check className="w-3 h-3" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="h-64 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={filteredModalStatePrices.slice(0, 12)}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                      <XAxis dataKey="state" tick={{ fontSize: 11, fontWeight: "bold" }} />
                      <YAxis tick={{ fontSize: 11, fontWeight: "bold" }} />
                      <RechartsTooltip 
                        contentStyle={{ backgroundColor: "#1a1b23", borderColor: "#10b981", borderRadius: "12px", color: "#fff", fontSize: "12px", fontWeight: "bold" }} 
                      />
                      <Bar dataKey="privatePrice" name="State Mandi Rate (₹/q)" fill="#10b981" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            {/* STATE MANDI DETAILS LIST */}
            <div className="space-y-2 text-xs">
              <h4 className="font-extrabold text-gray-900 dark:text-white uppercase tracking-wider text-xs flex justify-between items-center">
                {t('verified_state_apmc', 'Verified State APMC Mandi Rates')}
                <span className="text-[10px] text-green-600 font-black">{filteredModalStatePrices.length} States Found</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1">
                {filteredModalStatePrices.map((sp, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 dark:bg-white/5 p-3 rounded-xl border border-gray-200/60 dark:border-white/5 font-bold">
                    <div>
                      <span className="text-gray-900 dark:text-white block">{sp.mandiName}</span>
                      <span className="text-[10px] text-gray-400">{sp.state} • {t('arrival', 'Arrival:')} {sp.arrivalQuantity}</span>
                    </div>
                    <span className="text-sm font-black text-green-600 dark:text-green-400">₹{sp.privatePrice}/q</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedCropModal(null)}
              className="w-full py-3 bg-gray-200 dark:bg-white/10 font-black text-xs text-gray-800 dark:text-gray-200 rounded-xl hover:bg-gray-300 dark:hover:bg-white/20 transition-colors"
            >
              {t('close_analytics_panel', 'Close Analytics Panel')}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
