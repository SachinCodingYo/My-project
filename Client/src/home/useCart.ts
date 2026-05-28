// hooks/useCart.ts  (and CartContext.tsx — combine or split as you prefer)
//
// Usage:
//   1. Wrap your app with <CartProvider> in main.tsx / App.tsx
//   2. Call useCart() in any component

import React, { createContext, useContext, useState, useCallback } from "react";

// ── Types ────────────────────────────────────────────────────────
export interface CartItem {
  plan: any;       // your Plan type — replace `any` with your Plan interface
  quantity: number;
}

interface CartContextValue {
  cartItems: CartItem[];
  addToCart: (args: { plan: any; quantity: number }) => void;
  removeFromCart: (planId: string) => void;
  updateQty: (planId: string, qty: number) => void;
  clearCart: () => void;
}

// ── Context ──────────────────────────────────────────────────────
const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ─────────────────────────────────────────────────────
export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  /** Add a plan to cart. If it already exists, increment quantity. */
  const addToCart = useCallback(({ plan, quantity }: { plan: any; quantity: number }) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.plan._id === plan._id);
      if (existing) {
        return prev.map((i) =>
          i.plan._id === plan._id
            ? { ...i, quantity: Math.min(10, i.quantity + quantity) }
            : i
        );
      }
      return [...prev, { plan, quantity }];
    });
  }, []);

  /** Remove a plan entirely by plan ID. */
  const removeFromCart = useCallback((planId: string) => {
    setCartItems((prev) => prev.filter((i) => i.plan._id !== planId));
  }, []);

  /** Set a specific quantity. Removes item if qty ≤ 0. */
  const updateQty = useCallback((planId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems((prev) => prev.filter((i) => i.plan._id !== planId));
    } else {
      setCartItems((prev) =>
        prev.map((i) =>
          i.plan._id === planId ? { ...i, quantity: Math.min(10, qty) } : i
        )
      );
    }
  }, []);

  /** Remove all items from cart. */
  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQty, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ── Hook ─────────────────────────────────────────────────────────
export const useCart = (): CartContextValue => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
};