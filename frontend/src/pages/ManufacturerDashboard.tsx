import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const sidebarItems = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "inventory_2", label: "Available Batches" },
  { icon: "factory", label: "Processed Products" },
  { icon: "analytics", label: "Yield Reports" },
];

const ManufacturerDashboard = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    batchId: `BAT-${Math.floor(Math.random() * 10000)}`,
    linkedCollectionIds: '',
    linkedTestIds: 'TEST-NONE',
    manufactureDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(Date.now() + 31536000000).toISOString().split('T')[0], // 1 year from now
    qrHash: 'QR_PENDING'
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
      const res = await axios.get(`${API_URL}/api/chain/all-batches`);
      setBatches(res.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Error fetching data",
        description: err.response?.data?.msg || err.message,
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
      toast({ title: "Success", description: "Production batch registered on the blockchain!" });
      setIsModalOpen(false);
      setFormData({
        ...formData,
        batchId: `BAT-${Math.floor(Math.random() * 10000)}`,
        linkedCollectionIds: ''
      });
      fetchBatches();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-72 border-r border-primary/10 bg-card flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3">
          <div className="size-10 rounded-lg bg-primary flex items-center justify-center text-primary-foreground">
            <span className="material-symbols-outlined">track_changes</span>
          </div>
          <div>
            <h1 className="text-primary font-bold text-lg leading-tight">HerbChain</h1>
            <p className="text-xs text-muted-foreground font-medium">Manufacturer Portal</p>
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          {sidebarItems.map((item) => (
            <a key={item.label} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${item.active ? "bg-primary/10 text-primary font-semibold" : "text-muted-foreground hover:bg-primary/5 hover:text-primary"} transition-colors`} href="#">
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </a>
          ))}
        </nav>
        <div className="p-4 mt-auto">
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
            <div className="flex items-center gap-3 mb-3">
              <div className="size-8 rounded-full bg-muted bg-cover bg-center" style={{ backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuA7kTzqdBCU0GDCE-cC-Up_YBhaktRmivY0xXJpaeoVcqU54KwSMZVE_rRTci9zTwlmwDZqeBvCKpwbUxzMDrh35ktaCauoY5blzBMxLNL2yEn7SfGS2sN3LSQEPaJxzpTe_t_VXYFtkTjxF9gK99NY9YKtVvLFw06MJbyhQMgJ2ziruEslyN2G6TrGIhKOxi11WWwRyU1zSB6tfggm3F6-doanSOR3iryUG-IRxXNHh0IXlMxMylqsuOlMjoFSZiVhcO7T4FYE1G8V')` }}></div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name || "Alex Miller"}</p>
                <p className="text-xs text-muted-foreground">Manufacturer</p>
              </div>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 py-2 text-xs font-bold text-muted-foreground hover:text-primary transition-colors">
              <span className="material-symbols-outlined text-sm">logout</span> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-20 border-b border-primary/10 bg-card/80 backdrop-blur-md sticky top-0 z-10 px-8 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Manufacturer Dashboard</h2>
            <p className="text-sm text-muted-foreground">Real-time supply chain monitoring and processing</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full hover:bg-primary/5 text-muted-foreground relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-card"></span>
            </button>
            <Button onClick={() => setIsModalOpen(true)} className="shadow-lg shadow-primary/20">
              <span className="material-symbols-outlined text-xl">add</span>
              New Production Run
            </Button>
          </div>
        </header>

        <div className="p-8 space-y-8">

          {/* Dialog Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
              <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">New Production Run</h3>
                  <p className="text-muted-foreground text-sm mt-1">Combine raw collections into a finalized product batch.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Batch ID</label>
                      <input name="batchId" value={formData.batchId} onChange={handleFormChange} className="w-full h-10 px-3 bg-muted rounded-lg outline-none cursor-not-allowed" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">QR Code Hash</label>
                      <input name="qrHash" value={formData.qrHash} onChange={handleFormChange} className="w-full h-10 px-3 bg-muted border border-border rounded-lg outline-none text-muted-foreground text-sm" readOnly />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-primary">Linked Collection IDs (comma separated)</label>
                    <input name="linkedCollectionIds" value={formData.linkedCollectionIds} onChange={handleFormChange} placeholder="COL-1234, COL-5678" required className="w-full h-10 px-3 bg-background border border-primary/30 rounded-lg outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-sm" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Linked Lab Test IDs</label>
                    <input name="linkedTestIds" value={formData.linkedTestIds} onChange={handleFormChange} className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary cursor-not-allowed text-muted-foreground" title="Lab tests not enabled in this demo" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Manufacture Date</label>
                      <input type="date" name="manufactureDate" value={formData.manufactureDate} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Expiry Date</label>
                      <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button disabled={isSubmitting} type="submit" className="shadow-lg">
                      {isSubmitting ? "Registering..." : "Publish Batch"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "package_2", badge: "+12.5%", label: "Available for Processing", value: batches.length || 0, unit: "batches" },
              { icon: "precision_manufacturing", badge: "+5.2%", label: "Total Processed (MTD)", value: "8,500", unit: "kg" },
              { icon: "agriculture", badge: "12 active", label: "Approved Farmers", value: "48", unit: "" },
              { icon: "verified", badge: "99.2%", label: "Quality Pass Rate", value: "99.2", unit: "%" },
            ].map((s) => (
              <div key={s.label} className="bg-card p-6 rounded-xl border border-primary/10 shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg text-primary">
                    <span className="material-symbols-outlined">{s.icon}</span>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">{s.badge}</span>
                </div>
                <p className="text-muted-foreground text-sm font-medium">{s.label}</p>
                <h3 className="text-3xl font-extrabold mt-1">{s.value} {s.unit && <span className="text-lg font-medium text-muted-foreground">{s.unit}</span>}</h3>
              </div>
            ))}
          </div>

          {/* Batch Table */}
          <div className="bg-card rounded-xl border border-primary/10 shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-primary/10 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Approved Batches for Processing</h3>
                <p className="text-sm text-muted-foreground mt-1">Select a batch to begin a new production run.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={fetchBatches}>
                  <span className="material-symbols-outlined text-sm">refresh</span> Refresh
                </Button>
              </div>
            </div>
            <div className="overflow-x-auto min-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center p-8 text-muted-foreground">Loading from blockchain...</div>
              ) : (
                <table className="w-full">
                  <thead className="bg-muted/50">
                    <tr>
                      {["Batch ID", "Created By", "Collections Used", "Tests Used", "Approved On", "Status"].map((h) => (
                        <th key={h} className={`px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider ${h === "Status" ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {batches.length > 0 ? batches.map((b: any) => (
                      <tr key={b.batchId} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 font-mono text-sm text-primary font-bold cursor-pointer hover:underline">{b.batchId}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">AgriTrace Mfg</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold">{b.linkedCollectionIds?.join(", ") || "N/A"}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap max-w-[200px] gap-1">
                            {b.linkedTestIds?.map((t: string) => <span key={t} className="px-2 py-0.5 bg-primary/10 text-primary rounded text-[10px] font-bold">{t}</span>)}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-muted-foreground">
                          {b.manufactureDate ? format(new Date(b.manufactureDate), 'MMM dd, yyyy') : "Unknown"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">Ready</button>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          No batches found on the network.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
            <div className="p-4 bg-muted/30 border-t border-primary/5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total: {batches.length} entries</p>
            </div>
          </div>

          {/* Charts + Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-card rounded-xl border border-primary/10 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Production Output Trends</h3>
              <div className="h-64 flex items-end gap-4 px-4 pb-2">
                {[40, 65, 55, 85, 70, 45, 60].map((h, i) => (
                  <div key={i} className={`flex-1 ${i === 3 ? "bg-primary" : "bg-primary/20 hover:bg-primary/40"} rounded-t transition-all relative group`} style={{ height: `${h}%` }}>
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">{Math.round(h * 2.9)}kg</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground mt-4 px-4 font-bold uppercase tracking-widest">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => <span key={d}>{d}</span>)}
              </div>
            </div>

            <div className="bg-card rounded-xl border border-primary/10 p-6 shadow-sm">
              <h3 className="text-lg font-bold mb-6">Recent Log</h3>
              <div className="space-y-6">
                {[
                  { color: "bg-primary", title: "Batch #BAT-441 Processed", desc: "Completed milling 200kg of Organic Wheat.", time: "2 hours ago" },
                  { color: "bg-yellow-500", title: "New Batch Received", desc: "Batch #BAT-901 arrived from John Doe.", time: "5 hours ago" },
                  { color: "bg-slate-300", title: "System Maintenance", desc: "QR generator updated to v2.4.", time: "Yesterday" },
                ].map((l, i) => (
                  <div key={i} className="flex gap-4">
                    <div className={`size-2 mt-2 rounded-full ${l.color} shrink-0`}></div>
                    <div>
                      <p className="text-sm font-semibold">{l.title}</p>
                      <p className="text-xs text-muted-foreground">{l.desc}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 uppercase font-bold">{l.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button className="w-full mt-8 py-2 text-sm font-bold text-primary hover:bg-primary/5 rounded-lg border border-primary/20 transition-all">
                View All Activity
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ManufacturerDashboard;
