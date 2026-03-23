import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext, { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index"; // This is your Landing Page
import Login from "./pages/Login";
import FarmerDashboard from "./pages/FarmerDashboard"; // We'll call this Supplier Control
import ManufacturerDashboard from "./pages/ManufacturerDashboard"; // Warehouse Control
import AdminDashboard from "./pages/AdminDashboard"; // System Admin
import ProductTraceability from "./pages/ProductTraceability"; // The Search Page
import NotFound from "./pages/NotFound";
import Products from "./pages/Products";
import HowItWorks from "./pages/Protocol";
const queryClient = new QueryClient();

const ProtectedRoute = ({ children, allowedRoles }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const { user, token, loading } = useContext(AuthContext);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role)) return <Navigate to="/" replace />;

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* 🏠 1. Landing Page */}
            <Route path="/" element={<Index />} />
            
            {/* 🔑 Authentication */}
            <Route path="/login" element={<Login />} />
            
            {/* 🏭 Supplier Control Center (Formerly Farmer) */}
            <Route path="/supplier" element={
              <ProtectedRoute allowedRoles={['collector']}>
                <FarmerDashboard />
              </ProtectedRoute>
            } />
            <Route path="/products" element={<Products />} />
            
            {/* 🚚 Warehouse & Logistics (Formerly Manufacturer) */}
            <Route path="/warehouse" element={
              <ProtectedRoute allowedRoles={['manufacturer']}>
                <ManufacturerDashboard />
              </ProtectedRoute>
            } />
            
         <Route path="/how-it-works" element={<HowItWorks />} />
            {/* ⚙️ Admin Control Center */}
            <Route path="/admin" element={<AdminDashboard />} />
            
            {/* 🧾 Public Traceability Page */}
            <Route path="/traceability" element={<ProductTraceability />} />
            
            {/* 404 Page */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;