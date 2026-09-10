import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage, useLocalized } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/constants';
import ProductImage from '../components/ProductImage';
import './Cart.css';

export default function Cart() {
  const { t, format } = useLanguage();
  const localize = useLocalized();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    cartItems,
    subtotal,
    promoCode,
    promoError,
    promoDiscount,
    pointsToUse,
    setPointsToUse,
    updateQuantity,
    removeFromCart,
    applyPromo,
    canCheckout,
    MIN_ORDER,
  } = useCart();

  const [promoInput, setPromoInput] = useState(promoCode || '');

  if (cartItems.length === 0) {
    return (
      <div className="container page cart-empty">
        <h1 className="page-title">{t.cart.title}</h1>
        <p className="cart-empty__text">{t.cart.empty}</p>
        <p className="cart-empty__sub">{t.cart.emptyText}</p>
        <Link to="/catalog" className="btn btn-primary">
          {t.cart.goToCatalog}
        </Link>
      </div>
    );
  }

  const maxPoints = user?.points || 0;
  const maxPointsUsable = Math.min(maxPoints, Math.max(0, subtotal - promoDiscount));

  const handleCheckout = () => {
    if (canCheckout) navigate('/checkout');
  };

  const total = Math.max(0, subtotal - promoDiscount - pointsToUse);

  return (
    <div className="container page">
      <h1 className="page-title">{t.cart.title}</h1>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map(({ product, quantity }) => (
            <div key={product.id} className="cart-item card">
              <Link to={`/product/${product.id}`}>
                <ProductImage product={product} size="sm" />
              </Link>
              <div className="cart-item__info">
                <Link to={`/product/${product.id}`} className="cart-item__name">
                  {localize(product.name)}
                </Link>
                <p className="cart-item__price price">
                  {formatPrice(product.price)} {t.common.rub}
                </p>
                <div className="cart-item__actions">
                  <div className="qty-selector qty-selector--sm">
                    <button
                      className="qty-selector__btn"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                    >
                      −
                    </button>
                    <span className="qty-selector__value">{quantity}</span>
                    <button
                      className="qty-selector__btn"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => removeFromCart(product.id)}
                  >
                    {t.cart.remove}
                  </button>
                </div>
              </div>
              <p className="cart-item__total price">
                {formatPrice(product.price * quantity)} {t.common.rub}
              </p>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <div className="cart-summary__promo">
            <label className="label">{t.cart.promo}</label>
            <div className="promo-row">
              <input
                className="input"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                placeholder="FINE10"
              />
              <button
                className="btn btn-outline btn-sm"
                onClick={() => applyPromo(promoInput)}
              >
                {t.cart.applyPromo}
              </button>
            </div>
            {promoError && <p className="error-text">{t.cart.promoInvalid}</p>}
            {promoDiscount > 0 && (
              <p className="success-text">{t.cart.promoApplied}</p>
            )}
          </div>

          {user && maxPoints > 0 && (
            <div className="cart-summary__points">
              <label className="label">{t.cart.usePoints}</label>
              <p className="points-hint">
                {format(t.cart.pointsAvailable, { points: formatPrice(maxPoints) })}
              </p>
              <input
                type="range"
                min="0"
                max={maxPointsUsable}
                value={pointsToUse}
                onChange={(e) => setPointsToUse(Number(e.target.value))}
                className="points-slider"
              />
              {pointsToUse > 0 && (
                <p className="points-used">
                  {t.cart.pointsUsed}: {formatPrice(pointsToUse)} {t.common.rub}
                </p>
              )}
            </div>
          )}

          <div className="divider" />

          <div className="summary-row">
            <span>{t.cart.subtotal}</span>
            <span>{formatPrice(subtotal)} {t.common.rub}</span>
          </div>
          {promoDiscount > 0 && (
            <div className="summary-row summary-row--discount">
              <span>{t.cart.discount}</span>
              <span>−{formatPrice(promoDiscount)} {t.common.rub}</span>
            </div>
          )}
          {pointsToUse > 0 && (
            <div className="summary-row summary-row--discount">
              <span>{t.cart.pointsUsed}</span>
              <span>−{formatPrice(pointsToUse)} {t.common.rub}</span>
            </div>
          )}
          <div className="summary-row summary-row--total">
            <span>{t.cart.total}</span>
            <span className="price">{formatPrice(total)} {t.common.rub}</span>
          </div>

          {!canCheckout && (
            <p className="error-text min-order-hint">
              {format(t.cart.minOrder, { amount: formatPrice(MIN_ORDER) })}
            </p>
          )}

          <button
            className="btn btn-primary btn-full"
            disabled={!canCheckout}
            onClick={handleCheckout}
          >
            {t.cart.checkout}
          </button>
        </div>
      </div>
    </div>
  );
}
