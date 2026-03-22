import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";

const Products = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchProducts = async () => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
      const res = await axios.get(`${API_URL}/api/chain/all-collections`);
      setProducts(res.data);
    } catch (err) {
      toast({ variant: "destructive", title: "Network Error", description: "Could not load marketplace items." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  return (
    <div className="min-h-screen bg-slate-50 w-full flex flex-col">
      {/* 🧾 Page Header */}
      <section className="bg-white border-b border-slate-100 py-12 px-6 lg:px-20 text-center space-y-4">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Verified Products Marketplace</h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          Browse items backed by transparent and secure supply chains. Every product carries a verified journey.
        </p>
      </section>

      {/* 🔍 Filters Bar */}
      <div className="px-6 lg:px-20 py-6 flex flex-wrap gap-4 items-center justify-between bg-white/50 sticky top-16 z-30 backdrop-blur-md border-b border-slate-200">
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full border-blue-100 text-blue-600 bg-blue-50">All Categories</Button>
          <Button variant="ghost" className="rounded-full text-slate-500">Groceries</Button>
          <Button variant="ghost" className="rounded-full text-slate-500">Electronics</Button>
        </div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Showing {products.length} Secure Items</p>
      </div>

      {/* 📦 Products Grid */}
      <main className="flex-1 px-6 lg:px-20 py-12">
        {loading ? (
          <div className="text-center py-20 font-bold text-slate-400">LOADING BLOCKCHAIN MARKETPLACE...</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((p) => (
              <div key={p.collectionId} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/40 hover:-translate-y-2 transition-all duration-300">
                <div className="h-48 bg-slate-100 relative">
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-sm">
                    <span className="material-symbols-outlined text-blue-600 text-sm">verified</span>
                    <span className="text-[10px] font-black text-slate-900 uppercase">92% Trust Score</span>
                  </div>
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <span className="material-symbols-outlined text-6xl">inventory_2</span>
                  </div>
                </div>
                
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{p.herbName}</h3>
                    <p className="text-xs font-bold text-slate-400 uppercase">{p.farmDetails}</p>
                  </div>
                  
                  <div className="flex justify-between items-center pt-2 border-t border-slate-50">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-300 uppercase">Batch ID</span>
                      <span className="text-xs font-mono font-bold text-blue-600">{p.collectionId}</span>
                    </div>
                    <Link to={`/traceability?id=${p.collectionId}`}>
                      <Button variant="secondary" className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-xl font-bold text-xs h-9">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;