import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const logs = [
  { color: "bg-blue-600", glow: "shadow-[0_0_8px_rgba(37,99,235,0.5)]", title: "New Batch Verified", desc: "Batch #RT-9421 processed via Blockchain Node 4.", time: "12 mins ago" },
  { color: "bg-slate-400", glow: "", title: "Inventory Optimization", desc: "Automated warehouse pruning routine finished successfully.", time: "45 mins ago" },
  { color: "bg-orange-500", glow: "shadow-[0_0_8px_rgba(245,158,11,0.5)]", title: "Network Rate Alert", desc: "Retail-API-03 reaching 85% of allocated capacity.", time: "2 hours ago" },
  { color: "bg-[#0F172A]", glow: "shadow-[0_0_8px_rgba(15,23,42,0.5)]", title: "New Partner Access", desc: "Node 'Radha' initialized a new audit session.", time: "3 hours ago" },
];

const AdminDashboard = () => {
  const [collections, setCollections] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string>('');
  const [formData, setFormData] = useState({
    testId: `VERIFY-${Math.floor(Math.random() * 10000)}`,
    moisturePercentage: '12',
    pesticideStatus: 'Passed',
    labName: 'RetailChain Core Node',
    testDate: new Date().toISOString()
  });

  const { toast } = useToast();
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchCollections = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/api/chain/all-collections`);
      setCollections(res.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Network Sync Error",
        description: "Failed to connect to the decentralized ledger.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRunTest = (collectionId: string) => {
    setSelectedCollection(collectionId);
    setFormData({ ...formData, testId: `VERIFY-${Math.floor(Math.random() * 10000)}` });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, collectionId: selectedCollection };
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/chain/test`, payload);
      toast({ title: "Verification Secured", description: "Data point locked into the RetailChain ledger." });
      setIsModalOpen(false);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Encryption Error", description: "Could not write to the blockchain." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      {/* Sidebar - FOCUSED & CLEAN */}
      <aside className="w-64 border-r border-slate-200 bg-[#0F172A] text-white flex flex-col fixed h-full z-20">
        <div className="p-6 flex items-center gap-3">
          <div className="bg-[#2563EB] rounded-lg p-1.5 flex items-center justify-center shadow-lg shadow-blue-500/20">
            <span className="material-symbols-outlined text-white text-2xl">dataset</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-lg leading-tight tracking-tight">RetailChain</h1>
            <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Master Admin</p>
          </div>
        </div>
        
        <nav className="flex-1 px-4 py-4">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium bg-[#2563EB] text-white shadow-lg shadow-blue-500/30">
            <span className="material-symbols-outlined text-[20px]">dashboard</span>
            <span className="text-sm font-bold tracking-tight">System Overview</span>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="bg-slate-800/50 rounded-xl p-3 flex items-center gap-3 border border-slate-700/50">
            <div className="size-10 rounded-full bg-[#2563EB] flex items-center justify-center font-bold text-white text-sm uppercase tracking-tighter">R</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate text-white uppercase tracking-tight">{user?.name || "Radha"}</p>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-tight">Node Administrator</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full mt-3 flex items-center justify-center gap-2 py-2 text-xs font-bold text-slate-500 hover:text-blue-400 transition-colors">
            <span className="material-symbols-outlined text-sm">logout</span> Terminate Session
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen">
        <header className="h-16 border-b border-slate-200 bg-white px-8 flex items-center justify-between sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
            <span className="size-2 bg-blue-600 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-700 uppercase tracking-widest">Global Network Online</span>
          </div>
          
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Server Performance</p>
            <div className="flex items-center justify-end gap-1.5">
              <span className="text-xs font-bold text-slate-700 tracking-tighter">99.9% Latency Opt.</span>
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="mb-8">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Node Analytics</h2>
            <p className="text-slate-500 text-[10px] font-bold tracking-widest uppercase italic mt-1">Live Inventory & Distributed Ledger Verification</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: "Partner Nodes", value: "1,240", change: "+12.5%", icon: "hub", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Active Batches", value: "856", change: "+5.2%", icon: "inventory_2", color: "text-blue-600", bg: "bg-blue-50" },
              { label: "Awaiting Verification", value: "14", change: "Urgent", icon: "security", color: "text-orange-600", bg: "bg-orange-50" },
              { label: "System Uptime", value: "99.99%", change: "Verified", icon: "database", color: "text-emerald-600", bg: "bg-emerald-50" },
            ].map((s) => (
              <div key={s.label} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all cursor-default">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{s.label}</span>
                  <div className={`p-2 rounded-lg ${s.bg} ${s.color}`}>
                    <span className="material-symbols-outlined text-[20px]">{s.icon}</span>
                  </div>
                </div>
                <p className="text-2xl font-black text-slate-900">{s.value}</p>
                <p className={`text-[10px] font-bold mt-2 uppercase tracking-tight ${s.change === 'Urgent' ? 'text-orange-600' : 'text-slate-400'}`}>{s.change} Tracking Cycle</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Table */}
            <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-white">
                <h3 className="font-bold text-slate-900 uppercase text-xs tracking-widest italic">Inbound Supply Pipeline</h3>
                <Button variant="outline" size="sm" onClick={fetchCollections} className="text-[#2563EB] border-blue-100 hover:bg-blue-50 font-bold text-xs uppercase tracking-tight">
                  <span className="material-symbols-outlined text-sm mr-2">refresh</span> Sync Node
                </Button>
              </div>
              
              <div className="overflow-x-auto min-h-[300px]">
                {loading ? (
                  <div className="flex flex-col items-center justify-center p-20">
                    <div className="size-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Querying Retail Ledger...</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-slate-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Entry ID</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Product Category</th>
                        <th className="px-6 py-4 text-left text-[10px] font-black text-slate-400 uppercase tracking-widest">Origin Entity</th>
                        <th className="px-6 py-4 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {collections.length > 0 ? collections.map((c: any) => (
                        <tr key={c.collectionId} className="hover:bg-blue-50/30 transition-colors">
                          <td className="px-6 py-4 font-mono text-sm font-bold text-[#2563EB]">{c.collectionId}</td>
                          <td className="px-6 py-4 text-sm font-bold text-slate-700 uppercase tracking-tighter">{c.herbName}</td>
                          <td className="px-6 py-4 text-sm text-slate-500 uppercase text-xs font-medium tracking-tight">{c.collectorName}</td>
                          <td className="px-6 py-4 text-right">
                            <Button size="sm" onClick={() => handleRunTest(c.collectionId)} className="bg-[#2563EB] hover:bg-blue-700 shadow-md shadow-blue-500/10 uppercase text-[10px] font-black tracking-widest">
                              Verify Entry
                            </Button>
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={4} className="px-6 py-20 text-center text-slate-400 text-sm italic tracking-widest">Pipeline Clear. No pending entries found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            {/* Logs Sidebar */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col">
              <h3 className="font-bold text-xs uppercase tracking-widest text-slate-900 mb-6 italic">Security Health Logs</h3>
              <div className="space-y-6 flex-1">
                {logs.map((l, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`mt-1.5 flex-shrink-0 size-2 ${l.color} rounded-full ${l.glow}`}></div>
                    <div>
                      <p className="text-sm font-bold text-slate-900 leading-tight uppercase tracking-tighter">{l.title}</p>
                      <p className="text-[11px] text-slate-500 mt-1">{l.desc}</p>
                      <p className="text-[9px] font-black text-[#2563EB] mt-2 uppercase tracking-widest">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-slate-50 rounded-xl mt-6 border border-slate-100">
                 <p className="text-[9px] font-bold text-slate-400 uppercase text-center leading-relaxed tracking-tighter italic">Enterprise Grade Encryption Active <br/> Secure Hash: RT-889-ALPHA-X</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Verification Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">RetailChain Protocol</h3>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-1 italic">Securing entry: {selectedCollection}</p>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-300 hover:text-slate-900 transition-colors">
                <span className="material-symbols-outlined">cancel</span>
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol ID</label>
                  <input value={formData.testId} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-mono text-xs text-slate-400" readOnly />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Verifier Node</label>
                  <input name="labName" value={formData.labName} onChange={handleFormChange} required className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] outline-none font-bold" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Inventory Integrity Metric (%)</label>
                <input type="number" step="0.1" name="moisturePercentage" value={formData.moisturePercentage} onChange={handleFormChange} required className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] outline-none font-bold" />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">QA Authorization Status</label>
                <select name="pesticideStatus" value={formData.pesticideStatus} onChange={handleFormChange} className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl text-sm focus:border-[#2563EB] outline-none appearance-none font-black uppercase text-xs">
                  <option value="Passed">Verified (Secure)</option>
                  <option value="Warning">Warning (Review Required)</option>
                  <option value="Failed">Rejected (Flagged)</option>
                </select>
              </div>

              <Button disabled={isSubmitting} type="submit" className="w-full h-14 bg-[#2563EB] hover:bg-blue-700 text-white font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-blue-500/20">
                {isSubmitting ? "Encrypting Data..." : "Authorize Entry"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;