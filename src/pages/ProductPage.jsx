import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage, useLocalized } from '../i18n/LanguageContext';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/constants';
import ProductImage from '../components/ProductImage';
import './ProductPage.css';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, format } = useLanguage();
  const localize = useLocalized();
  const { products, addToCart, getCartQuantity, updateQuantity } = useCart();

  const product = products.find((p) => p.id === id);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="container page">
        <p>Product not found</p>
        <Link to="/catalog">{t.product.back}</Link>
      </div>
    );
  }

  const cartQty = getCartQuantity(product.id);
  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 3;
  const maxQty = product.stock;

  const handleAdd = () => {
    if (outOfStock) return;
    if (cartQty > 0) {
      updateQuantity(product.id, Math.min(cartQty + quantity, maxQty));
    } else {
      addToCart(product.id, quantity);
    }
    navigate('/cart');
  };

  const getTypeLabel = () => {
    if (product.category === 'whisky') return t.types.whisky;
    if (!product.alcoholic) return t.types.nonAlcoholic;
    if (product.wineType) return t.types[product.wineType] || product.wineType;
    return '—';
  };

  const specs = [
    { label: t.product.country, value: localize(product.country) },
    { label: t.product.region, value: localize(product.region) },
    { label: t.product.grape, value: localize(product.grape) },
    product.year && { label: t.product.year, value: product.year },
    product.abv > 0 && { label: t.product.abv, value: `${product.abv}%` },
    { label: t.product.type, value: getTypeLabel() },
    { label: t.product.volume, value: `${product.volume} ${t.product.ml}` },
  ].filter(Boolean);

  return (
    <div className="container page product-page">
      <Link to="/catalog" className="product-page__back">
        ← {t.product.back}
      </Link>

      <div className="product-page__layout">
        <div className="product-page__gallery">
          <ProductImage product={product} size="lg" />
          {lowStock && (
            <span className="product-page__stock badge badge-danger">
              {format(t.product.lowStock, { count: product.stock })}
            </span>
          )}
        </div>

        <div className="product-page__info">
          <h1 className="product-page__name">{localize(product.name)}</h1>
          <p className="product-page__price price price-lg">
            {formatPrice(product.price)} {t.common.rub}
          </p>

          <div className="product-page__specs">
            {specs.map((spec) => (
              <div key={spec.label} className="spec-row">
                <span className="spec-row__label">{spec.label}</span>
                <span className="spec-row__value">{spec.value}</span>
              </div>
            ))}
          </div>

          <div className="product-page__desc">
            <h3>{t.product.description}</h3>
            <p>{localize(product.description)}</p>
          </div>

          {!outOfStock && (
            <div className="product-page__actions">
              <div className="qty-selector">
                <button
                  className="qty-selector__btn"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease"
                >
                  −
                </button>
                <span className="qty-selector__value">{quantity}</span>
                <button
                  className="qty-selector__btn"
                  onClick={() => setQuantity((q) => Math.min(maxQty - cartQty, q + 1))}
                  aria-label="Increase"
                >
                  +
                </button>
              </div>
              <button className="btn btn-primary btn-full" onClick={handleAdd}>
                {cartQty > 0 ? t.product.inCart : t.product.addToCart}
              </button>
            </div>
          )}

          {outOfStock && (
            <button className="btn btn-primary btn-full" disabled>
              {t.product.outOfStock}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
