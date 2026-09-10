import { getProductImage } from '../data/productImages';
import ProductPlaceholder from './ProductPlaceholder';
import './ProductImage.css';

export default function ProductImage({ product, size = 'md', className = '' }) {
  const image = getProductImage(product.id);

  if (image) {
    return (
      <img
        src={image}
        alt=""
        className={`product-image product-image--${size}${className ? ` ${className}` : ''}`}
      />
    );
  }

  return <ProductPlaceholder type={product.imageType} size={size} />;
}
