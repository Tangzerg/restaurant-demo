export const REROLL_MAX = 2;
const BUDGET_MARGIN = 1.15;

function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function dedupeById(items) {
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}

function withinBudget(dish, avgBasket) {
  if (avgBasket == null) return true;
  return dish.price <= avgBasket * BUDGET_MARGIN;
}

function withoutAllergens(dish, allergens) {
  if (!allergens || allergens.length === 0) return true;
  return !dish.allergens?.some((a) => allergens.includes(a));
}

function matchesMood(dish, mood) {
  return Boolean(dish.moods?.includes(mood));
}

export function getSuggestions({
  category,
  mood,
  dishes,
  history = [],
  avgBasket = null,
  allergens = [],
  excludeIds = [],
}) {
  const pool = dishes.filter(
    (d) =>
      d.category === category &&
      withinBudget(d, avgBasket) &&
      withoutAllergens(d, allergens) &&
      !excludeIds.includes(d.id)
  );

  const isColdStart = history.length === 0;

  const orderCounts = history.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});

  let safeBetPool = isColdStart
    ? pool.filter((d) => d.trending)
    : [...pool].sort((a, b) => (orderCounts[b.id] || 0) - (orderCounts[a.id] || 0));

  safeBetPool = [
    ...safeBetPool.filter((d) => matchesMood(d, mood)),
    ...safeBetPool.filter((d) => !matchesMood(d, mood)),
  ];

  const safeBets = dedupeById(safeBetPool).slice(0, 2);

  const neverOrdered = pool.filter(
    (d) => !history.includes(d.id) && !safeBets.some((s) => s.id === d.id)
  );
  let discoveryPool = neverOrdered.filter((d) => matchesMood(d, mood));
  if (discoveryPool.length === 0) discoveryPool = neverOrdered;
  if (discoveryPool.length === 0) {
    discoveryPool = pool.filter((d) => !safeBets.some((s) => s.id === d.id));
  }
  const discovery = shuffle(discoveryPool)[0];

  let picks = discovery ? [...safeBets, discovery] : [...safeBets];

  if (picks.length < 3) {
    const remaining = pool.filter((d) => !picks.some((p) => p.id === d.id));
    picks = [...picks, ...shuffle(remaining)];
  }

  return { picks: dedupeById(picks).slice(0, 3), isFallback: false };
}

export function getFallbackFavorites({ dishes, history = [] }) {
  if (history.length === 0) {
    const trending = dishes.filter((d) => d.trending);
    return { picks: shuffle(trending).slice(0, 3), isFallback: true };
  }

  const orderCounts = history.reduce((acc, id) => {
    acc[id] = (acc[id] || 0) + 1;
    return acc;
  }, {});
  const byId = new Map(dishes.map((d) => [d.id, d]));
  const ranked = [...new Set(history)]
    .map((id) => byId.get(id))
    .filter(Boolean)
    .sort((a, b) => orderCounts[b.id] - orderCounts[a.id]);

  const picks =
    ranked.length >= 3
      ? ranked.slice(0, 3)
      : [...ranked, ...dishes.filter((d) => d.trending && !ranked.includes(d))].slice(0, 3);

  return { picks, isFallback: true };
}
