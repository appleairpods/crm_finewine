import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage, useLocalized } from '../i18n/LanguageContext';
import {
  formatPrice,
  getLoyaltyTier,
  getNextTier,
  getTierThreshold,
} from '../utils/constants';
import './Profile.css';

export default function Profile() {
  const { t, format } = useLanguage();
  const localize = useLocalized();
  const { user, isAuthenticated, openAuth, logout } = useAuth();
  const { orders } = useCart();

  if (!isAuthenticated) {
    return (
      <div className="container page profile-empty">
        <h1 className="page-title">{t.profile.title}</h1>
        <p>{t.profile.notLoggedIn}</p>
        <button className="btn btn-primary" onClick={openAuth}>
          {t.auth.title}
        </button>
      </div>
    );
  }

  const lifetimePoints = user.lifetimePoints || user.points || 0;
  const tier = getLoyaltyTier(lifetimePoints);
  const nextTier = getNextTier(tier);
  const nextThreshold = nextTier ? getTierThreshold(nextTier) : null;
  const pointsToNext = nextThreshold ? nextThreshold - lifetimePoints : 0;

  const tierLabels = {
    silver: t.profile.tierSilver,
    gold: t.profile.tierGold,
    platinum: t.profile.tierPlatinum,
  };

  const tierDesc = {
    silver: t.profile.tierSilverDesc,
    gold: t.profile.tierGoldDesc,
    platinum: t.profile.tierPlatinumDesc,
  };

  const userOrders = orders.filter((o) => o.phone === user.phone);

  return (
    <div className="container page">
      <h1 className="page-title">{t.profile.title}</h1>

      <div className="profile-header card">
        <div>
          <p className="profile-welcome">{t.auth.welcome}{user.name ? `, ${user.name}` : ''}</p>
          <p className="profile-phone">{user.phone}</p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={logout}>
          {t.auth.logout}
        </button>
      </div>

      <section className="loyalty-section card">
        <h2>{t.profile.loyalty}</h2>
        <div className="loyalty-grid">
          <div className="loyalty-stat">
            <span className="loyalty-stat__label">{t.profile.points}</span>
            <span className="loyalty-stat__value price">{formatPrice(user.points || 0)}</span>
          </div>
          <div className="loyalty-stat">
            <span className="loyalty-stat__label">{t.profile.tier}</span>
            <span className={`loyalty-tier loyalty-tier--${tier}`}>
              {tierLabels[tier]}
            </span>
          </div>
        </div>
        <p className="loyalty-desc">{tierDesc[tier]}</p>
        {nextTier ? (
          <p className="loyalty-next">
            {format(t.profile.nextTier, {
              tier: tierLabels[nextTier],
              points: formatPrice(pointsToNext),
            })}
          </p>
        ) : (
          <p className="loyalty-next">{t.profile.maxTier}</p>
        )}
        <div className="tier-progress">
          <div
            className="tier-progress__fill"
            style={{
              width: `${Math.min(100, (lifetimePoints / (nextThreshold || 15000)) * 100)}%`,
            }}
          />
        </div>
      </section>

      <section className="orders-section">
        <h2 className="section-title">{t.profile.orders}</h2>
        {userOrders.length === 0 ? (
          <p className="orders-empty">{t.profile.noOrders}</p>
        ) : (
          <div className="orders-list">
            {userOrders.map((order) => (
              <div key={order.id} className="order-card card">
                <div className="order-card__header">
                  <span className="order-card__id">
                    {format(t.profile.orderNumber, { id: order.id })}
                  </span>
                  <span className="badge badge-gold">{t.profile.statusCompleted}</span>
                </div>
                <div className="order-card__meta">
                  <span>
                    {t.profile.orderDate}:{' '}
                    {new Date(order.date).toLocaleDateString(undefined, {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </span>
                  <span className="price">
                    {formatPrice(order.total)} {t.common.rub}
                  </span>
                </div>
                <ul className="order-card__items">
                  {order.items.map((item) => (
                    <li key={item.id}>
                      {localize(item.name)} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
