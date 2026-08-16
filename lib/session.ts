"use client";

import { CartItem, CustomerSession } from "./types";

const SESSION_KEY = "turk-sarayi-session";
const CART_KEY = "turk-sarayi-cart";

export function saveSession(session: CustomerSession): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getSession(): CustomerSession | null {
  if (typeof window === "undefined") return null;
  const data = sessionStorage.getItem(SESSION_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data) as CustomerSession;
  } catch {
    return null;
  }
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
}

export function saveCart(cart: CartItem[]): void {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(CART_KEY, JSON.stringify(cart));
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  const data = sessionStorage.getItem(CART_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data) as CartItem[];
  } catch {
    return [];
  }
}

export function clearCart(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(CART_KEY);
}

export function validatePhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-+]/g, "");
  return /^(\d{10}|\d{12})$/.test(cleaned);
}

export function getCartTotal(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
}

export function getCartCount(cart: CartItem[]): number {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}
