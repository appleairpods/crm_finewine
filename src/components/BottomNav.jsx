import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import './BottomNav.css';

export default function BottomNav() {
  const { t } = useLanguage();
  const { cartCount } = useCart();
  const location = useLocation();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const items = [
    { path: '/', label: t.nav.home, icon: 'home' },
    { path: '/catalog', label: t.nav.catalog, icon: 'grid' },
    { path: '/cart', label: t.nav.cart, icon: 'cart', badge: cartCount },
    { path: '/profile', label: t.nav.profile, icon: 'user' },
  ];

  return (
    <nav className="bottom-nav hide-desktop-nav">
      {items.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`bottom-nav__item ${isActive(item.path) ? 'active' : ''}`}
        >
          <span className="bottom-nav__icon">
            {item.icon === 'home' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
                <path d="M9 21V12h6v9" />
              </svg>
            )}
            {item.icon === 'grid' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            )}
            {item.icon === 'cart' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
                <path d="M3 6h18M16 10a4 4 0 01-8 0" />
              </svg>
            )}
            {item.icon === 'user' && (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            )}
            {item.badge > 0 && <span className="bottom-nav__badge">{item.badge}</span>}
          </span>
          <span className="bottom-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
