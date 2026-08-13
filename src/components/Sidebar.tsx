"use client";

import { Home, LineChart, Cloud, Users, Calendar, Settings, Landmark, Stethoscope, User, MapPin, BarChart, ShoppingBag, Sprout, MessageSquareHeart, Leaf } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const GROUPS = [
  {
    label: "Market",
    items: [
      { href: "/",             label: "Dashboard",     icon: Home      },
      { href: "/marketplace",  label: "Buy Crops",      icon: ShoppingBag },
      { href: "/seller",       label: "Sell Harvest",   icon: Sprout    },
      { href: "/market",       label: "Market Prices",  icon: LineChart },
      { href: "/mandi-finder", label: "Mandi Finder",   icon: MapPin    },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/weather",  label: "Weather Hub",    icon: Cloud       },
      { href: "/planner",  label: "Crop Planner",   icon: Calendar    },
      { href: "/compare",  label: "Compare Crops",  icon: BarChart    },
      { href: "/experts",  label: "Agronomists",    icon: Stethoscope },
    ],
  },
  {
    label: "Community",
    items: [
      { href: "/community", label: "Farmers Forum",  icon: Users              },
      { href: "/schemes",   label: "Govt Schemes",   icon: Landmark           },
      { href: "/feedback",  label: "Feedback",       icon: MessageSquareHeart },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  if (["/auth", "/auth/signup", "/profile-setup"].includes(pathname)) return null;

  return (
    <motion.aside
      initial={{ x: -72, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      className="w-60 hidden md:flex flex-col min-h-screen fixed left-0 top-0 z-50"
      style={{ background: "#1A3D2B" }}
    >
      {/* Brand */}
      <div className="px-6 pt-7 pb-6" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: "rgba(111,207,151,0.18)", border: "1px solid rgba(111,207,151,0.3)" }}>
            <Leaf className="w-5 h-5" style={{ color: "#6FCF97" }} />
          </div>
          <div>
            <p className="font-display text-base font-bold text-white tracking-tight" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>AgroPulse</p>
            <p className="text-[9px] font-semibold tracking-[.14em] uppercase" style={{ color: "rgba(111,207,151,0.7)" }}>Farm Intelligence OS</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
        {GROUPS.map((g) => (
          <div key={g.label}>
            <p className="px-3 mb-2 text-[9px] font-bold tracking-[.14em] uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
              {g.label}
            </p>
            <div className="space-y-0.5">
              {g.items.map((item) => {
                const Icon = item.icon;
                const active = pathname === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <motion.div
                      whileHover={{ x: 3 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium"
                      style={{ color: active ? "#fff" : "rgba(255,255,255,0.45)" }}
                    >
                      {active && (
                        <>
                          {/* Active left bar */}
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full" style={{ background: "#6FCF97" }} />
                          <motion.div layoutId="sb-pill" className="absolute inset-0 rounded-xl"
                            style={{ background: "rgba(111,207,151,0.1)", border: "1px solid rgba(111,207,151,0.2)" }}
                            transition={{ type: "spring", stiffness: 350, damping: 30 }} />
                        </>
                      )}
                      <span className="relative z-10 w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: active ? "rgba(111,207,151,0.18)" : "rgba(255,255,255,0.05)" }}>
                        <Icon className="w-3.5 h-3.5" style={{ color: active ? "#6FCF97" : "rgba(255,255,255,0.38)" }} />
                      </span>
                      <span className="relative z-10 font-medium">{item.label}</span>
                    </motion.div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className="px-3 py-4 space-y-0.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
        {[{ href: "/profile", label: "My Profile", icon: User }, { href: "/settings", label: "Settings", icon: Settings }].map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}>
              <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium hover:bg-white/5 transition-colors"
                style={{ color: pathname === item.href ? "#6FCF97" : "rgba(255,255,255,0.35)" }}>
                <span className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background: "rgba(255,255,255,0.05)" }}>
                  <Icon className="w-3.5 h-3.5" />
                </span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </div>
    </motion.aside>
  );
}
