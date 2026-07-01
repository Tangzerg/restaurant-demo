import { useState } from "react";
import { getSuggestions, getFallbackFavorites, REROLL_MAX } from "../surpriseEngine";
import { getOrderHistory, getAvgBasket, getAllergens, isColdStart } from "../mockUserProfile";

const CATEGORIES = ["Starters", "Mains", "Desserts"];
const MOODS = [
  { key: "Réconfort", emoji: "🫂" },
  { key: "Healthy", emoji: "🥗" },
  { key: "Voyage", emoji: "✈️" },
  { key: "Gourmand", emoji: "🍷" },
];

export default function SurpriseModal({ dishes, onAddToCart, onClose }) {
  const [step, setStep] = useState("category");
  const [category, setCategory] = useState(null);
  const [mood, setMood] = useState(null);
  const [rerollCount, setRerollCount] = useState(0);
  const [shownIds, setShownIds] = useState([]);
  const [result, setResult] = useState(null);
  const [addedName, setAddedName] = useState(null);

  const coldStart = isColdStart();
  const history = coldStart ? [] : getOrderHistory();
  const avgBasket = getAvgBasket(dishes, history);
  const allergens = getAllergens();

  function pickCategory(cat) {
    setCategory(cat);
    setStep("mood");
  }

  function pickMood(selectedMood) {
    setMood(selectedMood);
    const res = getSuggestions({ category, mood: selectedMood, dishes, history, avgBasket, allergens, excludeIds: [] });
    if (res.picks.length === 0) {
      setResult(getFallbackFavorites({ dishes, history }));
      setStep("fallback");
      return;
    }
    setShownIds(res.picks.map((d) => d.id));
    setResult(res);
    setStep("results");
  }

  function reroll() {
    const res = getSuggestions({ category, mood, dishes, history, avgBasket, allergens, excludeIds: shownIds });
    if (res.picks.length === 0) {
      showFallback();
      return;
    }
    setShownIds((ids) => [...ids, ...res.picks.map((d) => d.id)]);
    setResult(res);
    setRerollCount((n) => n + 1);
  }

  function showFallback() {
    setResult(getFallbackFavorites({ dishes, history }));
    setStep("fallback");
  }

  function handleAdd(dish) {
    onAddToCart(dish);
    setAddedName(dish.name);
    setTimeout(onClose, 900);
  }

  function handleOverlayClick() {
    onClose();
  }

  function renderResultCards() {
    return (
      <div className="surprise-result-grid">
        {result.picks.map((dish) => (
          <div key={dish.id} className="surprise-dish-card">
            <span className="dish-emoji">{dish.emoji}</span>
            <h3>{dish.name}</h3>
            <p>{dish.description}</p>
            <span className="dish-price">€{dish.price.toFixed(2)}</span>
            <button className="modal-btn-primary" onClick={() => handleAdd(dish)}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {step === "category" && (
          <div className="modal-step">
            <h2 className="modal-title">Surprends-moi ✨</h2>
            <p className="surprise-subtitle">Quelle envie aujourd'hui ?</p>
            <div className="surprise-choice-grid">
              {CATEGORIES.map((cat) => (
                <button key={cat} className="surprise-choice-card" onClick={() => pickCategory(cat)}>
                  {cat}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Annuler</button>
            </div>
          </div>
        )}

        {step === "mood" && (
          <div className="modal-step">
            <h2 className="modal-title">Surprends-moi ✨</h2>
            <p className="surprise-subtitle">Quelle humeur ?</p>
            <div className="surprise-choice-grid">
              {MOODS.map((m) => (
                <button key={m.key} className="surprise-choice-card" onClick={() => pickMood(m.key)}>
                  <span className="surprise-choice-emoji">{m.emoji}</span> {m.key}
                </button>
              ))}
            </div>
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={() => setStep("category")}>Retour</button>
            </div>
          </div>
        )}

        {step === "results" && result && (
          <div className="modal-step">
            <h2 className="modal-title">Voici pour toi ✨</h2>
            {renderResultCards()}
            {addedName && <p className="surprise-toast">{addedName} ajouté au panier !</p>}
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Fermer</button>
              {rerollCount < REROLL_MAX ? (
                <button className="modal-btn-primary" onClick={reroll}>
                  Relancer ({REROLL_MAX - rerollCount} restant{REROLL_MAX - rerollCount > 1 ? "s" : ""})
                </button>
              ) : (
                <button className="modal-btn-primary" onClick={showFallback}>
                  Voir mes valeurs sûres
                </button>
              )}
            </div>
          </div>
        )}

        {step === "fallback" && result && (
          <div className="modal-step">
            <h2 className="modal-title">{coldStart ? "Nos plats tendance" : "Vos valeurs sûres"}</h2>
            {renderResultCards()}
            {addedName && <p className="surprise-toast">{addedName} ajouté au panier !</p>}
            <div className="modal-actions">
              <button className="modal-btn-secondary" onClick={onClose}>Fermer</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
