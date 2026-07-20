import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore, useCartStore, useLangStore, useThemeStore } from '../store';
import { t, LANGUAGES } from '../utils/i18n';
import { useBreakpoint } from '../hooks/useBreakpoint';

export default function Navbar() {
  const { user, isAuthenticated, logout, isAdmin } = useAuthStore();
  const { cartCount, fetchCount } = useCartStore();
  const { lang, setLang } = useLangStore();
  const { theme, toggle } = useThemeStore();
  const { isMobile } = useBreakpoint();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => { if (isAuthenticated) fetchCount(); }, [isAuthenticated]);
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    const h = (e) => { if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); setMenuOpen(false); };

  const isHero = location.pathname === '/' && !scrolled;
  const F = "'Outfit',sans-serif";

  const iconColor = scrolled
    ? (isDark ? 'rgba(255,255,255,0.85)' : '#222')
    : isHero ? '#fff'
    : (isDark ? 'rgba(255,255,255,0.8)' : '#333');

  const navTextColor = scrolled
    ? (isDark ? 'rgba(255,255,255,0.6)' : '#666')
    : isHero ? 'rgba(255,255,255,0.7)'
    : (isDark ? 'rgba(255,255,255,0.6)' : '#666');

  const btnBg = scrolled
    ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)')
    : isHero ? 'rgba(255,255,255,0.08)'
    : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)');

  const btnBorder = (open) => open
    ? 'var(--red)'
    : scrolled
    ? (isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)')
    : isHero ? 'rgba(255,255,255,0.15)'
    : (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)');

  const menuBg     = isDark ? '#0f0f0f'                 : '#ffffff';
  const menuText   = isDark ? '#ffffff'                 : '#111111';
  const menuText2  = isDark ? 'rgba(255,255,255,0.6)' : '#555555';
  const menuText3  = isDark ? 'rgba(255,255,255,0.3)' : '#999999';
  const menuBorder = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const menuHover  = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.03)';

  const NavLink = ({ to, label }) => {
    const active = location.pathname.startsWith(to) && to !== '/';
    return (
      <Link to={to} style={{
        fontSize: 11, fontWeight: 500, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: active ? 'var(--red)' : navTextColor,
        textDecoration: 'none', transition: 'color 0.25s',
        position: 'relative', paddingBottom: 4,
      }}
        onMouseOver={e => e.currentTarget.style.color = 'var(--red)'}
        onMouseOut={e => e.currentTarget.style.color = active ? 'var(--red)' : navTextColor}>
        {label}
        {active && <span style={{ position:'absolute', bottom:0, left:0, right:0, height:1, background:'var(--red)' }} />}
      </Link>
    );
  };

  const itemStyle = (mobile) => ({
    display: 'flex', alignItems: 'center', gap: 10,
    padding: mobile ? '14px 0' : '10px 18px',
    fontSize: mobile ? 16 : 14,
    color: menuText2,
    textDecoration: 'none',
    transition: 'background 0.15s',
    fontWeight: mobile ? 600 : 400,
    fontFamily: F,
    background: 'transparent',
    border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left',
  });

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'transparent',
        borderBottom: scrolled ? `1px solid ${menuBorder}` : '1px solid transparent',
        transition: 'border-color 0.5s var(--ease)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: isMobile ? '0 5%' : '0 6%', height: 60,
      }}>

        {/* Blur layer */}
        {scrolled && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: -1,
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            background: isDark ? 'rgba(10,10,11,0.96)' : 'rgba(255,255,255,0.96)',
            transition: 'background 0.5s',
          }} />
        )}

        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'baseline', gap: 6, flexShrink: 0, position: 'relative', zIndex: 1 }}>
          <span style={{
            fontFamily: F, fontSize: 15, fontWeight: 800,
            color: scrolled ? (isDark ? '#fff' : '#111') : isHero ? '#fff' : (isDark ? '#fff' : '#111'),
            letterSpacing: '0.08em', transition: 'color 0.4s',
          }}>
            AUTOPARK
          </span>
          <span style={{ fontSize: 8, fontWeight: 500, letterSpacing: '0.25em', color: 'var(--red)', textTransform: 'uppercase', opacity: 0.7 }}>
            GmbH
          </span>
        </Link>

        {/* Desktop nav links */}
        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 32, position: 'relative', zIndex: 1 }}>
            <NavLink to="/catalog"     label={t('nav_vehicles', lang)} />
            <NavLink to="/camping-car" label="Camping Car" />
            <NavLink to="/simulation"  label={t('nav_financing', lang)} />
            <NavLink to="/warranty"    label={t('nav_warranty', lang) || 'Garantie'} />
            <NavLink to="/insurance"   label={t('nav_insurance', lang) || 'Assurance'} />
            <NavLink to="/avis"        label={t('reviews_label', lang)} />
            <NavLink to="/track"       label={t('nav_track', lang)} />
          </div>
        )}

        {/* Right side */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative', zIndex: 1 }}>

          {/* Cart */}
          {isAuthenticated && (
            <Link to="/cart" style={{
              position: 'relative', width: 36, height: 36,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              borderRadius: 6, background: btnBg,
              border: `1px solid ${btnBorder(false)}`,
              color: iconColor, transition: 'all 0.25s', flexShrink: 0,
            }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.color = 'var(--red)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = btnBorder(false); e.currentTarget.style.color = iconColor; }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"/>
              </svg>
              {cartCount > 0 && (
                <span style={{
                  position: 'absolute', top: -4, right: -4,
                  width: 15, height: 15, background: 'var(--red)', color: '#fff',
                  fontSize: 8, fontWeight: 800, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '2px solid var(--bg)',
                }}>
                  {cartCount}
                </span>
              )}
            </Link>
          )}

          {/* Menu button */}
          <div style={{ position: 'relative' }} ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: btnBg,
                border: `1px solid ${btnBorder(menuOpen)}`,
                borderRadius: 6,
                padding: isMobile ? '7px' : '6px 12px',
                cursor: 'pointer', transition: 'all 0.25s',
                height: 36, width: isMobile ? 36 : 'auto',
                justifyContent: 'center',
              }}>
              {isAuthenticated && !isMobile ? (
                <>
                  <div style={{
                    width: 20, height: 20, borderRadius: '50%',
                    background: 'linear-gradient(135deg,#0E1E3D,#132853)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, fontWeight: 700, color: '#fff', flexShrink: 0,
                  }}>
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 500, color: iconColor, maxWidth: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.firstName}
                  </span>
                  <span style={{ fontSize: 9, color: iconColor, opacity: 0.5 }}>▾</span>
                </>
              ) : (
                <span style={{ fontSize: 18, lineHeight: 1, color: iconColor }}>
                  {menuOpen ? '✕' : '☰'}
                </span>
              )}
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 6, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.97 }}
                  transition={{ duration: 0.2, ease: [0.16,1,0.3,1] }}
                  style={{
                    position: isMobile ? 'fixed' : 'absolute',
                    right: 0,
                    top: isMobile ? 60 : 'calc(100% + 8px)',
                    left: isMobile ? 0 : 'auto',
                    bottom: isMobile ? 0 : 'auto',
                    background: menuBg,
                    border: isMobile ? 'none' : `1px solid ${menuBorder}`,
                    borderTop: isMobile ? `1px solid ${menuBorder}` : undefined,
                    borderRadius: isMobile ? 0 : 10,
                    boxShadow: isMobile ? 'none' : '0 8px 40px rgba(0,0,0,0.20)',
                    overflow: 'auto',
                    minWidth: isMobile ? '100%' : 220,
                    zIndex: 9999,
                    padding: isMobile ? '20px 5%' : 0,
                  }}>

                  {/* Mobile nav links */}
                  {isMobile && (
                    <div style={{ marginBottom: 20 }}>
                      {[
                        { to: '/catalog',     icon: '🚗', label: t('nav_vehicles', lang) },
                        { to: '/camping-car', icon: '🚐', label: 'Camping Car' },
                        { to: '/simulation',  icon: '💳', label: t('nav_financing', lang) },
                        { to: '/track',       icon: '📍', label: t('nav_track', lang) },
                      ].map(({ to, icon, label }) => (
                        <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 12,
                            padding: '14px 0', fontSize: 15,
                            color: menuText,
                            textDecoration: 'none',
                            borderBottom: `1px solid ${menuBorder}`,
                            fontWeight: 500, fontFamily: F,
                          }}>
                          <span style={{ fontSize: 20 }}>{icon}</span> {label}
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* User info */}
                  {isAuthenticated && (
                    <div style={{
                      padding: isMobile ? '0 0 16px' : '14px 18px',
                      borderBottom: `1px solid ${menuBorder}`,
                      background: isMobile ? 'transparent' : (isDark ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.015)'),
                    }}>
                      <p style={{ fontSize: isMobile ? 16 : 13, fontWeight: 600, color: menuText, fontFamily: F }}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <p style={{ fontSize: isMobile ? 13 : 11, color: menuText3, marginTop: 2 }}>{user?.email}</p>
                    </div>
                  )}

                  {/* Account links */}
                  <div style={{ padding: isMobile ? '16px 0' : '6px 0' }}>
                    {isAuthenticated ? (
                      <>
                        {[
                          { to: '/dashboard', icon: '⊞', label: t('nav_dashboard', lang) },
                          { to: '/orders',    icon: '📦', label: t('nav_orders', lang) },
                          { to: '/profile',   icon: '👤', label: t('nav_profile', lang) },
                        ].map(({ to, icon, label }) => (
                          <Link key={to} to={to} onClick={() => setMenuOpen(false)}
                            style={{ ...itemStyle(isMobile), display: 'flex', color: menuText2 }}
                            onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = menuHover; }}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                            <span style={{ fontSize: isMobile ? 20 : 15, width: isMobile ? 28 : 20, textAlign: 'center' }}>{icon}</span>
                            {label}
                          </Link>
                        ))}
                        {isAdmin() && (
                          <Link to="/admin" onClick={() => setMenuOpen(false)}
                            style={{ ...itemStyle(isMobile), display: 'flex', color: 'var(--red)' }}
                            onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = 'rgba(19,40,83,0.04)'; }}
                            onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                            <span style={{ fontSize: isMobile ? 20 : 15, width: isMobile ? 28 : 20, textAlign: 'center' }}>⚙</span>
                            {t('nav_admin', lang)}
                          </Link>
                        )}
                      </>
                    ) : (
                      <>
                        <Link to="/login" onClick={() => setMenuOpen(false)}
                          style={{ ...itemStyle(isMobile), display: 'flex', color: menuText2 }}
                          onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = menuHover; }}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontSize: isMobile ? 20 : 15, width: isMobile ? 28 : 20, textAlign: 'center' }}>→</span>
                          {t('nav_login', lang)}
                        </Link>
                        <Link to="/register" onClick={() => setMenuOpen(false)}
                          style={{ ...itemStyle(isMobile), display: 'flex', color: 'var(--red)', fontWeight: 600 }}
                          onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = 'rgba(19,40,83,0.04)'; }}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontSize: isMobile ? 20 : 15, width: isMobile ? 28 : 20, textAlign: 'center' }}>✦</span>
                          {t('nav_register', lang)}
                        </Link>
                      </>
                    )}
                  </div>

                  <div style={{ height: 1, background: menuBorder, margin: isMobile ? '8px 0' : 0 }} />

                  {/* Theme toggle */}
                  <div style={{ padding: isMobile ? '8px 0' : '6px 0' }}>
                    <button onClick={toggle} style={{ ...itemStyle(isMobile), width: '100%', color: menuText2 }}
                      onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = menuHover; }}
                      onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                      <span style={{ fontSize: isMobile ? 20 : 15, width: isMobile ? 28 : 20, textAlign: 'center' }}>
                        {isDark ? '☀️' : '🌙'}
                      </span>
                      {isDark ? t('light_mode', lang) : t('dark_mode', lang)}
                    </button>
                  </div>

                  <div style={{ height: 1, background: menuBorder, margin: isMobile ? '8px 0' : 0 }} />

                  {/* Language selector */}
                  <div style={{ padding: isMobile ? '8px 0' : '8px 0' }}>
                    <p style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: '0.25em',
                      textTransform: 'uppercase', color: menuText3,
                      padding: isMobile ? '4px 0 10px' : '4px 18px 8px',
                    }}>
                      {lang === 'fr' ? 'Langue' : lang === 'en' ? 'Language' : lang === 'de' ? 'Sprache' : 'Idioma'}
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: isMobile ? 8 : 4, padding: isMobile ? 0 : '0 10px 6px' }}>
                      {LANGUAGES.map(l => (
                        <button key={l.code} onClick={() => { setLang(l.code); setMenuOpen(false); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: isMobile ? '10px 6px' : '8px 10px',
                            background: l.code === lang ? 'rgba(19,40,83,0.08)' : 'transparent',
                            border: `1px solid ${l.code === lang ? 'rgba(19,40,83,0.2)' : 'transparent'}`,
                            borderRadius: 6, cursor: 'pointer',
                            fontSize: isMobile ? 13 : 12,
                            color: l.code === lang ? 'var(--red)' : menuText2,
                            fontFamily: F, fontWeight: l.code === lang ? 600 : 400,
                            transition: 'all 0.15s',
                          }}
                          onMouseOver={e => { if (l.code !== lang) e.currentTarget.style.background = menuHover; }}
                          onMouseOut={e => { if (l.code !== lang) e.currentTarget.style.background = 'transparent'; }}>
                          <span style={{ fontSize: isMobile ? 16 : 14 }}>{l.flag}</span> {l.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Logout */}
                  {isAuthenticated && (
                    <>
                      <div style={{ height: 1, background: menuBorder, margin: isMobile ? '8px 0' : 0 }} />
                      <div style={{ padding: isMobile ? '8px 0' : '6px 0 8px' }}>
                        <button onClick={handleLogout}
                          style={{ ...itemStyle(isMobile), width: '100%', color: '#DC2626' }}
                          onMouseOver={e => { if (!isMobile) e.currentTarget.style.background = 'rgba(239,68,68,0.04)'; }}
                          onMouseOut={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontSize: isMobile ? 20 : 15, width: isMobile ? 28 : 20, textAlign: 'center' }}>→</span>
                          {t('nav_logout', lang)}
                        </button>
                      </div>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>
    </>
  );
}
