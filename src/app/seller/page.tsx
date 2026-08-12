"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, ClipboardList, CheckCircle2, Phone, MessageSquare, 
  Clock, Check, Truck, XCircle, ShieldCheck, MapPin, ArrowRightLeft, Sprout, Eye, X, Info, Calendar, Award, Receipt, DollarSign, Edit3, Trash2, Save, Sparkles, AlertCircle, Lock, LogIn, RefreshCw, User, ShieldAlert, PackageCheck, Printer
} from "lucide-react";
import Link from "next/link";
import { ALL_INDIAN_STATES_AND_UTS, FarmerCropListing, BuyerOrderRequest } from "@/app/marketplace/page";

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
    village: "Baramati APMC Mandi",
    pricePerQuintal: 2550,
    availableQuantityQuintals: 45,
    qualityGrade: "Organic Certified",
    deliveryOption: "Doorstep Delivery",
    rating: 4.9,
    harvestDate: "2026-07-25",
    description: "100% Organic certified Lokwan wheat grown without chemical pesticides. High protein content, ideal for chapatis and bakery.",
    imageUrl: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
    createdAt: "2 hours ago",
    moistureContent: "11.2% (Optimal Dry)",
    soilType: "Black Loam Soil"
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
    buyerName: "Amitabh Verma (Hotel Annapurna)",
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
    paymentMethod: "Cash on Delivery / Direct Bank"
  },
  {
    sequenceNo: 2,
    orderId: "ORD-9082",
    listingId: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45678",
    farmerWhatsapp: "919822145678",
    buyerName: "Rajesh Foods Pvt Ltd",
    buyerPhone: "+91 98450 66778",
    buyerAddress: "APMC Market Gate 3, Bangalore, Karnataka",
    buyerPincode: "560001",
    quantityQuintals: 25,
    pricePerQuintal: 2550,
    subtotal: 63750,
    deliveryFee: 600,
    totalPrice: 64350,
    orderDate: "Yesterday",
    status: "Accepted",
    paymentMethod: "Prepaid Bank"
  },
  {
    sequenceNo: 3,
    orderId: "ORD-9083",
    listingId: "lst-101",
    cropName: "Organic Wheat (Lokwan)",
    iconEmoji: "🌾",
    farmerName: "Rameshwar Patil",
    farmerPhone: "+91 98221 45678",
    farmerWhatsapp: "919822145678",
    buyerName: "Kishore Grain Traders",
    buyerPhone: "+91 94220 33445",
    buyerAddress: "Grain Market Yard, Solapur, Maharashtra",
    buyerPincode: "413001",
    quantityQuintals: 15,
    pricePerQuintal: 2550,
    subtotal: 38250,
    deliveryFee: 450,
    totalPrice: 38700,
    orderDate: "3 days ago",
    status: "Dispatched",
    paymentMethod: "Prepaid Direct"
  }
];

const CATEGORIES = [
  "Cereals & Grains",
  "Vegetables",
  "Fruits",
  "Pulses & Legumes",
  "Oilseeds",
  "Spices & Herbs",
  "Commercial & Plantation"
];

