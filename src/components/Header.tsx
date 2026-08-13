"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Bell, User, Menu, X, CloudRain, Landmark, ShieldAlert, BadgePercent, LogOut, ChevronDown } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { Logo } from "./Logo";
import { useTheme } from "./ThemeProvider";
import { motion, AnimatePresence } from "framer-motion";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { darkMode, toggleDarkMode } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const notifs = [
    { id:"n1", dot:"bg-red-400",    title:"Cotton Price Drop",  desc:"Rajkot cotton fell 3.1% below MSP."              },
    { id:"n2", dot:"bg-sky-400",    title:"Rain Alert — Pune",  desc:"Heavy rain tomorrow. Hold spraying."             },
    { id:"n3", dot:"bg-green-500",  title:"Expert Reply",       desc:"Dr. Ramesh replied to your pest ticket."         },
    { id:"n4", dot:"bg-amber-400",  title:"PM-Kisan Open",      desc:"15th installment applications now open."         },
  ];

  const handleLogout = async () => {
    try { if (auth) await signOut(auth); } catch {}
    localStorage.removeItem("user");
    router.push("/auth");
  };

  useEffect(() => {
    const u = onAuthStateChanged(auth, u => setUser(u || { displayName:"Rajesh Kumar", email:"rajesh@agropulse.in" }));
    return () => u();
  }, []);

  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
    };
    document.addEventListener("mousedown", fn);
    return () => document.removeEventListener("mousedown", fn);
  }, []);

  if (["/auth", "/auth/signup", "/profile-setup"].includes(pathname)) return null;

  const pageLabel = pathname === "/" ? "Dashboard" : pathname.replace("/","").replace(/-/g," ");

  const dropStyle = {
    background: "#FDFAF5",
    border: "1px solid rgba(26,61,43,0.12)",
    borderRadius: 18,
    boxShadow: "0 20px 60px rgba(26,61,43,0.15)",
  };

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3"
      style={{ background: "rgba(245,240,232,0.88)", backdropFilter:"blur(20px)", WebkitBackdropFilter:"blur(20px)", borderBottom:"1px solid rgba(26,61,43,0.09)" }}>

      {/* Mobile: logo + hamburger */}
      <div className="flex items-center gap-3 md:hidden">
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-2 rounded-xl hover:bg-black/5 transition-colors" style={{ color:"#1A3D2B" }}>
          {mobileOpen ? <X className="w-5 h-5"/> : <Menu className="w-5 h-5"/>}
        </button>
        <span className="font-display font-bold text-sm" style={{ fontFamily:"'Playfair Display',Georgia,serif", color:"#1A3D2B" }}>AgroPulse</span>
      </div>

      {/* Desktop: breadcrumb */}
      <div className="hidden md:flex items-center gap-2 text-xs">
        <span style={{ color:"rgba(26,61,43,0.3)" }}>AgroPulse</span>
        <span style={{ color:"rgba(26,61,43,0.18)" }}>/</span>
        <span className="font-semibold capitalize" style={{ color:"#1A3D2B" }}>{pageLabel}</span>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-1.5">

        {/* Language */}
        <select onChange={e => i18n.changeLanguage(e.target.value)} value={i18n.language}
          className="text-xs font-semibold rounded-xl px-2.5 py-2 cursor-pointer focus:outline-none"
          style={{ background:"rgba(26,61,43,0.07)", color:"#2D6A4F", border:"1px solid rgba(26,61,43,0.1)" }}>
          {[["en","EN"],["hi","हि"],["mr","MR"],["pa","PA"],["ta","TA"],["te","TE"]].map(([v,l]) => (
            <option key={v} value={v}>{l}</option>
          ))}
        </select>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button onClick={() => setNotifOpen(o=>!o)}
            className="relative p-2.5 rounded-xl hover:bg-black/5 transition-colors" style={{ color:"#2D6A4F" }}>
            <Bell className="w-4 h-4"/>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full border-2" style={{ background:"#6FCF97", borderColor:"#F5F0E8" }}/>
          </button>
          <AnimatePresence>
            {notifOpen && (
              <motion.div initial={{ opacity:0, y:8, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:6, scale:0.97 }}
                transition={{ duration:0.15 }}
                className="absolute right-0 mt-2 w-[296px] overflow-hidden z-50" style={dropStyle}>
                <div className="px-4 py-3 flex justify-between items-center" style={{ borderBottom:"1px solid rgba(26,61,43,0.07)" }}>
                  <span className="text-xs font-bold" style={{ color:"#1A3D2B" }}>Notifications</span>
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full" style={{ background:"rgba(111,207,151,0.2)", color:"#2D6A4F" }}>4 new</span>
                </div>
                {notifs.map(n => (
                  <div key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-black/[0.03] cursor-pointer transition-colors" style={{ borderBottom:"1px solid rgba(26,61,43,0.04)" }}>
                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.dot}`}/>
                    <div>
                      <p className="text-xs font-semibold" style={{ color:"#1A3D2B" }}>{n.title}</p>
                      <p className="text-[10px] mt-0.5 leading-relaxed" style={{ color:"rgba(26,61,43,0.45)" }}>{n.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Profile */}
        <div className="relative" ref={profileRef}>
          <button onClick={() => setProfileOpen(o=>!o)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl transition-colors hover:bg-black/5"
            style={{ border:"1px solid rgba(26,61,43,0.12)" }}>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center text-[11px] font-black text-white"
              style={{ background:"linear-gradient(135deg,#2D6A4F,#1A3D2B)" }}>
              {user?.displayName?.charAt(0)||"R"}
            </div>
            <span className="text-xs font-semibold hidden sm:inline" style={{ color:"#1A3D2B" }}>
              {user?.displayName?.split(" ")[0]||"Rajesh"}
            </span>
            <ChevronDown className="w-3 h-3 hidden sm:inline" style={{ color:"rgba(26,61,43,0.3)" }}/>
          </button>
          <AnimatePresence>
            {profileOpen && (
              <motion.div initial={{ opacity:0, y:8, scale:0.97 }} animate={{ opacity:1, y:0, scale:1 }} exit={{ opacity:0, y:6, scale:0.97 }}
                transition={{ duration:0.15 }}
                className="absolute right-0 mt-2 w-52 overflow-hidden z-50" style={dropStyle}>
                <div className="px-4 py-3" style={{ borderBottom:"1px solid rgba(26,61,43,0.07)" }}>
                  <p className="text-xs font-bold" style={{ color:"#1A3D2B" }}>{user?.displayName||"Rajesh Kumar"}</p>
                  <p className="text-[10px] mt-0.5 truncate" style={{ color:"rgba(26,61,43,0.45)" }}>{user?.email}</p>
                </div>
                <div className="p-1.5">
                  <Link href="/profile" onClick={()=>setProfileOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-black/[0.04] transition-colors"
                    style={{ color:"#2D6A4F" }}>
                    <User className="w-3.5 h-3.5"/> View Profile
                  </Link>
                  <div className="my-1 mx-3" style={{ height:1, background:"rgba(26,61,43,0.07)" }}/>
                  <button onClick={()=>{ setProfileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold hover:bg-red-50 transition-colors text-red-500">
                    <LogOut className="w-3.5 h-3.5"/> Sign Out
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-50 md:hidden">
            <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={()=>setMobileOpen(false)}/>
            <motion.div initial={{ x:-280 }} animate={{ x:0 }} exit={{ x:-280 }} transition={{ type:"spring", stiffness:300, damping:32 }}
              className="absolute left-0 top-0 bottom-0 w-72 flex flex-col overflow-y-auto"
              style={{ background:"#1A3D2B" }}>
              <div className="flex items-center justify-between p-5" style={{ borderBottom:"1px solid rgba(255,255,255,0.08)" }}>
                <span className="font-display font-bold text-white text-base" style={{ fontFamily:"'Playfair Display',Georgia,serif" }}>AgroPulse</span>
                <button onClick={()=>setMobileOpen(false)} className="p-1.5 rounded-xl hover:bg-white/10" style={{ color:"rgba(255,255,255,0.4)" }}>
                  <X className="w-4 h-4"/>
                </button>
              </div>
              <nav className="flex-1 px-3 py-4 space-y-1">
                {[
                  "/","marketplace","seller","market","mandi-finder",
                  "weather","planner","compare","experts",
                  "community","schemes","feedback"
                ].map(p => {
                  const href = p==="/" ? "/" : `/${p}`;
                  const label = p==="/" ? "Dashboard" : p.replace(/-/g," ").replace(/\b\w/g,c=>c.toUpperCase());
                  const active = pathname===href;
                  return (
                    <Link key={href} href={href} onClick={()=>setMobileOpen(false)}
                      className="block px-3 py-2.5 rounded-xl text-xs font-medium transition-colors capitalize"
                      style={{ color:active?"#6FCF97":"rgba(255,255,255,0.45)", background:active?"rgba(111,207,151,0.1)":"transparent" }}>
                      {label}
                    </Link>
                  );
                })}
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
