const STORAGE_KEY = "surprise-me:order-history";

const SEED_HISTORY = [5, 5, 7, 10, 9];

const SEED_ALLERGENS = [];

export function getOrderHistory() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return SEED_HISTORY;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return SEED_HISTORY;
  }
}

export function appendOrderHistory(dishIds) {
  const updated = [...getOrderHistory(), ...dishIds];
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // localStorage unavailable (private mode, quota) — fail silently
  }
  return updated;
}

export function getAllergens() {
  return SEED_ALLERGENS;
}

export function getAvgBasket(dishes, history = getOrderHistory()) {
  if (history.length === 0) return null;
  const priceById = new Map(dishes.map((d) => [d.id, d.price]));
  const total = history.reduce((sum, id) => sum + (priceById.get(id) ?? 0), 0);
  return total / history.length;
}

export function isColdStart(history = getOrderHistory()) {
  if (new URLSearchParams(window.location.search).get("coldstart") === "1") {
    return true;
  }
  return history.length === 0;
}
