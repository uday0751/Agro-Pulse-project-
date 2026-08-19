"use client";

import React, { useState, useLayoutEffect, useRef, useMemo, useEffect } from 'react';
import gsap from 'gsap';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Check, CheckCircle2, Droplets, IndianRupee, Info, Leaf, Sprout, TrendingUp, AlertTriangle, CalendarDays, ShieldAlert, Search, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { COMPREHENSIVE_CROPS_DATABASE } from '../market/page';

const CROP_DATA = COMPREHENSIVE_CROPS_DATABASE.map(crop => {
  // Extract number from string like "18-22 Quintals" or "80 Quintals"
  const yieldMatch = crop.avgYieldPerAcre.match(/\d+/);
  const parsedYield = yieldMatch ? parseInt(yieldMatch[0]) : 15;
  
  // Extract number from string like "110-130 Days" or "120 Days"
  const durationMatch = crop.durationDays.match(/\d+/);
  const parsedDuration = durationMatch ? parseInt(durationMatch[0]) : 120;

  // Approximate water needs based on category
  const water = 
    crop.category === 'Commercial & Plantation' ? 1500 : 
    crop.category === 'Cereals & Grains' ? 800 : 
    crop.category === 'Fruits' ? 1000 : 
    crop.category === 'Vegetables' ? 600 : 500;

  // Risk inversely proportional to demand
  const risk = 
    crop.demandLevel === 'Extremely High' ? 'Low' : 
    crop.demandLevel === 'High' ? 'Medium' : 'High';

  return {
    id: crop.id.toString(),
    name: crop.name,
    price: crop.private,
    msp: crop.govt,
    yield: parsedYield,
    water: water,
    season: crop.season,
    risk: risk,
    fertilizerCost: Math.round(crop.costPerAcre * 0.25), // Estimate fert cost as 25% of total
    irrigationType: crop.soilType.toLowerCase().includes('sandy') ? 'Drip/Sprinkler' : 'Surface/Flood',
    duration: parsedDuration,
    trend: crop.history.map(h => ({ month: h.month, price: h.private }))
  };
});

const COLORS = ['#16a34a', '#2563eb', '#ea580c', '#9333ea'];