export default function FarmerSellerPortalPage() {
  const [activeTab, setActiveTab] = useState<"orders" | "my_listings" | "post">("orders");
  const [listings, setListings] = useState<FarmerCropListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<BuyerOrderRequest[]>(INITIAL_ORDERS);
  
  // FARMER ACCOUNT PRIVACY & AUTHENTICATION STATE
  const [farmerPhoneInput, setFarmerPhoneInput] = useState("");
  const [farmerNameInput, setFarmerNameInput] = useState("");
  const [loggedInFarmerPhone, setLoggedInFarmerPhone] = useState<string | null>(null);
  const [loggedInFarmerName, setLoggedInFarmerName] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Modals state
  const [editingCrop, setEditingCrop] = useState<FarmerCropListing | null>(null);
  const [billOrder, setBillOrder] = useState<BuyerOrderRequest | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [orderSort, setOrderSort] = useState<"newest" | "oldest">("newest");
  const [monthFilter, setMonthFilter] = useState<string>("All");

  // New Farmer Listing Form state
  const [newCropName, setNewCropName] = useState("");
  const [newCategory, setNewCategory] = useState("Cereals & Grains");
  const [newIconEmoji, setNewIconEmoji] = useState("🌾");
  const [newFarmerName, setNewFarmerName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [newState, setNewState] = useState("Maharashtra");
  const [newDistrict, setNewDistrict] = useState("");
  const [newVillage, setNewVillage] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newQuantity, setNewQuantity] = useState("");
  const [newQuality, setNewQuality] = useState<FarmerCropListing["qualityGrade"]>("Grade A Premium");
  const [newDelivery, setNewDelivery] = useState<FarmerCropListing["deliveryOption"]>("Doorstep Delivery");
  const [newDescription, setNewDescription] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [postSuccess, setPostSuccess] = useState(false);

  // Edit Crop Form State
  const [editCropName, setEditCropName] = useState("");
  const [editCategory, setEditCategory] = useState("Cereals & Grains");
  const [editPrice, setEditPrice] = useState("");
  const [editQuantity, setEditQuantity] = useState("");
  const [editQuality, setEditQuality] = useState<FarmerCropListing["qualityGrade"]>("Grade A Premium");
  const [editDelivery, setEditDelivery] = useState<FarmerCropListing["deliveryOption"]>("Doorstep Delivery");
  const [editDescription, setEditDescription] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");

  useEffect(() => {
    // Restore Logged In Farmer Identity
    const savedPhone = localStorage.getItem("agropulse_farmer_phone");
    const savedName = localStorage.getItem("agropulse_farmer_name");
    if (savedPhone) {
      setLoggedInFarmerPhone(savedPhone);
      setNewPhone(savedPhone);
    } else {
      setLoggedInFarmerPhone("+91 98221 45678");
      setNewPhone("+91 98221 45678");
    }
    if (savedName) {
      setLoggedInFarmerName(savedName);
      setNewFarmerName(savedName);
    } else {
      setLoggedInFarmerName("Rameshwar Patil");
      setNewFarmerName("Rameshwar Patil");
    }

    const savedListings = localStorage.getItem("agropulse_farmer_listings");
    if (savedListings) {
      try {
        const parsed = JSON.parse(savedListings);
        if (Array.isArray(parsed) && parsed.length > 0) setListings(parsed);
      } catch (e) { console.error(e); }
    }

    const savedOrders = localStorage.getItem("agropulse_farmer_orders");
    if (savedOrders) {
      try {
        const parsed = JSON.parse(savedOrders);
        if (Array.isArray(parsed) && parsed.length > 0) setOrders(parsed);
      } catch (e) { console.error(e); }
    }
  }, []);

  const handleFarmerLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerPhoneInput.trim()) {
      alert("Please enter your registered farmer mobile phone number.");
      return;
    }

    const cleanPhone = farmerPhoneInput.startsWith("+") ? farmerPhoneInput : `+91 ${farmerPhoneInput.trim()}`;
    const name = farmerNameInput.trim() || "Verified Farmer Seller";

    setLoggedInFarmerPhone(cleanPhone);
    setLoggedInFarmerName(name);
    setNewPhone(cleanPhone);
    setNewFarmerName(name);

    localStorage.setItem("agropulse_farmer_phone", cleanPhone);
    localStorage.setItem("agropulse_farmer_name", name);
    setShowAuthModal(false);
  };

  // PRIVACY SCOPED FARMER ORDERS (FARMER ONLY SEES ORDERS RECEIVED FOR THEIR OWN CROPS)
  const myPrivateFarmerOrders = useMemo(() => {
    if (!loggedInFarmerPhone) return [];
    const cleanPhone = loggedInFarmerPhone.replace(/\D/g, "");

    return orders.filter(o => {
      const orderFarmerPhoneClean = (o.farmerPhone || "").replace(/\D/g, "");
      const isPhoneMatch = orderFarmerPhoneClean.length > 5 && (orderFarmerPhoneClean === cleanPhone || orderFarmerPhoneClean.slice(-10) === cleanPhone.slice(-10));
      const isNameMatch = loggedInFarmerName && o.farmerName && o.farmerName.toLowerCase().includes(loggedInFarmerName.toLowerCase());
      return isPhoneMatch || isNameMatch;
    });
  }, [orders, loggedInFarmerPhone, loggedInFarmerName]);

  // PRIVACY SCOPED FARMER CROP LISTINGS
  const myPrivateListings = useMemo(() => {
    if (!loggedInFarmerPhone) return listings;
    const cleanPhone = loggedInFarmerPhone.replace(/\D/g, "");

    return listings.filter(l => {
      const listingPhoneClean = (l.phone || "").replace(/\D/g, "");
      const isPhoneMatch = listingPhoneClean.length > 5 && (listingPhoneClean === cleanPhone || listingPhoneClean.slice(-10) === cleanPhone.slice(-10));
      const isNameMatch = loggedInFarmerName && l.farmerName && l.farmerName.toLowerCase().includes(loggedInFarmerName.toLowerCase());
      return isPhoneMatch || isNameMatch;
    });
  }, [listings, loggedInFarmerPhone, loggedInFarmerName]);

  const openEditModal = (crop: FarmerCropListing) => {
    setEditingCrop(crop);
    setEditCropName(crop.cropName);
    setEditCategory(crop.category);
    setEditPrice(String(crop.pricePerQuintal));
    setEditQuantity(String(crop.availableQuantityQuintals));
    setEditQuality(crop.qualityGrade);
    setEditDelivery(crop.deliveryOption);
    setEditDescription(crop.description);
    setEditImageUrl(crop.imageUrl);
  };

  const handleSaveEditCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCrop) return;

    const updated = listings.map(item => {
      if (item.id === editingCrop.id) {
        return {
          ...item,
          cropName: editCropName,
          category: editCategory,
          pricePerQuintal: Number(editPrice),
          availableQuantityQuintals: Number(editQuantity),
          qualityGrade: editQuality,
          deliveryOption: editDelivery,
          description: editDescription,
          imageUrl: editImageUrl || item.imageUrl
        };
      }
      return item;
    });

    setListings(updated);
    localStorage.setItem("agropulse_farmer_listings", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("agropulse_listings_updated"));
    setEditingCrop(null);
  };

  const handleDeleteCrop = (cropId: string) => {
    if (!confirm("Are you sure you want to remove this active crop listing from the market?")) return;
    const updated = listings.filter(item => item.id !== cropId);
    setListings(updated);
    localStorage.setItem("agropulse_farmer_listings", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("agropulse_listings_updated"));
  };

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName || !newPrice || !newQuantity || !newDistrict || !newVillage) {
      alert("Please fill in all required fields to list your crop.");
      return;
    }

    const newListing: FarmerCropListing = {
      id: `lst-${Date.now()}`,
      cropName: newCropName,
      category: newCategory,
      iconEmoji: newIconEmoji || "🌾",
      farmerName: newFarmerName || loggedInFarmerName || "Verified Farmer",
      phone: newPhone || loggedInFarmerPhone || "+91 98221 45678",
      whatsapp: (newPhone || loggedInFarmerPhone || "9822145678").replace(/\D/g, ""),
      state: newState,
      district: newDistrict,
      village: newVillage,
      pricePerQuintal: Number(newPrice),
      availableQuantityQuintals: Number(newQuantity),
      qualityGrade: newQuality,
      deliveryOption: newDelivery,
      rating: 4.9,
      harvestDate: "Fresh Crop Harvest",
      description: newDescription || "Direct APMC Mandi benchmarked farmer produce. Fresh harvest.",
      imageUrl: newImageUrl || "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80",
      createdAt: "Just now",
      apmcMandiVerified: true
    };

    const updatedListings = [newListing, ...listings];
    setListings(updatedListings);
    localStorage.setItem("agropulse_farmer_listings", JSON.stringify(updatedListings));
    
    // Broadcast live update event so Buy Crop section updates instantly!
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("agropulse_listings_updated"));

    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab("my_listings");
    }, 1500);

    setNewCropName("");
    setNewPrice("");
    setNewQuantity("");
    setNewDistrict("");
    setNewVillage("");
    setNewDescription("");
    setNewImageUrl("");
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: BuyerOrderRequest["status"]) => {
    let cancelReason: string | undefined = undefined;
    if (newStatus === "Cancelled by Farmer") {
      cancelReason = prompt("Enter reason for order cancellation:") || "Stock depleted or harvest affected.";
    }

    const updated = orders.map(o => {
      if (o.orderId === orderId) {
        return {
          ...o,
          status: newStatus,
          cancellationReason: cancelReason || o.cancellationReason
        };
      }
      return o;
    });

    setOrders(updated);
    localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
    window.dispatchEvent(new Event("agropulse_listings_updated"));
  };

  const filteredOrders = useMemo(() => {
    let list = myPrivateFarmerOrders.filter(o => {
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
  }, [myPrivateFarmerOrders, statusFilter, monthFilter, orderSort]);

  const orderStats = useMemo(() => {
    const activeOrders = myPrivateFarmerOrders.filter(o => !o.status.includes("Cancelled"));
    const totalEarnings = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingCount = myPrivateFarmerOrders.filter(o => o.status === "Pending").length;
    const acceptedCount = myPrivateFarmerOrders.filter(o => o.status === "Accepted").length;
    const dispatchedCount = myPrivateFarmerOrders.filter(o => o.status === "Dispatched").length;
    const completedCount = myPrivateFarmerOrders.filter(o => o.status === "Completed").length;

    return { 
      totalEarnings, 
      pendingCount, 
      acceptedCount, 
      dispatchedCount, 
      completedCount, 
      totalOrders: myPrivateFarmerOrders.length 
    };
  }, [myPrivateFarmerOrders]);

  const getOrderCardStyles = (status: BuyerOrderRequest["status"]) => {
    switch (status) {
      case "Pending":
        return {
          border: "border-2 border-amber-400/60 dark:border-amber-500/40",
          headerBg: "bg-gradient-to-r from-amber-500 to-amber-600 text-white",
          badgeBg: "bg-amber-100 text-amber-900 border-amber-300",
          icon: <Clock className="w-4 h-4 text-amber-100 animate-pulse" />,
          label: "⏳ Pending Confirmation"
        };
      case "Accepted":
        return {
          border: "border-2 border-blue-500/60 dark:border-blue-500/40",
          headerBg: "bg-gradient-to-r from-blue-600 to-indigo-600 text-white",
          badgeBg: "bg-blue-100 text-blue-900 border-blue-300",
          icon: <CheckCircle2 className="w-4 h-4 text-blue-100" />,
          label: "🔵 Accepted by You"
        };
      case "Dispatched":
        return {
          border: "border-2 border-purple-500/60 dark:border-purple-500/40",
          headerBg: "bg-gradient-to-r from-purple-600 to-indigo-700 text-white",
          badgeBg: "bg-purple-100 text-purple-900 border-purple-300",
          icon: <Truck className="w-4 h-4 text-purple-100 animate-bounce" />,
          label: "🚚 Dispatched — En Route"
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
      case "Cancelled by Buyer":
      default:
        return {
          border: "border-2 border-red-300 dark:border-red-900/50",
          headerBg: "bg-gradient-to-r from-red-600 to-rose-700 text-white",
          badgeBg: "bg-red-100 text-red-900 border-red-300",
          icon: <XCircle className="w-4 h-4 text-red-100" />,
          label: "❌ Cancelled"
        };
    }
  };

  return (
    <div className="min-h-screen w-full px-4 sm:px-6 md:px-8 lg:px-10 py-6 pt-[84px] font-sans">
      
      {/* Farmer Seller Header Bar */}
      <header className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-md w-full">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" /> APMC Verified Farmer Desk
            </span>
            <span className="text-xs text-gray-400 font-semibold">• Encrypted Seller Order Management</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-2.5">
            <Sprout className="w-8 h-8 text-emerald-600 dark:text-emerald-400 shrink-0" />
            Farmer Seller & Order Management Desk
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
          {/* FARMER ACCOUNT PRIVACY DESK STATUS */}
          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-950/40 p-2 px-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-800">
            <User className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="text-left text-xs">
              <span className="text-[10px] text-gray-400 font-bold block">Logged In Seller:</span>
              <strong className="text-emerald-700 dark:text-emerald-400 font-extrabold">
                {loggedInFarmerName || "Rameshwar Patil"} ({loggedInFarmerPhone || "+91 98221..."})
              </strong>
            </div>
            <button
              onClick={() => setShowAuthModal(true)}
              className="ml-2 px-2.5 py-1 bg-emerald-600 text-white rounded-xl text-[10px] font-black hover:bg-emerald-700 transition-all flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Switch
            </button>
          </div>

          <div className="flex bg-gray-100 dark:bg-white/10 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "orders" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Received Orders ({myPrivateFarmerOrders.length})
            </button>

            <button
              onClick={() => setActiveTab("my_listings")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "my_listings" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <Sprout className="w-4 h-4" /> My Active Crops ({myPrivateListings.length})
            </button>

            <button
              onClick={() => setActiveTab("post")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "post" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Sell New Crop
            </button>
          </div>
        </div>
      </header>

      {/* FARMER ACCOUNT AUTHENTICATION MODAL */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border-2 border-emerald-500 rounded-3xl max-w-md w-full p-6 md:p-8 shadow-2xl relative space-y-5"
            >
              <button 
                onClick={() => setShowAuthModal(false)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Lock className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700">Seller Order Privacy</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Farmer Seller Desk Login</h3>
                </div>
              </div>

              <p className="text-xs text-gray-500 font-medium">
                Enter your registered farmer phone number and name to privately view only orders placed for your crops.
              </p>

              <form onSubmit={handleFarmerLogin} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Farmer Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rameshwar Patil"
                    value={farmerNameInput}
                    onChange={(e) => setFarmerNameInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Farmer Mobile Phone Number:</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 9822145678"
                    value={farmerPhoneInput}
                    onChange={(e) => setFarmerPhoneInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                >
                  <LogIn className="w-4 h-4" /> Securely Access My Seller Desk Orders
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* PRIVACY SCOPED RECEIVED ORDERS TAB */}
      {activeTab === "orders" && (
        <div className="space-y-6 w-full">
          
          {/* STATS OVERVIEW CARDS */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 w-full">
            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-2xl border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between">
              <span className="text-[10px] font-black text-gray-400 uppercase">My Total Revenue</span>
              <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{orderStats.totalEarnings.toLocaleString("en-IN")}</div>
              <span className="text-[10px] text-gray-500 font-bold">{orderStats.totalOrders} Orders Received</span>
            </div>

            <button
              onClick={() => setStatusFilter(statusFilter === "Pending" ? "All" : "Pending")}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Pending" ? "bg-amber-500 text-white border-amber-600 shadow-md" : "bg-white dark:bg-[#1a1b23] border-amber-200 dark:border-amber-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Pending" ? "text-white" : "text-amber-600"}`}>⏳ Pending</span>
              <div className={`text-xl font-black mt-1 ${statusFilter === "Pending" ? "text-white" : "text-amber-500"}`}>{orderStats.pendingCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Needs Action</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Accepted" ? "All" : "Accepted")}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Accepted" ? "bg-blue-600 text-white border-blue-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-blue-200 dark:border-blue-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Accepted" ? "text-white" : "text-blue-600"}`}>🔵 Accepted</span>
              <div className={`text-xl font-black mt-1 ${statusFilter === "Accepted" ? "text-white" : "text-blue-600"}`}>{orderStats.acceptedCount}</div>
              <span className="text-[10px] opacity-80 font-bold">In Processing</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Dispatched" ? "All" : "Dispatched")}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Dispatched" ? "bg-purple-600 text-white border-purple-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-purple-200 dark:border-purple-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Dispatched" ? "text-white" : "text-purple-600"}`}>🚚 Dispatched</span>
              <div className={`text-xl font-black mt-1 ${statusFilter === "Dispatched" ? "text-white" : "text-purple-600"}`}>{orderStats.dispatchedCount}</div>
              <span className="text-[10px] opacity-80 font-bold">En Route</span>
            </button>

            <button
              onClick={() => setStatusFilter(statusFilter === "Completed" ? "All" : "Completed")}
              className={`p-5 rounded-2xl border-2 text-left transition-all ${
                statusFilter === "Completed" ? "bg-emerald-600 text-white border-emerald-700 shadow-md" : "bg-white dark:bg-[#1a1b23] border-emerald-200 dark:border-emerald-900/40"
              }`}
            >
              <span className={`text-[10px] font-black uppercase ${statusFilter === "Completed" ? "text-white" : "text-emerald-600"}`}>✅ Delivered</span>
              <div className={`text-xl font-black mt-1 ${statusFilter === "Completed" ? "text-white" : "text-emerald-600"}`}>{orderStats.completedCount}</div>
              <span className="text-[10px] opacity-80 font-bold">Completed</span>
            </button>

            <button
              onClick={() => setStatusFilter("All")}
              className="p-5 rounded-2xl border-2 text-left bg-gray-50 dark:bg-white/5 border-gray-200 dark:border-white/10"
            >
              <span className="text-[10px] font-black text-gray-500 uppercase">View All</span>
              <div className="text-xl font-black text-gray-900 dark:text-white mt-1">{orderStats.totalOrders}</div>
              <span className="text-[10px] text-gray-400 font-bold">Reset Filters</span>
            </button>
          </div>

          {/* PRIVACY SECURITY BANNER */}
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs w-full">
            <div className="flex items-center gap-2.5">
              <Lock className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <span className="font-black text-emerald-800 dark:text-emerald-300 block">🔒 Encrypted Farmer Seller Privacy Active</span>
                <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                  Showing incoming buyer orders received for seller <strong>{loggedInFarmerName || "Rameshwar Patil"}</strong> ({loggedInFarmerPhone || "+91 98221..."}). Other farmers cannot view your received orders.
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1.5 bg-emerald-600 text-white rounded-xl font-black text-xs hover:bg-emerald-700 shrink-0"
            >
              Switch Seller Account
            </button>
          </div>

          {/* ORDERS LIST CONTAINER */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-[#1a1b23] border-2 border-dashed border-gray-200 dark:border-white/10 p-12 text-center rounded-3xl space-y-3 w-full">
              <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto" />
              <h4 className="text-base font-extrabold text-gray-900 dark:text-white">No incoming buyer orders for your seller account</h4>
              <p className="text-xs text-gray-400 font-medium max-w-md mx-auto">
                No orders have been received under farmer identity <strong>{loggedInFarmerPhone}</strong> yet. List new crops to receive direct buyer orders!
              </p>
              <button
                onClick={() => setActiveTab("post")}
                className="px-5 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all shadow-md"
              >
                + List New Produce Crop
              </button>
            </div>
          ) : (
            <div className="space-y-6 w-full">
              {filteredOrders.map((order) => {
                const style = getOrderCardStyles(order.status);

                return (
                  <motion.div
                    key={order.orderId}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`bg-white dark:bg-[#1a1b23] rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all ${style.border} w-full`}
                  >
                    {/* CARD HEADER BANNER */}
                    <div className={`px-6 py-3.5 ${style.headerBg} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 shadow-inner`}>
                      <div className="flex items-center gap-3">
                        <span className="bg-black/30 text-white font-black text-xs px-2.5 py-1 rounded-lg border border-white/20">
                          #{order.sequenceNo}
                        </span>
                        <span className="font-mono text-xs font-extrabold tracking-wider bg-white/10 px-2.5 py-0.5 rounded-md">
                          {order.orderId}
                        </span>
                        <span className="text-xs font-bold opacity-90 flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Received: {order.orderDate}
                        </span>
                      </div>

                      <span className={`text-xs font-black px-3.5 py-1 rounded-xl flex items-center gap-1.5 shadow-sm ${style.badgeBg}`}>
                        {style.icon}
                        <span>{style.label}</span>
                      </span>
                    </div>

                    {/* CARD BODY */}
                    <div className="p-6 space-y-5">
                      
                      {/* SECTION 1: CROP & BUYER INFO */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-gray-100 dark:border-white/10">
                        <div className="flex items-start gap-4">
                          <div className="text-4xl p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl border-2 border-emerald-500/30 shrink-0">
                            {order.iconEmoji}
                          </div>
                          <div>
                            <h3 className="text-lg font-black text-gray-900 dark:text-white">{order.cropName}</h3>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs font-extrabold">
                              <span className="text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                                <User className="w-3.5 h-3.5" /> Buyer: <strong>{order.buyerName}</strong>
                              </span>
                              <span className="text-gray-400">•</span>
                              <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                                <Phone className="w-3.5 h-3.5 text-emerald-600" /> {order.buyerPhone}
                              </span>
                              <a
                                href={`https://wa.me/${(order.buyerPhone || "").replace(/\D/g, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                className="px-2 py-0.5 bg-green-100 text-green-800 rounded-md text-[10px] font-black hover:bg-green-200"
                              >
                                WhatsApp Buyer
                              </a>
                            </div>
                          </div>
                        </div>

                        {/* TOTAL ORDER VALUE */}
                        <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500/40 px-5 py-3 rounded-2xl text-right shrink-0">
                          <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Order Payable Amount</span>
                          <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">₹{order.totalPrice.toLocaleString("en-IN")}</div>
                        </div>
                      </div>

                      {/* ITEM DETAILS */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-semibold">
                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Quantity Ordered</span>
                          <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{order.quantityQuintals} Quintals</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Mandi Rate / Quintal</span>
                          <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">₹{order.pricePerQuintal.toLocaleString("en-IN")}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Freight Fee</span>
                          <div className="text-sm font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₹{order.deliveryFee}</div>
                        </div>

                        <div>
                          <span className="text-[10px] font-black text-gray-400 uppercase">Payment Mode</span>
                          <div className="text-sm font-black text-gray-900 dark:text-white mt-0.5">{order.paymentMethod || "COD / Direct Bank"}</div>
                        </div>
                      </div>

                      {/* DELIVERY ADDRESS & EXPLICIT "VIEW OFFICIAL TAX INVOICE BILL" ACTION BUTTON */}
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/10">
                        <div className="flex items-center gap-2 text-xs font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-white/5 px-3.5 py-2 rounded-xl border border-gray-200 dark:border-white/10 w-full md:w-auto">
                          <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                          <span>Deliver To: <strong>{order.buyerAddress}</strong> (PIN: {order.buyerPincode})</span>
                        </div>

                        {/* STATUS ACTION BUTTONS & VIEW BILL RECEIPT OPTION FOR FARMER */}
                        <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
                          
                          {/* EXPLICIT VIEW OFFICIAL TAX INVOICE BILL BUTTON */}
                          <button
                            onClick={() => setBillOrder(order)}
                            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
                          >
                            <Receipt className="w-4 h-4 text-yellow-300" />
                            <span>View Official Tax Invoice Bill</span>
                          </button>

                          {order.status === "Pending" && (
                            <>
                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, "Accepted")}
                                className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-4 h-4" /> Accept Order
                              </button>

                              <button
                                onClick={() => handleUpdateOrderStatus(order.orderId, "Cancelled by Farmer")}
                                className="px-3.5 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-extrabold rounded-xl text-xs border border-red-200 transition-all flex items-center gap-1"
                              >
                                <XCircle className="w-4 h-4 text-red-600" /> Reject / Cancel
                              </button>
                            </>
                          )}

                          {order.status === "Accepted" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Dispatched")}
                              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                            >
                              <Truck className="w-4 h-4" /> Mark Dispatched & En Route
                            </button>
                          )}

                          {order.status === "Dispatched" && (
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Completed")}
                              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                            >
                              <PackageCheck className="w-4 h-4" /> Mark Order Delivered & Completed
                            </button>
                          )}

                          {order.status === "Completed" && (
                            <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 flex items-center gap-1">
                              <CheckCircle2 className="w-4 h-4" /> Transaction Settled
                            </span>
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

      {/* PRIVACY SCOPED FARMER ACTIVE LISTINGS TAB */}
      {activeTab === "my_listings" && (
        <div className="space-y-6 w-full">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border border-gray-200 dark:border-white/10 shadow-sm w-full">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                My Active Produce Crop Listings ({myPrivateListings.length})
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Manage, update rates, or edit stock for crops listed under your farmer account.</p>
            </div>

            <button
              onClick={() => setActiveTab("post")}
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" /> Sell New Crop Listing
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
            {myPrivateListings.map((crop) => (
              <div key={crop.id} className="bg-white dark:bg-[#1a1b23] border-2 border-gray-100 dark:border-white/10 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <img src={crop.imageUrl} alt={crop.cropName} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md">
                      {crop.qualityGrade}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-extrabold text-gray-900 dark:text-white text-base">{crop.cropName}</h4>
                        <span className="text-xs text-gray-500 font-bold">{crop.village}, {crop.district}</span>
                      </div>
                      <span className="text-2xl">{crop.iconEmoji}</span>
                    </div>

                    <div className="bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-2xl flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] font-black text-emerald-800 uppercase">Mandi Rate</span>
                        <div className="text-base font-black text-emerald-700">₹{crop.pricePerQuintal.toLocaleString("en-IN")}/q</div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-gray-400 font-bold uppercase">Stock</span>
                        <div className="text-xs font-black text-gray-900 dark:text-white">{crop.availableQuantityQuintals} Q</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => openEditModal(crop)}
                    className="py-2.5 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-800 dark:text-gray-200 font-black rounded-xl text-xs hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-emerald-600" /> Edit Listing
                  </button>

                  <button
                    onClick={() => handleDeleteCrop(crop.id)}
                    className="py-2.5 bg-red-50 hover:bg-red-100 text-red-700 font-black rounded-xl text-xs transition-colors flex items-center justify-center gap-1 border border-red-200"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* POST NEW CROP FORM TAB */}
      {activeTab === "post" && (
        <div className="max-w-3xl mx-auto bg-white dark:bg-[#1a1b23] p-6 md:p-8 rounded-3xl border-2 border-emerald-500/30 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-700">APMC Mandi Direct Trade</span>
              <h3 className="text-xl font-black text-gray-900 dark:text-white">List Produce Crop For Sale</h3>
            </div>
          </div>

          {postSuccess ? (
            <div className="bg-emerald-50 dark:bg-emerald-950/40 p-8 rounded-3xl text-center space-y-3 border-2 border-emerald-500">
              <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Crop Listed Successfully!</h3>
              <p className="text-xs text-gray-500 font-medium">Your crop listing is now live in the APMC Mandi Marketplace for buyers across India.</p>
            </div>
          ) : (
            <form onSubmit={handleCreateListing} className="space-y-4 text-xs font-semibold">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">Crop Produce Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Organic Wheat (Lokwan)"
                    value={newCropName}
                    onChange={(e) => setNewCropName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">Category:</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">Mandi Price per Quintal (₹):</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 2550"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600 text-sm"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">Available Quantity (Quintals):</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 50"
                    value={newQuantity}
                    onChange={(e) => setNewQuantity(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">State:</label>
                  <select
                    value={newState}
                    onChange={(e) => setNewState(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  >
                    {ALL_INDIAN_STATES_AND_UTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">District:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pune"
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">Mandi / Village Yard:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Baramati Mandi"
                    value={newVillage}
                    onChange={(e) => setNewVillage(e.target.value)}
                    className="w-full px-3.5 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-600 dark:text-gray-300 font-bold mb-1">Crop Description:</label>
                <textarea
                  rows={3}
                  placeholder="Describe your produce quality, moisture level, organic certification, harvest date..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-medium text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-2xl text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-4"
              >
                <PlusCircle className="w-4 h-4" /> Publish Live Crop Listing to Marketplace
              </button>
            </form>
          )}
        </div>
      )}

      {/* OFFICIAL PRINTABLE TAX INVOICE BILL RECEIPT MODAL FOR FARMER SELLER */}
      <AnimatePresence>
        {billOrder && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white text-gray-900 border-4 border-emerald-600 rounded-3xl max-w-3xl w-full p-6 md:p-8 shadow-2xl relative space-y-6 font-sans overflow-hidden"
            >
              <button 
                onClick={() => setBillOrder(null)}
                className="absolute top-6 right-6 p-2 text-gray-400 hover:text-gray-800 rounded-full bg-gray-100 border"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b-2 border-emerald-600 pb-4 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🌾</span>
                    <span className="text-2xl font-black text-emerald-800 tracking-tight">AgroPulse</span>
                    <span className="bg-emerald-100 text-emerald-800 text-[9px] font-black px-2 py-0.5 rounded border border-emerald-300">
                      OFFICIAL SELLER TAX INVOICE
                    </span>
                  </div>
                  <p className="text-[11px] text-gray-500 font-bold mt-0.5">
                    Direct Farm Trading & APMC Mandi Procurement Portal • GSTIN: 27AAAAA0000A1Z5
                  </p>
                </div>

                <div className="text-left sm:text-right text-xs">
                  <div className="font-black text-emerald-900">INVOICE #: <span className="font-mono text-emerald-700">INV-2026-{billOrder.orderId}</span></div>
                  <div className="text-gray-600 font-semibold">Date: {billOrder.orderDate}</div>
                  <div className="text-gray-600 font-semibold">Payment Status: <strong className="text-emerald-700 uppercase">{billOrder.status}</strong></div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-900 tracking-wider block border-b border-emerald-200 pb-1 mb-1">
                    👨‍🌾 Billed From (Farmer Seller):
                  </span>
                  <div className="font-black text-sm text-gray-900">{billOrder.farmerName}</div>
                  <div className="text-gray-600 font-medium">Location: {billOrder.farmLocation || "Baramati, Pune, Maharashtra"}</div>
                  <div className="text-gray-600 font-medium">Contact: {billOrder.farmerPhone}</div>
                  <div className="text-gray-500 text-[10px]">Verified Farmer Identity: e-KYC Verified</div>
                </div>

                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                  <span className="text-[10px] font-black uppercase text-gray-700 tracking-wider block border-b border-gray-200 pb-1 mb-1">
                    🛒 Billed To (Customer Buyer):
                  </span>
                  <div className="font-black text-sm text-gray-900">{billOrder.buyerName}</div>
                  <div className="text-gray-600 font-medium">Address: {billOrder.buyerAddress}</div>
                  <div className="text-gray-600 font-medium">PIN Code: {billOrder.buyerPincode}</div>
                  <div className="text-gray-600 font-medium">Phone: {billOrder.buyerPhone}</div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-emerald-800 text-white font-black uppercase text-[10px]">
                    <tr>
                      <th className="p-3">S.No</th>
                      <th className="p-3">Description of Produce</th>
                      <th className="p-3">Quality Grade</th>
                      <th className="p-3 text-right">Quantity</th>
                      <th className="p-3 text-right">Rate / Quintal</th>
                      <th className="p-3 text-right">Amount (₹)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 font-semibold text-gray-800">
                    <tr>
                      <td className="p-3 font-black text-center">1</td>
                      <td className="p-3 font-bold text-gray-900 flex items-center gap-1.5">
                        <span className="text-base">{billOrder.iconEmoji}</span> {billOrder.cropName}
                      </td>
                      <td className="p-3 text-emerald-800 font-bold">{billOrder.qualityGrade || "Grade A Premium"}</td>
                      <td className="p-3 text-right font-black">{billOrder.quantityQuintals} Quintals</td>
                      <td className="p-3 text-right">₹{billOrder.pricePerQuintal.toLocaleString("en-IN")}</td>
                      <td className="p-3 text-right font-black">₹{billOrder.subtotal.toLocaleString("en-IN")}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 text-xs pt-2">
                <div className="space-y-1 text-gray-600 font-medium">
                  <div>• Payment Method: <strong>{billOrder.paymentMethod || "Cash on Delivery / Direct Bank"}</strong></div>
                  <div>• GST Exempt: <strong>Agricultural Raw Produce (0% CGST / SGST)</strong></div>
                  <div>• Guarantee: <strong>100% Direct Farmer Settlement Guarantee</strong></div>
                </div>

                <div className="w-full sm:w-72 bg-emerald-900 text-white p-4 rounded-2xl space-y-1.5 shadow-lg">
                  <div className="flex justify-between text-emerald-200">
                    <span>Subtotal:</span>
                    <span>₹{billOrder.subtotal.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>Freight Transport:</span>
                    <span>₹{billOrder.deliveryFee}</span>
                  </div>
                  <div className="flex justify-between text-emerald-200">
                    <span>GST (0% Exempt):</span>
                    <span>₹0</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-emerald-700 text-base font-black text-white">
                    <span>Grand Total Payable:</span>
                    <span className="text-yellow-300">₹{billOrder.totalPrice.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 flex flex-col sm:flex-row justify-between items-center text-[10px] text-gray-500 font-bold gap-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Digitally Certified Seller Tax Invoice by Developer Uday Pratap Singh Chauhan</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" /> Print Seller Invoice Bill
                  </button>

                  <button
                    onClick={() => setBillOrder(null)}
                    className="px-4 py-2 bg-gray-200 text-gray-800 font-black rounded-xl text-xs"
                  >
                    Close Bill
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* EDIT CROP MODAL */}
      <AnimatePresence>
        {editingCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border-2 border-emerald-500 rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative space-y-5"
            >
              <button 
                onClick={() => setEditingCrop(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="p-3 bg-emerald-100 text-emerald-800 rounded-2xl">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-700">Edit Active Crop</span>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white">Update Listing Details</h3>
                </div>
              </div>

              <form onSubmit={handleSaveEditCrop} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Crop Name:</label>
                  <input
                    type="text"
                    required
                    value={editCropName}
                    onChange={(e) => setEditCropName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Price per Quintal (₹):</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Available Stock (Quintals):</label>
                    <input
                      type="number"
                      required
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Description:</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-medium"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setEditingCrop(null)}
                    className="flex-1 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 bg-emerald-600 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Updated Listing
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
