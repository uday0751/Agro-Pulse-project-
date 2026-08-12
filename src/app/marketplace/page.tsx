"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Search, MapPin, Phone, MessageSquare, 
  CheckCircle2, X, ShieldCheck, ArrowRight, Truck, Star, ArrowUpDown, User, XCircle, Clock, ArrowRightCircle, Sparkles, Check, FileText, ChevronRight, Hash, Receipt, Eye, Calendar, Sprout, Award, Info, DollarSign, ListOrdered, ChevronDown, AlertTriangle, PackageCheck, Filter, ChevronUp, Map, CreditCard, RefreshCw, Printer, ExternalLink
} from "lucide-react";
import Link from "next/link";

export interface FarmerCropListing {
  id: string;
  cropName: string;
  category: string;
  iconEmoji: string;
  farmerName: string;
  phone: string;
  whatsapp: string;
  state: string;
  district: string;
  village: string;
  pricePerQuintal: number;
  availableQuantityQuintals: number;
  qualityGrade: "Organic Certified" | "Grade A Premium" | "Standard Fresh" | "Export Quality" | "Natural Farming";
  deliveryOption: "Doorstep Delivery" | "Farmer Location Pickup" | "Mandi Transport";
  rating: number;
  harvestDate: string;
  description: string;
  imageUrl: string;
  createdAt: string;
  moistureContent?: string;
  soilType?: string;
}

export interface BuyerOrderRequest {
  sequenceNo: number;
  orderId: string;
  listingId: string;
  cropName: string;
  iconEmoji: string;
  farmerName: string;
  farmerPhone: string;
  farmerWhatsapp: string;
  buyerName: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerPincode: string;
  quantityQuintals: number;
  pricePerQuintal: number;
  subtotal: number;
  deliveryFee: number;
  totalPrice: number;
  orderDate: string;
  status: "Pending" | "Accepted" | "Dispatched" | "Completed" | "Cancelled by Buyer" | "Cancelled by Farmer";
  cancellationReason?: string;
  paymentMethod: string;
  qualityGrade?: string;
  deliveryOption?: string;
  farmLocation?: string;
}

export const ALL_INDIAN_STATES_AND_UTS = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", 
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", 
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", 
  "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", 
  "Dadra and Nagar Haveli and Daman and Diu", "Delhi NCR", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

// COMPREHENSIVE MANDI CROPS LISTING DATABASE
const INITIAL_LISTINGS: FarmerCropListing[] = [
  {
    id: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    phone: "+91 98221 45678",
    whatsapp: "919822145678",
    state: "Maharashtra",
    district: "Pune",
    village: "Baramati",
    pricePerQuintal: 2550,
    availableQuantityQuintals: 45,
    qualityGrade: "Organic Certified",
    deliveryOption: "Doorstep Delivery",
    rating: 4.9,
    harvestDate: "2026-07-25",
    description: "100% Organic certified Lokwan wheat grown without chemical pesticides. High gluten and protein content, ideal for soft chapatis, rotis, and commercial baking.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    createdAt: "2 hours ago",
    moistureContent: "11.2% (Optimal Dry)",
    soilType: "Black Loam Soil"
  },
  {
    id: "lst-102",
    cropName: "Fresh Red Tomatoes (Hybrid)",
    category: "Vegetables",
    iconEmoji: "🍅",
    farmerName: "Venkatesh Gowda",
    phone: "+91 94480 12345",
    whatsapp: "919448012345",
    state: "Karnataka",
    district: "Kolar",
    village: "Mulbagal",
    pricePerQuintal: 1650,
    availableQuantityQuintals: 120,
    qualityGrade: "Grade A Premium",
    deliveryOption: "Farmer Location Pickup",
    rating: 4.8,
    harvestDate: "2026-07-29",
    description: "Freshly harvested firm red tomatoes with high shelf life (up to 14 days). Ideal for hotels, wholesale markets, sauce manufacturing, and retail grocery stores.",
    imageUrl: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80",
    createdAt: "5 hours ago",
    moistureContent: "Fresh Juicy Harvest",
    soilType: "Red Clay Loam"
  },
  {
    id: "lst-103",
    cropName: "Premium Basmati Rice (1121)",
    category: "Cereals & Grains",
    iconEmoji: "🌾",
    farmerName: "Gurpreet Singh",
    phone: "+91 98140 98765",
    whatsapp: "919814098765",
    state: "Punjab",
    district: "Ludhiana",
    village: "Jagraon",
    pricePerQuintal: 4350,
    availableQuantityQuintals: 200,
    qualityGrade: "Export Quality",
    deliveryOption: "Mandi Transport",
    rating: 5.0,
    harvestDate: "2026-07-20",
    description: "Aged 1121 extra-long grain Basmati rice direct from Punjab farm. Double polished, 0% broken grains, distinct aromatic fragrance.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    createdAt: "1 day ago",
    moistureContent: "12.0% Standard",
    soilType: "Alluvial Canal Soil"
  },
  {
    id: "lst-104",
    cropName: "Onion (Nashik Red)",
    category: "Vegetables",
    iconEmoji: "🧅",
    farmerName: "Dnyaneshwar Shinde",
    phone: "+91 98230 77889",
    whatsapp: "919823077889",
    state: "Maharashtra",
    district: "Nashik",
    village: "Lasalgaon",
    pricePerQuintal: 1850,
    availableQuantityQuintals: 150,
    qualityGrade: "Export Quality",
    deliveryOption: "Doorstep Delivery",
    rating: 4.9,
    harvestDate: "2026-07-28",
    description: "Authentic Lasalgaon Nashik Red onions. Well cured, dry skin, high pungency, long storage life.",
    imageUrl: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80",
    createdAt: "3 hours ago"
  },
  {
    id: "lst-105",
    cropName: "Alphonso Mango (Ratnagiri Hapus)",
    category: "Fruits",
    iconEmoji: "🥭",
    farmerName: "Subhash Kelkar",
    phone: "+91 94220 33445",
    whatsapp: "919422033445",
    state: "Maharashtra",
    district: "Ratnagiri",
    village: "Devgad",
    pricePerQuintal: 18500,
    availableQuantityQuintals: 30,
    qualityGrade: "Organic Certified",
    deliveryOption: "Doorstep Delivery",
    rating: 5.0,
    harvestDate: "2026-07-27",
    description: "GI-Tagged original Ratnagiri Alphonso mangoes. Naturally ripened in straw, rich saffron pulp, world famous fragrance.",
    imageUrl: "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80",
    createdAt: "1 hour ago"
  },
  {
    id: "lst-106",
    cropName: "Kashmiri Red Apple",
    category: "Fruits",
    iconEmoji: "🍎",
    farmerName: "Tariq Ahmad Mir",
    phone: "+91 99060 11223",
    whatsapp: "919906011223",
    state: "Jammu and Kashmir",
    district: "Baramulla",
    village: "Sopore",
    pricePerQuintal: 12500,
    availableQuantityQuintals: 85,
    qualityGrade: "Export Quality",
    deliveryOption: "Mandi Transport",
    rating: 4.9,
    harvestDate: "2026-07-26",
    description: "Crisp, sweet, deep red Sopore Kashmiri Delicious Apples direct from orchard. Hand-picked and wooden crate packed.",
    imageUrl: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80",
    createdAt: "4 hours ago"
  },
  {
    id: "lst-107",
    cropName: "Pigeon Pea / Tur (Arhar Red)",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    farmerName: "Hanumant Rao",
    phone: "+91 94231 66778",
    whatsapp: "919423166778",
    state: "Maharashtra",
    district: "Latur",
    village: "Ausa",
    pricePerQuintal: 10200,
    availableQuantityQuintals: 60,
    qualityGrade: "Grade A Premium",
    deliveryOption: "Farmer Location Pickup",
    rating: 4.7,
    harvestDate: "2026-07-22",
    description: "Latur special bold Red Tur / Arhar dal whole grain. Unpolished, chemical-free processing.",
    imageUrl: "https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80",
    createdAt: "6 hours ago"
  },
  {
    id: "lst-108",
    cropName: "Chickpea / Chana (Desi)",
    category: "Pulses & Legumes",
    iconEmoji: "🫘",
    farmerName: "Vikramaditya Singh",
    phone: "+91 98260 55443",
    whatsapp: "919826055443",
    state: "Madhya Pradesh",
    district: "Ujjain",
    village: "Nagda",
    pricePerQuintal: 6250,
    availableQuantityQuintals: 90,
    qualityGrade: "Standard Fresh",
    deliveryOption: "Doorstep Delivery",
    rating: 4.8,
    harvestDate: "2026-07-24",
    description: "Ujjain Mandi bold Desi Chana. High germination rate, ideal for dal milling and sprouts.",
    imageUrl: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=600&q=80",
    createdAt: "Just now"
  }
];

