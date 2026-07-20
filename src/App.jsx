import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore, useLangStore } from './store/index';
import { t } from './utils/i18n';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';
import ClientBottomNav, { useClientBottomNavPadding } from './components/ClientBottomNav';

// Pages
import Home         from './pages/Home';
import Catalog      from './pages/Catalog';
import CarDetails   from './pages/CarDetails';
import Simulation   from './pages/Simulation';
import Cart         from './pages/Cart';
import Track        from './pages/Track';
import OrderConfirm from './pages/OrderConfirm';
import Orders       from './pages/Orders';
import Dashboard    from './pages/Dashboard';
import Profile      from './pages/Profile';
import Login        from './pages/Login';
import Register     from './pages/Register';
import Legal        from './pages/Legal';
import Warranty     from './pages/Warranty';
import Insurance    from './pages/Insurance';
import CampingCar   from './pages/CampingCar';
import Reviews      from './pages/Reviews';

// Admin
import AdminLayout      from './pages/admin/AdminLayout';
import AdminDashboard   from './pages/admin/AdminDashboard';
import AdminOrders      from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminCars        from './pages/admin/AdminCars';
import AdminCarForm     from './pages/admin/AdminCarForm';
import AdminClients     from './pages/admin/AdminClients';

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
function RequireAdmin({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" replace />;
  return children;
}
function GuestOnly({ children }) {
  const { isAuthenticated } = useAuthStore();
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
}
function MainLayout({ children }) {
  const paddingBottom = useClientBottomNavPadding();
  return (
    <>
      <Navbar />
      <div style={paddingBottom ? { paddingBottom } : undefined}>{children}</div>
      <ClientBottomNav />
      <Chatbot />
    </>
  );
}

export default function App() {
  const { lang } = useLangStore();
  const l = lang || 'fr';

  // Apply RTL on load
  useEffect(() => {
    document.documentElement.dir = 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <BrowserRouter>
      <Toast />
      <Routes>
        {/* Public */}
        <Route path="/"          element={<MainLayout><Home /></MainLayout>} />
        <Route path="/catalog"   element={<MainLayout><Catalog /></MainLayout>} />
        <Route path="/cars/:id"  element={<MainLayout><CarDetails /></MainLayout>} />
        <Route path="/simulation"element={<MainLayout><Simulation /></MainLayout>} />
        <Route path="/track"     element={<MainLayout><Track /></MainLayout>} />
        <Route path="/track/:orderNumber" element={<MainLayout><Track /></MainLayout>} />
        <Route path="/warranty"   element={<MainLayout><Warranty /></MainLayout>} />
        <Route path="/insurance"  element={<MainLayout><Insurance /></MainLayout>} />
        <Route path="/camping-car" element={<MainLayout><CampingCar /></MainLayout>} />
        <Route path="/avis"        element={<MainLayout><Reviews /></MainLayout>} />

        {/* Legal pages */}
        <Route path="/mentions-legales"         element={<MainLayout><Legal /></MainLayout>} />
        <Route path="/politique-confidentialite" element={<MainLayout><Legal /></MainLayout>} />
        <Route path="/cgv"                       element={<MainLayout><Legal /></MainLayout>} />
        <Route path="/cookies"                   element={<MainLayout><Legal /></MainLayout>} />

        {/* Auth */}
        <Route path="/login"    element={<GuestOnly><MainLayout><Login /></MainLayout></GuestOnly>} />
        <Route path="/register" element={<GuestOnly><MainLayout><Register /></MainLayout></GuestOnly>} />

        {/* Protected */}
        <Route path="/cart"     element={<RequireAuth><MainLayout><Cart /></MainLayout></RequireAuth>} />
        <Route path="/order-confirm/:orderNumber" element={<RequireAuth><MainLayout><OrderConfirm /></MainLayout></RequireAuth>} />
        <Route path="/orders"   element={<RequireAuth><MainLayout><Orders /></MainLayout></RequireAuth>} />
        <Route path="/dashboard"element={<RequireAuth><MainLayout><Dashboard /></MainLayout></RequireAuth>} />
        <Route path="/profile"  element={<RequireAuth><MainLayout><Profile /></MainLayout></RequireAuth>} />

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index            element={<AdminDashboard />} />
          <Route path="orders"    element={<AdminOrders />} />
          <Route path="orders/:id"element={<AdminOrderDetail />} />
          <Route path="cars"      element={<AdminCars />} />
          <Route path="cars/new"  element={<AdminCarForm />} />
          <Route path="cars/:id/edit" element={<AdminCarForm />} />
          <Route path="clients"   element={<AdminClients />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={
          <MainLayout>
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', background: 'var(--black)' }}>
              <div>
                <p style={{ fontFamily: "'Outfit', sans-serif", fontSize: 120, fontWeight: 900, color: '#132853', lineHeight: 1, letterSpacing: '-0.05em' }}>404</p>
                <h1 style={{ fontFamily: "'Outfit', sans-serif", fontSize: 32, fontWeight: 700, color: '#fff', marginBottom: 32 }}>
                  {l==='fr'?'Page introuvable':l==='en'?'Page not found':l==='de'?'Seite nicht gefunden':l==='es'?'Página no encontrada':l==='it'?'Pagina non trovata':'Página não encontrada'}
                </h1>
                <a href="/" className="btn-primary" style={{ fontSize: 14, padding: '16px 40px' }}>
                  ← {l==='fr'?'Accueil':l==='en'?'Home':l==='de'?'Startseite':l==='es'?'Inicio':l==='it'?'Home':'Início'}
                </a>
              </div>
            </div>
          </MainLayout>
        } />
      </Routes>
    </BrowserRouter>
  );
}
