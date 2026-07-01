import { describe, it, expect } from "vitest";
import { getSuggestions, getFallbackFavorites, REROLL_MAX } from "../surpriseEngine";

const dishes = [
  { id: 1, name: "A", price: 10, category: "Starters", moods: ["Healthy"], allergens: [], trending: true },
  { id: 2, name: "B", price: 12, category: "Starters", moods: ["Gourmand"], allergens: ["dairy"], trending: false },
  { id: 3, name: "C", price: 8, category: "Starters", moods: ["Healthy", "Réconfort"], allergens: [], trending: false },
  { id: 4, name: "D", price: 30, category: "Starters", moods: ["Gourmand"], allergens: [], trending: false },
  { id: 5, name: "E", price: 20, category: "Mains", moods: ["Voyage"], allergens: ["fish"], trending: true },
  { id: 6, name: "F", price: 22, category: "Mains", moods: ["Gourmand"], allergens: [], trending: false },
];

describe("getSuggestions", () => {
  it("returns picks all matching the requested category", () => {
    const { picks } = getSuggestions({ category: "Starters", mood: "Healthy", dishes, history: [] });
    expect(picks.every((d) => d.category === "Starters")).toBe(true);
  });

  it("cold start: uses trending dishes as safe bets when history is empty", () => {
    const { picks } = getSuggestions({ category: "Starters", mood: "Healthy", dishes, history: [] });
    expect(picks[0].trending).toBe(true);
  });

  it("with history: prefers frequently ordered dishes as safe bets", () => {
    const { picks } = getSuggestions({
      category: "Starters",
      mood: "Healthy",
      dishes,
      history: [3, 3, 3, 1],
    });
    expect(picks.slice(0, 2).some((d) => d.id === 3)).toBe(true);
  });

  it("excludeIds are never re-proposed", () => {
    const { picks } = getSuggestions({
      category: "Starters",
      mood: "Healthy",
      dishes,
      history: [3, 3, 1],
      excludeIds: [1, 3],
    });
    expect(picks.some((d) => [1, 3].includes(d.id))).toBe(false);
  });

  it("filters out dishes above budget (avgBasket * 1.15)", () => {
    const { picks } = getSuggestions({
      category: "Starters",
      mood: "Gourmand",
      dishes,
      history: [],
      avgBasket: 10,
    });
    expect(picks.some((d) => d.id === 4)).toBe(false);
  });

  it("does not filter by allergens when allergens list is empty", () => {
    const { picks } = getSuggestions({
      category: "Starters",
      mood: "Gourmand",
      dishes,
      history: [],
      allergens: [],
    });
    expect(picks.some((d) => d.id === 2)).toBe(true);
  });

  it("filters out dishes containing a declared allergen", () => {
    const { picks } = getSuggestions({
      category: "Starters",
      mood: "Gourmand",
      dishes,
      history: [],
      allergens: ["dairy"],
    });
    expect(picks.some((d) => d.id === 2)).toBe(false);
  });
});

describe("getFallbackFavorites", () => {
  it("returns trending dishes when there is no history", () => {
    const { picks, isFallback } = getFallbackFavorites({ dishes, history: [] });
    expect(isFallback).toBe(true);
    expect(picks.every((d) => d.trending)).toBe(true);
  });

  it("returns most-ordered dishes ranked by frequency when history exists", () => {
    const { picks } = getFallbackFavorites({ dishes, history: [3, 3, 1, 1, 1, 5] });
    expect(picks[0].id).toBe(1);
  });
});

describe("reroll limit", () => {
  it("REROLL_MAX is 2", () => {
    expect(REROLL_MAX).toBe(2);
  });
});