const INITIAL_ORDERS: BuyerOrderRequest[] = [
  {
    sequenceNo: 1,
    orderId: "ORD-9081",
    listingId: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45678",
    farmerWhatsapp: "919822145678",
    buyerName: "Amitabh Verma",
    buyerPhone: "+91 98200 11223",
    buyerAddress: "Plot 42, Market Yard, Pune, Maharashtra",
    buyerPincode: "411037",
    quantityQuintals: 10,
    pricePerQuintal: 2550,
    subtotal: 25500,
    deliveryFee: 500,
    totalPrice: 26000,
    orderDate: "Today, 02:30 PM",
    status: "Pending",
    paymentMethod: "Cash on Delivery / Direct Bank",
    qualityGrade: "Organic Certified",
    deliveryOption: "Doorstep Delivery",
    farmLocation: "Baramati, Pune, Maharashtra"
  },
  {
    sequenceNo: 2,
    orderId: "ORD-9082",
    listingId: "lst-105",
    cropName: "Alphonso Mango (Ratnagiri Hapus)",
    iconEmoji: "🥭",
    farmerName: "Subhash Kelkar",
    farmerPhone: "+91 94220 33445",
    farmerWhatsapp: "919422033445",
    buyerName: "Amitabh Verma",
    buyerPhone: "+91 98200 11223",
    buyerAddress: "Plot 42, Market Yard, Pune, Maharashtra",
    buyerPincode: "411037",
    quantityQuintals: 5,
    pricePerQuintal: 18500,
    subtotal: 92500,
    deliveryFee: 400,
    totalPrice: 92900,
    orderDate: "Yesterday",
    status: "Cancelled by Farmer",
    cancellationReason: "Stock depleted due to heavy unseasonal rains at farm orchard in Ratnagiri.",
    paymentMethod: "Prepaid Bank Transfer",
    qualityGrade: "GI-Tagged Original Hapus",
    deliveryOption: "Doorstep Delivery",
    farmLocation: "Devgad, Ratnagiri, Maharashtra"
  },
  {
    sequenceNo: 3,
    orderId: "ORD-9083",
    listingId: "lst-104",
    cropName: "Onion (Nashik Red)",
    iconEmoji: "🧅",
    farmerName: "Dnyaneshwar Shinde",
    farmerPhone: "+91 98230 77889",
    farmerWhatsapp: "919823077889",
    buyerName: "Amitabh Verma",
    buyerPhone: "+91 98200 11223",
    buyerAddress: "Plot 42, Market Yard, Pune, Maharashtra",
    buyerPincode: "411037",
    quantityQuintals: 20,
    pricePerQuintal: 1850,
    subtotal: 37000,
    deliveryFee: 500,
    totalPrice: 37500,
    orderDate: "2 days ago",
    status: "Accepted",
    paymentMethod: "Prepaid Direct",
    qualityGrade: "Export Quality",
    deliveryOption: "Doorstep Delivery",
    farmLocation: "Lasalgaon, Nashik, Maharashtra"
  }
];

const CATEGORIES = [
  "All Categories",
  "Cereals & Grains",
  "Vegetables",
  "Fruits",
  "Pulses & Legumes",
  "Oilseeds",
  "Spices & Herbs",
  "Commercial & Plantation"
];

