"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Cloud, LineChart, Users, Calendar, Landmark, Stethoscope,
  ShoppingBag, Sprout, MapPin, BarChart, ArrowRight, TrendingUp,
  TrendingDown, Droplets, Wind, Navigation, Loader2, MessageSquare,
  Star, Send, CheckCircle2, Leaf, Cpu, ShieldCheck, Zap, ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useTranslation } from "react-i18next";

// ─────────────────────────────────────────────────────────────
//  INTERACTIVE 3D ICOSAHEDRON — pure canvas, no dependencies
//  Earthy agri-tech: deep green front / clay back wireframe
// ─────────────────────────────────────────────────────────────
function AgroOrb() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: 0.4, y: 0 });
  const target = useRef({ x: 0.4, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const p = canvas.parentElement;
      canvas.width = p ? p.offsetWidth : 460;
      canvas.height = p ? p.offsetHeight : 460;
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse track on parent container
    const parent = canvas.parentElement;
    const onMove = (e: MouseEvent) => {
      if (!parent) return;
      const r = parent.getBoundingClientRect();
      mouse.current = {
        x: (e.clientX - r.left - r.width / 2) / r.width,
        y: (e.clientY - r.top - r.height / 2) / r.height,
      };
    };
    parent?.addEventListener("mousemove", onMove);
    const onLeave = () => { mouse.current = { x: 0, y: 0 }; };
    parent?.addEventListener("mouseleave", onLeave);

    // ── Icosahedron geometry ──────────────────────────────
    const φ = (1 + Math.sqrt(5)) / 2;
    const rawV: [number, number, number][] = [
      [0, 1, φ], [0, -1, φ], [0, 1, -φ], [0, -1, -φ],
      [1, φ, 0], [-1, φ, 0], [1, -φ, 0], [-1, -φ, 0],
      [φ, 0, 1], [-φ, 0, 1], [φ, 0, -1], [-φ, 0, -1],
    ];
    const VERTS = rawV.map(([x, y, z]) => {
      const l = Math.sqrt(x * x + y * y + z * z);
      return [x / l, y / l, z / l] as [number, number, number];
    });
    const EDGES: [number, number][] = [
      [0,1],[0,4],[0,5],[0,8],[0,9],
      [1,6],[1,7],[1,8],[1,9],
      [2,3],[2,4],[2,5],[2,10],[2,11],
      [3,6],[3,7],[3,10],[3,11],
      [4,5],[4,8],[4,10],
      [5,9],[5,11],
      [6,7],[6,8],[6,10],
      [7,9],[7,11],
      [8,10],[9,11],
    ];
    // Extra subdivided sphere dots for texture
    const DOTS: [number, number, number][] = Array.from({ length: 60 }, () => {
      const u = Math.random() * Math.PI * 2;
      const v = Math.acos(2 * Math.random() - 1);
      return [Math.sin(v) * Math.cos(u), Math.sin(v) * Math.sin(u), Math.cos(v)];
    });

    // ── Math helpers ──────────────────────────────────────
    const rx = (v: [number,number,number], a: number): [number,number,number] =>
      [v[0], v[1]*Math.cos(a)-v[2]*Math.sin(a), v[1]*Math.sin(a)+v[2]*Math.cos(a)];
    const ry = (v: [number,number,number], a: number): [number,number,number] =>
      [v[0]*Math.cos(a)+v[2]*Math.sin(a), v[1], -v[0]*Math.sin(a)+v[2]*Math.cos(a)];
    const project = (v: [number,number,number], w: number, h: number) => {
      const FOV = 2.8;
      const pz = v[2] + FOV;
      const s = Math.min(w, h) * 0.36 * FOV;
      return { x: (v[0] / pz) * s + w / 2, y: (v[1] / pz) * s + h / 2, z: v[2] };
    };

    // ── Animated floating particles in background ─────────
    const particles = Array.from({ length: 18 }, () => ({
      x: Math.random(), y: Math.random(),
      vx: (Math.random() - 0.5) * 0.0008,
      vy: (Math.random() - 0.5) * 0.0008,
      r: Math.random() * 2.5 + 1,
      col: ["var(--forest)","var(--lime)","var(--clay)","var(--amber)"][Math.floor(Math.random()*4)],
    }));

    let raf: number;
    let t = 0;

    const draw = () => {
      const w = canvas.width, h = canvas.height;
      ctx.clearRect(0, 0, w, h);
      t += 0.01;

      // Smooth rotation lerp
      target.current.y = mouse.current.x * 1.1 + t * 0.18;
      target.current.x = mouse.current.y * 0.7 + 0.4;
      rot.current.x += (target.current.x - rot.current.x) * 0.06;
      rot.current.y += (target.current.y - rot.current.y) * 0.06;

      // Background radial glow
      const g = ctx.createRadialGradient(w*.5, h*.5, 0, w*.5, h*.5, h*.5);
      g.addColorStop(0, "rgba(111,207,151,0.12)");
      g.addColorStop(0.6, "rgba(45,106,79,0.05)");
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // Floating background particles
      particles.forEach(p => {
        p.x = (p.x + p.vx + 1) % 1;
        p.y = (p.y + p.vy + 1) % 1;
        ctx.beginPath();
        ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.col + "55";
        ctx.fill();
      });

      // Transform all vertices
      const tf = (v: [number,number,number]) => ry(rx(v, rot.current.x), rot.current.y);
      const projV = VERTS.map(v => project(tf(v), w, h));
      const projD = DOTS.map(v => project(tf(v), w, h));

      // ── Draw subtle sphere ring ─────────────────────────
      const scale = Math.min(w, h) * 0.36;
      ctx.beginPath();
      ctx.arc(w/2, h/2, scale, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(45,106,79,0.06)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ── Draw edges ──────────────────────────────────────
      EDGES.forEach(([a, b]) => {
        const pa = projV[a], pb = projV[b];
        const depth = (pa.z + pb.z) / 2; // -1 to 1
        const norm = (depth + 1) / 2;     // 0 to 1

        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);

        if (norm > 0.45) {
          // Front faces — deep green
          ctx.strokeStyle = `rgba(26,61,43,${0.2 + norm * 0.55})`;
          ctx.lineWidth = 0.8 + norm;
        } else {
          // Back faces — clay, subtle
          ctx.strokeStyle = `rgba(201,113,75,${0.08 + (1-norm)*0.2})`;
          ctx.lineWidth = 0.5;
        }
        ctx.stroke();
      });

      // ── Draw vertex dots ─────────────────────────────────
      projV.forEach((p) => {
        const norm = (p.z + 1) / 2;
        const size = 2 + norm * 4;
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = norm > 0.45
          ? `rgba(45,106,79,${0.5 + norm * 0.5})`
          : `rgba(201,113,75,${0.15 + (1-norm)*0.3})`;
        ctx.shadowBlur = norm > 0.6 ? 6 : 0;
        ctx.shadowColor = "var(--forest)";
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // ── Subdivision dots (fine texture) ──────────────────
      projD.forEach((p) => {
        const norm = (p.z + 1) / 2;
        if (norm < 0.3) return;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(111,207,151,${norm * 0.35})`;
        ctx.fill();
      });

      raf = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      parent?.removeEventListener("mousemove", onMove);
      parent?.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <canvas ref={canvasRef}
      className="w-full h-full"
      style={{ cursor: "crosshair" }}
    />
  );
}

// ─────────────────────────────────────────────────────────────
//  3D TILT CARD — mouse-position-based perspective tilt
// ─────────────────────────────────────────────────────────────
function TiltCard({ children, className = "", style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);
  const handleMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    el.style.transform = `perspective(600px) rotateY(${dx * 7}deg) rotateX(${-dy * 5}deg) translateY(-4px)`;
    el.style.boxShadow = `${-dx * 8}px ${dy * 8 + 12}px 40px color-mix(in srgb, var(--deep-green) 14.000000000000002%, transparent)`;
  }, []);
  const handleLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(600px) rotateY(0deg) rotateX(0deg) translateY(0px)";
    el.style.boxShadow = "0 2px 8px color-mix(in srgb, var(--deep-green) 6%, transparent)";
  }, []);
  return (
    <div ref={ref} onMouseMove={handleMove} onMouseLeave={handleLeave}
      className={className}
      style={{ transition: "transform 0.3s cubic-bezier(.23,1,.32,1), box-shadow 0.3s ease", transformStyle: "preserve-3d", ...style }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
//  TOOL CARD
// ─────────────────────────────────────────────────────────────
const COLORS: Record<string, { bg: string; text: string; border: string }> = {
  green:  { bg: "#EAF5EE", text: "#1A5C36", border: "#B8DEC8" },
  clay:   { bg: "#F7EDE8", text: "#7A3B26", border: "#E8C4B4" },
  sky:    { bg: "#E8F4FA", text: "#14527A", border: "#B4D9EE" },
  amber:  { bg: "#FBF3E0", text: "#7A5014", border: "#F0D898" },
  purple: { bg: "#F0EBF8", text: "#4A2080", border: "#D0B8EC" },
  teal:   { bg: "#E5F5F2", text: "#0D6B5B", border: "#A8DDD5" },
  rose:   { bg: "#FAE8EB", text: "#7A1C2E", border: "#F0B8C4" },
  indigo: { bg: "#EAECf8", text: "#2C2C8A", border: "#B8BCEC" },
};

function ToolCard({ title, desc, icon: Icon, href, badge, color = "green" }: { title: string; desc: string; icon: any; href: string; badge: string; color?: string }) {
  const c = COLORS[color] || COLORS.green;
  return (
    <Link href={href} className="block group h-full">
      <TiltCard
        className="h-full p-5 rounded-2xl flex flex-col gap-4 cursor-pointer"
        style={{ background: "var(--off-white)", border: `1px solid color-mix(in srgb, var(--deep-green) 10%, transparent)`, boxShadow: "0 2px 8px color-mix(in srgb, var(--deep-green) 6%, transparent)" }}
      >
        <div className="flex items-start justify-between">
          <div className="p-2.5 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
            <Icon className="w-5 h-5" style={{ color: c.text }} />
          </div>
          <span className="text-[9px] font-bold px-2.5 py-1 rounded-full"
            style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}>
            {badge}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold mb-1.5 group-hover:text-green-700 transition-colors" style={{ color: "var(--deep-green)" }}>{title}</h3>
          <p className="text-[11px] leading-relaxed" style={{ color: "color-mix(in srgb, var(--deep-green) 50%, transparent)" }}>{desc}</p>
        </div>
        <div className="flex items-center gap-1 text-xs font-semibold" style={{ color: c.text }}>
          Open <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </div>
      </TiltCard>
    </Link>
  );
}

// ─────────────────────────────────────────────────────────────
//  SCROLL-REVEAL WRAPPER
// ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, direction = "up" }: { children: React.ReactNode; delay?: number; direction?: "up" | "left" | "right" }) {
  const offsets = { up: { y: 40, x: 0 }, left: { y: 0, x: 40 }, right: { y: 0, x: -40 } };
  const off = offsets[direction];
  return (
    <motion.div
      initial={{ opacity: 0, y: off.y, x: off.x }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.65, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
//  MAIN DASHBOARD
// ─────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState("Good morning");
  const [weather, setWeather] = useState({ city:"Detecting…", temp:28, cond:"Clear ☀️", hum:52, wind:12, loading:true });
  const [fbName, setFbName] = useState(""); const [fbMsg, setFbMsg] = useState("");
  const [fbRating, setFbRating] = useState(5); const [fbDone, setFbDone] = useState(false);
  const [reviews, setReviews] = useState([
    { id:"1", name:"Rameshwar Patil", rating:5, msg:"Sold 45q Lokwan wheat directly to a Pune bulk buyer — saved ₹18,000 in agent commission. Life-changing platform.", role:"Farmer · Baramati, MH", ts:"2h ago" },
    { id:"2", name:"Gurpreet Singh",  rating:5, msg:"The direct buyer matching is unreal. Our whole village switched to AgroPulse. Not one grain goes through a middleman now.", role:"Farmer · Ludhiana, PB", ts:"Yesterday" },
    { id:"3", name:"Kavitha Reddy",   rating:5, msg:"The 60-day forecast saved my cotton crop from an unseasonal rain. Agronomist consultation was spot-on and affordable.", role:"Farmer · Warangal, TG", ts:"3 days ago" },
  ]);

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening");
  }, []);

  const fetchWx = async (lat: number, lng: number, fb = "Your location") => {
    try {
      const d = await (await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m`)).json();
      const c = d.current || {};
      const cm: Record<number, string> = { 0:"Clear ☀️", 1:"Mainly Clear 🌤️", 2:"Partly Cloudy ⛅", 3:"Overcast ☁️", 61:"Light Rain 🌧️", 95:"Storm ⛈️" };
      let city = fb;
      try { const gd = await (await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)).json(); city = gd?.address?.city || gd?.address?.town || gd?.address?.village || fb; } catch {}
      setWeather({ city, temp: Math.round(c.temperature_2m ?? 28), cond: cm[c.weather_code] ?? "Clear ☀️", hum: Math.round(c.relative_humidity_2m ?? 52), wind: Math.round(c.wind_speed_10m ?? 12), loading: false });
    } catch { setWeather(w => ({ ...w, city: fb, loading: false })); }
  };
  const detect = () => {
    setWeather(w => ({ ...w, loading: true }));
    navigator.geolocation?.getCurrentPosition(p => fetchWx(p.coords.latitude, p.coords.longitude), () => fetchWx(23.26, 77.41, "Bhopal"), { timeout: 8000 });
  };
  useEffect(() => { detect(); }, []);

  const submitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fbName.trim() || !fbMsg.trim()) return;
    setReviews(r => [{ id: Date.now().toString(), name: fbName, rating: fbRating, msg: fbMsg, role: "Verified User", ts: "Just now" }, ...r]);
    setFbName(""); setFbMsg(""); setFbDone(true);
    setTimeout(() => setFbDone(false), 4000);
  };

  const tickers = [
    { crop:"Wheat (Sharbati)",       mandi:"Indore APMC",    price:"₹2,850/q", d:"+4.2%", up:true  },
    { crop:"Paddy (Basmati 1121)",    mandi:"Karnal APMC",    price:"₹4,620/q", d:"+2.8%", up:true  },
    { crop:"Cotton (Bt Staple)",      mandi:"Rajkot APMC",    price:"₹7,150/q", d:"−1.5%", up:false },
    { crop:"Soyabean (Yellow)",       mandi:"Ujjain APMC",    price:"₹4,480/q", d:"+1.9%", up:true  },
    { crop:"Mustard (Yellow)",        mandi:"Jaipur APMC",    price:"₹5,350/q", d:"+3.1%", up:true  },
    { crop:"Onion (Nashik Red)",      mandi:"Lasalgaon APMC", price:"₹1,920/q", d:"−2.4%", up:false },
    { crop:"Tomato (Desi)",           mandi:"Pune APMC",      price:"₹2,100/q", d:"+6.8%", up:true  },
    { crop:"Chickpea (Desi)",         mandi:"Akola APMC",     price:"₹5,850/q", d:"+0.9%", up:true  },
  ];

  const tools = [
    { title:t('market_prices', "Market Prices"),        desc:t('tool_desc_market', "Live MSP vs APMC rates for 70+ crops with trend analysis."), icon:LineChart,   href:"/market",        badge:t('badge_70_crops', "70+ Crops"), color:"green"  },
    { title:t('mandi_finder', "GPS Mandi Finder"),     desc:t('tool_desc_mandi', "26+ APMC mandis on an interactive map with GPS navigation."), icon:MapPin,      href:"/mandi-finder",  badge:t('badge_gps', "GPS"),       color:"sky"    },
    { title:t('weather', "Weather Forecast"),     desc:t('tool_desc_weather', "60-day hyper-local rain, humidity & soil moisture forecast."), icon:Cloud,       href:"/weather",       badge:t('badge_60_day', "60-Day"),    color:"sky"    },
    { title:t('community', "Farmer Community"),     desc:t('tool_desc_community', "Verified e-Farmer groups for yields, prices & advice."),     icon:Users,       href:"/community",     badge:t('badge_verified', "Verified"),  color:"green"  },
    { title:t('expert_consultation', "Agronomist Consult"),   desc:t('tool_desc_experts', "1-on-1 certified crop disease diagnosis & treatment plans."),  icon:Stethoscope, href:"/experts",       badge:t('badge_1_on_1', "1-on-1"),    color:"clay"   },
    { title:t('planner', "AI Crop Planner"),      desc:t('tool_desc_planner', "Enter crop & date → get a full sowing-to-harvest plan."),    icon:Calendar,    href:"/planner",       badge:t('badge_ai', "AI"),        color:"amber"  },
    { title:t('compare', "Compare Crops"),        desc:t('tool_desc_compare', "Profit margins, soil fit & water needs side-by-side."),      icon:BarChart,    href:"/compare",       badge:t('badge_analytics', "Analytics"), color:"teal"   },
    { title:t('govt_schemes', "Govt Schemes"),         desc:t('tool_desc_schemes', "PM-Kisan, Fasal Bima, subsidies & agri loan details."),      icon:Landmark,    href:"/schemes",       badge:t('badge_free', "Free"),      color:"indigo" },
  ];

  /* ─── RENDER ────────────────────────────────────────────── */
  return (
    <div>

      {/* ════════════════════════════════════════════════════
          §1  ASYMMETRIC HERO — left text, right 3D canvas
      ════════════════════════════════════════════════════ */}
      <section style={{ background: "var(--cream)", overflow: "hidden" }}>
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_480px] min-h-[90vh] items-center px-8 md:px-12 gap-0">

          {/* LEFT — editorial text block, left-aligned */}
          <div className="py-20 pr-0 lg:pr-16 space-y-8">

            {/* Eyebrow — pill badge, left-aligned (not centered) */}
            <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.55 }}>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                style={{ background:"rgba(45,106,79,0.1)", border:"1px solid rgba(45,106,79,0.2)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-semibold" style={{ color:"var(--forest)" }}>{greeting} — AgroPulse is live</span>
              </div>
            </motion.div>

            {/* DISPLAY HEADLINE — Playfair, left-anchored, intentionally asymmetric */}
            <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.08 }}>
              <h1 className="font-display leading-[1.04] tracking-tight"
                style={{ fontFamily:"'Playfair Display', Georgia, serif", fontSize:"clamp(44px, 5.5vw, 78px)", color:"var(--deep-green)" }}>
                {t('hero_line1', 'From Seed')}
                <br />
                <em style={{ color:"var(--clay)" }}>{t('hero_line2', 'to Sale.')}</em>
                <br />
                {t('hero_line3', 'No Middlemen.')}
              </h1>
            </motion.div>

            <motion.p initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.16 }}
              className="text-base md:text-lg leading-relaxed max-w-md"
              style={{ color:"color-mix(in srgb, var(--deep-green) 60%, transparent)", fontFamily:"'DM Sans', sans-serif" }}>
              {t('hero_desc', "India's direct agri-market platform. Buy, sell, and trade farm produce across 36 States & UTs with live APMC data, AI planning, and zero commission.")}
            </motion.p>

            {/* CTAs — left-aligned stack of buttons */}
            <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.65, delay:0.22 }}
              className="flex flex-wrap gap-3">
              <Link href="/marketplace" className="btn-green">
                <ShoppingBag className="w-4 h-4" /> {t('browse_marketplace', 'Browse Marketplace')}
              </Link>
              <Link href="/seller" className="btn-amber">
                <Sprout className="w-4 h-4" /> {t('nav_sell_harvest', 'Sell Harvest')}
              </Link>
              <Link href="/planner" className="btn-ghost flex items-center gap-2">
                {t('planner', 'AI Planner')} <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Inline stats — typography-only, no cards */}
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ duration:0.65, delay:0.32 }}
              className="flex flex-wrap items-center gap-6 pt-2">
              {[
                { v:"₹14.8Cr+", l:"Direct Trade Volume" },
                { v:"50,000+",   l:"Verified Farmers"    },
                { v:"0%",        l:"Middleman Commission" },
              ].map(s => (
                <div key={s.l}>
                  <p className="font-display text-2xl font-bold" style={{ fontFamily:"'Playfair Display',serif", color:"var(--deep-green)" }}>{s.v}</p>
                  <p className="text-[10px] font-medium mt-0.5" style={{ color:"color-mix(in srgb, var(--deep-green) 45%, transparent)" }}>{s.l}</p>
                </div>
              ))}
              <div style={{ width:1, height:36, background:"color-mix(in srgb, var(--deep-green) 10%, transparent)" }} className="hidden sm:block" />
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-semibold"
                style={{ background:"rgba(232,168,56,0.15)", color:"#7A5014", border:"1px solid rgba(232,168,56,0.3)" }}>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                26+ APMC Mandis · Live Feed
              </div>
            </motion.div>
          </div>

          {/* RIGHT — interactive 3D scene, NOT centered in page */}
          <motion.div
            initial={{ opacity:0, x:40 }} animate={{ opacity:1, x:0 }}
            transition={{ duration:0.8, delay:0.2, ease:[0.23,1,0.32,1] }}
            className="relative hidden lg:flex items-center justify-center h-full"
            style={{ minHeight: 480 }}
          >
            {/* 3D canvas container */}
            <div className="w-full h-[460px] relative">
              <AgroOrb />
            </div>

            {/* Floating data callouts — positioned absolutely */}
            <div className="absolute top-[18%] left-[-20px] float">
              <div className="px-3.5 py-2.5 rounded-2xl shadow-lg"
                style={{ background:"var(--off-white)", border:"1px solid var(--border)", boxShadow:"0 8px 24px color-mix(in srgb, var(--deep-green) 10%, transparent)" }}>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color:"color-mix(in srgb, var(--deep-green) 40%, transparent)" }}>Wheat · Indore</p>
                <p className="font-display font-bold text-sm" style={{ fontFamily:"'Playfair Display',serif", color:"var(--deep-green)" }}>₹2,850 <span className="text-green-600 text-xs">↑4.2%</span></p>
              </div>
            </div>
            <div className="absolute bottom-[20%] right-[-10px] float float-delay-1">
              <div className="px-3.5 py-2.5 rounded-2xl shadow-lg"
                style={{ background:"var(--off-white)", border:"1px solid rgba(201,113,75,0.2)", boxShadow:"0 8px 24px rgba(201,113,75,0.12)" }}>
                <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color:"color-mix(in srgb, var(--deep-green) 40%, transparent)" }}>Farmers Online</p>
                <p className="font-display font-bold text-sm" style={{ fontFamily:"'Playfair Display',serif", color:"var(--clay)" }}>2,841 <span style={{ color:"color-mix(in srgb, var(--deep-green) 40%, transparent)", fontSize:10 }}>right now</span></p>
              </div>
            </div>
            <div className="absolute top-[52%] left-[-30px] float float-delay-2">
              <div className="px-3 py-2 rounded-xl" style={{ background:"rgba(111,207,151,0.2)", border:"1px solid rgba(111,207,151,0.4)" }}>
                <p className="text-[9px] font-bold" style={{ color:"#1A5C36" }}>0% Commission · Today</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §2  LIVE APMC TICKER — deep green band
      ════════════════════════════════════════════════════ */}
      <section className="overflow-hidden py-4" style={{ background:"var(--deep-green)" }}>
        <div className="flex items-center">
          <div className="shrink-0 flex items-center gap-2.5 px-6 pr-7"
            style={{ borderRight:"1px solid color-mix(in srgb, var(--cream) 12%, transparent)" }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background:"var(--lime)" }} />
            <span className="text-[10px] font-bold tracking-[.12em] uppercase" style={{ color:"var(--lime)" }}>
              Live APMC Rates
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="ticker-track">
              {[...tickers, ...tickers].map((t, i) => (
                <div key={i} className="inline-flex items-center gap-3 px-7 shrink-0">
                  <span className="text-xs font-medium" style={{ color:"color-mix(in srgb, var(--cream) 55.00000000000001%, transparent)" }}>{t.crop}</span>
                  <span className="text-sm font-bold text-white">{t.price}</span>
                  <span className={`flex items-center gap-0.5 text-[11px] font-bold ${t.up ? "text-green-400" : "text-red-400"}`}>
                    {t.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />} {t.d}
                  </span>
                  <span className="text-[10px]" style={{ color:"color-mix(in srgb, var(--cream) 25%, transparent)" }}>{t.mandi}</span>
                  <span style={{ color:"color-mix(in srgb, var(--cream) 10%, transparent)" }}>·</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §3  PLATFORM INTRO — asymmetric, off-center
      ════════════════════════════════════════════════════ */}
      <section className="px-8 md:px-12 py-20" style={{ background:"var(--cream)" }}>
        <div className="max-w-[1400px] mx-auto">
          {/* Off-center section: large decorative number left, heading slightly indented */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr_420px] gap-8 items-start">

            {/* Giant muted number — decorative, non-centered */}
            <div className="hidden lg:block pt-2 select-none">
              <span className="font-display font-bold" style={{ fontFamily:"'Playfair Display',serif", fontSize:120, lineHeight:1, color:"color-mix(in srgb, var(--deep-green) 6%, transparent)", letterSpacing:"-8px" }}>01</span>
            </div>

            {/* Heading + quick links */}
            <div className="space-y-8">
              <Reveal>
                <p className="label">The Platform</p>
                <h2 className="font-display mt-3 leading-tight"
                  style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(34px, 4vw, 52px)", color:"var(--deep-green)" }}>
                  Everything a farmer needs,<br />
                  <em style={{ color:"var(--forest)" }}>intelligently connected.</em>
                </h2>
              </Reveal>

              <Reveal delay={0.1}>
                <p className="text-base leading-relaxed max-w-sm"
                  style={{ color:"color-mix(in srgb, var(--deep-green) 55.00000000000001%, transparent)", fontFamily:"'DM Sans',sans-serif" }}>
                  Built ground-up for Indian agriculture — from small-holders in Vidarbha to large-scale cotton growers in Gujarat.
                </p>
              </Reveal>

              {/* Quick-access links — horizontal list, not a card grid */}
              <Reveal delay={0.18}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-sm">
                  {[
                    { href:"/marketplace", icon:ShoppingBag, label:"Crop Marketplace",  sub:"50,000+ listings",   col:"var(--forest)", bg:"#EAF5EE" },
                    { href:"/seller",      icon:Sprout,      label:"Farmer Desk",       sub:"List & sell produce", col:"var(--clay)", bg:"#F7EDE8" },
                    { href:"/mandi-finder",icon:MapPin,      label:"GPS Mandi Finder",  sub:"26+ APMC mandis",     col:"#0369A1", bg:"#E8F4FA" },
                    { href:"/planner",     icon:Calendar,    label:"AI Crop Planner",   sub:"Full growth schedule",col:"#7C3AED", bg:"#F0EBF8" },
                  ].map(({ href,icon:Icon,label,sub,col,bg }) => (
                    <Link key={href} href={href}
                      className="group flex items-center gap-3.5 p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                      style={{ background:"var(--off-white)", border:"1px solid color-mix(in srgb, var(--deep-green) 10%, transparent)", boxShadow:"0 2px 8px color-mix(in srgb, var(--deep-green) 5%, transparent)" }}>
                      <div className="p-2 rounded-xl shrink-0" style={{ background:bg }}>
                        <Icon className="w-4 h-4" style={{ color:col }} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold group-hover:text-green-800 transition-colors" style={{ color:"var(--deep-green)" }}>{label}</p>
                        <p className="text-[10px]" style={{ color:"color-mix(in srgb, var(--deep-green) 40%, transparent)" }}>{sub}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </Reveal>
            </div>

            {/* Weather widget — right column */}
            <Reveal direction="left" delay={0.1}>
              <TiltCard
                className="rounded-3xl overflow-hidden"
                style={{ background:"linear-gradient(150deg, #E8F4FA 0%, #D0E8F4 100%)", border:"1px solid #A8D8EE", boxShadow:"0 8px 32px rgba(2,106,170,0.1)" }}
              >
                <div className="p-7 space-y-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="label" style={{ color:"#0369A1" }}>Live Weather Guard</p>
                      <div className="mt-1.5">
                        {weather.loading
                          ? <Loader2 className="w-4 h-4 text-sky-500 animate-spin mt-1" />
                          : <p className="text-xs font-medium flex items-center gap-1" style={{ color:"rgba(3,105,161,0.7)" }}>
                              <MapPin className="w-3 h-3 text-red-400" />{weather.city}
                            </p>}
                      </div>
                    </div>
                    <button onClick={detect} className="p-2.5 rounded-2xl transition-colors" style={{ background:"rgba(3,105,161,0.12)", color:"#0369A1" }}>
                      <Navigation className="w-4 h-4" />
                    </button>
                  </div>
                  {!weather.loading && (
                    <>
                      <div className="flex items-end gap-3">
                        <span className="font-display font-bold leading-none" style={{ fontFamily:"'Playfair Display',serif", fontSize:72, color:"#0C4A6E" }}>{weather.temp}°</span>
                        <div>
                          <p className="text-sm font-semibold" style={{ color:"var(--clay)" }}>{weather.cond}</p>
                          <p className="text-[10px] mt-1" style={{ color:"rgba(3,105,161,0.5)" }}>Farming conditions</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { icon:Droplets, l:"Humidity",   v:`${weather.hum}%` },
                          { icon:Wind,     l:"Wind Speed", v:`${weather.wind} km/h` },
                        ].map(({ icon:Icon, l, v }) => (
                          <div key={l} className="p-3.5 rounded-2xl flex items-center gap-2.5" style={{ background:"color-mix(in srgb, var(--cream) 55.00000000000001%, transparent)", backdropFilter:"blur(8px)" }}>
                            <Icon className="w-4 h-4 shrink-0 text-sky-600" />
                            <div>
                              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color:"rgba(3,105,161,0.5)" }}>{l}</p>
                              <p className="text-sm font-bold" style={{ color:"#0C4A6E" }}>{v}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                  <Link href="/weather" className="flex items-center justify-between text-xs font-semibold pt-3"
                    style={{ borderTop:"1px solid rgba(3,105,161,0.15)", color:"#0369A1" }}>
                    60-Day Weather Hub <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </TiltCard>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §4  TOOLS GRID — earthy warm section
      ════════════════════════════════════════════════════ */}
      <section className="px-8 md:px-12 py-20" style={{ background:"var(--cream-dark)" }}>
        <div className="max-w-[1400px] mx-auto space-y-10">

          {/* Off-center heading */}
          <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-8 items-end">
            <div className="hidden lg:block select-none">
              <span className="font-display font-bold" style={{ fontFamily:"'Playfair Display',serif", fontSize:100, lineHeight:1, color:"color-mix(in srgb, var(--deep-green) 7.000000000000001%, transparent)", letterSpacing:"-6px" }}>02</span>
            </div>
            <div>
              <Reveal>
                <p className="label">{t('integrated_tools_label', 'Integrated Farm Tools')}</p>
                <h2 className="font-display mt-2" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(30px, 3.5vw, 46px)", color:"var(--deep-green)" }}>
                  {t('integrated_tools_title', '10 services, one platform.')}
                </h2>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((t, i) => (
              <Reveal key={t.href} delay={i * 0.05}>
                <ToolCard {...t} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          §5  REVIEWS — deep green background, cream cards
      ════════════════════════════════════════════════════ */}
      <section className="px-8 md:px-12 py-20" style={{ background:"var(--deep-green)" }}>
        <div className="max-w-[1400px] mx-auto space-y-12">

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
            <Reveal>
              <p className="label" style={{ color:"rgba(111,207,151,0.7)" }}>Verified Farmer Reviews</p>
              <h2 className="font-display mt-2" style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(28px,3.5vw,44px)", color:"var(--off-white)" }}>
                Heard from the fields.
              </h2>
            </Reveal>
            <Link href="/feedback" className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              style={{ background:"rgba(111,207,151,0.15)", color:"var(--lime)", border:"1px solid rgba(111,207,151,0.25)" }}>
              <MessageSquare className="w-3.5 h-3.5" /> All Reviews
            </Link>
          </div>

          {/* Review cards — cream on dark green, slight overlap effect */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.1}>
                <TiltCard
                  className="p-6 rounded-2xl flex flex-col gap-4 h-full"
                  style={{ background:"var(--off-white)", border:"1px solid color-mix(in srgb, var(--deep-green) 10%, transparent)", boxShadow:"0 4px 24px rgba(0,0,0,0.2)" }}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: r.rating }).map((_, j) => (
                      <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <blockquote className="font-display text-base font-medium leading-relaxed flex-1"
                    style={{ fontFamily:"'Playfair Display',serif", color:"var(--deep-green)" }}>
                    "{r.msg}"
                  </blockquote>
                  <div className="flex items-center gap-3 pt-4" style={{ borderTop:"1px solid color-mix(in srgb, var(--deep-green) 7.000000000000001%, transparent)" }}>
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black text-white"
                      style={{ background:"linear-gradient(135deg,var(--forest),var(--deep-green))" }}>
                      {r.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold" style={{ color:"var(--deep-green)" }}>{r.name}</p>
                      <p className="text-[10px]" style={{ color:"color-mix(in srgb, var(--deep-green) 45%, transparent)" }}>{r.role}</p>
                    </div>
                    <span className="text-[10px]" style={{ color:"color-mix(in srgb, var(--deep-green) 28.000000000000004%, transparent)" }}>{r.ts}</span>
                  </div>
                </TiltCard>
              </Reveal>
            ))}
          </div>

          {/* Review form */}
          <Reveal delay={0.15}>
            <div className="rounded-3xl p-8" style={{ background:"color-mix(in srgb, var(--cream) 6%, transparent)", border:"1px solid color-mix(in srgb, var(--cream) 10%, transparent)" }}>
              <h3 className="font-display font-bold text-xl mb-6" style={{ fontFamily:"'Playfair Display',serif", color:"var(--off-white)" }}>
                Share your story
              </h3>
              <form onSubmit={submitReview} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input type="text" required placeholder="Your name & city" value={fbName} onChange={e=>setFbName(e.target.value)}
                    className="px-4 py-3.5 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-400/30"
                    style={{ background:"color-mix(in srgb, var(--cream) 8%, transparent)", border:"1px solid color-mix(in srgb, var(--cream) 12%, transparent)", color:"var(--off-white)", caretColor:"var(--lime)" }}
                    onFocus={e=>(e.target.style.background="color-mix(in srgb, var(--cream) 12%, transparent)")}
                    onBlur={e=>(e.target.style.background="color-mix(in srgb, var(--cream) 8%, transparent)")} />
                  <select value={fbRating} onChange={e=>setFbRating(Number(e.target.value))}
                    className="px-4 py-3.5 rounded-xl text-sm font-semibold focus:outline-none"
                    style={{ background:"rgba(232,168,56,0.15)", border:"1px solid rgba(232,168,56,0.3)", color:"var(--amber)" }}>
                    <option value={5} style={{ background:"var(--deep-green)" }}>⭐⭐⭐⭐⭐  Excellent</option>
                    <option value={4} style={{ background:"var(--deep-green)" }}>⭐⭐⭐⭐  Very Good</option>
                    <option value={3} style={{ background:"var(--deep-green)" }}>⭐⭐⭐  Good</option>
                  </select>
                </div>
                <textarea rows={3} required placeholder="How did AgroPulse help your farm business…" value={fbMsg} onChange={e=>setFbMsg(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl text-sm font-medium resize-none focus:outline-none focus:ring-2 focus:ring-green-400/30"
                  style={{ background:"color-mix(in srgb, var(--cream) 8%, transparent)", border:"1px solid color-mix(in srgb, var(--cream) 12%, transparent)", color:"var(--off-white)", caretColor:"var(--lime)" }} />
                <div className="flex justify-between items-center">
                  <AnimatePresence>
                    {fbDone && (
                      <motion.span initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0 }}
                        className="flex items-center gap-1.5 text-sm font-semibold" style={{ color:"var(--lime)" }}>
                        <CheckCircle2 className="w-4 h-4" /> Thank you! Review posted.
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <button type="submit" className="btn-amber ml-auto">
                    <Send className="w-3.5 h-3.5" /> Submit Review
                  </button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

    </div>
  );
}
