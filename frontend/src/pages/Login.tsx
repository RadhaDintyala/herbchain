import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const { login, register } = useContext(AuthContext);
  const navigate = useNavigate();
  const { toast } = useToast();

  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'collector'
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let data;
      if (isRegistering) {
        data = await register(formData.name, formData.email, formData.password, formData.role);
        toast({
          title: "Registration successful",
          description: "Welcome to RetailChain!",
        });
      } else {
        data = await login(formData.email, formData.password);
        toast({
          title: "Login successful",
          description: "Access granted to the secure ledger.",
        });
      }

      // Logic stays same to keep backend happy, but labels on screen are updated
      const role = data.role === 'farmer' ? 'collector' : data.role;
      if (role === 'collector') navigate('/supplier'); // Changed path to match our new App.tsx
      else if (role === 'manufacturer') navigate('/warehouse'); // Changed path
      else if (role === 'lab') navigate('/admin');
      else navigate('/');

    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Authentication failed",
        description: err.response?.data?.msg || "Verification failed. Check credentials.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="bg-slate-50 min-h-screen flex flex-col">
      {/* 🧾 Retail Header */}
      <header className="w-full px-6 py-4 flex items-center justify-between border-b border-blue-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-8 bg-blue-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-blue-200">
            <span className="material-symbols-outlined text-xl">barcode_scanner</span>
          </div>
          <h1 className="text-slate-900 text-xl font-black tracking-tight">RetailChain</h1>
        </Link>
        <div className="flex items-center gap-4">
          <a className="text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors" href="#">Support</a>
          <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 rounded-full border border-blue-100">
            <span className="size-2 bg-blue-500 rounded-full animate-pulse"></span>
            <span className="text-[10px] font-black text-blue-700">STABLE</span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-6 relative">
        <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 bg-white rounded-3xl overflow-hidden shadow-2xl border border-blue-50">
          
          {/* 🖼️ Left Panel - Retail Imagery */}
          <div className="hidden lg:block relative min-h-[600px]">
            <div className="absolute inset-0 bg-blue-600/10 flex flex-col justify-end p-12 text-white z-10">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-800/40 to-transparent"></div>
              <div className="relative z-20">
                <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest mb-4">Enterprise Grade</span>
                <h2 className="text-4xl font-black leading-tight mb-4 text-white">Supply Chain, <br/>Simplified.</h2>
                <p className="text-blue-100 text-lg font-medium leading-relaxed">
                  The future of retail management. Secure your inventory with blockchain-verified data from factory to storefront.
                </p>
              </div>
            </div>
            <img 
              alt="Modern automated retail warehouse" 
              className="absolute inset-0 w-full h-full object-cover" 
              src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=1000" 
            />
          </div>

          {/* 🔑 Right Panel - Login Form */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white">
            <div className="mb-8">
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{isRegistering ? "Register Partner" : "Welcome Back"}</h3>
              <p className="text-slate-500 mt-2 font-medium">
                {isRegistering ? "Join the RetailChain trusted network." : "Sign in to manage your inventory node."}
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              {isRegistering && (
                <div className="space-y-1.5">
                  <label className="text-xs font-black uppercase text-slate-400 ml-1">Company / Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">domain</span>
                    <input name="name" value={formData.name} onChange={handleChange} required className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none font-medium" placeholder="D-Mart Warehouse 01" type="text" />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Access Role</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl px-4 focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none appearance-none font-bold text-slate-700">
                  <option value="collector">Supplier / Entry Point (Collector)</option>
                  <option value="manufacturer">Warehouse / Logistics Manager</option>
                  <option value="lab">Quality Auditor (Admin/Lab)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase text-slate-400 ml-1">Network Email</label>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">verified_user</span>
                  <input name="email" value={formData.email} onChange={handleChange} required className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none font-medium" placeholder="radha@retailchain.com" type="email" />
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between items-center ml-1">
                  <label className="text-xs font-black uppercase text-slate-400">Security Key</label>
                  {!isRegistering && <a className="text-[10px] font-black text-blue-600 uppercase hover:underline" href="#">Reset Key?</a>}
                </div>
                <div className="relative group">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-colors">lock</span>
                  <input name="password" value={formData.password} onChange={handleChange} required className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 focus:ring-4 focus:ring-blue-50 focus:border-blue-600 transition-all outline-none font-medium" placeholder="••••••••" type="password" />
                </div>
              </div>

              <Button disabled={isLoading} className="w-full h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-blue-100 group" type="submit">
                {isLoading ? "Verifying..." : (isRegistering ? "Initialize Account" : "Sign In to RetailChain")}
                {!isLoading && <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-sm">arrow_forward</span>}
              </Button>

              <button onClick={() => setIsRegistering(!isRegistering)} type="button" className="w-full text-center text-xs font-black text-blue-600 uppercase tracking-widest hover:text-blue-800 transition-colors">
                {isRegistering ? "Existing Node? Sign In" : "Request Partner Access"}
              </button>
            </form>

            <p className="text-center text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-12">
              Protected by Enterprise Grade Blockchain Encryption
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;