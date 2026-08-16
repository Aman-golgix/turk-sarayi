"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/menu-data";
import { getCartTotal } from "@/lib/session";
import { CartItem } from "@/lib/types";

interface CartBarProps {
  cart: CartItem[];
  tableNumber: number;
}

export default function CartBar({ cart, tableNumber }: CartBarProps) {
  if (cart.length === 0) return null;

  const total = getCartTotal(cart);
  const count = cart.reduce((s, i) => s + i.quantity, 0);

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        padding: "12px 16px",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        background: "linear-gradient(transparent, rgba(253,246,236,0.95) 20%)",
      }}
    >
      <Link
        href={`/t/${tableNumber}/cart`}
        className="btn btn-primary"
        style={{
          width: "100%",
          maxWidth: 480,
          margin: "0 auto",
          display: "flex",
          justifyContent: "space-between",
          boxShadow: "0 -4px 24px rgba(139,26,26,0.25)",
        }}
      >
        <span>
          🛒 View Cart ({count} {count === 1 ? "item" : "items"})
        </span>
        <span style={{ fontWeight: 700 }}>{formatPrice(total)}</span>
      </Link>
    </div>
  );
}
