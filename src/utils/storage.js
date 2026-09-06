const STORAGE_PREFIX = 'finewine_';

export function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function saveJSON(key, value) {
  localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
}

export function generateOrderId() {
  return Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}
