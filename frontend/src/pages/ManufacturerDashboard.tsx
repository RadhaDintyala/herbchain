import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";
import { QRCodeSVG } from "qrcode.react";

const sidebarItems = [
  { icon: "dashboard", label: "Operations Overview", active: true },
  { icon: "inventory_2", label: "Inbound Batches" },
  { icon: "conveyor_belt", label: "Processing Lines" },
  { icon: "local_shipping", label: "Outbound Logistics" },
];

const ManufacturerDashboard = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQrBatch, setSelectedQrBatch] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchId: `BAT-${Math.floor(Math.random() * 10000)}`,
    linkedCollectionIds: '',
    linkedTestIds: '',
    manufactureDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0], 
    qrHash: 'SECURE_HASH_PENDING'
  });

  const { toast } = useToast();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchBatches = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const [batchesRes, testsRes] = await Promise.all([
        axios.get(`${API_URL}/api/chain/all-batches`),
        axios.get(`${API_URL}/api/chain/all-tests`)
      ]);
      setBatches(batchesRes.data);
      setTests(testsRes.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Sync Error",
        description: "Could not retrieve warehouse data from ledger.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBatches();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        ...formData,
        linkedCollectionIds: formData.linkedCollectionIds.split(',').map(id => id.trim()),
        linkedTestIds: formData.linkedTestIds.split(',').map(id => id.trim())
      };

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/chain/batch`, payload);
      toast({ title: "Ledger Updated", description: "Production batch finalized and cryptographically signed." });
      setIsModalOpen(false);
      setFormData({
        ...formData,
        batchId: `BAT-${Math.floor(Math.random() * 10000)}`,
        linkedCollectionIds: '',
        linkedTestIds: ''
      });
      fetchBatches();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* 🧾 Sidebar - Professional Logistics Look */}
      <aside className="w-72 border-r border-blue-100 bg-white flex flex-col sticky top-0 h-screen shadow-sm">
        <div className="p-8 flex items-center gap-3">
          <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-100">
            <span className="material-symbols-outlined">precision_manufacturing</span>
          </div>
          <div>
            <h1 className="text-slate-900 font-black text-xl leading-tight tracking-tight">RetailChain</h1>
            <p className="text-[10px] text-blue-600 font-black uppercase tracking-widest">Warehouse Node</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-1">
          {sidebarItems.map((item) => (
            <a key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${item.active ? "bg-blue-600 text-white shadow-md shadow-blue-100 font-bold" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"}`} href="#">
              <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-6 mt-auto border-t border-slate-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="size-9 rounded-full bg-slate-200 border-2 border-blue-100 overflow-hidden">
               <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7kTzqdBCU0GDCE-cC-Up_YBhaktRmivY0xXJpaeoVcqU54KwSMZVE_rRTci9zTwlmwDZqeBvCKpwbUxzMDrh35ktaCauoY5blzBMxLNL2yEn7SfGS2sN3LSQEPaJxzpTe_t_VXYFtkTjxF9gK99NY9YKtVvLFw06MJbyhQMgJ2ziruEslyN2G6TrGIhKOxi11WWwRyU1zSB6tfggm3F6-doanSOR3iryUG-IRxXNHh0IXlMxMylqsuOlMjoFSZiVhcO7T4FYE1G8V" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Operations Lead"}</p>
              <p className="text-[10px] text-slate-400 font-bold">Authenticated User</p>
            </div>
          </div>
          <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-slate-400 hover:text-red-600 hover:bg-red-50 h-10 rounded-xl">
            <span className="material-symbols-outlined mr-2 text-sm">logout</span>
            <span className="text-xs font-bold uppercase tracking-wider">Secure Exit</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-10 px-10 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">Warehouse Control</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Live Ledger Monitoring</p>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full border border-emerald-100">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-emerald-700">LEDGER SYNCED</span>
             </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200 rounded-xl h-11 px-6 font-bold">
              <span className="material-symbols-outlined mr-2">add_box</span>
              New Production Run
            </Button>
          </div>
        </header>

        <div className="p-10 space-y-10">

          {/* QR Code Modal */}
          {selectedQrBatch && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
              <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-10 relative border border-blue-50 flex flex-col items-center animate-in zoom-in-95">
                <button onClick={() => setSelectedQrBatch(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-900">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <h3 className="text-2xl font-black text-slate-900 mb-2">Product QR</h3>
                <p className="text-slate-500 text-sm mb-8 text-center font-medium">Scan this unique identifier at any retail point for instant verification.</p>
                <div className="p-6 bg-slate-50 rounded-3xl shadow-inner border border-slate-100">
                  <QRCodeSVG value={selectedQrBatch} size={200} fgColor="#0f172a" />
                </div>
                <p className="mt-8 font-mono font-black text-blue-600 text-xl tracking-tighter bg-blue-50 px-4 py-2 rounded-xl">{selectedQrBatch}</p>
                <Button className="w-full mt-8 bg-slate-900 text-white h-12 rounded-xl font-bold" onClick={() => setSelectedQrBatch(null)}>Dismiss</Button>
              </div>
            </div>
          )}

          {/* Registration Form Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-blue-50 animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Initiate Production</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Bundle raw stock into consumer-ready batches.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Master Batch ID</label>
                      <input name="batchId" value={formData.batchId} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-blue-600 outline-none" readOnly />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Cryptographic Hash</label>
                      <input name="qrHash" value={formData.qrHash} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl text-slate-400 text-[10px] font-bold outline-none" readOnly />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-blue-600 ml-1">Input Stock IDs (Linked Collections)</label>
                    <input name="linkedCollectionIds" value={formData.linkedCollectionIds} onChange={handleFormChange} placeholder="e.g. BAT-123, BAT-456" required className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all font-medium" />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Linked Quality Reports (Test IDs)</label>
                    <input name="linkedTestIds" value={formData.linkedTestIds} onChange={handleFormChange} placeholder="e.g. LAB-9001" className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Manufacture Date</label>
                      <input type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleFormChange} required className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold text-slate-700" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Expiry Date</label>
                      <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleFormChange} required className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-blue-600 font-bold text-slate-700" />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <Button disabled={isSubmitting} type="submit" className="bg-blue-600 hover:bg-blue-700 text-white h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 transition-all">
                      {isSubmitting ? "Securing Transaction..." : "Sign & Finalize Batch"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold h-10">Abort</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "inventory_2", label: "Inbound Raw Stock", value: batches.length || 0, color: "text-blue-600", bg: "bg-blue-50" },
              { icon: "conveyor_belt", label: "Volume Processed", value: "14.2", unit: "k", color: "text-indigo-600", bg: "bg-indigo-50" },
              { icon: "verified", label: "QA Pass Rate", value: "99.8", unit: "%", color: "text-emerald-600", bg: "bg-emerald-50" },
              { icon: "local_shipping", label: "Pending Shipments", value: "08", color: "text-amber-600", bg: "bg-amber-50" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/40">
                <div className={`${s.bg} ${s.color} size-12 rounded-2xl flex items-center justify-center mb-6`}>
                  <span className="material-symbols-outlined text-2xl">{s.icon}</span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <h3 className="text-3xl font-black mt-2 text-slate-900">{s.value}<span className="text-base ml-0.5">{s.unit}</span></h3>
              </div>
            ))}
          </div>

          {/* Quality Audit Table */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Quality Assurance Reports</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Verified lab results for inbound stock</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              {!loading && tests.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      {["Report ID", "Inbound Stock", "Auditor", "Compliance", "Status"].map((h) => (
                        <th key={h} className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {tests.map((t: any) => (
                      <tr key={t.testId} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-10 py-5 font-mono text-xs font-bold text-blue-600">{t.testId}</td>
                        <td className="px-10 py-5 font-mono text-xs font-bold text-slate-500">{t.collectionId}</td>
                        <td className="px-10 py-5 text-sm font-bold text-slate-700">{t.labName}</td>
                        <td className="px-10 py-5 text-sm font-black text-slate-900">{t.moisturePercentage}%</td>
                        <td className="px-10 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${t.pesticideStatus === 'Passed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                            {t.pesticideStatus}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-20 text-center font-bold text-slate-300">NO PENDING AUDITS</div>
              )}
            </div>
          </div>

          {/* Master Batch Table */}
          <div className="bg-white rounded-3xl border border-blue-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Retail Ready Inventory</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Immutable production records</p>
              </div>
              <Button variant="ghost" className="text-blue-600 font-black text-[10px] uppercase tracking-widest hover:bg-blue-50" onClick={fetchBatches}>
                <span className="material-symbols-outlined mr-2 text-sm">sync</span>
                Refresh Ledger
              </Button>
            </div>
            <div className="overflow-x-auto min-h-[250px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center p-20 gap-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-black text-slate-400 tracking-widest uppercase">Fetching Blockchain State...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      {["Batch ID", "Verification", "Source Links", "Quality Hashes", "Status"].map((h) => (
                        <th key={h} className="px-10 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {batches.length > 0 ? batches.map((b: any) => (
                      <tr key={b.batchId} className="hover:bg-blue-50/30 transition-colors group">
                        <td
                          className="px-10 py-5 font-mono text-xs font-bold text-blue-600 cursor-pointer hover:underline"
                          onClick={() => setSelectedQrBatch(b.batchId)}
                        >
                          {b.batchId}
                        </td>
                        <td className="px-10 py-5">
                           <div className="size-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:border-blue-200 cursor-pointer" onClick={() => setSelectedQrBatch(b.batchId)}>
                              <span className="material-symbols-outlined text-slate-400 group-hover:text-blue-600 text-sm">qr_code</span>
                           </div>
                        </td>
                        <td className="px-10 py-5">
                          <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">{b.linkedCollectionIds?.join(", ") || "N/A"}</span>
                        </td>
                        <td className="px-10 py-5">
                          <div className="flex flex-wrap gap-1 max-w-[200px]">
                            {b.linkedTestIds?.map((t: string) => <span key={t} className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded text-[9px] font-black border border-blue-100 uppercase">{t}</span>)}
                          </div>
                        </td>
                        <td className="px-10 py-5">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700">
                             <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                             Signed
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={5} className="px-10 py-20 text-center text-slate-400 font-bold text-sm">
                          No production records found on the network.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Activity Logs Bar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 p-10 shadow-xl shadow-slate-200/40">
              <h3 className="text-xl font-black text-slate-900 mb-8">Warehouse Productivity</h3>
              <div className="h-64 flex items-end gap-3 px-2">
                {[55, 75, 60, 95, 80, 50, 65].map((h, i) => (
                  <div key={i} className={`flex-1 ${i === 3 ? "bg-blue-600" : "bg-blue-100 hover:bg-blue-200"} rounded-xl transition-all relative group shadow-sm`} style={{ height: `${h}%` }}>
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-black py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">{Math.round(h * 3)} Batches</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-6 px-2 font-black uppercase tracking-widest">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-xl shadow-slate-200/40">
              <h3 className="text-xl font-black text-slate-900 mb-8">System Audit Log</h3>
              <div className="space-y-8">
                {[
                  { icon: "verified", color: "text-emerald-500", title: "Batch Signed", time: "28m ago" },
                  { icon: "inventory_2", color: "text-blue-500", title: "New Stock Arrival", time: "2h ago" },
                  { icon: "sync", color: "text-amber-500", title: "Ledger Update", time: "4h ago" },
                ].map((l, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className={`size-2 mt-2 rounded-full bg-slate-200 shrink-0`}></div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 leading-none">{l.title}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{l.time}</p>
                    </div>
                    <span className={`material-symbols-outlined text-lg ${l.color} opacity-40`}>{l.icon}</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-10 py-3 text-[10px] font-black uppercase tracking-widest text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white rounded-xl transition-all">
                Export Audit Logs
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManufacturerDashboard;