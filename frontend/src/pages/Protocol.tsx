import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HowItWorks = () => {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-blue-100">
      {/* 1. STICKY HEADER */}
      <nav className="h-20 border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <div className="flex items-center gap-2">
          <div className="bg-[#2563EB] p-1.5 rounded-lg shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-white text-xl">dataset</span>
          </div>
          <span className="font-black text-xl tracking-tighter text-[#0F172A] uppercase">RetailChain</span>
        </div>
        <Link to="/">
          <Button variant="ghost" className="font-bold text-slate-400 hover:text-[#2563EB] uppercase text-[10px] tracking-widest">
            <span className="material-symbols-outlined text-sm mr-2">arrow_back</span> Return Home
          </Button>
        </Link>
      </nav>

      {/* 2. HERO SECTION */}
      <section className="py-24 bg-slate-50 border-b border-slate-100 text-center px-6">
        <span className="text-[#2563EB] font-black text-[10px] uppercase tracking-[0.4em] mb-4 block">The Trust Protocol</span>
        <h1 className="text-5xl md:text-6xl font-black text-[#0F172A] tracking-tighter mb-6">How It Works.</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-lg font-medium leading-relaxed">
          Ensuring 100% authentic goods through a decentralized, tamper-proof supply chain ledger from factory to storefront.
        </p>
      </section>

      {/* 3. TECHNICAL STEPS */}
      <section className="max-w-6xl mx-auto py-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32">
          <div>
            <span className="text-[#2563EB] font-black text-xs uppercase tracking-widest mb-4 block italic">Phase 01</span>
            <h2 className="text-3xl font-black text-[#0F172A] mb-6 uppercase tracking-tight">Manufacturer Node Logging</h2>
            <p className="text-slate-600 leading-relaxed mb-6 font-medium">
              Every production batch is assigned a unique **Global UID**. Manufacturers register raw material sources and production metadata directly into the RetailChain node at the source.
            </p>
            <div className="flex items-center gap-4 text-[#2563EB] font-bold text-sm">
              <span className="material-symbols-outlined">analytics</span>
              <span>Metadata Encryption Active</span>
            </div>
          </div>
          <div className="bg-[#0F172A] p-12 rounded-[3rem] shadow-2xl flex items-center justify-center relative overflow-hidden group">
             <div className="absolute inset-0 bg-blue-600/10 group-hover:bg-blue-600/20 transition-all"></div>
             <span className="material-symbols-outlined text-8xl text-blue-500 relative z-10">factory</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-32 flex-row-reverse">
          <div className="order-2 md:order-1 bg-slate-50 border border-slate-200 p-12 rounded-[3rem] flex items-center justify-center">
             <span className="material-symbols-outlined text-8xl text-slate-300">verified_user</span>
          </div>
          <div className="order-1 md:order-2">
            <span className="text-[#2563EB] font-black text-xs uppercase tracking-widest mb-4 block italic">Phase 02</span>
            <h2 className="text-3xl font-black text-[#0F172A] mb-6 uppercase tracking-tight">On-Chain Verification</h2>
            <p className="text-slate-600 leading-relaxed mb-6 font-medium">
              Authorized compliance labs perform quality checks. Results are **permanently hashed** onto the ledger. Once certified, batch data is immutable and accessible to all network nodes.
            </p>
            <div className="flex items-center gap-4 text-emerald-600 font-bold text-sm uppercase tracking-tighter">
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Immutable Hash Generated</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
          <div>
            <span className="text-[#2563EB] font-black text-xs uppercase tracking-widest mb-4 block italic">Phase 03</span>
            <h2 className="text-3xl font-black text-[#0F172A] mb-6 uppercase tracking-tight">Retail Availability</h2>
            <p className="text-slate-600 leading-relaxed mb-6 font-medium">
              As goods arrive at partner retail hubs (like D-Mart), a scan verifies the batch integrity. The entire history—from origin to shelf—is instantly mapped for the end consumer.
            </p>
            <div className="flex items-center gap-4 text-[#2563EB] font-bold text-sm">
              <span className="material-symbols-outlined">storefront</span>
              <span>Consumer QR Lookup Ready</span>
            </div>
          </div>
          <div className="bg-[#2563EB] p-12 rounded-[3rem] shadow-xl shadow-blue-200 flex items-center justify-center">
             <span className="material-symbols-outlined text-8xl text-white">inventory</span>
          </div>
        </div>
      </section>

      {/* 4. FOOTER CTA */}
      <section className="bg-[#0F172A] py-24 text-center px-6">
        <h2 className="text-white text-4xl font-black mb-8 tracking-tighter italic uppercase">Securing the Global Supply Chain.</h2>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link to="/login">
            <Button className="bg-[#2563EB] hover:bg-blue-700 h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 text-xs">
              Sign In to Node
            </Button>
          </Link>
          <Link to="/">
             <Button variant="outline" className="border-slate-700 text-slate-400 hover:bg-slate-800 h-16 px-12 rounded-2xl font-black uppercase tracking-[0.2em] text-xs">
               View Live Ledger
             </Button>
          </Link>
        </div>
        <p className="mt-12 text-slate-600 text-[10px] font-bold uppercase tracking-widest">RetailChain Enterprise Protocol v1.0.4</p>
      </section>
    </div>
  );
};

export default HowItWorks;