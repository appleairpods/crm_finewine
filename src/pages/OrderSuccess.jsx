import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import './OrderSuccess.css';

export default function OrderSuccess() {
  const { orderId } = useParams();
  const { t } = useLanguage();
  const { orders } = useCart();

  const order = orders.find((o) => o.id === orderId);

  return (
    <div className="container page success-page">
      <div className="success-icon">
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="30" stroke="currentColor" strokeWidth="2" opacity="0.3" />
          <path d="M20 32l8 8 16-16" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <h1 className="page-title">{t.success.title}</h1>
      <p className="success-text">{t.success.text}</p>
      {order && (
        <p className="success-order">
          {t.success.orderNumber}: <strong>{order.id}</strong>
        </p>
      )}
      {!order && orderId && (
        <p className="success-order">
          {t.success.orderNumber}: <strong>{orderId}</strong>
        </p>
      )}
      <div className="success-actions">
        <Link to="/catalog" className="btn btn-primary">
          {t.success.toCatalog}
        </Link>
        <Link to="/profile" className="btn btn-outline">
          {t.success.toProfile}
        </Link>
      </div>
    </div>
  );
}
