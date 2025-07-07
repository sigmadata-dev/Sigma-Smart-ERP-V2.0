import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { LoginPage } from '@/components/auth/LoginPage';
import Index from './pages/Index';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/facturi" element={<div>Facturi Module Coming Soon</div>} />
        <Route path="/tva" element={<div>TVA Module Coming Soon</div>} />
        <Route path="/depozit" element={<div>Depozit Module Coming Soon</div>} />
        <Route path="/comenzi" element={<div>Comenzi Module Coming Soon</div>} />
        <Route path="/lucrari" element={<div>Lucrări Module Coming Soon</div>} />
        <Route path="/manopera" element={<div>Manoperă Module Coming Soon</div>} />
        <Route path="/contracte" element={<div>Contracte Module Coming Soon</div>} />
        <Route path="/pontaj" element={<div>Pontaj Module Coming Soon</div>} />
        <Route path="/clienti" element={<div>Clienți Module Coming Soon</div>} />
        <Route path="/furnizori" element={<div>Furnizori Module Coming Soon</div>} />
        <Route path="/centre-cost" element={<div>Centre Cost Module Coming Soon</div>} />
        <Route path="/angajati" element={<div>Angajați Module Coming Soon</div>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
