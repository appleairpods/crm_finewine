import { Link } from 'react-router-dom';
import { useLanguage, useLocalized } from '../i18n/LanguageContext';
import { formatPrice } from '../utils/constants';
import ProductImage from './ProductImage';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { t, format } = useLanguage();
  const localize = useLocalized();

  const outOfStock = product.stock <= 0;
  const lowStock = product.stock > 0 && product.stock <= 3;

  return (
    <Link to={`/product/${product.id}`} className="product-card card">
      <div className="product-card__image">
        <ProductImage product={product} size="md" />
        {lowStock && (
          <span className="product-card__stock badge badge-danger">
            {format(t.product.lowStock, { count: product.stock })}
          </span>
        )}
        {outOfStock && (
          <span className="product-card__stock badge badge-danger">
            {t.product.outOfStock}
          </span>
        )}
      </div>
      <div className="product-card__body">
        <h3 className="product-card__name">{localize(product.name)}</h3>
        <p className="product-card__meta">
          {localize(product.country)}
          {product.year && ` · ${product.year}`}
        </p>
        <p className="product-card__price price">
          {formatPrice(product.price)} {t.common.rub}
        </p>
      </div>
    </Link>
  );
}
