import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage, useLocalized } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice, maskCardNumber, maskExpiry } from '../utils/constants';
import ProductImage from '../components/ProductImage';
import './Checkout.css';

export default function Checkout() {
  const { t, format } = useLanguage();
  const localize = useLocalized();
  const navigate = useNavigate();
  const { user, isAuthenticated, openAuth, updateUser, spendPoints, addPoints } = useAuth();
  const { cartItems, getTotal, placeOrder, promoDiscount, pointsToUse, subtotal } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [processing, setProcessing] = useState(false);
  const [errors, setErrors] = useState({});

  const totals = getTotal(deliveryMethod);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="container page checkout-auth">
        <h1 className="page-title">{t.checkout.title}</h1>
        <p className="checkout-auth__text">{t.checkout.authRequired}</p>
        <button className="btn btn-primary" onClick={openAuth}>
          {t.checkout.login}
        </button>
        <Link to="/cart" className="btn btn-ghost" style={{ marginTop: 12 }}>
          {t.checkout.backToCart}
        </Link>
      </div>
    );
  }

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = true;
    if (!phone.trim()) errs.phone = true;
    if (deliveryMethod === 'delivery' && !address.trim()) errs.address = true;
    if (cardNumber.replace(/\s/g, '').length < 16) errs.card = true;
    if (cardExpiry.length < 5) errs.card = true;
    if (cardCvc.length < 3) errs.card = true;
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setProcessing(true);
    await new Promise((r) => setTimeout(r, 1800));

    updateUser({ name, phone });

    const spendFn = (amount) => {
      spendPoints(amount);
    };

    const result = placeOrder({
      deliveryMethod,
      name,
      phone,
      address,
      user,
      spendPointsFn: spendFn,
      addPointsFn: addPoints,
    });

    setProcessing(false);

    if (result.ok) {
      navigate(`/success/${result.order.id}`);
    }
  };

  return (
    <div className="container page">
      <h1 className="page-title">{t.checkout.title}</h1>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePay}>
          <section className="checkout-section card">
            <h2>{t.checkout.deliveryMethod}</h2>
            <div className="delivery-options">
              <label className={`delivery-option ${deliveryMethod === 'pickup' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="pickup"
                  checked={deliveryMethod === 'pickup'}
                  onChange={() => setDeliveryMethod('pickup')}
                />
                <div>
                  <strong>{t.checkout.pickup}</strong>
                  <p>{t.checkout.pickupAddress}</p>
                  <span className="delivery-price">{t.checkout.pickupFree}</span>
                </div>
              </label>
              <label className={`delivery-option ${deliveryMethod === 'delivery' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="delivery"
                  value="delivery"
                  checked={deliveryMethod === 'delivery'}
                  onChange={() => setDeliveryMethod('delivery')}
                />
                <div>
                  <strong>{t.checkout.delivery}</strong>
                  <p>{t.checkout.deliveryInfo}</p>
                  <span className="delivery-price">
                    {totals.delivery === 0
                      ? t.cart.freeDelivery
                      : `${formatPrice(totals.delivery)} ${t.common.rub}`}
                  </span>
                </div>
              </label>
            </div>
          </section>

          <section className="checkout-section card">
            <h2>{t.checkout.contact}</h2>
            <div className="form-group">
              <label className="label">{t.checkout.name}</label>
              <input
                className={`input ${errors.name ? 'input-error' : ''}`}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.checkout.namePlaceholder}
              />
            </div>
            <div className="form-group">
              <label className="label">{t.checkout.phone}</label>
              <input
                className={`input ${errors.phone ? 'input-error' : ''}`}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                readOnly={!!user?.phone}
              />
            </div>
            {deliveryMethod === 'delivery' && (
              <div className="form-group">
                <label className="label">{t.checkout.address}</label>
                <textarea
                  className={`input ${errors.address ? 'input-error' : ''}`}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={t.checkout.addressPlaceholder}
                  rows={3}
                />
              </div>
            )}
          </section>

          <section className="checkout-section card">
            <h2>{t.checkout.payment}</h2>
            <div className="form-group">
              <label className="label">{t.checkout.cardNumber}</label>
              <input
                className={`input ${errors.card ? 'input-error' : ''}`}
                value={cardNumber}
                onChange={(e) => setCardNumber(maskCardNumber(e.target.value))}
                placeholder="0000 0000 0000 0000"
                inputMode="numeric"
              />
            </div>
            <div className="card-row">
              <div className="form-group">
                <label className="label">{t.checkout.cardExpiry}</label>
                <input
                  className={`input ${errors.card ? 'input-error' : ''}`}
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(maskExpiry(e.target.value))}
                  placeholder="MM/YY"
                  inputMode="numeric"
                />
              </div>
              <div className="form-group">
                <label className="label">{t.checkout.cardCvc}</label>
                <input
                  className={`input ${errors.card ? 'input-error' : ''}`}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 3))}
                  placeholder="•••"
                  inputMode="numeric"
                />
              </div>
            </div>
          </section>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={processing}
          >
            {processing ? t.checkout.processing : t.checkout.pay}
          </button>

          <Link to="/cart" className="btn btn-ghost btn-full">
            {t.checkout.backToCart}
          </Link>
        </form>

        <aside className="checkout-summary card">
          <h2>{t.checkout.summary}</h2>
          <div className="checkout-items">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="checkout-item">
                <ProductImage product={product} size="sm" />
                <div>
                  <p className="checkout-item__name">{localize(product.name)}</p>
                  <p className="checkout-item__qty">× {quantity}</p>
                </div>
                <span className="price">
                  {formatPrice(product.price * quantity)} {t.common.rub}
                </span>
              </div>
            ))}
          </div>
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
          <div className="summary-row">
            <span>{t.cart.delivery}</span>
            <span>
              {totals.delivery === 0
                ? t.cart.freeDelivery
                : `${formatPrice(totals.delivery)} ${t.common.rub}`}
            </span>
          </div>
          <div className="summary-row summary-row--total">
            <span>{t.cart.total}</span>
            <span className="price">{formatPrice(totals.total)} {t.common.rub}</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
