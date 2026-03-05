import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import axios from "axios";
import { format } from "date-fns";
import { useToast } from "@/components/ui/use-toast";

const sidebarItems = [
  { icon: "dashboard", label: "Dashboard", active: true },
  { icon: "layers", label: "My Batches" },
  { icon: "add_circle", label: "Submit New Batch" },
  { icon: "person", label: "Profile" },
  { icon: "settings", label: "Settings" },
];

const FarmerDashboard = () => {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    collectionId: `COL-${Math.floor(Math.random() * 10000)}`,
    herbName: 'Organic Ginseng',
    farmDetails: 'Green Valley Farm, Sector 4',
    quantity: '100',
    lat: '34.0522',
    long: '-118.2437'
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
        title: "Error fetching data",
        description: err.response?.data?.msg || err.message,
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
      const payload = { ...formData, timestamp: Date.now().toString(), collectorName: user?.name || "Farmer" };
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      await axios.post(`${API_URL}/api/chain/collection`, payload);
      toast({ title: "Success", description: "Harvest registered on the blockchain!" });
      setIsModalOpen(false);
      setFormData({ ...formData, collectionId: `COL-${Math.floor(Math.random() * 10000)}` });
      fetchCollections();
    } catch (err: any) {
      toast({ variant: "destructive", title: "Error", description: err.response?.data?.error || err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-row overflow-x-hidden bg-background">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r border-primary/10 bg-card min-h-screen">
        <div className="flex h-full flex-col justify-between p-4">
          <div className="flex flex-col gap-8">
            <div className="flex items-center gap-3 px-2">
              <div className="aspect-square size-10 rounded-full bg-primary/20 flex items-center justify-center text-primary overflow-hidden">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBBuid-OpOnHlD3kZpm7YvJUyUm-P_MiYpRjYWeOgZx06H8F-LSEimpXB0l_kGH172mrTz5KmbY02soWzU0GmmjQ9rtXuEZqs9TLFLNLUFrOOsL6fkNu2XWw9SZalxFBES0O6WHzalF2Ztduh6ZcobM7UKreA1VdPBaaNkJIdJ71qvaUI8Y_WjiCRP3AGmVqR7Rc-hYoLQFIpJY8XEof1hlJEiCp74bvGCumKhmIWgX8sVy0rHZkelSC2D9_mes5Wt0pGiA_BwBYNrA" alt="Farm avatar" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-sm font-bold leading-tight">{user?.name || "Green Valley Farm"}</h1>
                <p className="text-primary/70 text-xs font-medium">Verified Producer</p>
              </div>
            </div>
            <nav className="flex flex-col gap-1">
              {sidebarItems.map((item) => (
                <a key={item.label} className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${item.active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-primary/10 hover:text-primary"} transition-colors`} href="#">
                  <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </a>
              ))}
            </nav>
          </div>
          <div className="mt-auto pt-4 border-t border-primary/10">
            <Button onClick={handleLogout} className="w-full rounded-xl">
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        <header className="h-16 border-b border-primary/10 bg-card/80 backdrop-blur-md px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Pages</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-[20px]">search</span>
              <input className="pl-10 pr-4 py-1.5 rounded-full border border-primary/10 bg-background text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none w-64" placeholder="Search batches..." type="text" />
            </div>
            <button className="p-2 rounded-full hover:bg-primary/10 text-muted-foreground">
              <span className="material-symbols-outlined">notifications</span>
            </button>
          </div>
        </header>

        <div className="p-8 max-w-6xl mx-auto w-full">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black tracking-tight">Farmer Dashboard</h2>
              <p className="text-muted-foreground mt-1">Monitor your crop traceability lifecycle and compliance status.</p>
            </div>
            <Button onClick={() => setIsModalOpen(true)} className="rounded-xl shadow-lg border">
              <span className="material-symbols-outlined mr-2">add</span>
              Record New Harvest
            </Button>
          </div>

          {/* Dialog Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm transition-opacity">
              <div className="bg-card w-full max-w-lg rounded-2xl shadow-2xl p-6 relative border border-primary/20 animate-in fade-in zoom-in-95 duration-200">
                <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
                  <span className="material-symbols-outlined">close</span>
                </button>
                <div className="mb-6">
                  <h3 className="text-2xl font-bold">Record New Harvest</h3>
                  <p className="text-muted-foreground text-sm mt-1">Register a new crop collection on the blockchain.</p>
                </div>

                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Collection ID</label>
                      <input name="collectionId" value={formData.collectionId} onChange={handleFormChange} className="w-full h-10 px-3 bg-muted rounded-lg outline-none cursor-not-allowed" readOnly />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Herb / Crop Name</label>
                      <input name="herbName" value={formData.herbName} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-semibold">Farm Details</label>
                    <input name="farmDetails" value={formData.farmDetails} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Quantity (kg)</label>
                      <input name="quantity" type="number" value={formData.quantity} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Latitude</label>
                      <input name="lat" value={formData.lat} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold">Longitude</label>
                      <input name="long" value={formData.long} onChange={handleFormChange} required className="w-full h-10 px-3 bg-background border border-border rounded-lg outline-none focus:border-primary" />
                    </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3">
                    <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button disabled={isSubmitting} type="submit" className="shadow-lg">
                      {isSubmitting ? "Registering..." : "Submit to Blockchain"}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {[
              { label: "Total Batches", value: batches.length || 0, change: "Current count", up: true, icon: "inventory_2", iconBg: "bg-primary/10 text-primary", note: "Lifetime entries" },
              { label: "Approved", value: batches.length || 0, change: "100%", up: true, icon: "verified", iconBg: "bg-emerald-100 text-emerald-700", note: "High compliance rate" },
              { label: "Pending", value: "0", change: "None currently", up: false, icon: "pending_actions", iconBg: "bg-amber-100 text-amber-700", note: "Processed automatically" },
            ].map((stat) => (
              <div key={stat.label} className="bg-card border border-primary/10 p-6 rounded-xl shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <p className="text-muted-foreground font-medium text-sm uppercase tracking-wider">{stat.label}</p>
                  <div className={`${stat.iconBg} p-2 rounded-lg`}>
                    <span className="material-symbols-outlined">{stat.icon}</span>
                  </div>
                </div>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-3xl font-bold">{stat.value}</h3>
                  <span className={`${stat.up ? "text-emerald-600" : "text-emerald-600"} text-sm font-semibold flex items-center`}>
                    <span className="material-symbols-outlined text-[16px]">{stat.up ? "trending_up" : "check"}</span>
                    {stat.change}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs mt-2">{stat.note}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-card border border-primary/10 rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-5 border-b border-primary/10 flex justify-between items-center">
              <h3 className="text-lg font-bold">Recent Harvest Registrations</h3>
              <button className="text-primary text-sm font-bold hover:underline" onClick={fetchCollections}>Refresh Data</button>
            </div>
            <div className="overflow-x-auto min-h-[200px]">
              {loading ? (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">Loading data from blockchain...</div>
              ) : (
                <table className="w-full text-left">
                  <thead className="bg-muted/50">
                    <tr>
                      {["Batch ID", "Crop Type", "Farm/Origin", "Qty (kg)", "Date Submitted", "Status"].map((h) => (
                        <th key={h} className={`px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider ${h === "Status" || h === "Qty (kg)" ? "text-right" : ""}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-primary/5">
                    {batches.length > 0 ? batches.map((b: any) => (
                      <tr key={b.collectionId} className="hover:bg-primary/5 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap font-medium text-primary cursor-pointer hover:underline">{b.collectionId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">{b.herbName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground truncate max-w-[200px]" title={b.farmDetails}>{b.farmDetails}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground text-right">{b.quantity}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                          {b.timestamp ? format(new Date(parseInt(b.timestamp, 10)), 'MMM dd, yyyy') : "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700`}>Logged</span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                          No collections found. Record a harvest to get started.
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
