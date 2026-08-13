"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Sprout, TrendingUp, ShieldCheck, Zap, ArrowUpRight } from "lucide-react";

export function SplineHeroAnimation() {
  const [splineLoaded, setSplineLoaded] = useState(false);
  const [splineError, setSplineError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Dynamic Electric Blue / Indigo 3D Particle Orbit Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 450);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener("resize", handleResize);

    // 3D Electric Particles Simulation
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      z: Math.random() * 2 + 0.5,
      radius: Math.random() * 3.5 + 1.5,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      color: ["#6366f1", "#3b82f6", "#06b6d4", "#a855f7", "#38bdf8"][Math.floor(Math.random() * 5)]
    }));

    let angle = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      angle += 0.005;

      // Draw Glowing Ambient Electric Spheres (Indigo & Cyan)
      const grad1 = ctx.createRadialGradient(width * 0.35, height * 0.4, 20, width * 0.35, height * 0.4, 240);
      grad1.addColorStop(0, "rgba(99, 102, 241, 0.35)");
      grad1.addColorStop(1, "rgba(99, 102, 241, 0)");
      ctx.fillStyle = grad1;
      ctx.beginPath();
      ctx.arc(width * 0.35, height * 0.4, 240, 0, Math.PI * 2);
      ctx.fill();

      const grad2 = ctx.createRadialGradient(width * 0.75, height * 0.6, 20, width * 0.75, height * 0.6, 200);
      grad2.addColorStop(0, "rgba(6, 182, 212, 0.3)");
      grad2.addColorStop(1, "rgba(6, 182, 212, 0)");
      ctx.fillStyle = grad2;
      ctx.beginPath();
      ctx.arc(width * 0.75, height * 0.6, 200, 0, Math.PI * 2);
      ctx.fill();

      // Connect nearby particles with electric cyan/indigo lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 115) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99, 102, 241, ${0.25 * (1 - dist / 115)})`;
            ctx.lineWidth = 0.9;
            ctx.stroke();
          }
        }
      }

      // Draw & Move Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 14;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="relative w-full h-[420px] md:h-[480px] rounded-3xl overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 border-2 border-indigo-500/40 shadow-2xl flex items-center justify-center">
      
      {/* BACKGROUND ELECTRIC 3D CANVAS */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover pointer-events-none" />

      {/* OVERLAY FLOATING 3D GLASSMorphic INTERACTIVE WIDGETS */}
      <div className="relative z-20 w-full h-full pointer-events-none p-6 flex flex-col justify-between">
        
        {/* TOP GLOW BADGE */}
        <div className="flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="pointer-events-auto bg-black/50 backdrop-blur-xl border border-indigo-500/30 px-4 py-2 rounded-2xl flex items-center gap-2 text-white shadow-xl"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <Sparkles className="w-4 h-4 text-cyan-300 animate-spin" />
            <span className="text-xs font-black tracking-wider uppercase bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent">
              Spline 3D Electric Mesh Ecosystem
            </span>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="pointer-events-auto bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-xs px-3.5 py-1.5 rounded-xl shadow-lg border border-indigo-400"
          >
            Live APMC Feed
          </motion.div>
        </div>

        {/* CENTER FLOATING 3D CARDS (ELECTRIC VIOLET / CYAN ACCENTS) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pointer-events-auto">
          
          <motion.div
            whileHover={{ scale: 1.06, rotateY: 5, y: -6 }}
            className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/30 text-white space-y-2 shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-cyan-300">Live Mandi Prices</span>
              <TrendingUp className="w-4 h-4 text-cyan-400" />
            </div>
            <strong className="text-xl font-black text-yellow-300 block">₹5,400 / Qtl</strong>
            <p className="text-[10px] text-cyan-100 font-bold">Basmati Paddy • Punjab APMC</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.06, rotateY: -5, y: -6 }}
            className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/30 text-white space-y-2 shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-sky-300">AI Weather Guard</span>
              <Zap className="w-4 h-4 text-sky-400" />
            </div>
            <strong className="text-xl font-black text-sky-300 block">28°C • Optimal</strong>
            <p className="text-[10px] text-sky-100 font-bold">Ideal Spraying Moisture</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.06, rotateY: 5, y: -6 }}
            className="bg-slate-900/60 backdrop-blur-xl p-4 rounded-2xl border border-indigo-500/30 text-white space-y-2 shadow-2xl transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase text-purple-300">Verified Farmers</span>
              <ShieldCheck className="w-4 h-4 text-purple-400" />
            </div>
            <strong className="text-xl font-black text-purple-300 block">50,000+ Active</strong>
            <p className="text-[10px] text-purple-100 font-bold">Direct Buyer Trading</p>
          </motion.div>

        </div>

      </div>

    </div>
  );
}