export default function CustomerMarketplacePage() {
  const [activeTab, setActiveTab] = useState<"browse" | "my_orders">("browse");
  const [listings, setListings] = useState<FarmerCropListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<BuyerOrderRequest[]>(INITIAL_ORDERS);
  const [groupBy, setGroupBy] = useState<"crop" | "location">("crop");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedState, setSelectedState] = useState("All");
  const [sortBy, setSortBy] = useState<"newest" | "price_asc" | "price_desc" | "quantity">("newest");
  const [selectedGrade, setSelectedGrade] = useState("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [orderSort, setOrderSort] = useState<"newest" | "oldest">("newest");
  const [monthFilter, setMonthFilter] = useState<string>("All");

  // Detailed Modals State
  const [inspectingCrop, setInspectingCrop] = useState<FarmerCropListing | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<BuyerOrderRequest | null>(null);

  // Multi-step Checkout Modal State
  const [buyingListing, setBuyingListing] = useState<FarmerCropListing | null>(null);
  const [checkoutStep, setCheckoutStep] = useState<1 | 2 | 3>(1);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [quantityInput, setQuantityInput] = useState<string>("1");
  const [buyerName, setBuyerName] = useState("");
  const [buyerPhone, setBuyerPhone] = useState("");
  const [buyerStreet, setBuyerStreet] = useState("");
  const [buyerCity, setBuyerCity] = useState("");
  const [buyerPincode, setBuyerPincode] = useState("");

  useEffect(() => {
    let currentListings = INITIAL_LISTINGS;
    const savedListings = localStorage.getItem("agropulse_farmer_listings");
    if (savedListings) {
      try {
        const parsed = JSON.parse(savedListings);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(p => p.id));
          const merged = [...parsed];
          INITIAL_LISTINGS.forEach(item => {
            if (!existingIds.has(item.id)) merged.push(item);
          });
          currentListings = merged;
        }
      } catch (e) { console.error(e); }
    }

    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const query = params.get("search");
      const city = params.get("city");
      const state = params.get("state");
      const mandi = params.get("mandi");

      if (query) {
        setSearchQuery(query);
      }
      if (state && state !== "All" && state !== "undefined") {
        setSelectedState(state);
      }

      if (query && (city || state)) {
        const targetCity = city || "Local Mandi";
        const targetState = state || "Madhya Pradesh";
        const targetMandi = mandi || "APMC Mandi";

        const cityMatch = currentListings.find(item => 
          item.cropName.toLowerCase().includes(query.toLowerCase()) &&
          (item.state.toLowerCase().includes(targetState.toLowerCase()) || item.district.toLowerCase().includes(targetCity.toLowerCase()))
        );

        if (!cityMatch) {
          const localFarmerNames = ["Suresh Patel", "Rajeshwar Yadav", "Mohanlal Sharma", "Dinesh Verma", "Shivpal Singh"];
          const randomFarmer = localFarmerNames[Math.floor(Math.random() * localFarmerNames.length)];

          const localListing: FarmerCropListing = {
            id: `lst-local-${Date.now()}`,
            cropName: `${query} (${targetCity} Fresh Harvest)`,
            category: "Direct Mandi Harvest",
            iconEmoji: query.toLowerCase().includes("wheat") ? "🌾" : query.toLowerCase().includes("rice") ? "🌾" : query.toLowerCase().includes("tomato") ? "🍅" : query.toLowerCase().includes("onion") ? "🧅" : query.toLowerCase().includes("mango") ? "🥭" : query.toLowerCase().includes("apple") ? "🍎" : "🌿",
            farmerName: `${randomFarmer} (${targetCity} Farmer)`,
            phone: "+91 98765 43210",
            whatsapp: "919876543210",
            state: targetState,
            district: targetCity,
            village: `${targetMandi} Hub`,
            pricePerQuintal: query.toLowerCase().includes("mango") ? 18500 : query.toLowerCase().includes("apple") ? 12500 : query.toLowerCase().includes("rice") ? 4350 : query.toLowerCase().includes("tur") ? 10200 : query.toLowerCase().includes("chana") ? 6250 : 2550,
            availableQuantityQuintals: 85,
            qualityGrade: "Grade A Premium",
            deliveryOption: "Doorstep Delivery",
            rating: 4.9,
            harvestDate: "2026-07-30",
            description: `Freshly harvested ${query} directly from ${targetMandi}, ${targetCity}, ${targetState}. High quality grade, zero middleman markup. Ready for fast delivery.`,
            imageUrl: query.toLowerCase().includes("tomato") ? "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80" : query.toLowerCase().includes("onion") ? "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=600&q=80" : query.toLowerCase().includes("mango") ? "https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80" : query.toLowerCase().includes("apple") ? "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=600&q=80" : "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
            createdAt: "Live Just Now"
          };

          currentListings = [localListing, ...currentListings];
          setBuyingListing(localListing);
        } else {
          setBuyingListing(cityMatch);
        }
      }
    }

    setListings(currentListings);

    const savedOrders = localStorage.getItem("agropulse_farmer_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map(p => p.orderId));
          const merged = [...parsed];
          INITIAL_ORDERS.forEach(o => {
            if (!existingIds.has(o.orderId)) merged.push(o);
          });
          setOrders(merged);
        }
      } catch (e) { console.error(e); }
    }
  }, []);

  // Filter listings
  const filteredListings = useMemo(() => {
    let result = [...listings];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item => 
        item.cropName.toLowerCase().includes(q) ||
        item.farmerName.toLowerCase().includes(q) ||
        item.district.toLowerCase().includes(q) ||
        item.state.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== "All Categories") {
      result = result.filter(item => item.category === selectedCategory);
    }

    if (selectedState !== "All") {
      result = result.filter(item => item.state === selectedState);
    }

    if (selectedGrade !== "All") {
      result = result.filter(item => item.qualityGrade === selectedGrade);
    }

    if (sortBy === "price_asc") {
      result.sort((a, b) => a.pricePerQuintal - b.pricePerQuintal);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.pricePerQuintal - a.pricePerQuintal);
    } else if (sortBy === "quantity") {
      result.sort((a, b) => b.availableQuantityQuintals - a.availableQuantityQuintals);
    }

    return result;
  }, [listings, searchQuery, selectedCategory, selectedState, selectedGrade, sortBy]);

  // Filter & Sort Orders
  const filteredOrders = useMemo(() => {
    let list = orders.filter(o => {
      const matchStatus = statusFilter === "All" || o.status === statusFilter;
      const matchMonth = monthFilter === "All" || (o.orderDate && o.orderDate.toLowerCase().includes(monthFilter.toLowerCase()));
      return matchStatus && matchMonth;
    });

    if (orderSort === "newest") {
      list.sort((a, b) => (b.sequenceNo || 0) - (a.sequenceNo || 0));
    } else {
      list.sort((a, b) => (a.sequenceNo || 0) - (b.sequenceNo || 0));
    }

    return list;
  }, [orders, statusFilter, monthFilter, orderSort]);

  // Lifetime Customer Transaction Stats
  const buyerTransactionStats = useMemo(() => {
    const activeOrders = orders.filter(o => !o.status.includes("Cancelled"));
    const totalLifetimeSpend = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const acceptedCount = orders.filter(o => o.status === "Accepted").length;
    const dispatchedCount = orders.filter(o => o.status === "Dispatched").length;
    const completedCount = orders.filter(o => o.status === "Completed").length;
    const cancelledByFarmerCount = orders.filter(o => o.status === "Cancelled by Farmer").length;
    const cancelledByBuyerCount = orders.filter(o => o.status === "Cancelled by Buyer").length;

    return { 
      totalLifetimeSpend, 
      pendingCount, 
      acceptedCount, 
      dispatchedCount, 
      completedCount, 
      cancelledByFarmerCount,
      cancelledByBuyerCount,
      totalOrders: orders.length 
    };
  }, [orders]);

  const groupedData = useMemo(() => {
    const map: Record<string, FarmerCropListing[]> = {};
    filteredListings.forEach((item) => {
      const key = groupBy === "crop" ? item.category : `${item.state}`;
      if (!map[key]) map[key] = [];
      map[key].push(item);
    });
    return map;
  }, [filteredListings, groupBy]);

  const checkoutCalculations = useMemo(() => {
    if (!buyingListing) return { subtotal: 0, deliveryFee: 0, grandTotal: 0 };
    const subtotal = orderQuantity * buyingListing.pricePerQuintal;
    const deliveryFee = buyingListing.deliveryOption === "Doorstep Delivery" ? 400 : 0;
    const grandTotal = subtotal + deliveryFee;
    return { subtotal, deliveryFee, grandTotal };
  }, [buyingListing, orderQuantity]);

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone || !buyerStreet || !buyerCity || !buyerPincode) {
      alert("Please fill in all delivery details including your pincode.");
      return;
    }
    setCheckoutStep(2);
  };

  const handleFinalOrderSubmit = () => {
    if (!buyingListing) return;

    const fullAddress = `${buyerStreet}, ${buyerCity}, ${buyingListing.state}`;
    const nextSeq = orders.length > 0 ? Math.max(...orders.map(o => o.sequenceNo || 0)) + 1 : 1;
    
    const newOrder: BuyerOrderRequest = {
      sequenceNo: nextSeq,
      orderId: `ORD-${Math.floor(10000 + Math.random() * 90000)}`,
      listingId: buyingListing.id,
      cropName: buyingListing.cropName,
      iconEmoji: buyingListing.iconEmoji,
      farmerName: buyingListing.farmerName,
      farmerPhone: buyingListing.phone,
      farmerWhatsapp: buyingListing.whatsapp,
      buyerName: buyerName,
      buyerPhone: buyerPhone,
      buyerAddress: fullAddress,
      buyerPincode: buyerPincode,
      quantityQuintals: orderQuantity,
      pricePerQuintal: buyingListing.pricePerQuintal,
      subtotal: checkoutCalculations.subtotal,
      deliveryFee: checkoutCalculations.deliveryFee,
      totalPrice: checkoutCalculations.grandTotal,
      orderDate: "Today, Just Now",
      status: "Pending",
      paymentMethod: "Cash on Delivery / Direct Bank Transfer",
      qualityGrade: buyingListing.qualityGrade,
      deliveryOption: buyingListing.deliveryOption,
      farmLocation: `${buyingListing.village}, ${buyingListing.district}, ${buyingListing.state}`
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updatedOrders));

    setCheckoutStep(3);
  };

  const startCheckout = (listing: FarmerCropListing) => {
    setInspectingCrop(null);
    setBuyingListing(listing);
    setOrderQuantity(1);
    setQuantityInput("1");
    setCheckoutStep(1);
  };

  // Helper for Order Card Color Schemes
  const getOrderCardStyles = (status: BuyerOrderRequest["status"]) => {
    switch (status) {
      case "Pending":
        return {
          border: "border-2 border-amber-400/60 dark:border-amber-500/40",
          headerBg: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
          badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
          icon: <Clock className="w-4 h-4 text-amber-100 animate-pulse" />,
          label: "⏳ Pending Farmer Confirmation"
        };
      case "Accepted":
        return {
          border: "border-2 border-blue-500/60 dark:border-blue-500/40",
          headerBg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
          badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
          icon: <CheckCircle2 className="w-4 h-4 text-blue-100" />,
          label: "🔵 Order Accepted by Farmer"
        };
      case "Dispatched":
        return {
          border: "border-2 border-purple-500/60 dark:border-purple-500/40",
          headerBg: "bg-gradient-to-r from-purple-600 to-indigo-700 text-white",
          badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
          icon: <Truck className="w-4 h-4 text-purple-100 animate-bounce" />,
          label: "🚚 Order Dispatched — En Route"
        };
      case "Completed":
        return {
          border: "border-2 border-emerald-500/60 dark:border-emerald-500/40",
          headerBg: "bg-gradient-to-r from-emerald-600 to-green-700 text-white",
          badgeBg: "bg-emerald-100 text-emerald-900 border-emerald-300",
          icon: <PackageCheck className="w-4 h-4 text-emerald-100" />,
          label: "✅ Completed & Delivered"
        };
      case "Cancelled by Farmer":
        return {
          border: "border-2 border-red-500/60 dark:border-red-500/40",
          headerBg: "bg-gradient-to-r from-red-600 to-rose-700 text-white",
          badgeBg: "bg-red-100 text-red-900 border-red-300",
          icon: <AlertTriangle className="w-4 h-4 text-red-100" />,
          label: "❌ Cancelled by Farmer"
        };
      case "Cancelled by Buyer":
      default:
        return {
          border: "border-2 border-gray-300 dark:border-gray-700",
          headerBg: "bg-gradient-to-r from-gray-700 to-slate-800 text-white",
          badgeBg: "bg-gray-100 text-gray-800 border-gray-300",
          icon: <XCircle className="w-4 h-4 text-gray-200" />,
          label: "🚫 Cancelled by Buyer"
        };
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto pt-[78px]">
      
      {/* Customer Header Bar */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800">
              🛒 Customer Crop Market
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Direct Farm Purchasing & Order Tracking</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <ShoppingBag className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Buy Crops Directly From Farmers & Mandis
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("browse")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "browse" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> Browse Crops ({filteredListings.length})
            </button>
            <button
              onClick={() => setActiveTab("my_orders")}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "my_orders" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <Receipt className="w-4 h-4" /> My Orders ({orders.length})
            </button>
          </div>

          <Link
            href="/seller"
            className="hidden lg:flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 px-4 py-2.5 rounded-2xl text-xs font-black hover:bg-amber-100 transition-colors shadow-sm"
          >
            <span>Switch to Farmer Seller Desk</span>
            <ArrowRightCircle className="w-4 h-4 text-amber-600" />
          </Link>
        </div>
      </header>

      {/* BROWSE CROPS TO BUY */}
      {activeTab === "browse" && (
        <div>
          {/* Controls Bar */}
          <div className="bg-white dark:bg-[#1a1b23] p-4 md:p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-white/10 mb-8 space-y-4">
            <div className="flex flex-col md:flex-row gap-3 items-center">
              
              {/* Search Bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  className="block w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 text-sm font-semibold bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-emerald-500"
                  placeholder="Search by crop, farmer name, district, or state..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Complete 36 States & UTs Dropdown */}
              <div className="relative w-full md:w-56">
                <MapPin className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="All">All 36 States & UTs</option>
                  {ALL_INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              {/* Sort By Dropdown */}
              <div className="relative w-full md:w-44">
                <ArrowUpDown className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 pointer-events-none" />
                <select
                  value={sortBy}
                  onChange={(e: any) => setSortBy(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-xs font-bold text-gray-800 dark:text-gray-200 bg-gray-50 dark:bg-white/5 focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                >
                  <option value="newest">Sort: Newest First</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="quantity">Max Stock Quantity</option>
                </select>
              </div>

              {/* Group By Toggle */}
              <div className="flex items-center bg-gray-100 dark:bg-white/5 p-1 rounded-xl shrink-0 w-full md:w-auto">
                <button
                  onClick={() => setGroupBy("crop")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    groupBy === "crop" ? "bg-white dark:bg-[#1a1b23] text-emerald-700 dark:text-emerald-400 shadow-sm" : "text-gray-500"
                  }`}
                >
                  By Crop Type
                </button>
                <button
                  onClick={() => setGroupBy("location")}
                  className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                    groupBy === "location" ? "bg-white dark:bg-[#1a1b23] text-emerald-700 dark:text-emerald-400 shadow-sm" : "text-gray-500"
                  }`}
                >
                  By Location
                </button>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                    selectedCategory === cat
                      ? "bg-emerald-600 border-emerald-600 text-white"
                      : "bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-emerald-400"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* LISTINGS DISPLAY GROUPED */}
          {filteredListings.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl p-12 text-center my-8">
              <ShoppingBag className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No crop listings match "{searchQuery}"</h3>
              <button 
                onClick={() => { setSearchQuery(""); setSelectedState("All"); setSelectedCategory("All Categories"); setSelectedGrade("All"); }}
                className="mt-4 bg-emerald-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            Object.entries(groupedData).map(([groupTitle, items]) => (
              <div key={groupTitle} className="mb-10">
                <div className="flex items-center justify-between mb-4 border-b border-gray-200 dark:border-white/10 pb-2">
                  <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                    {groupBy === "crop" ? "📦" : "📍"} {groupTitle}
                    <span className="text-xs font-bold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded-full ml-1">
                      {items.length} Mandi Listings Available
                    </span>
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((listing) => (
                    <motion.div
                      key={listing.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between group"
                    >
                      <div>
                        {/* Image Header with Click to Inspect Overlay */}
                        <div 
                          onClick={() => setInspectingCrop(listing)}
                          className="relative h-52 w-full bg-gray-100 dark:bg-white/5 overflow-hidden cursor-pointer"
                        >
                          <img 
                            src={listing.imageUrl} 
                            alt={listing.cropName}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-extrabold px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> {listing.qualityGrade}
                          </span>

                          <span className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1">
                            <Truck className="w-3.5 h-3.5 text-emerald-400" /> {listing.deliveryOption}
                          </span>

                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-white/90 text-gray-900 font-extrabold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-lg">
                              <Eye className="w-4 h-4 text-emerald-600" /> View Crop Details
                            </span>
                          </div>
                        </div>

                        {/* Card Details */}
                        <div className="p-5" onClick={() => setInspectingCrop(listing)}>
                          <div className="flex justify-between items-start mb-2 cursor-pointer">
                            <div>
                              <h3 className="font-extrabold text-gray-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                                {listing.cropName}
                              </h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
                                  Seller: {listing.farmerName}
                                </span>
                                <span className="flex items-center text-[11px] text-yellow-500 font-bold bg-yellow-50 dark:bg-yellow-950/30 px-1.5 py-0.5 rounded-md">
                                  <Star className="w-3 h-3 fill-yellow-400 mr-0.5" /> {listing.rating}
                                </span>
                              </div>
                            </div>
                            <span className="text-2xl">{listing.iconEmoji}</span>
                          </div>

                          <div className="flex items-center gap-1 text-xs font-medium text-gray-500 dark:text-gray-400 mb-3">
                            <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                            <span>{listing.village}, {listing.district}, {listing.state}</span>
                          </div>

                          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                            {listing.description}
                          </p>

                          {/* Price Banner */}
                          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/40 p-3.5 rounded-xl flex justify-between items-center mb-4">
                            <div>
                              <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 uppercase">Mandi Rate</span>
                              <div className="text-lg font-extrabold text-emerald-700 dark:text-emerald-400">₹{listing.pricePerQuintal.toLocaleString("en-IN")}<span className="text-xs font-bold text-gray-500">/quintal</span></div>
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-gray-400 block font-semibold">Available Stock</span>
                              <span className="text-xs font-extrabold text-gray-900 dark:text-white">{listing.availableQuantityQuintals} Quintals</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setInspectingCrop(listing)}
                          className="bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 text-xs font-extrabold py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-600" /> View Details
                        </button>

                        <button
                          onClick={() => startCheckout(listing)}
                          className="bg-emerald-600 text-white font-extrabold py-2.5 rounded-xl text-xs hover:bg-emerald-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <ShoppingBag className="w-4 h-4" /> Buy Now
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* REDESIGNED MY CUSTOMER ORDERS WITH EXHAUSTIVE "SHOW FULL PURCHASE DETAILS" MODAL */}
      {activeTab === "my_orders" && (
        <div className="space-y-6">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            <div className="bg-white dark:bg-[#1a1b23] p-4 rounded-2xl border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase">Lifetime Spend</span>
              <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{buyerTransactionStats.totalLifetimeSpend.toLocaleString("en-IN")}</div>
              <span className="text-[10px] text-gray-500 font-bold">{buyerTransactionStats.totalOrders} Orders Total</span>
            </div>

            <button
              onClick={() => setStatusFilter(statusFilter === "Pending" ? "All" : "Pending")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Pending" ? "bg-amber-500 text-white border-amber-600 shadow-md" : "bg-white dark:bg-[#1a1b23] border-amber-200 dark:border-amber-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Pending" ? "text-white" : "text-amber-600"}`}>⏳ Pending</span>
              <div className={`text-lg font-black mt-1 ${statusFilter === "Pending" ? "text-white" : "text-amber-500"}`}>{buyerTransactionStats.pendingCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Filter Pending</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Accepted" ? "All" : "Accepted")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Accepted" ? "bg-blue-600 text-white border-blue-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-blue-200 dark:border-blue-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Accepted" ? "text-white" : "text-blue-600"}`}>🔵 Accepted</span>
              <div className={`text-lg font-black mt-1 ${statusFilter === "Accepted" ? "text-white" : "text-blue-600"}`}>{buyerTransactionStats.acceptedCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Filter Accepted</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Dispatched" ? "All" : "Dispatched")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Dispatched" ? "bg-purple-600 text-white border-purple-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-purple-200 dark:border-purple-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Dispatched" ? "text-white" : "text-purple-600"}`}>🚚 Dispatched</span>
              <div className={`text-lg font-black mt-1 ${statusFilter === "Dispatched" ? "text-white" : "text-purple-600"}`}>{buyerTransactionStats.dispatchedCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Filter En Route</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Completed" ? "All" : "Completed")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Completed" ? "bg-emerald-600 text-white border-emerald-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-emerald-200 dark:border-emerald-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Completed" ? "text-white" : "text-emerald-600"}`}>✅ Completed</span>
              <div className={`text-lg font-black mt-1 ${statusFilter === "Completed" ? "text-white" : "text-emerald-600"}`}>{buyerTransactionStats.completedCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Filter Delivered</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Cancelled by Farmer" ? "All" : "Cancelled by Farmer")}
              className={`p-4 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Cancelled by Farmer" ? "bg-red-600 text-white border-red-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-red-200 dark:border-red-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Cancelled by Farmer" ? "text-white" : "text-red-600"}`}>❌ Cancelled</span>
              <div className={`text-lg font-black mt-1 ${statusFilter === "Cancelled by Farmer" ? "text-white" : "text-red-600"}`}>{buyerTransactionStats.cancelledByFarmerCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Filter Cancelled</span>
            </button>
          </div>

          {/* CONTROLS HEADER BAR */}
          <div className="bg-white dark:bg-[#1a1b23] p-4 rounded-3xl border-2 border-gray-200 dark:border-white/10 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-600" />
                My Crop Purchase Orders ({filteredOrders.length})
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Click "Show Full Purchase Details" on any order card to view the complete tax invoice and full metadata.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* SORT DROPDOWN */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-500 uppercase">Sort:</span>
                <select
                  value={orderSort}
                  onChange={(e: any) => setOrderSort(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="newest">🕒 Latest First (Newest to Oldest)</option>
                  <option value="oldest">⏳ Oldest First</option>
                </select>
              </div>

              {/* STATUS FILTER DROPDOWN */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-gray-500 uppercase">Filter:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 text-xs font-black text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="All">All Statuses ({orders.length})</option>
                  <option value="Pending">⏳ Pending ({buyerTransactionStats.pendingCount})</option>
                  <option value="Accepted">🔵 Accepted ({buyerTransactionStats.acceptedCount})</option>
                  <option value="Dispatched">🚚 Dispatched ({buyerTransactionStats.dispatchedCount})</option>
                  <option value="Completed">✅ Completed ({buyerTransactionStats.completedCount})</option>
                  <option value="Cancelled by Farmer">❌ Cancelled by Farmer ({buyerTransactionStats.cancelledByFarmerCount})</option>
                  <option value="Cancelled by Buyer">🚫 Cancelled by Buyer ({buyerTransactionStats.cancelledByBuyerCount})</option>
                </select>
              </div>
            </div>
          </div>

          {/* DISTINCT INDIVIDUAL ORDER CARDS GRID */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1b23] border-2 border-dashed border-gray-200 dark:border-white/10 p-12 text-center rounded-3xl space-y-3">
              <Receipt className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white">No orders found under "{statusFilter}" status filter</h4>
              <button
                onClick={() => setStatusFilter("All")}
                className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all"
              >
                Reset Status Filter
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredOrders.map((order) => {
                const style = getOrderCardStyles(order.status);

                return (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-[#1a1b23] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all ${style.border}`}
                  >
                    {/* CARD HEADER BANNER WITH DISTINCT COLOR ACCENT */}
                    <div className={`px-6 py-3.5 ${style.headerBg} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-inner`}>
                      <div className="flex items-center gap-3">
                        <span className="bg-black/30 text-white font-black text-xs px-2.5 py-1 rounded-lg border border-white/20">
                          #{order.sequenceNo}
                        </span>
                        <span className="font-mono text-xs font-extrabold tracking-wider bg-white/10 px-2.5 py-0.5 rounded-md">
                          {order.orderId}
                        </span>
                        <span className="text-xs font-bold opacity-90 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> {order.orderDate}
                        </span>
                      </div>

                      {/* STATUS BADGE WITH ANIMATED ICON */}
                      <span className={`text-xs font-black px-3.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm ${style.badgeBg}`}>
                        {style.icon}
                        <span>{style.label}</span>
                      </span>
                    </div>

                    {/* CARD BODY WITH CLEAR VISUAL SECTIONS */}
                    <div className="p-6 space-y-5">
                      
                      {/* SECTION 1: CROP & FARMER DETAILS */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-500/30 shrink-0">
                            {order.iconEmoji}
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{order.cropName}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-extrabold">
                              <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                                <User className="w-3.5 h-3.5" /> Seller: {order.farmerName}
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-gray-400" /> {order.farmerPhone}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* TOTAL PRICE HIGHLIGHT */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 px-5 py-3 rounded-2xl text-right shrink-0">
                          <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Total Order Amount</span>
                          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{order.totalPrice.toLocaleString("en-IN")}</div>
                        </div>
                      </div>

                      {/* CANCELLATION REASON BANNER IF CANCELLED BY FARMER OR BUYER */}
                      {order.status === "Cancelled by Farmer" && (
                        <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-2xl border-2 border-red-500/50 text-xs font-bold text-red-900 dark:text-red-200 flex items-start gap-3 shadow-sm">
                          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-black text-red-700 dark:text-red-400 block text-xs">Farmer Cancellation Reason:</span>
                            <p className="mt-0.5 text-red-800 dark:text-red-200 font-semibold">{order.cancellationReason || "Stock depleted or harvest affected by unseasonal weather."}</p>
                          </div>
                        </div>
                      )}

                      {/* SECTION 2: ITEMIZED ORDER DATA GRID */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Quantity Purchased</span>
                          <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{order.quantityQuintals} Quintals</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Mandi Rate / Quintal</span>
                          <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">₹{order.pricePerQuintal.toLocaleString("en-IN")}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Freight Delivery Fee</span>
                          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{order.deliveryFee}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Payment Method</span>
                          <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{order.paymentMethod || "COD / Direct Bank"}</div>
                        </div>
                      </div>

                      {/* SECTION 3: DELIVERY ADDRESS & EXPLICIT "SHOW FULL PURCHASE DETAILS" ACTION BUTTON */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 w-full md:w-auto">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Delivery Address: <strong>{order.buyerAddress}</strong> (PIN: {order.buyerPincode})</span>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
                          {/* PROMINENT SHOW FULL PURCHASE DETAILS BUTTON */}
                          <button
                            onClick={() => setInspectingOrder(order)}
                            className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-4 h-4 text-yellow-300" />
                            <span>Show Full Purchase Details</span>
                          </button>

                          {/* BUYER CANCEL ORDER ACTION */}
                          {!order.status.includes("Cancelled") && order.status !== "Completed" && (
                            <button
                              onClick={() => {
                                const reason = prompt("Optional: Enter your reason for cancelling this order:") || "Cancelled manually by buyer";
                                const updated = orders.map(o => o.orderId === order.orderId ? { ...o, status: "Cancelled by Buyer" as const, cancellationReason: reason } : o);
                                setOrders(updated);
                                localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updated));
                              }}
                              className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 font-extrabold rounded-xl text-xs border border-red-200 dark:border-red-900/60 transition-all flex items-center justify-center gap-1 shadow-sm"
                            >
                              <XCircle className="w-4 h-4 text-red-600" /> Cancel
                            </button>
                          )}
                        </div>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* EXHAUSTIVE PURCHASE DETAILS INSPECTION MODAL */}
      <AnimatePresence>
        {inspectingOrder && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border-2 border-emerald-500/50 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 text-gray-900 dark:text-white"
            >
              <button 
                onClick={() => setInspectingOrder(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              {/* MODAL HEADER WITH TAX INVOICE BADGE */}
              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-black shrink-0">
                  📄
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-2.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-800">
                      Official Tax Invoice & Metadata Receipt
                    </span>
                    <span className="font-mono text-xs font-extrabold text-gray-400">{inspectingOrder.orderId}</span>
                  </div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mt-0.5">
                    Full Purchase Details — {inspectingOrder.cropName}
                  </h2>
                </div>
              </div>

              {/* EXHAUSTIVE METADATA SECTIONS GRID */}
              <div className="space-y-4 max-h-[65vh] overflow-y-auto pr-1 scrollbar-none">
                
                {/* 1. ORDER & TIMELINE SUMMARY */}
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> 1. Order Identifiers & Timeline
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-semibold pt-1">
                    <div><span className="text-gray-400 block">Sequence #:</span> #{inspectingOrder.sequenceNo}</div>
                    <div><span className="text-gray-400 block">Order ID:</span> <strong className="font-mono text-emerald-600">{inspectingOrder.orderId}</strong></div>
                    <div><span className="text-gray-400 block">Purchase Date:</span> {inspectingOrder.orderDate}</div>
                    <div><span className="text-gray-400 block">Order Status:</span> <strong className="text-emerald-600">{inspectingOrder.status}</strong></div>
                  </div>
                </div>

                {/* 2. CROP & QUALITY METADATA */}
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <Sprout className="w-4 h-4" /> 2. Crop & Produce Specifications
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs font-semibold pt-1">
                    <div><span className="text-gray-400 block">Crop Name:</span> <strong>{inspectingOrder.cropName}</strong></div>
                    <div><span className="text-gray-400 block">Quality Grade:</span> <strong className="text-emerald-600">{inspectingOrder.qualityGrade || "Grade A Premium"}</strong></div>
                    <div><span className="text-gray-400 block">Delivery Method:</span> <strong>{inspectingOrder.deliveryOption || "Doorstep Delivery"}</strong></div>
                  </div>
                </div>

                {/* 3. FARMER / SELLER DIRECT DETAILS */}
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border-2 border-emerald-500/40 space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-emerald-600" /> 3. Verified Farmer / Seller Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold pt-1">
                    <div><span className="text-gray-500 block">Seller Name:</span> <strong className="text-gray-900 dark:text-white">{inspectingOrder.farmerName}</strong></div>
                    <div><span className="text-gray-500 block">Contact Phone:</span> <strong>{inspectingOrder.farmerPhone}</strong></div>
                    <div><span className="text-gray-500 block">Farm Location:</span> <strong>{inspectingOrder.farmLocation || "Baramati, Pune, Maharashtra"}</strong></div>
                  </div>
                  {inspectingOrder.farmerWhatsapp && (
                    <div className="pt-1">
                      <a
                        href={`https://wa.me/${inspectingOrder.farmerWhatsapp}?text=Namaste%20${encodeURIComponent(inspectingOrder.farmerName)},%20I%20have%20a%20question%20regarding%20my%20order%20${inspectingOrder.orderId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] px-3 py-1.5 rounded-xl shadow-sm transition-all"
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Chat Directly on WhatsApp with {inspectingOrder.farmerName}
                      </a>
                    </div>
                  )}
                </div>

                {/* 4. BUYER & SHIPPING INFORMATION */}
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4" /> 4. Shipping & Buyer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-semibold pt-1">
                    <div><span className="text-gray-400 block">Customer Name:</span> <strong>{inspectingOrder.buyerName}</strong></div>
                    <div><span className="text-gray-400 block">Customer Phone:</span> <strong>{inspectingOrder.buyerPhone}</strong></div>
                    <div><span className="text-gray-400 block">Delivery Pincode:</span> <strong className="text-emerald-600">{inspectingOrder.buyerPincode}</strong></div>
                  </div>
                  <div className="text-xs font-semibold pt-1">
                    <span className="text-gray-400 block">Full Delivery Address:</span>
                    <strong className="text-gray-900 dark:text-white">{inspectingOrder.buyerAddress}</strong>
                  </div>
                </div>

                {/* 5. FINANCIAL INVOICE BREAKDOWN */}
                <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 space-y-2">
                  <h4 className="text-xs font-black uppercase text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> 5. Itemized Financial Breakdown
                  </h4>
                  <div className="space-y-1.5 text-xs font-semibold pt-1">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Purchased Quantity:</span>
                      <strong>{inspectingOrder.quantityQuintals} Quintals</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Mandi Price Rate:</span>
                      <strong>₹{inspectingOrder.pricePerQuintal.toLocaleString("en-IN")} / quintal</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Crop Subtotal:</span>
                      <strong>₹{inspectingOrder.subtotal.toLocaleString("en-IN")}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Freight Transport Charge:</span>
                      <strong className="text-emerald-600">₹{inspectingOrder.deliveryFee}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Payment Gateway Method:</span>
                      <strong>{inspectingOrder.paymentMethod || "Cash on Delivery / Direct Bank"}</strong>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-white/10 text-sm font-black text-emerald-600 dark:text-emerald-400">
                      <span>Grand Total Amount Paid:</span>
                      <span>₹{inspectingOrder.totalPrice.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* MODAL FOOTER WITH PRINT RECEIPT ACTION */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-4 border-t border-gray-100 dark:border-white/10">
                <button
                  onClick={() => window.print()}
                  className="w-full sm:w-auto px-5 py-2.5 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 font-extrabold rounded-xl text-xs hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5"
                >
                  <Printer className="w-4 h-4" /> Print Tax Receipt Invoice
                </button>

                <button
                  onClick={() => setInspectingOrder(null)}
                  className="w-full sm:w-auto px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all"
                >
                  Close Purchase Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MULTI-STEP CHECKOUT MODAL */}
      <AnimatePresence>
        {buyingListing && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative space-y-6"
            >
              <button 
                onClick={() => setBuyingListing(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <span className="text-3xl p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl">{buyingListing.iconEmoji}</span>
                <div>
                  <span className="text-[10px] font-black text-emerald-700 uppercase">3-Step Checkout</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Buy {buyingListing.cropName}</h3>
                </div>
              </div>

              {checkoutStep === 1 && (
                <form onSubmit={handleProceedToReview} className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="block text-xs font-bold text-gray-600 dark:text-gray-300">
                        Type or Select Quantity (Quintals):
                      </label>
                      <span className="text-[11px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        Max Stock: {buyingListing.availableQuantityQuintals} Quintals
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.max(1, orderQuantity - 1);
                          setOrderQuantity(val);
                          setQuantityInput(String(val));
                        }}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white font-black text-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        -
                      </button>

                      <input
                        type="number"
                        min="1"
                        max={buyingListing.availableQuantityQuintals}
                        value={quantityInput}
                        onChange={(e) => {
                          const valStr = e.target.value;
                          setQuantityInput(valStr);
                          const parsed = parseInt(valStr, 10);
                          if (!isNaN(parsed) && parsed > 0) {
                            setOrderQuantity(parsed);
                          }
                        }}
                        onBlur={() => {
                          const parsed = parseInt(quantityInput, 10);
                          if (isNaN(parsed) || parsed < 1) {
                            setOrderQuantity(1);
                            setQuantityInput("1");
                          } else if (parsed > buyingListing.availableQuantityQuintals) {
                            setOrderQuantity(buyingListing.availableQuantityQuintals);
                            setQuantityInput(String(buyingListing.availableQuantityQuintals));
                          }
                        }}
                        className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-base text-center text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                        placeholder="Type quantity manually..."
                      />

                      <button
                        type="button"
                        onClick={() => {
                          const val = Math.min(buyingListing.availableQuantityQuintals, orderQuantity + 1);
                          setOrderQuantity(val);
                          setQuantityInput(String(val));
                        }}
                        className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-white font-black text-lg flex items-center justify-center hover:bg-gray-200"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[10px] text-gray-400 font-semibold mt-1">
                      💡 You can click the text field and type any custom number manually (e.g. 5, 12, 50, 100).
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">Your Full Name:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Amitabh Verma"
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">Phone Number:</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98200 11223"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-600 mb-1">Delivery Street Address:</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Plot 42, Market Yard Road"
                      value={buyerStreet}
                      onChange={(e) => setBuyerStreet(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">City / Town:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Pune"
                        value={buyerCity}
                        onChange={(e) => setBuyerCity(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-600 mb-1">ZIP / Pincode:</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 411037"
                        value={buyerPincode}
                        onChange={(e) => setBuyerPincode(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-emerald-600"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md mt-4"
                  >
                    Proceed to Order Summary & Confirmation →
                  </button>
                </form>
              )}

              {checkoutStep === 2 && (
                <div className="space-y-4 text-xs">
                  <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 space-y-2">
                    <h4 className="font-extrabold text-gray-900 dark:text-white uppercase text-[10px]">Itemized Invoice Breakdown</h4>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Crop Subtotal ({orderQuantity} Quintals × ₹{buyingListing.pricePerQuintal}):</span>
                      <span className="font-bold">₹{checkoutCalculations.subtotal.toLocaleString("en-IN")}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Freight Transport Charge:</span>
                      <span className="font-bold">₹{checkoutCalculations.deliveryFee}</span>
                    </div>
                    <div className="flex justify-between pt-2 border-t font-black text-sm text-emerald-700 dark:text-emerald-400">
                      <span>Total Amount Payable:</span>
                      <span>₹{checkoutCalculations.grandTotal.toLocaleString("en-IN")}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setCheckoutStep(1)}
                      className="flex-1 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl text-xs"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleFinalOrderSubmit}
                      className="flex-1 py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-md"
                    >
                      Confirm & Place Purchase Order
                    </button>
                  </div>
                </div>
              )}

              {checkoutStep === 3 && (
                <div className="text-center space-y-4 py-4">
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Order Confirmed Successfully!</h3>
                  <p className="text-xs text-gray-500 font-medium">Your purchase order for {orderQuantity} quintals of {buyingListing.cropName} has been transmitted directly to the farmer.</p>
                  
                  <button
                    onClick={() => {
                      setBuyingListing(null);
                      setActiveTab("my_orders");
                    }}
                    className="bg-emerald-600 text-white font-extrabold px-6 py-3 rounded-xl text-xs shadow-md"
                  >
                    View Order in My Orders
                  </button>
                </div>
              )}

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* INSPECT CROP MODAL */}
      <AnimatePresence>
        {inspectingCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-2xl w-full p-6 md:p-8 shadow-2xl relative space-y-5"
            >
              <button 
                onClick={() => setInspectingCrop(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-start gap-4">
                <img src={inspectingCrop.imageUrl} alt={inspectingCrop.cropName} className="w-24 h-24 rounded-2xl object-cover border" />
                <div>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-md">{inspectingCrop.category}</span>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mt-1">{inspectingCrop.cropName}</h2>
                  <p className="text-xs text-gray-500 font-semibold">{inspectingCrop.village}, {inspectingCrop.district}, {inspectingCrop.state}</p>
                </div>
              </div>

              <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-2xl flex justify-between items-center text-xs">
                <div>
                  <span className="text-gray-400 font-bold uppercase text-[10px]">Price Rate</span>
                  <div className="text-xl font-black text-emerald-700">₹{inspectingCrop.pricePerQuintal.toLocaleString("en-IN")}/quintal</div>
                </div>
                <button
                  onClick={() => startCheckout(inspectingCrop)}
                  className="bg-emerald-600 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md text-xs"
                >
                  Buy This Crop Now
                </button>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setInspectingCrop(null)} className="bg-gray-200 text-gray-800 font-bold px-5 py-2 rounded-xl text-xs">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
