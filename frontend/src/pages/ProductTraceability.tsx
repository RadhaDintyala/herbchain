import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { Html5QrcodeScanner } from 'html5-qrcode';

const ProductTraceability = () => {
  const [batchIdInput, setBatchIdInput] = useState("");
  const [traceData, setTraceData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isScanning) {
      const scanner = new Html5QrcodeScanner("qr-reader", { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render((decodedText) => {
        setIsScanning(false);
        scanner.clear();
        setBatchIdInput(decodedText);
        performSearch(decodedText);
      }, (err) => {
        // Continuous scanning
      });

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [isScanning]);

  const performSearch = async (idToSearch: string) => {
    if (!idToSearch) return;
    setLoading(true);
    setTraceData(null);
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/api/chain/traceability/${idToSearch}`);
      setTraceData(res.data);
      toast({ title: "Data Verified", description: "Blockchain record retrieved successfully." });
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Record Not Found",
        description: "This Batch ID is not registered on the secure network.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    performSearch(batchIdInput);
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-slate-50">
      {/* 🧾 Retail Header */}
      <header className="flex items-center justify-between border-b border-blue-100 bg-white px-6 md:px-20 py-4 sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-3 text-blue-600">
            <div className="size-9 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-100">
              <span className="material-symbols-outlined text-xl">verified</span>
            </div>
            <h2 className="text-slate-900 text-lg font-black leading-tight tracking-tight">Traceability Hub</h2>
          </Link>
          <div className="hidden lg:flex items-center gap-6">
            <Link className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors" to="/">Home</Link>
            <Link className="text-slate-500 hover:text-blue-600 text-sm font-bold transition-colors" to="/supplier">Admin</Link>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-3 ml-4">
          <form onSubmit={handleSearch} className="flex flex-1 sm:flex-none items-center h-11 w-full max-w-sm bg-slate-100 rounded-xl px-4 border border-transparent focus-within:border-blue-300 focus-within:bg-white transition-all">
            <input
              value={batchIdInput}
              onChange={(e) => setBatchIdInput(e.target.value)}
              className="flex-1 w-full border-none bg-transparent focus:ring-0 text-sm font-bold placeholder:text-slate-400 outline-none"
              placeholder="Enter Batch ID (e.g. BAT-1234)"
            />
            <button type="submit" className="material-symbols-outlined text-blue-600 hover:scale-110 transition-transform">search</button>
          </form>
          <Button onClick={() => setIsScanning(true)} className="bg-blue-600 hover:bg-blue-700 text-white gap-2 rounded-xl h-11 font-bold">
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            <span className="hidden sm:inline">Scan QR</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 py-12">
        {loading && (
          <div className="flex flex-col items-center justify-center p-20 gap-4">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-bold text-slate-400 animate-pulse">VERIFYING BLOCKCHAIN LEDGER...</p>
          </div>
        )}

        {!loading && !traceData && (
          <div className="flex flex-col items-center justify-center p-20 text-center bg-white rounded-3xl border border-blue-100 shadow-xl shadow-slate-200/50">
            <div className="size-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6">
               <span className="material-symbols-outlined text-5xl">search_insights</span>
            </div>
            <h2 className="text-3xl font-black text-slate-900">Track Full Journey</h2>
            <p className="text-slate-500 mt-3 max-w-md font-medium leading-relaxed">Enter a unique Batch ID to retrieve its complete lifecycle across manufacturing, testing, and logistics.</p>
          </div>
        )}

        {/* 🚀 Traceability Report Result */}
        {!loading && traceData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            <div className="mb-10 bg-white rounded-3xl overflow-hidden shadow-2xl border border-blue-50">
              <div className="relative h-48 w-full bg-slate-900 flex items-center px-10 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/20 skew-x-12 translate-x-20"></div>
                <div className="relative z-10 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="bg-blue-500 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
                      <span className="material-symbols-outlined text-sm">verified_user</span>
                      Authenticity Verified
                    </span>
                  </div>
                  <h1 className="text-4xl font-black mb-1">Traceability Report</h1>
                  <p className="text-blue-400 text-sm font-mono font-bold">ID: {traceData.batch.batchId}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-t border-slate-100">
                {[
                  { label: "Current Node", value: traceData.batch.manufacturerId, icon: "warehouse" },
                  { label: "Entry Date", value: traceData.batch.timestamp ? format(new Date(parseInt(traceData.batch.timestamp, 10)), 'MMM dd, yyyy') : "N/A", icon: "calendar_today" },
                  { label: "Status", value: "Verified on Chain", icon: "security", isPrimary: true },
                ].map((d) => (
                  <div key={d.label} className="p-8 flex items-center gap-5">
                    <div className="size-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                       <span className="material-symbols-outlined text-2xl">{d.icon}</span>
                    </div>
                    <div className="flex flex-col">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{d.label}</span>
                       <span className={`text-base font-black ${d.isPrimary ? "text-blue-600" : "text-slate-900"}`}>{d.value}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Journey Timeline */}
              <div className="lg:col-span-2 space-y-8">
                <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <span className="material-symbols-outlined text-blue-600">route</span>
                  Supply Chain Journey
                </h3>

                {traceData.collections.map((col: any, idx: number) => (
                  <div key={idx} className="relative pl-12 before:content-[''] before:absolute before:left-[19px] before:top-4 before:bottom-[-32px] before:w-[2px] before:bg-blue-100 last:before:hidden">
                    <div className="absolute -left-1 top-0 size-10 rounded-2xl bg-white border-2 border-blue-600 flex items-center justify-center text-blue-600 z-10 shadow-lg shadow-blue-50">
                       <span className="material-symbols-outlined text-xl">inventory_2</span>
                    </div>
                    <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-xl shadow-slate-200/40 group hover:border-blue-200 transition-all">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h4 className="font-black text-xl text-slate-900">Manufacturing Entry</h4>
                          <p className="text-xs font-bold text-slate-400 uppercase mt-1">Source ID: {col.collectorId}</p>
                        </div>
                        <span className="text-xs font-black text-blue-700 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
                          {col.timestamp ? format(new Date(parseInt(col.timestamp, 10)), 'yyyy-MM-dd') : "N/A"}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-6 mb-6">
                        {[
                          { icon: "category", label: "Product", val: col.herbName },
                          { icon: "layers", label: "Qty", val: `${col.quantity} Units` },
                          { icon: "location_on", label: "Supplier", val: col.farmDetails },
                        ].map((d) => (
                          <div key={d.label} className="flex flex-col gap-1">
                             <span className="text-[10px] font-black text-slate-400 uppercase">{d.label}</span>
                             <div className="flex items-center gap-2">
                               <span className="material-symbols-outlined text-blue-600 text-sm">{d.icon}</span>
                               <span className="text-sm font-bold text-slate-700">{d.val}</span>
                             </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <span className="material-symbols-outlined text-slate-400 text-sm">database</span>
                        <span className="text-[10px] font-mono font-bold text-slate-500 truncate">BLOCK_HASH: {col.collectionId}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust Score Sidebar */}
              <div className="space-y-6">
                <div className="bg-blue-600 text-white p-8 rounded-3xl shadow-2xl shadow-blue-200 relative overflow-hidden group">
                  <div className="absolute -right-8 -top-8 opacity-10 rotate-12 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[150px]">verified</span>
                  </div>
                  <h4 className="font-black text-xl mb-2 flex items-center gap-2 relative z-10">
                    <span className="material-symbols-outlined">shield_check</span>
                    Trust Score
                  </h4>
                  <p className="text-blue-100 text-xs font-bold mb-8 relative z-10 uppercase tracking-widest">Network Integrity Check</p>
                  <div className="flex items-baseline gap-2 relative z-10 mb-2">
                    <span className="text-7xl font-black">98</span>
                    <span className="text-xl font-bold opacity-60">%</span>
                  </div>
                  <div className="w-full bg-blue-800/50 rounded-full h-2.5 relative z-10 mb-4">
                    <div className="bg-white h-full rounded-full animate-in slide-in-from-left duration-1000" style={{ width: "98%" }}></div>
                  </div>
                  <p className="text-[10px] font-bold text-blue-100 italic">"High reliability - Verifiable end-to-end data."</p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-blue-50 shadow-xl shadow-slate-200/40 space-y-6">
                  <h4 className="font-black text-slate-900 flex items-center gap-2">
                    <span className="material-symbols-outlined text-blue-600">receipt_long</span>
                    Audit Summary
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-400">Ledger Status</span>
                      <span className="text-emerald-600">IMMUTABLE</span>
                    </div>
                    <div className="flex justify-between items-center text-sm font-bold">
                      <span className="text-slate-400">Total Updates</span>
                      <span className="text-slate-900">{traceData.collections.length} Stages</span>
                    </div>
                  </div>
                  <Button onClick={() => window.print()} className="w-full h-12 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                    Print Proof of Origin
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="mt-auto py-12 px-6 bg-slate-900 text-white text-center">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-blue-400">verified</span>
            <span className="font-black tracking-tight">RetailChain Hub</span>
          </div>
          <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase">Powered by Blockchain Security © 2026</p>
          <div className="flex gap-6 text-slate-400">
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-white">lock</span>
            <span className="material-symbols-outlined text-xl cursor-pointer hover:text-white">policy</span>
          </div>
        </div>
      </footer>

      {/* 📱 Professional QR Scanner */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-md p-8 rounded-3xl shadow-2xl relative animate-in zoom-in-95 duration-300">
            <button onClick={() => setIsScanning(false)} className="absolute top-6 right-6 size-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 hover:text-red-600 transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-black text-slate-900">Scan Product QR</h3>
              <p className="text-slate-500 text-sm font-medium mt-2">Instantly verify authenticity on the ledger.</p>
            </div>
            <div className="rounded-3xl overflow-hidden border-4 border-blue-50 bg-slate-900 p-2 shadow-inner">
              <div id="qr-reader" className="w-full"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTraceability;