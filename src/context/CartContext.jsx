import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { loadJSON, saveJSON, generateOrderId } from '../utils/storage';
import { INITIAL_PRODUCTS } from '../data/products';
import {
  calculatePromoDiscount,
  getDeliveryCost,
  MIN_ORDER,
  POINTS_PER_RUB,
} from '../utils/constants';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [products, setProducts] = useState(() => {
    const saved = loadJSON('products', null);
    return saved || INITIAL_PRODUCTS;
  });

  const [cart, setCart] = useState(() => loadJSON('cart', {}));
  const [promoCode, setPromoCode] = useState(() => loadJSON('promo', ''));
  const [promoError, setPromoError] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [orders, setOrders] = useState(() => loadJSON('orders', []));

  useEffect(() => saveJSON('products', products), [products]);
  useEffect(() => saveJSON('cart', cart), [cart]);
  useEffect(() => saveJSON('promo', promoCode), [promoCode]);
  useEffect(() => saveJSON('orders', orders), [orders]);

  const cartItems = useMemo(() => {
    return Object.entries(cart)
      .map(([id, qty]) => {
        const product = products.find((p) => p.id === id);
        if (!product) return null;
        return { product, quantity: qty };
      })
      .filter(Boolean);
  }, [cart, products]);

  const cartCount = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.quantity, 0),
    [cartItems]
  );

  const subtotal = useMemo(
    () => cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cartItems]
  );

  const promoDiscount = useMemo(
    () => calculatePromoDiscount(promoCode, subtotal),
    [promoCode, subtotal]
  );

  const getTotal = useCallback(
    (deliveryMethod = 'pickup') => {
      const afterPromo = Math.max(0, subtotal - promoDiscount);
      const afterPoints = Math.max(0, afterPromo - pointsToUse);
      const delivery = getDeliveryCost(afterPoints, deliveryMethod);
      return {
        subtotal,
        promoDiscount,
        pointsUsed: pointsToUse,
        afterDiscount: afterPoints,
        delivery,
        total: afterPoints + delivery,
      };
    },
    [subtotal, promoDiscount, pointsToUse]
  );

  const addToCart = useCallback(
    (productId, quantity = 1) => {
      const product = products.find((p) => p.id === productId);
      if (!product || product.stock <= 0) return false;
      setCart((prev) => {
        const current = prev[productId] || 0;
        const newQty = Math.min(current + quantity, product.stock);
        if (newQty <= 0) return prev;
        return { ...prev, [productId]: newQty };
      });
      return true;
    },
    [products]
  );

  const updateQuantity = useCallback(
    (productId, quantity) => {
      const product = products.find((p) => p.id === productId);
      if (!product) return;
      if (quantity <= 0) {
        setCart((prev) => {
          const next = { ...prev };
          delete next[productId];
          return next;
        });
        return;
      }
      setCart((prev) => ({
        ...prev,
        [productId]: Math.min(quantity, product.stock),
      }));
    },
    [products]
  );

  const removeFromCart = useCallback((productId) => {
    setCart((prev) => {
      const next = { ...prev };
      delete next[productId];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    setPromoCode('');
    setPointsToUse(0);
  }, []);

  const applyPromo = useCallback(
    (code) => {
      const discount = calculatePromoDiscount(code, subtotal);
      if (discount > 0 || code === '') {
        setPromoCode(code.toUpperCase());
        setPromoError(false);
        return true;
      }
      setPromoError(true);
      return false;
    },
    [subtotal]
  );

  const placeOrder = useCallback(
    ({ deliveryMethod, name, phone, address, user, spendPointsFn, addPointsFn }) => {
      const totals = getTotal(deliveryMethod);
      if (totals.afterDiscount < MIN_ORDER) return { ok: false, error: 'minOrder' };

      const orderItems = cartItems.map(({ product, quantity }) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity,
      }));

      setProducts((prev) =>
        prev.map((p) => {
          const cartQty = cart[p.id];
          if (!cartQty) return p;
          return { ...p, stock: Math.max(0, p.stock - cartQty) };
        })
      );

      const earnedPoints = Math.round(totals.total * POINTS_PER_RUB);
      if (pointsToUse > 0) spendPointsFn(pointsToUse);
      addPointsFn(earnedPoints);

      const order = {
        id: generateOrderId(),
        date: new Date().toISOString(),
        items: orderItems,
        deliveryMethod,
        name,
        phone,
        address: deliveryMethod === 'delivery' ? address : null,
        promoCode: promoCode || null,
        promoDiscount: totals.promoDiscount,
        pointsUsed: totals.pointsUsed,
        pointsEarned: earnedPoints,
        delivery: totals.delivery,
        subtotal: totals.subtotal,
        total: totals.total,
        status: 'completed',
      };

      setOrders((prev) => [order, ...prev]);
      clearCart();
      return { ok: true, order };
    },
    [cartItems, cart, getTotal, promoCode, pointsToUse, clearCart]
  );

  const getCartQuantity = useCallback((productId) => cart[productId] || 0, [cart]);

  const canCheckout = subtotal >= MIN_ORDER;

  return (
    <CartContext.Provider
      value={{
        products,
        cartItems,
        cartCount,
        subtotal,
        promoCode,
        promoError,
        promoDiscount,
        pointsToUse,
        setPointsToUse,
        orders,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromo,
        getTotal,
        placeOrder,
        getCartQuantity,
        canCheckout,
        MIN_ORDER,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
