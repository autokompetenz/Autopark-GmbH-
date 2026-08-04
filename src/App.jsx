import { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore, useLangStore } from './store/index';
import { t } from './utils/i18n';
import Navbar from './components/Navbar';
import Toast from './components/Toast';
import Chatbot from './components/Chatbot';
import PendingOrderReminder from './components/PendingOrderReminder';
import ClientBottomNav, { useClientBottomNavPadding } from './components/ClientBottomNav';

// Pages (code-split, chargées à la demande)
const Home         = lazy(() => import('./pages/Home'));
const Catalog      = lazy(() => import('./pages/Catalog'));
const CarDetails   = lazy(() => import('./pages/CarDetails'));
const Simulation   = lazy(() => import('./pages/Simulation'));
const Cart         = lazy(() => import('./pages/Cart'));
const Track        = lazy(() => import('./pages/Track'));
const OrderConfirm = lazy(() => import('./pages/OrderConfirm'));
const Orders       = lazy(() => import('./pages/Orders'));
const Dashboard    = lazy(() => import('./pages/Dashboard'));
const Profile      = lazy(() => import('./pages/Profile'));
const Login        = lazy(() => import('./pages/Login'));
const Register     = lazy(() => import('./pages/Register'));
const Legal        = lazy(() => import('./pages/Legal'));
const Warranty     = lazy(() => import('./pages/Warranty'));
const Insurance    = lazy(() => import('./pages/Insurance'));
const CampingCar   = lazy(() => import('./pages/CampingCar'));
const Reviews      = lazy(() => import('./pages/Reviews'));
const Sell         = lazy(() => import('./pages/Sell'));
const Contact      = lazy(() => import('./pages/Contact'));
const Faq          = lazy(() => import('./pages/Faq'));
const About        = lazy(() => import('./pages/About'));
const Brands       = lazy(() => import('./pages/Brands'));
const Delivery     = lazy(() => import('./pages/Delivery'));
const Maintenance  = lazy(() => import('./pages/Maintenance'));

// Admin
const AdminLayout      = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard   = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminOrders      = lazy(() => import('./pages/admin/AdminOrders'));
const AdminOrderDetail = lazy(() => import('./pages/admin/AdminOrderDetail'));
const AdminCars        = lazy(() => import('./pages/admin/AdminCars'));
const AdminCarForm     = lazy(() => import('./pages/admin/AdminCarForm'));
const AdminClients     = lazy(() => import('./pages/admin/AdminClients'));
const AdminSettings    = lazy(() => import('./pages/admin/AdminSettings'));

function RouteFallback() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: '#0a0a0a',
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          width: 40, height: 40, margin: '0 auto 16px', borderRadius: '50%',
          border: '3px solid rgba(19,40,83,0.2)', borderTopColor: '#132853',
          animation: 'autopark-spin 0.8s linear infinite',
        }} />
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          Autopark GmbH
        </div>
      </div>
      <style>{`@keyframes autopark-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window.history.scrollRestoration === 'string') {
      window.history.scrollRestoration = 'manual';
    }
    const el = document.documentElement;
    const prev = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
    el.style.scrollBehavior = prev;
  }, [pathname]);

  return null;
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
      <ScrollToTop />
      <Toast />
      <PendingOrderReminder />
      <Suspense fallback={<RouteFallback />}>
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
        <Route path="/vendre"      element={<MainLayout><Sell /></MainLayout>} />
        <Route path="/contact"     element={<MainLayout><Contact /></MainLayout>} />
        <Route path="/faq"         element={<MainLayout><Faq /></MainLayout>} />
        <Route path="/a-propos"    element={<MainLayout><About /></MainLayout>} />
        <Route path="/marques"     element={<MainLayout><Brands /></MainLayout>} />
        <Route path="/livraison"   element={<MainLayout><Delivery /></MainLayout>} />
        <Route path="/maintenance" element={<MainLayout><Maintenance /></MainLayout>} />

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
          <Route path="settings"  element={<AdminSettings />} />
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
        }         />
      </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
