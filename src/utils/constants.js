export const PROMO_CODES = {
  FINE10: { type: 'percent', value: 10, label: '−10%' },
  WINE500: { type: 'fixed', value: 500, label: '−500 ₽' },
  GOLD15: { type: 'percent', value: 15, label: '−15%' },
};

export function calculatePromoDiscount(code, subtotal) {
  const promo = PROMO_CODES[code?.toUpperCase()];
  if (!promo) return 0;
  if (promo.type === 'percent') return Math.round(subtotal * (promo.value / 100));
  if (promo.type === 'fixed') return Math.min(promo.value, subtotal);
  return 0;
}

export const DELIVERY_PRICE = 499;
export const FREE_DELIVERY_FROM = 5000;
export const MIN_ORDER = 2000;
export const AUTH_CODE = '123456';
export const POINTS_PER_RUB = 1;

export function getDeliveryCost(subtotal, method) {
  if (method === 'pickup') return 0;
  if (subtotal >= FREE_DELIVERY_FROM) return 0;
  return DELIVERY_PRICE;
}

export function getLoyaltyTier(totalPoints) {
  if (totalPoints >= 15000) return 'platinum';
  if (totalPoints >= 5000) return 'gold';
  return 'silver';
}

export function getTierThreshold(tier) {
  if (tier === 'gold') return 5000;
  if (tier === 'platinum') return 15000;
  return 0;
}

export function getNextTier(currentTier) {
  if (currentTier === 'silver') return 'gold';
  if (currentTier === 'gold') return 'platinum';
  return null;
}

export function formatPrice(amount) {
  return new Intl.NumberFormat('ru-RU').format(amount);
}

export function validatePhone(phone) {
  return /^\+7\d{10}$/.test(phone);
}

export function maskCardNumber(value) {
  const digits = value.replace(/\D/g, '').slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

export function maskExpiry(value) {
  const digits = value.replace(/\D/g, '').slice(0, 4);
  if (digits.length <= 2) return digits;
  return digits.slice(0, 2) + '/' + digits.slice(2);
}
