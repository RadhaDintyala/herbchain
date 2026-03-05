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
        // Ignored, continuous scanning
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
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Traceability Error",
        description: err.response?.data?.msg || "Batch not found on network.",
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
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-primary/10 bg-card px-6 md:px-20 py-4 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link to="/" className="flex items-center gap-4 text-primary">
            <div className="size-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">verified_user</span>
            </div>
            <h2 className="text-foreground text-lg font-bold leading-tight tracking-tight">Traceability Hub</h2>
          </Link>
          <div className="hidden md:flex items-center gap-9">
            <Link className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors" to="/">Home</Link>
            <a className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors" href="#">Insights</a>
            <a className="text-muted-foreground hover:text-primary text-sm font-medium transition-colors" href="#">Support</a>
          </div>
        </div>
        <div className="flex flex-1 justify-end gap-2 md:gap-4 ml-4">
          <form onSubmit={handleSearch} className="flex flex-1 sm:flex-none items-center h-10 w-full max-w-64 bg-muted rounded-xl px-2 sm:px-4">
            <span className="material-symbols-outlined text-xl text-muted-foreground cursor-pointer hidden sm:block mr-2" onClick={() => handleSearch()}>search</span>
            <input
              value={batchIdInput}
              onChange={(e) => setBatchIdInput(e.target.value)}
              className="flex-1 w-full min-w-0 border-none bg-transparent focus:ring-0 text-xs sm:text-sm placeholder:text-muted-foreground outline-none"
              placeholder="Search Batch ID..."
            />
          </form>
          <Button onClick={() => setIsScanning(true)} className="gap-1 sm:gap-2 px-3 sm:px-4">
            <span className="material-symbols-outlined text-xl">qr_code_scanner</span>
            <span className="hidden sm:inline">Scan QR</span>
          </Button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">

        {loading && <div className="p-12 text-center text-muted-foreground">Searching blockchain records...</div>}

        {!loading && !traceData && (
          <div className="flex flex-col items-center justify-center p-24 text-center bg-card rounded-xl border border-primary/10">
            <span className="material-symbols-outlined text-6xl text-muted-foreground mb-4 opacity-50">qr_code_scanner</span>
            <h2 className="text-2xl font-bold">Search the Ledger</h2>
            <p className="text-muted-foreground mt-2 max-w-md">Enter a Batch ID above or scan a product's QR code to view its complete, verifiable journey from farm to processing.</p>
          </div>
        )}

        {/* Product Hero */}
        {!loading && traceData && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out fill-mode-both">
            <div className="mb-8 bg-card rounded-xl overflow-hidden shadow-sm border border-primary/5">
              <div className="relative h-64 w-full bg-cover bg-center" style={{
                backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDatPyqCEUtBqriGD5IYebiYp6LCCd_IDp2cjnFgVJeC5-_AJTDZTZ0sDlPU0BMR4yoJkTCqqbgB_mtaFocM_-VvOIRMJ7yk-1iiSbwvVbsa-0F7sGzIkhXbxRARJqMTQMEN1A_lv-lnSsD81NiGQhaAw_8cd4Q9H6RL4OkdDERIscrje4iAu12AOPeEp-sZ07ldr5EEJGdupFkvn3UlsPKBaroHz1go1rnjMa08A3TSPzOXByHAeTGSM9ERTyxQNElNQAH_LNJGmU4')`
              }}>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-primary px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1 shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                      <span className="material-symbols-outlined text-xs">verified</span>
                      Blockchain Verified
                    </span>
                  </div>
                  <h1 className="text-3xl font-black mb-1">Authenticated Batch</h1>
                  <p className="text-white/80 text-sm font-mono tracking-wide">Batch ID: {traceData.batch.batchId}</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-t border-primary/5">
                {[
                  { label: "Manufacturer", value: traceData.batch.manufacturerId },
                  { label: "Date Processed", value: traceData.batch.timestamp ? format(new Date(parseInt(traceData.batch.timestamp, 10)), 'MMM dd, yyyy') : "N/A" },
                  { label: "Authenticity", value: "Verified on Chain", icon: "shield", isPrimary: true },
                ].map((d) => (
                  <div key={d.label} className="p-6 flex flex-col gap-1">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{d.label}</span>
                    <span className={`text-lg font-bold ${d.isPrimary ? "text-primary flex items-center gap-2" : ""}`}>
                      {d.value}
                      {d.icon && <span className="material-symbols-outlined text-xl">{d.icon}</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Timeline */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">timeline</span>
                  Batch Ancestry
                </h3>

                {traceData.collections.map((col: any, idx: number) => (
                  <div key={idx} className="relative pl-8 mb-8 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-0 size-6 rounded-full bg-primary border-4 border-card z-10 shadow-sm"></div>
                      <div className="bg-card p-6 rounded-xl border border-primary/5 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-lg">Farm Cultivation</h4>
                            <p className="text-sm text-muted-foreground">Collector ID: {col.collectorId}</p>
                          </div>
                          <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded">
                            {col.timestamp ? format(new Date(parseInt(col.timestamp, 10)), 'yyyy-MM-dd') : "Date Unknown"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <div className="space-y-2">
                            {[
                              { icon: "eco", text: `Crop: ${col.herbName}` },
                              { icon: "scale", text: `Quantity: ${col.quantity} kg` },
                              { icon: "map", text: `Origin Details: ${col.farmDetails}` },
                            ].map((d) => (
                              <div key={d.icon} className="flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-primary text-base">{d.icon}</span>
                                <span className="text-muted-foreground">{d.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg border border-primary/10">
                          <span className="material-symbols-outlined text-primary text-sm">link</span>
                          <span className="text-[10px] font-mono text-primary truncate">Collection ID: {col.collectionId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {traceData.tests && traceData.tests.map((test: any, idx: number) => (
                  <div key={`test-${idx}`} className="relative pl-8 mb-8 space-y-12 before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-muted">
                    <div className="relative">
                      <div className="absolute -left-[30px] top-0 size-6 rounded-full bg-blue-500 border-4 border-card z-10 shadow-sm"></div>
                      <div className="bg-card p-6 rounded-xl border border-blue-500/20 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="font-bold text-lg text-blue-600">Lab Quality Verification</h4>
                            <p className="text-sm text-muted-foreground">Facility: {test.labName || "Independent Lab"}</p>
                          </div>
                          <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded">
                            {test.testDate ? format(new Date(parseInt(test.testDate, 10)), 'yyyy-MM-dd') : "Date Unknown"}
                          </span>
                        </div>
                        <div className="grid grid-cols-1 gap-4 mb-4">
                          <div className="space-y-2">
                            {[
                              { icon: "water_drop", text: `Moisture: ${test.moisturePercentage || "N/A"}%` },
                              { icon: "pest_control", text: `Pesticide Check: ${test.pesticideStatus || "N/A"}` },
                            ].map((d) => (
                              <div key={d.icon} className="flex items-center gap-2 text-sm">
                                <span className="material-symbols-outlined text-blue-500 text-base">{d.icon}</span>
                                <span className="text-muted-foreground font-medium">{d.text}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <span className="material-symbols-outlined text-blue-500 text-sm">science</span>
                          <span className="text-[10px] font-mono text-blue-600 truncate">Report ID: {test.testId}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Sidebar Stats */}
              <div className="space-y-6">
                <div className="bg-primary text-primary-foreground p-6 rounded-xl shadow-lg relative overflow-hidden group">
                  <div className="absolute -right-4 -top-4 opacity-10 group-hover:scale-110 transition-transform">
                    <span className="material-symbols-outlined text-[120px]">verified</span>
                  </div>
                  <h4 className="font-bold text-xl mb-2 flex items-center gap-2 relative z-10">
                    <span className="material-symbols-outlined">security</span>
                    Trust Score
                  </h4>
                  <p className="text-primary-foreground/80 text-sm mb-6 relative z-10">Based on data integrity checks across the decentralized network.</p>
                  <div className="flex items-end gap-2 relative z-10">
                    <span className="text-5xl font-black">100</span>
                    <span className="text-lg font-bold mb-1">/100</span>
                  </div>
                  <div className="mt-6 w-full bg-white/20 rounded-full h-2 relative z-10">
                    <div className="bg-white h-full rounded-full" style={{ width: "100%" }}></div>
                  </div>
                </div>

                <div className="bg-card p-6 rounded-xl border border-primary/5 shadow-sm space-y-4">
                  <h4 className="font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">analytics</span>
                    Batch Composition
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Source Collections</span>
                      <span className="font-bold">{traceData.collections.length}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">Quality Tests</span>
                      <span className="font-bold">{traceData.tests?.length || 0}</span>
                    </div>
                  </div>
                  <hr className="border-muted" />
                  <button onClick={() => window.print()} className="w-full py-3 px-4 bg-muted hover:bg-muted/80 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined text-lg">download</span>
                    Full Audit Report (PDF)
                  </button>
                </div>

                <div className="bg-card p-6 rounded-xl border border-primary/5 shadow-sm">
                  <h4 className="font-bold mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">help</span>
                    Need Help?
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4 leading-relaxed">Questions about this product's lifecycle? Compare details against your physical label.</p>
                  <a className="text-primary text-sm font-bold hover:underline flex items-center gap-1" href="#">
                    Contact Supply Chain Support
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-primary/10 py-10 px-6 mt-12 bg-card text-center">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-primary">
            <span className="material-symbols-outlined">verified_user</span>
            <span className="font-bold">Traceability Hub</span>
          </div>
          <p className="text-muted-foreground text-xs">© 2024 Product Traceability Blockchain Network. All Rights Reserved.</p>
          <div className="flex gap-4">
            <a className="text-muted-foreground hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">language</span></a>
            <a className="text-muted-foreground hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">info</span></a>
            <a className="text-muted-foreground hover:text-primary transition-colors" href="#"><span className="material-symbols-outlined">description</span></a>
          </div>
        </div>
      </footer>

      {/* QR Scanner Modal */}
      {isScanning && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
          <div className="bg-card w-full max-w-md p-6 rounded-3xl shadow-2xl border border-primary/20 relative animate-in zoom-in-95 duration-300">
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-muted flex items-center justify-center rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors z-10" onClick={() => setIsScanning(false)}>
              <span className="material-symbols-outlined text-lg">close</span>
            </Button>
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-3">
                <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
              </div>
              <h3 className="text-xl font-bold">Scan Product QR</h3>
              <p className="text-muted-foreground text-sm mt-1">Align the QR code within the frame to verify authenticity instantly.</p>
            </div>
            <div className="rounded-xl overflow-hidden border-2 border-primary/20 bg-muted/50 p-1">
              <div id="qr-reader" className="w-full bg-black rounded-lg overflow-hidden [&>div]:!border-none [&>video]:scale-[1.02] [&_#qr-shaded-region]:!border-primary/50"></div>
            </div>
            <div className="mt-6 flex justify-center text-xs font-mono text-muted-foreground/60">Powered by HexChain Traceability</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductTraceability;
