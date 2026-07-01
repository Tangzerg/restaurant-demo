export const deliveryInfo = {
  etaMin: 25,
  etaMax: 35, // average delivery estimate, in minutes
};

export const dishes = [
  { id: 1, name: "Bruschetta", description: "Toasted bread with tomatoes, garlic and fresh basil", price: 6.5, category: "Starters", emoji: "🍞", moods: ["Voyage", "Réconfort"], allergens: ["gluten"], trending: true },
  { id: 2, name: "Soup of the Day", description: "Ask your waiter for today's homemade soup", price: 5.0, category: "Starters", emoji: "🍲", moods: ["Réconfort", "Healthy"], allergens: [], trending: false },
  { id: 3, name: "Garlic Prawns", description: "Sautéed king prawns in garlic butter and white wine", price: 9.5, category: "Starters", emoji: "🦐", moods: ["Gourmand", "Voyage"], allergens: ["shellfish"], trending: false },
  { id: 4, name: "Caesar Salad", description: "Romaine lettuce, parmesan, croutons and Caesar dressing", price: 7.0, category: "Starters", emoji: "🥗", moods: ["Healthy"], allergens: ["gluten", "dairy", "egg"], trending: true },
  { id: 5, name: "Classic Burger", description: "Beef patty, cheddar, lettuce, tomato and pickles", price: 14.0, category: "Mains", emoji: "🍔", moods: ["Réconfort", "Gourmand"], allergens: ["gluten", "dairy"], trending: true },
  { id: 6, name: "Grilled Salmon", description: "Atlantic salmon with lemon butter sauce and seasonal vegetables", price: 18.5, category: "Mains", emoji: "🐟", moods: ["Healthy", "Voyage"], allergens: ["fish"], trending: false },
  { id: 7, name: "Margherita Pizza", description: "San Marzano tomato sauce, fresh mozzarella and basil", price: 13.0, category: "Mains", emoji: "🍕", moods: ["Réconfort", "Voyage"], allergens: ["gluten", "dairy"], trending: true },
  { id: 8, name: "Mushroom Risotto", description: "Arborio rice with wild mushrooms, white wine and parmesan", price: 15.0, category: "Mains", emoji: "🍚", moods: ["Réconfort", "Gourmand"], allergens: ["dairy"], trending: false },
  { id: 9, name: "Chicken Tikka Masala", description: "Tender chicken in a rich tomato and cream sauce with rice", price: 16.0, category: "Mains", emoji: "🍛", moods: ["Voyage", "Gourmand"], allergens: ["dairy"], trending: false },
  { id: 10, name: "Chocolate Lava Cake", description: "Warm chocolate cake with a molten centre and vanilla ice cream", price: 7.5, category: "Desserts", emoji: "🍫", moods: ["Gourmand", "Réconfort"], allergens: ["gluten", "dairy", "egg"], trending: true },
  { id: 11, name: "Crème Brûlée", description: "Classic French vanilla custard with a caramelised sugar crust", price: 6.5, category: "Desserts", emoji: "🍮", moods: ["Gourmand"], allergens: ["dairy", "egg"], trending: false },
  { id: 12, name: "Tiramisu", description: "Italian coffee-soaked ladyfingers with mascarpone cream", price: 7.0, category: "Desserts", emoji: "☕", moods: ["Gourmand", "Réconfort"], allergens: ["dairy", "egg", "gluten"], trending: false },
];
