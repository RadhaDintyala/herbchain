import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background">
      {/* 🧾 Header - Updated to Retail Branding */}
      <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 backdrop-blur-xl px-6 py-4 lg:px-20 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center bg-blue-600 rounded-lg p-1.5 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]">
            <span className="material-symbols-outlined text-2xl">barcode_scanner</span>
          </div>
          <h2 className="text-slate-900 text-xl font-bold tracking-tight">RetailChain</h2>
        </div>
        <nav className="hidden md:flex items-center gap-8">
          <Link className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors" to="/">Home</Link>
          <Link className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors" to="/traceability">Traceability</Link>
          <Link className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors" to="/products">Products</Link>
          <Link className="text-slate-600 text-sm font-medium hover:text-blue-600 transition-colors" to="/scan">Scan & Verify</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="outline" className="hidden sm:flex border-blue-200 text-blue-600 hover:bg-blue-50">Login</Button>
          </Link>
          <Link to="/login">
            <Button className="bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200 text-white">Get Started</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1">
        {/* 🏠 1. Hero Section - "Trust Amplified" */}
        <section className="px-6 lg:px-20 py-10">
          <div
            className="relative overflow-hidden rounded-xl lg:rounded-3xl min-h-[500px] lg:min-h-[600px] flex flex-col items-center justify-center text-center px-4"
            style={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.6)), url("https://images.unsplash.com/photo-1534452203293-494d7ddbf7e0?auto=format&fit=crop&q=80&w=2000")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="max-w-4xl space-y-6 z-10">
              <h1 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
                Supply Chain, <span className="text-blue-400">Simplified.</span> <br />
                Trust, <span className="text-blue-400">Amplified.</span>
              </h1>
              <p className="text-slate-100 text-lg md:text-xl max-w-2xl mx-auto font-normal">
                Track every product from origin to shelf with complete transparency. 
                A modern retail experience powered by blockchain.
              </p>
              
              {/* 🔍 Search / Track Input */}
              <div className="flex flex-col sm:flex-row w-full max-w-2xl mx-auto bg-white rounded-xl lg:rounded-2xl p-2 shadow-2xl border border-blue-100">
                <div className="flex items-center px-4 text-slate-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <input 
                  className="flex-1 border-none focus:ring-0 text-slate-900 px-2 py-4 font-medium outline-none bg-transparent" 
                  placeholder="Enter Batch ID (e.g., SC-20456)" 
                  type="text" 
                />
                <Link to="/traceability">
                  <Button className="bg-blue-600 hover:bg-blue-700 px-8 py-4 h-auto rounded-lg lg:rounded-xl font-bold text-white">Track Product</Button>
                </Link>
              </div>

              {/* Highlight Strip */}
              <div className="flex flex-wrap justify-center gap-6 pt-8">
                <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                  <span className="material-symbols-outlined text-blue-400">visibility</span> 🔍 End-to-End Visibility
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                  <span className="material-symbols-outlined text-blue-400">lock_reset</span> 🔐 Tamper-Proof Records
                </div>
                <div className="flex items-center gap-2 text-white/90 text-sm font-semibold">
                  <span className="material-symbols-outlined text-blue-400">bolt</span> ⚡ Instant Verification
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 🛠️ How it Works - D-Mart Warehouse style */}
        <section className="px-6 lg:px-20 py-20 bg-slate-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl lg:text-4xl font-black text-slate-900">Retail Transparency Journey</h2>
              <p className="text-slate-600 max-w-2xl mx-auto">Ensuring 100% authentic goods from the manufacturer to your shopping cart.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {[
                { icon: "inventory_2", title: "Manufacturer Logging", desc: "Batches are registered at the source with unique IDs and production metadata." },
                { icon: "verified", title: "Quality Assurance", desc: "Lab results and compliance certificates are permanently hashed onto the ledger." },
                { icon: "storefront", title: "Retail Availability", desc: "D-Mart scans arrival, making the entire history available to consumers instantly." },
              ].map((step) => (
                <div key={step.title} className="flex flex-col items-center text-center space-y-6 relative z-10 group">
                  <div className="w-20 h-20 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                    <span className="material-symbols-outlined text-4xl">{step.icon}</span>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900">{step.title}</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <div className="py-12 bg-white text-center">
  <Link to="/how-it-works">
    <Button className="bg-[#2563EB] hover:bg-blue-700 h-14 px-10 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 text-xs transition-all hover:scale-105 active:scale-95">
      Explore the Trust Protocol →
    </Button>
  </Link>
  <p className="mt-4 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
    Technical deep-dive into the RetailChain ledger
  </p>
</div>

      {/* 🔥 Footer - Building Trust */}
      <footer className="bg-slate-900 text-white px-6 lg:px-20 py-12">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <div className="flex justify-center items-center gap-2">
             <span className="material-symbols-outlined text-blue-400 text-3xl">barcode_scanner</span>
             <h2 className="text-2xl font-bold">RetailChain</h2>
          </div>
          <p className="text-slate-400 max-w-md mx-auto">Building trust into every product. Transparent. Secure. Verifiable.</p>
          <div className="flex justify-center gap-8 text-sm text-slate-500 font-medium">
            <Link to="/traceability" className="hover:text-blue-400">Traceability</Link>
            <Link to="/scan" className="hover:text-blue-400">Scan & Verify</Link>
            <Link to="/login" className="hover:text-blue-400">Admin Dashboard</Link>
          </div>
          <div className="pt-8 border-t border-slate-800 text-slate-600 text-xs">
            © 2026 RetailChain Blockchain Solutions. Powered by blockchain security.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;