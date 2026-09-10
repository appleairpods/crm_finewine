import w1 from '../assets/products/w1.jpg';
import w2 from '../assets/products/w2.jpg';
import w3 from '../assets/products/w3.jpg';
import w4 from '../assets/products/w4.jpg';
import w5 from '../assets/products/w5.jpg';
import w6 from '../assets/products/w6.jpg';
import w7 from '../assets/products/w7.jpg';
import w8 from '../assets/products/w8.jpg';
import w9 from '../assets/products/w9.jpg';
import w10 from '../assets/products/w10.jpg';
import w11 from '../assets/products/w11.jpg';
import w12 from '../assets/products/w12.jpg';
import w13 from '../assets/products/w13.jpg';
import w14 from '../assets/products/w14.jpg';
import w15 from '../assets/products/w15.jpg';
import w16 from '../assets/products/w16.jpg';
import wh1 from '../assets/products/wh1.jpg';
import wh2 from '../assets/products/wh2.jpg';
import wh3 from '../assets/products/wh3.jpg';
import wh4 from '../assets/products/wh4.jpg';
import wh5 from '../assets/products/wh5.jpg';
import wh6 from '../assets/products/wh6.jpg';
import wh7 from '../assets/products/wh7.jpg';
import na1 from '../assets/products/na1.jpg';
import na2 from '../assets/products/na2.jpg';
import na3 from '../assets/products/na3.jpg';
import na4 from '../assets/products/na4.jpg';
import na5 from '../assets/products/na5.jpg';

const PRODUCT_IMAGES = {
  w1,
  w2,
  w3,
  w4,
  w5,
  w6,
  w7,
  w8,
  w9,
  w10,
  w11,
  w12,
  w13,
  w14,
  w15,
  w16,
  wh1,
  wh2,
  wh3,
  wh4,
  wh5,
  wh6,
  wh7,
  na1,
  na2,
  na3,
  na4,
  na5,
};

export function getProductImage(productId) {
  return PRODUCT_IMAGES[productId] ?? null;
}
