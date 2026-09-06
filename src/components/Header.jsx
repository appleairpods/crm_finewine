import { Link, useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Header.css';

export default function Header() {
  const { t, lang, setLang } = useLanguage();
  const { cartCount } = useCart();
  const { isAuthenticated, openAuth } = useAuth();
  const location = useLocation();

  return (
    <header className="header">
      <div className="header__inner container">
        <Link to="/" className="header__logo">
          FineWine
        </Link>

        <nav className="header__nav hide-mobile">
          <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
            {t.nav.home}
          </Link>
          <Link to="/catalog" className={location.pathname.startsWith('/catalog') || location.pathname.startsWith('/product') ? 'active' : ''}>
            {t.nav.catalog}
          </Link>
          <Link to="/cart" className={location.pathname === '/cart' ? 'active' : ''}>
            {t.nav.cart}
            {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
          </Link>
          <Link to="/profile" className={location.pathname === '/profile' ? 'active' : ''}>
            {t.nav.profile}
          </Link>
        </nav>

        <div className="header__actions">
          <button
            className="lang-toggle"
            onClick={() => setLang(lang === 'ru' ? 'en' : 'ru')}
            aria-label="Switch language"
          >
            {lang === 'ru' ? 'EN' : 'RU'}
          </button>

          {!isAuthenticated && (
            <button className="btn btn-outline btn-sm hide-mobile" onClick={openAuth}>
              {t.auth.title}
            </button>
          )}

          <Link to="/cart" className="header__cart hide-desktop">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4H6z" />
              <path d="M3 6h18M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && <span className="header__badge">{cartCount}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
