"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  PlusCircle, ClipboardList, CheckCircle2, Phone, MessageSquare, 
  Clock, Check, Truck, XCircle, ShieldCheck, MapPin, ArrowRightLeft, Sprout, Eye, X, Info, Calendar, Award, Receipt, DollarSign, Edit3, Trash2, Save, Sparkles, AlertCircle
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
    village: "Baramati",
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
  const [activeTab, setActiveTab] = useState<"post" | "orders" | "my_listings">("my_listings");
  const [listings, setListings] = useState<FarmerCropListing[]>(INITIAL_LISTINGS);
  const [orders, setOrders] = useState<BuyerOrderRequest[]>(INITIAL_ORDERS);
  
  // Modals state
  const [inspectingCrop, setInspectingCrop] = useState<FarmerCropListing | null>(null);
  const [editingCrop, setEditingCrop] = useState<FarmerCropListing | null>(null);
  const [inspectingOrder, setInspectingOrder] = useState<BuyerOrderRequest | null>(null);
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
    setEditingCrop(null);
  };

  const handleDeleteCrop = (cropId: string) => {
    if (!confirm("Are you sure you want to remove this active crop listing from the market?")) return;
    const updated = listings.filter(item => item.id !== cropId);
    setListings(updated);
    localStorage.setItem("agropulse_farmer_listings", JSON.stringify(updated));
  };

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

  const monthWiseSalesStats = useMemo(() => {
    const months = ["July 2026", "June 2026", "May 2026", "April 2026"];
    return months.map(m => {
      const mOrders = orders.filter(o => o.orderDate && o.orderDate.toLowerCase().includes(m.toLowerCase()));
      const totalRevenue = mOrders.filter(o => !o.status.includes("Cancelled")).reduce((sum, o) => sum + o.totalPrice, 0);
      return {
        monthName: m,
        count: mOrders.length,
        totalRevenue
      };
    });
  }, [orders]);

  const orderStats = useMemo(() => {
    const activeOrders = orders.filter(o => !o.status.includes("Cancelled"));
    const totalLifetimeRevenue = activeOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingCount = orders.filter(o => o.status === "Pending").length;
    const acceptedCount = orders.filter(o => o.status === "Accepted").length;
    const dispatchedCount = orders.filter(o => o.status === "Dispatched").length;
    const completedCount = orders.filter(o => o.status === "Completed").length;
    return { totalLifetimeRevenue, pendingCount, acceptedCount, dispatchedCount, completedCount, totalOrders: orders.length };
  }, [orders]);

  const handlePostCrop = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCropName || !newFarmerName || !newPhone || !newPrice || !newQuantity) {
      alert("Please fill in all required fields.");
      return;
    }

    const cleanPhone = newPhone.replace(/\D/g, "");
    const newListing: FarmerCropListing = {
      id: `lst-${Date.now()}`,
      cropName: newCropName,
      category: newCategory,
      iconEmoji: newIconEmoji,
      farmerName: newFarmerName,
      phone: newPhone.startsWith("+") ? newPhone : `+91 ${newPhone}`,
      whatsapp: cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone,
      state: newState,
      district: newDistrict || "Primary District",
      village: newVillage || "Farm Village",
      pricePerQuintal: Number(newPrice),
      availableQuantityQuintals: Number(newQuantity),
      qualityGrade: newQuality,
      deliveryOption: newDelivery,
      rating: 5.0,
      harvestDate: new Date().toISOString().split("T")[0],
      description: newDescription || "Fresh high-quality crop directly harvested from farm.",
      imageUrl: newImageUrl || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=600&q=80",
      createdAt: "Just now",
      moistureContent: "11.5% Standard",
      soilType: "Natural Fertile Soil"
    };

    const updated = [newListing, ...listings];
    setListings(updated);
    localStorage.setItem("agropulse_farmer_listings", JSON.stringify(updated));

    setPostSuccess(true);
    setTimeout(() => {
      setPostSuccess(false);
      setActiveTab("my_listings");
      setNewCropName(""); setNewPrice(""); setNewQuantity(""); setNewDescription(""); setNewImageUrl("");
    }, 2000);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: BuyerOrderRequest["status"]) => {
    let reason: string | undefined = undefined;
    if (newStatus.includes("Cancelled")) {
      reason = prompt("Enter reason for cancelling/rejecting this order request:") || "Cancelled by Farmer";
    }

    const updated = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus, cancellationReason: reason } : o);
    setOrders(updated);
    localStorage.setItem("agropulse_farmer_orders", JSON.stringify(updated));
    
    if (inspectingOrder && inspectingOrder.orderId === orderId) {
      setInspectingOrder(prev => prev ? { ...prev, status: newStatus, cancellationReason: reason } : null);
    }
  };

  return (
    <div className="min-h-screen p-4 md:p-8 font-sans max-w-7xl mx-auto pt-[78px]">
      
      {/* Farmer Seller Hero Header */}
      <header className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gradient-to-r from-emerald-900 via-green-800 to-teal-900 text-white p-6 md:p-8 rounded-3xl shadow-xl border-2 border-emerald-500/40">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-yellow-400 text-emerald-950 text-[10px] font-black uppercase px-3 py-1 rounded-full shadow-md flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Real Farmer Direct Sales Desk
            </span>
            <span className="text-xs text-emerald-200 font-semibold">• Manage Active Crops & Buyer Orders</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight flex items-center gap-2.5">
            <Sprout className="w-8 h-8 text-yellow-300 shrink-0" />
            Farmer Seller Desk & Active Crop Manager
          </h1>
          <p className="text-emerald-100 mt-1 text-xs md:text-sm font-medium max-w-2xl">
            Publish harvest online, edit live mandi prices & stock, manage received purchase orders, and sell directly to customers across India.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto shrink-0">
          <div className="flex bg-black/40 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 w-full md:w-auto justify-between">
            <button
              onClick={() => setActiveTab("my_listings")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "my_listings" ? "bg-yellow-400 text-emerald-950 shadow-md" : "text-emerald-100 hover:text-white"
              }`}
            >
              <Sprout className="w-4 h-4" /> My Active Crops ({listings.length})
            </button>

            <button
              onClick={() => setActiveTab("post")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeTab === "post" ? "bg-yellow-400 text-emerald-950 shadow-md" : "text-emerald-100 hover:text-white"
              }`}
            >
              <PlusCircle className="w-4 h-4" /> Post New Crop
            </button>
            
            <button
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 relative ${
                activeTab === "orders" ? "bg-yellow-400 text-emerald-950 shadow-md" : "text-emerald-100 hover:text-white"
              }`}
            >
              <ClipboardList className="w-4 h-4" /> Buyer Orders ({orders.length})
              {orderStats.pendingCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                  {orderStats.pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* TAB 3: FARMER'S MY ACTIVE LISTINGS (WITH EDIT CROP OPTION & ELEVATED UI/UX) */}
      {activeTab === "my_listings" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-[#1a1b23] p-6 rounded-3xl border-2 border-emerald-500/30 shadow-md gap-4">
            <div>
              <h3 className="text-lg font-black text-gray-900 dark:text-white flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-600" />
                Active Crop Listings ({listings.length})
              </h3>
              <p className="text-xs text-gray-400 font-medium mt-0.5">Real-time crops published in the buyer marketplace. Click <strong>"Edit Crop"</strong> to update prices or stock anytime.</p>
            </div>
            <button
              onClick={() => setActiveTab("post")}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-2xl text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" /> Add New Harvest Listing
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((item) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-[#1a1b23] border-2 border-gray-200 dark:border-white/10 hover:border-emerald-500 dark:hover:border-emerald-400 rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Crop Image Header with Edit & Quality Badges */}
                  <div className="relative h-48 w-full bg-gray-100 dark:bg-white/5 overflow-hidden">
                    <img 
                      src={item.imageUrl} 
                      alt={item.cropName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2.5 py-1 rounded-lg shadow-md flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {item.qualityGrade}
                    </span>

                    <button
                      onClick={() => openEditModal(item)}
                      className="absolute top-3 right-3 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1 transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit Crop
                    </button>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-black text-gray-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {item.cropName}
                        </h4>
                        <div className="text-xs text-gray-400 font-bold mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-gray-400" /> {item.village}, {item.district}, {item.state}
                        </div>
                      </div>
                      <span className="text-3xl p-1.5 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border">{item.iconEmoji}</span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed font-medium">
                      {item.description}
                    </p>

                    {/* Rates & Stock Banner */}
                    <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-2xl border border-emerald-200 dark:border-emerald-900/40 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-[10px] font-black uppercase text-emerald-800 dark:text-emerald-300">Mandi Rate</span>
                        <div className="text-base font-black text-emerald-700 dark:text-emerald-400">
                          ₹{item.pricePerQuintal.toLocaleString("en-IN")}<span className="text-[10px] font-bold text-gray-500">/quintal</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-black uppercase text-gray-400">Available Stock</span>
                        <div className="text-sm font-black text-gray-900 dark:text-white">{item.availableQuantityQuintals} Quintals</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="p-5 pt-0 grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => openEditModal(item)}
                    className="col-span-1 bg-yellow-50 hover:bg-yellow-100 dark:bg-yellow-950/40 text-yellow-900 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-800 text-xs font-black py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-yellow-600" /> Edit
                  </button>

                  <button 
                    onClick={() => setInspectingCrop(item)}
                    className="col-span-1 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 text-xs font-black py-2.5 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5 text-emerald-600" /> Inspect
                  </button>

                  <button 
                    onClick={() => handleDeleteCrop(item.id)}
                    className="col-span-1 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-900/40 text-xs font-black py-2.5 rounded-xl transition-colors flex items-center justify-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-600" /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* EDIT CROP MODAL */}
      <AnimatePresence>
        {editingCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border-2 border-yellow-400 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative space-y-5 text-gray-900 dark:text-white"
            >
              <button 
                onClick={() => setEditingCrop(null)}
                className="absolute top-5 right-5 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white rounded-full bg-gray-100 dark:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                <div className="p-3 bg-yellow-100 dark:bg-yellow-950/60 text-yellow-800 rounded-2xl">
                  <Edit3 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-yellow-700 dark:text-yellow-400">Edit Active Crop Listing</span>
                  <h3 className="text-xl font-black text-gray-900 dark:text-white">Update {editingCrop.cropName}</h3>
                </div>
              </div>

              <form onSubmit={handleSaveEditCrop} className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Crop Name:</label>
                    <input
                      type="text"
                      required
                      value={editCropName}
                      onChange={(e) => setEditCropName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Category:</label>
                    <select
                      value={editCategory}
                      onChange={(e) => setEditCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Selling Price Rate (₹/Quintal):</label>
                    <input
                      type="number"
                      required
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold text-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Available Stock (Quintals):</label>
                    <input
                      type="number"
                      required
                      value={editQuantity}
                      onChange={(e) => setEditQuantity(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-extrabold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Quality Grade:</label>
                    <select
                      value={editQuality}
                      onChange={(e: any) => setEditQuality(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                    >
                      <option value="Organic Certified">Organic Certified</option>
                      <option value="Grade A Premium">Grade A Premium</option>
                      <option value="Natural Farming">Natural Farming</option>
                      <option value="Standard Fresh">Standard Fresh</option>
                      <option value="Export Quality">Export Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-600 dark:text-gray-300 mb-1">Delivery Option:</label>
                    <select
                      value={editDelivery}
                      onChange={(e: any) => setEditDelivery(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold"
                    >
                      <option value="Doorstep Delivery">Doorstep Delivery</option>
                      <option value="Farmer Location Pickup">Farmer Location Pickup</option>
                      <option value="Mandi Transport">Mandi Transport</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Crop Description:</label>
                  <textarea
                    rows={3}
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-white/5 font-bold text-xs"
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
                    className="flex-1 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl text-xs shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Save className="w-4 h-4" /> Save Updated Listing Details
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TAB 1: FARMER POST CROP FORM */}
      {activeTab === "post" && (
        <div className="max-w-3xl mx-auto">
          <div className="bg-white dark:bg-[#1a1b23] border-2 border-emerald-500/30 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white">Put Your Crop Online for Online Buyers</h2>
                <p className="text-xs text-gray-400 font-medium mt-0.5">List your harvest directly to customers across India with 0% middleman commission.</p>
              </div>
            </div>

            {postSuccess ? (
              <div className="text-center py-12">
                <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-xl font-black text-gray-900 dark:text-white">Crop Listed Online Successfully!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium mt-2">
                  Your crop is now live in the Customer Buying Portal. Incoming buyer order requests will appear in your <strong>Received Orders</strong> tab for your manual approval.
                </p>
              </div>
            ) : (
              <form onSubmit={handlePostCrop} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Crop Name & Variety *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Organic Wheat, Red Tomatoes, Basmati Rice"
                      value={newCropName}
                      onChange={(e) => setNewCropName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Category *</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Farmer Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={newFarmerName}
                      onChange={(e) => setNewFarmerName(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9822145678"
                      value={newPhone}
                      onChange={(e) => setNewPhone(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Selling Price (₹ per Quintal) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 2500"
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Available Quantity (Quintals) *</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 50"
                      value={newQuantity}
                      onChange={(e) => setNewQuantity(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Select State / UT *</label>
                    <select
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      {ALL_INDIAN_STATES_AND_UTS.map(s => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">District / Mandi Area *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Nashik, Pune, Ludhiana"
                      value={newDistrict}
                      onChange={(e) => setNewDistrict(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Quality Grade</label>
                    <select
                      value={newQuality}
                      onChange={(e: any) => setNewQuality(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Organic Certified">Organic Certified</option>
                      <option value="Grade A Premium">Grade A Premium</option>
                      <option value="Natural Farming">Natural Farming</option>
                      <option value="Standard Fresh">Standard Fresh</option>
                      <option value="Export Quality">Export Quality</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Delivery Option</label>
                    <select
                      value={newDelivery}
                      onChange={(e: any) => setNewDelivery(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="Doorstep Delivery">Doorstep Delivery</option>
                      <option value="Farmer Location Pickup">Farmer Location Pickup</option>
                      <option value="Mandi Transport">Mandi Transport</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Photo Image URL (Optional)</label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-gray-700 dark:text-gray-300 mb-1">Crop Description & Details</label>
                  <textarea
                    rows={3}
                    placeholder="Describe crop quality, moisture level, organic farming practices, or delivery options..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-semibold bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black py-3.5 rounded-xl text-xs shadow-lg flex items-center justify-center gap-2"
                >
                  <PlusCircle className="w-4 h-4" /> Publish Crop Online for Buyers
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: FARMER RECEIVED ORDERS DESK */}
      {activeTab === "orders" && (
        <div className="space-y-6">
          
          {/* Lifetime Farmer Revenue & Orders Summary Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border-2 border-emerald-500/40 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-black text-gray-400 uppercase">Total Lifetime Sales Revenue</span>
              <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">₹{orderStats.totalLifetimeRevenue.toLocaleString("en-IN")}</div>
              <span className="text-[10px] text-gray-400 font-semibold">{orderStats.totalOrders} Total Buyer Requests</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border-2 border-blue-500/40 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-black text-gray-400 uppercase">🔵 Accepted Orders</span>
              <div className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{orderStats.acceptedCount} Orders</div>
              <span className="text-[10px] text-blue-600 dark:text-blue-300 font-bold">Ready for Dispatch</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border-2 border-purple-500/40 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-black text-gray-400 uppercase">🚚 Dispatched Orders</span>
              <div className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{orderStats.dispatchedCount} Orders</div>
              <span className="text-[10px] text-purple-600 dark:text-purple-300 font-bold">En Route Transport</span>
            </div>

            <div className="bg-white dark:bg-[#1a1b23] p-5 rounded-3xl border-2 border-amber-500/40 shadow-sm flex flex-col justify-between">
              <span className="text-xs font-black text-gray-400 uppercase">⏳ Pending Review</span>
              <div className="text-2xl font-black text-amber-500 mt-1">{orderStats.pendingCount} Orders</div>
              <span className="text-[10px] text-amber-600 dark:text-amber-300 font-bold">Awaiting Your Approval</span>
            </div>
          </div>

          <div className="bg-white dark:bg-[#1a1b23] border-2 border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-md">
            <div className="p-5 border-b border-gray-100 dark:border-white/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-gray-50/50 dark:bg-white/5">
              <div>
                <h3 className="text-base font-black text-gray-900 dark:text-white flex items-center gap-2">
                  <ClipboardList className="w-5 h-5 text-emerald-600" />
                  Received Buyer Orders ({filteredOrders.length})
                </h3>
                <p className="text-xs text-gray-400 font-medium mt-0.5">Filter & sort transactions from newest to oldest or month-wise.</p>
              </div>

              {/* ENHANCED SORT & MONTH-WISE TRANSACTION CONTROLS */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 font-bold">Sort:</span>
                  <select
                    value={orderSort}
                    onChange={(e: any) => setOrderSort(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b23] text-xs font-black text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="newest">🕒 Newest to Oldest (Latest First)</option>
                    <option value="oldest">⏳ Oldest to Newest</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-400 font-bold">Status:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1a1b23] text-xs font-black text-gray-900 dark:text-white shadow-sm focus:ring-2 focus:ring-emerald-500"
                  >
                    <option value="All">All Statuses ({orders.length})</option>
                    <option value="Pending">⏳ Pending Approval</option>
                    <option value="Accepted">🔵 Accepted</option>
                    <option value="Dispatched">🚚 Dispatched</option>
                    <option value="Completed">✅ Completed</option>
                  </select>
                </div>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="p-12 text-center">
                <ClipboardList className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">No orders found matching status "{statusFilter}"</h4>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-white/5">
                {filteredOrders.map((order) => (
                  <div key={order.orderId} className={`p-5 md:p-6 transition-colors ${
                    order.status === "Pending" ? "bg-amber-50/20 dark:bg-amber-950/10" : "hover:bg-gray-50/50 dark:hover:bg-white/5"
                  }`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                      
                      <div className="flex items-center gap-3">
                        <span className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-black text-sm flex items-center justify-center shrink-0 border border-emerald-200 dark:border-emerald-800">
                          #{order.sequenceNo}
                        </span>

                        <span className="text-3xl p-2 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-800">
                          {order.iconEmoji}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-black text-gray-400 uppercase">{order.orderId}</span>
                            <span className="text-xs text-gray-400 font-semibold">• {order.orderDate}</span>
                          </div>
                          <h4 className="text-base font-black text-gray-900 dark:text-white mt-0.5">
                            {order.cropName}
                          </h4>
                        </div>
                      </div>

                      <div>
                        <span className={`text-xs font-black px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm ${
                          order.status === "Pending" ? "bg-amber-500 text-white animate-pulse" :
                          order.status === "Accepted" ? "bg-blue-600 text-white" :
                          order.status === "Dispatched" ? "bg-purple-600 text-white" :
                          order.status === "Completed" ? "bg-emerald-600 text-white" :
                          "bg-red-600 text-white"
                        }`}>
                          {order.status === "Pending" && <Clock className="w-3.5 h-3.5" />}
                          {order.status === "Accepted" && <Check className="w-3.5 h-3.5" />}
                          {order.status === "Dispatched" && <Truck className="w-3.5 h-3.5" />}
                          {order.status === "Completed" && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {order.status.includes("Cancelled") && <XCircle className="w-3.5 h-3.5" />}
                          
                          {order.status === "Pending" ? "⏳ Pending Farmer Approval" :
                           order.status === "Accepted" ? "🔵 Accepted Order" :
                           order.status === "Dispatched" ? "🚚 Dispatched Transport" :
                           order.status === "Completed" ? "✅ Completed & Delivered" :
                           `Status: ${order.status}`}
                        </span>
                      </div>

                    </div>

                    <div 
                      onClick={() => setInspectingOrder(order)}
                      className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5 mb-4 text-xs cursor-pointer hover:border-emerald-400 transition-colors"
                    >
                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">Buyer Info</span>
                        <div className="font-black text-gray-900 dark:text-white mt-1">{order.buyerName}</div>
                        <div className="text-gray-500 font-semibold mt-0.5">{order.buyerPhone}</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">Delivery Address & Pincode</span>
                        <div className="font-semibold text-gray-700 dark:text-gray-300 mt-1">{order.buyerAddress}</div>
                        {order.buyerPincode && <div className="text-emerald-600 font-bold">Pincode: {order.buyerPincode}</div>}
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">Quantity Bought</span>
                        <div className="font-black text-gray-900 dark:text-white mt-1">{order.quantityQuintals} Quintals</div>
                        <div className="text-gray-400 font-semibold">@ ₹{order.pricePerQuintal.toLocaleString("en-IN")}/q</div>
                      </div>

                      <div>
                        <span className="text-[10px] font-black text-gray-400 uppercase">Order Revenue</span>
                        <div className="font-black text-emerald-700 dark:text-emerald-400 text-sm mt-1">
                          ₹{order.totalPrice.toLocaleString("en-IN")}
                        </div>
                      </div>
                    </div>

                    {/* MANUAL FARMER ACTION BUTTONS */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-gray-100 dark:border-white/5">
                      <div className="flex items-center gap-2">
                        {order.status === "Pending" && (
                          <>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Accepted")}
                              className="bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4" /> Accept Order
                            </button>
                            <button
                              onClick={() => handleUpdateOrderStatus(order.orderId, "Cancelled by Farmer")}
                              className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 font-bold px-3 py-2 rounded-xl text-xs hover:bg-red-100 transition-colors flex items-center gap-1"
                            >
                              <XCircle className="w-3.5 h-3.5" /> Cancel / Reject
                            </button>
                          </>
                        )}

                        {order.status === "Accepted" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.orderId, "Dispatched")}
                            className="bg-purple-600 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-purple-700 transition-all shadow-md flex items-center gap-1.5"
                          >
                            <Truck className="w-4 h-4" /> Dispatch Crop Transport
                          </button>
                        )}

                        {order.status === "Dispatched" && (
                          <button
                            onClick={() => handleUpdateOrderStatus(order.orderId, "Completed")}
                            className="bg-emerald-600 text-white font-black px-4 py-2 rounded-xl text-xs hover:bg-emerald-700 transition-all shadow-md flex items-center gap-1.5"
                          >
                            <CheckCircle2 className="w-4 h-4" /> Mark Order Completed
                          </button>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${order.buyerPhone.replace(/\D/g, "")}?text=Hi%20${order.buyerName},%20regarding%20your%20order%20%23${order.sequenceNo}%20(${order.orderId})%20for%20${order.cropName}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 hover:bg-emerald-100"
                        >
                          <MessageSquare className="w-3.5 h-3.5" /> WhatsApp Buyer
                        </a>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECT CROP MODAL FOR FARMER DESK LISTINGS */}
      <AnimatePresence>
        {inspectingCrop && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-[#1a1b23] border border-gray-100 dark:border-white/10 rounded-3xl max-w-2xl w-full my-8 overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={() => setInspectingCrop(null)}
                className="absolute top-4 right-4 z-20 text-white bg-black/60 hover:bg-black/90 p-2 rounded-full backdrop-blur-sm transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative h-64 w-full bg-gray-100 dark:bg-white/5">
                <img 
                  src={inspectingCrop.imageUrl} 
                  alt={inspectingCrop.cropName} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="absolute bottom-4 left-6 right-6 flex justify-between items-end">
                  <div>
                    <span className="bg-emerald-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-lg shadow-md mb-2 inline-flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" /> {inspectingCrop.qualityGrade}
                    </span>
                    <h2 className="text-2xl font-black text-white leading-tight flex items-center gap-2">
                      {inspectingCrop.cropName} <span className="text-3xl">{inspectingCrop.iconEmoji}</span>
                    </h2>
                    <p className="text-xs text-emerald-300 font-bold mt-0.5">
                      Farmer: {inspectingCrop.farmerName} • {inspectingCrop.village}, {inspectingCrop.district}, {inspectingCrop.state}
                    </p>
                  </div>

                  <div className="text-right bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                    <span className="text-[10px] text-gray-300 uppercase block font-bold">Farmer Rate</span>
                    <div className="text-xl font-black text-emerald-400">
                      ₹{inspectingCrop.pricePerQuintal.toLocaleString("en-IN")}
                      <span className="text-xs font-semibold text-gray-300">/quintal</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-6">
                <div>
                  <h3 className="text-xs font-black uppercase text-gray-400 tracking-wider mb-2 flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-emerald-600" /> Crop Description & Quality Summary
                  </h3>
                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-medium bg-gray-50 dark:bg-white/5 p-4 rounded-2xl border border-gray-100 dark:border-white/5">
                    {inspectingCrop.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Sprout className="w-3 h-3 text-emerald-500" /> Category
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.category}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-blue-500" /> Harvest Date
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.harvestDate}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Award className="w-3 h-3 text-amber-500" /> Moisture Level
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.moistureContent || "11-12% Optimal"}</div>
                  </div>

                  <div className="bg-gray-50 dark:bg-white/5 p-3.5 rounded-2xl border border-gray-100 dark:border-white/5">
                    <span className="text-[10px] font-extrabold text-gray-400 uppercase flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5 text-purple-500" /> Logistics
                    </span>
                    <div className="font-extrabold text-xs text-gray-900 dark:text-white mt-1">{inspectingCrop.deliveryOption}</div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setInspectingCrop(null); openEditModal(inspectingCrop); }}
                    className="flex-1 py-3 bg-yellow-400 hover:bg-yellow-300 text-emerald-950 font-black rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    <Edit3 className="w-4 h-4" /> Edit This Listing
                  </button>
                  <button
                    onClick={() => setInspectingCrop(null)}
                    className="px-5 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl text-xs"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
