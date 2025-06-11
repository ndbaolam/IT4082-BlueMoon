import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Index />} />
            <Route path="/register" element={<Index />} />
            <Route path="/dashboard" element={<Index />} />
            <Route path="/household" element={<Index />} />
            <Route path="/person" element={<Index />} />
            <Route path="/fees" element={<Index />} />
            <Route path="/payments" element={<Index />} />
            <Route path="/household-history" element={<Index />} />
            <Route path="/temporary-residence" element={<Index />} />
            <Route path="/users" element={<Index />} />
            <Route path="/reports" element={<Index />} />
            <Route path="/profile" element={<Index />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
