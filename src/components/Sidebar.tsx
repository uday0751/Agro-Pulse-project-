"use client";

import { Home, LineChart, Cloud, Users, Calendar, Settings, Landmark, Stethoscope, User, MapPin, BarChart, ShoppingBag, Sprout, MessageSquareHeart, Sparkles } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Logo } from "./Logo";

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  // Hide sidebar on Auth and Profile-Setup pages
  if (pathname === "/auth" || pathname === "/auth/signup" || pathname === "/profile-setup") {
    return null;
  }

  const links = [
    { href: "/", label: t("dashboard") || "Dashboard", icon: Home },
    { href: "/marketplace", label: "Buy Crops (Customer)", icon: ShoppingBag },
    { href: "/seller", label: "Sell Crops (Farmer Desk)", icon: Sprout },
    { href: "/market", label: t("market_prices") || "Market Prices", icon: LineChart },
    { href: "/mandi-finder", label: t("mandi_finder") || "Mandi Finder", icon: MapPin },
    { href: "/weather", label: t("weather") || "Weather", icon: Cloud },
    { href: "/community", label: t("community") || "Community", icon: Users },
    { href: "/experts", label: t("expert_consultation") || "Experts", icon: Stethoscope },
    { href: "/planner", label: t("planner") || "Crop Planner", icon: Calendar },
    { href: "/compare", label: t("compare") || "Compare Crops", icon: BarChart },
    { href: "/schemes", label: t("govt_schemes") || "Govt Schemes", icon: Landmark },
    { href: "/feedback", label: "Feedback & Support", icon: MessageSquareHeart },
  ];

  return (
    <motion.aside 
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-64 bg-white/90 dark:bg-[#12131c]/90 backdrop-blur-xl border-r border-emerald-500/20 dark:border-white/10 hidden md:flex flex-col min-h-screen fixed left-0 top-0 z-50 shadow-2xl"
    >
      {/* GLOWING LOGO BRANDING */}
      <div className="p-6 border-b border-gray-100 dark:border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-emerald-500/20 rounded-full blur-2xl pointer-events-none" />
        <Link href="/" className="text-2xl font-black text-emerald-700 dark:text-emerald-400 flex items-center gap-2.5 tracking-tight relative z-10">
          <Logo className="w-9 h-9 transition-transform hover:rotate-12" />
          <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-green-600 bg-clip-text text-transparent drop-shadow-sm">
            AgroPulse
          </span>
        </Link>
        <span className="text-[9px] font-black uppercase text-emerald-600/80 tracking-widest mt-1">
          ✦ Modern 3D Portal ✦
        </span>
      </div>
      
      {/* NAVIGATION LINKS WITH FRAMER MOTION GLOWING PILL */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto font-sans">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          
          return (
            <Link key={link.href} href={link.href} className="relative block">
              <motion.div
                whileHover={{ scale: 1.03, x: 4 }}
                whileTap={{ scale: 0.97 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-xs font-black relative z-10 ${
                  isActive 
                    ? "text-white shadow-lg" 
                    : "text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-white/5"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activePill"
                    className="absolute inset-0 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 rounded-2xl shadow-[0_4px_20px_rgba(16,185,129,0.4)] border border-emerald-400/50 -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-4.5 h-4.5 ${isActive ? "text-yellow-300 animate-pulse" : "text-emerald-600 dark:text-emerald-400"}`} />
                <span>{link.label}</span>
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* FOOTER USER / SETTINGS */}
      <div className="p-4 border-t border-gray-100 dark:border-white/10 space-y-1 bg-gray-50/50 dark:bg-black/20">
        <Link href="/profile" className="relative block">
          <motion.div 
            whileHover={{ scale: 1.03, x: 4 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              pathname === "/profile" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5"
            }`}
          >
            <User className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("profile") || "Profile"}</span>
          </motion.div>
        </Link>

        <Link href="/settings" className="relative block">
          <motion.div 
            whileHover={{ scale: 1.03, x: 4 }}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
              pathname === "/settings" ? "bg-emerald-600 text-white shadow-md" : "text-gray-600 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-white/5"
            }`}
          >
            <Settings className="w-4.5 h-4.5 text-emerald-600 dark:text-emerald-400" />
            <span>{t("settings") || "Settings"}</span>
          </motion.div>
        </Link>
      </div>
    </motion.aside>
  );
}