const SearchableSelect = ({ 
  value, 
  onChange, 
  label,
  index 
}: { 
  value: string | null; 
  onChange: (val: string | null) => void; 
  label: string;
  index: number;
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const selectedCrop = CROP_DATA.find(c => c.id === value);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = CROP_DATA.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="relative w-full" ref={containerRef}>
      <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
      <div 
        className={`flex items-center justify-between border px-4 py-2.5 rounded-xl cursor-pointer bg-white transition-all ${open ? 'border-green-500 ring-2 ring-green-500/20' : 'border-gray-200 hover:border-gray-300'}`}
        onClick={() => { setOpen(true); setSearch(''); }}
      >
        <span className={`text-sm font-medium ${selectedCrop ? 'text-gray-900' : 'text-gray-400'}`}>
          {selectedCrop ? selectedCrop.name : 'Select a crop...'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </div>
      
      {open && (
        <div className="absolute z-50 mt-1.5 w-full bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-gray-50 flex items-center gap-2 bg-gray-50/50">
            <Search className="w-4 h-4 text-gray-400 ml-1" />
            <input 
              type="text" 
              autoFocus
              placeholder="Search crops..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm outline-none bg-transparent py-1"
            />
          </div>
          <div className="max-h-48 overflow-y-auto p-1">
            {value && (
              <div 
                className="px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-lg cursor-pointer mb-1 font-medium"
                onClick={() => { onChange(null); setOpen(false); }}
              >
                Clear selection
              </div>
            )}
            {filtered.length === 0 ? (
              <div className="px-3 py-4 text-sm text-gray-500 text-center">No crops found</div>
            ) : (
              filtered.map(crop => (
                <div 
                  key={crop.id}
                  className="px-3 py-2 text-sm hover:bg-green-50 rounded-lg cursor-pointer flex items-center justify-between group"
                  onClick={() => { onChange(crop.id); setOpen(false); }}
                >
                  <span className="font-medium text-gray-700 group-hover:text-green-700">{crop.name}</span>
                  {value === crop.id && <Check className="w-4 h-4 text-green-600" />}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default function CompareCrops() {
  const { t } = useTranslation();
  const [selectedIds, setSelectedIds] = useState<(string | null)[]>([null, null, null, null]);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedCrops = useMemo(() => {
    return selectedIds.map(id => id ? CROP_DATA.find(c => c.id === id) : null).filter(Boolean) as typeof CROP_DATA;
  }, [selectedIds]);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from(".animate-item", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "all"
      });
      gsap.from(".table-row", {
        x: -20,
        opacity: 0,
        stagger: 0.05,
        duration: 0.4,
        ease: "power2.out",
        clearProps: "all",
        delay: 0.4
      });
    }, containerRef);
    return () => ctx.revert();
  }, [selectedIds]);

  // Combine trend data for chart
  const chartData = useMemo(() => {
    const data: any[] = [];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    months.forEach((month, idx) => {
      let dataPoint: any = { name: month };
      selectedCrops.forEach(crop => {
        dataPoint[crop.id] = crop.trend[idx].price;
      });
      data.push(dataPoint);
    });
    return data;
  }, [selectedCrops]);

  // Calculations for recommendation
  const getProfitRatio = (crop: any) => {
    // Note: Estimated profit per acre = (Yield * Price) - Fertilizer Cost (Assume additional fixed costs like labour = 10000)
    const fixedCosts = 10000;
    const revenue = crop.yield * crop.price;
    const totalCost = crop.fertilizerCost + fixedCosts;
    const profit = revenue - totalCost;
    let riskFactor = 1;
    if (crop.risk === 'Medium') riskFactor = 1.2;
    if (crop.risk === 'High') riskFactor = 1.5;
    return profit / riskFactor; // profit to risk ratio
  };

  const recommendedCrop = useMemo(() => {
    if (selectedCrops.length === 0) return null;
    let best = selectedCrops[0];
    let maxRatio = getProfitRatio(best);
    selectedCrops.forEach(c => {
      const ratio = getProfitRatio(c);
      if (ratio > maxRatio) {
        maxRatio = ratio;
        best = c;
      }
    });
    return best;
  }, [selectedCrops]);

  const calcProfit = (crop: any) => {
    const fixedCosts = 10000; // Assumed irrigation & labour costs
    return (crop.yield * crop.price) - (crop.fertilizerCost + fixedCosts);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 md:p-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="animate-item">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">{t("compare_crops_title", "Compare Crops")}</h1>
          <p className="mt-2 text-gray-600">{t("compare_crops_desc", "Select up to 4 crops to compare market prices, inputs, and estimated profitability side-by-side.")}</p>
        </div>

        {/* Selection Area */}
        <div className="animate-item bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Leaf className="w-5 h-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-800">
              {t("select_crops_compare", "Select Crops to Compare")}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map(index => (
              <SearchableSelect 
                key={index}
                index={index}
                label={`Crop ${index + 1}`}
                value={selectedIds[index]}
                onChange={(newVal) => {
                  const newIds = [...selectedIds];
                  newIds[index] = newVal;
                  setSelectedIds(newIds);
                }}
              />
            ))}
          </div>
        </div>

        {/* Recommendation Badge */}
        {recommendedCrop && (
          <div className="animate-item bg-green-600 rounded-2xl p-6 text-white shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-full">
                <CheckCircle2 className="w-8 h-8 text-green-50" />
              </div>
              <div>
                <h3 className="text-green-100 font-medium text-sm tracking-wide uppercase">{t("recommended_based", "Recommended based on selection")}</h3>
                <p className="text-2xl font-bold">{recommendedCrop.name}</p>
                <p className="text-green-50 text-sm mt-1">{t("best_profit_risk", "Best profit-to-risk ratio among selected crops.")}</p>
              </div>
            </div>
            <div className="bg-white/10 px-6 py-4 rounded-xl border border-white/20 relative z-10 text-center w-full md:w-auto">
              <p className="text-green-100 text-xs font-medium uppercase tracking-wider mb-1">{t("est_profit_acre", "Est. Profit / Acre")}</p>
              <p className="text-3xl font-bold text-white">₹{calcProfit(recommendedCrop).toLocaleString()}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Comparison Table */}
          <div className="lg:col-span-2 animate-item bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Info className="w-5 h-5 text-green-600" />
                {t("detailed_comparison", "Detailed Comparison")}
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-4 font-medium text-gray-500 border-b border-gray-100 w-1/4">{t("metric", "Metric")}</th>
                    {selectedCrops.map((crop, idx) => (
                      <th key={crop.id} className="px-6 py-4 font-semibold text-gray-900 border-b border-gray-100 text-center" style={{ color: COLORS[idx] }}>
                        {crop.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><IndianRupee className="w-4 h-4" /> {t("market_price", "Market Price")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center font-medium">₹{crop.price}/qtl</td>)}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> {t("msp", "MSP")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.msp ? `₹${crop.msp}/qtl` : 'N/A'}</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><Sprout className="w-4 h-4" /> {t("yield_acre", "Yield/Acre")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center font-medium">{crop.yield} qtl</td>)}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><Droplets className="w-4 h-4" /> {t("water_needs", "Water Needs")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.water} mm</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {t("duration", "Duration")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.duration} days</td>)}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><Leaf className="w-4 h-4" /> {t("season", "Season")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.season}</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> {t("risk_level_header", "Risk Level")}</td>
                    {selectedCrops.map(crop => (
                      <td key={crop.id} className="px-6 py-4 text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          crop.risk === 'Low' ? 'bg-green-100 text-green-700' :
                          crop.risk === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {crop.risk}
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="table-row bg-gray-50/30">
                    <td className="px-6 py-4 text-gray-500 font-medium">{t("fert_cost_acre", "Fertilizer Cost/Acre")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">₹{crop.fertilizerCost}</td>)}
                  </tr>
                  <tr className="table-row">
                    <td className="px-6 py-4 text-gray-500 font-medium">{t("irrigation_type", "Irrigation Type")}</td>
                    {selectedCrops.map(crop => <td key={crop.id} className="px-6 py-4 text-center text-gray-600">{crop.irrigationType}</td>)}
                  </tr>
                  <tr className="table-row border-t-2 border-gray-100 bg-green-50/20">
                    <td className="px-6 py-5 text-gray-800 font-bold">{t("est_profit_acre", "Est. Profit/Acre")}</td>
                    {selectedCrops.map(crop => (
                      <td key={crop.id} className="px-6 py-5 text-center font-bold text-gray-900">
                        ₹{calcProfit(crop).toLocaleString()}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column: Chart & Summary */}
          <div className="space-y-8">
            <div className="animate-item bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 flex flex-col">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-green-600" />
                {t("price_trend", "6-Month Price Trend")}
              </h2>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: '#6b7280', fontSize: 12 }}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
                    {selectedCrops.map((crop, index) => (
                      <Line 
                        key={crop.id} 
                        type="monotone" 
                        dataKey={crop.id} 
                        name={crop.name}
                        stroke={COLORS[index]} 
                        strokeWidth={2}
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff' }}
                        activeDot={{ r: 6 }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Summary Cards */}
            <div className="animate-item grid grid-cols-1 gap-4">
               {selectedCrops.map((crop, idx) => (
                 <div key={crop.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between">
                   <div className="flex items-center gap-3">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></div>
                     <span className="font-semibold text-gray-800">{crop.name}</span>
                   </div>
                   <div className="text-right">
                     <div className="text-sm text-gray-500">Duration</div>
                     <div className="font-medium text-gray-900">{crop.duration} days</div>
                   </div>
                 </div>
               ))}
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
