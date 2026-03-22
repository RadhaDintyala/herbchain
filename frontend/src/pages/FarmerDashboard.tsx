import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const sidebarItems = [
  { icon: "dashboard", label: "Control Center", active: true },
  { icon: "inventory", label: "Inventory Batches" },
  { icon: "add_box", label: "Register New Stock" },
  { icon: "analytics", label: "Supply Insights" },
  { icon: "settings", label: "Settings" },
];

const FarmerDashboard = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    collectionId: `BAT-${Math.floor(Math.random() * 10000)}`,
    herbName: 'Premium Basmati Rice',
    farmDetails: 'Warehouse A, Mumbai Hub',
    quantity: '500',
    lat: '19.0760',
    long: '72.8777'
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
      setBatches(res.data);
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Connection Error",
        description: "Could not fetch ledger data.",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = { ...formData, timestamp: Date.now().toString(), collectorName: user?.name || "Supplier" };
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/chain/collection`, payload);
      
      toast({ 
        title: "Transaction Verified", 
        description: "Stock registered on the blockchain ledger successfully." 
      });
      
      setIsModalOpen(false);
      setFormData({ ...formData, collectionId: `BAT-${Math.floor(Math.random() * 10000)}` });
      fetchCollections();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Blockchain Error", description: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-x-hidden bg-slate-50">
      {/* 🧾 Sidebar - Retail Blue Theme */}
      <aside className="w-64 flex-shrink-0 border-r border-blue-100 bg-white min-h-screen shadow-sm">
        <div className="flex h-full flex-col justify-between p-6">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 px-2">
              <div className="size-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-200">
                <span className="material-symbols-outlined">warehouse</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold text-slate-900 leading-tight">Supplier Portal</h1>
                <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest">Verified node</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <a key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${item.active ? "bg-blue-600 text-white shadow-md shadow-blue-100" : "text-slate-500 hover:bg-blue-50 hover:text-blue-600"} transition-all`} href="#">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm font-semibold">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-auto pt-4">
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-slate-500 hover:text-red-600 hover:bg-red-50">
              <span className="material-symbols-outlined mr-2">logout</span>
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <header className="h-16 border-b border-blue-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span>Enterprise</span>
            <span>/</span>
            <span className="text-blue-600">Control Center</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-full border border-blue-100">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-bold text-blue-700">NETWORK ACTIVE</span>
             </div>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="mb-10 flex justify-between items-center">
            <div>
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">Supplier Dashboard</h2>
              <p className="text-slate-500 mt-2 font-medium">Manage and record the movement of goods into the secure supply chain.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 h-12 shadow-xl shadow-blue-200 font-bold transition-all hover:-translate-y-1">
              <span className="material-symbols-outlined mr-2">add_circle</span>
              Register New Batch
            </Button>
          </div>

          {/* Registration Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
              <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl p-8 border border-blue-100 animate-in zoom-in-95">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">Register New Stock</h3>
                    <p className="text-slate-500 text-sm font-medium mt-1">Committing data to immutable blockchain ledger.</p>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-900">
                    <span className="material-symbols-outlined">close</span>
                  </button>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Batch ID</label>
                      <input name="collectionId" value={formData.collectionId} className="w-full h-12 px-4 bg-slate-50 border border-slate-100 rounded-xl font-mono text-sm text-blue-600 outline-none" readOnly />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Product Name</label>
                      <input name="herbName" value={formData.herbName} onChange={handleFormChange} required className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Supplier / Facility Details</label>
                    <input name="farmDetails" value={formData.farmDetails} onChange={handleFormChange} required className="w-full h-12 px-4 bg-white border border-slate-200 rounded-xl outline-none focus:border-blue-600 transition-all" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-400 ml-1">Qty (Units)</label>
                      <input name="quantity" type="number" value={formData.quantity} onChange={handleFormChange} required className="w-full h-12 px-4 border border-slate-200 rounded-xl outline-none focus:border-blue-600" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-400 ml-1">LAT</label>
                      <input name="lat" value={formData.lat} onChange={handleFormChange} className="w-full h-12 px-4 border border-slate-200 rounded-xl" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-black uppercase text-slate-400 ml-1">LONG</label>
                      <input name="long" value={formData.long} onChange={handleFormChange} className="w-full h-12 px-4 border border-slate-200 rounded-xl" />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col gap-3">
                    <Button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 rounded-xl font-bold shadow-lg shadow-blue-200">
                      {isSubmitting ? "Verifying Transaction..." : "Submit to Blockchain"}
                    </Button>
                    <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)} className="text-slate-400 font-bold">Cancel Request</Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Inventory Table */}
          <div className="bg-white border border-blue-100 rounded-3xl shadow-xl shadow-slate-200/50 overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-xl font-black text-slate-900">Recent Supply Entries</h3>
              <button className="text-blue-600 text-xs font-black uppercase tracking-widest hover:text-blue-800 transition-colors" onClick={fetchCollections}>Refresh Ledger</button>
            </div>
            <div className="overflow-x-auto min-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 gap-4">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Fetching Ledger Data...</p>
                </div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50">
                    <tr>
                      {["Batch ID", "Product", "Supplier", "Qty", "Entry Date", "Status"].map((h) => (
                        <th key={h} className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {batches.length > 0 ? batches.map((b: any) => (
                      <tr key={b.collectionId} className="hover:bg-blue-50/30 transition-colors group">
                        <td className="px-8 py-5 whitespace-nowrap font-mono text-xs font-bold text-blue-600">{b.collectionId}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm font-bold text-slate-700">{b.herbName}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-500 font-medium">{b.farmDetails}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-sm text-slate-900 font-black">{b.quantity}</td>
                        <td className="px-8 py-5 whitespace-nowrap text-slate-400 text-xs font-bold">
                          {b.timestamp ? format(new Date(parseInt(b.timestamp, 10)), 'MMM dd, yyyy') : "N/A"}
                        </td>
                        <td className="px-8 py-5 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-blue-100 text-blue-700">
                             <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                             Verified
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-8 py-20 text-center">
                          <p className="text-slate-400 font-bold text-sm">No ledger entries found. Register your first retail batch.</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;