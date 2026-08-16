"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import { formatPrice } from "@/lib/menu-data";
import {
  getSession,
  getCart,
  saveCart,
  clearCart,
  getCartTotal,
  getCartCount,
} from "@/lib/session";
import { CartItem } from "@/lib/types";

export default function CartPage({ params }: { params: { table: string } }) {
  const router = useRouter();
  const tableNumber = parseInt(params.table, 10);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orderInstructions, setOrderInstructions] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const session = getSession();
    if (!session || session.tableNumber !== tableNumber) {
      router.replace(`/t/${tableNumber}`);
      return;
    }
    setCart(getCart());
    setReady(true);
  }, [tableNumber, router]);

  const updateCart = (updated: CartItem[]) => {
    setCart(updated);
    saveCart(updated);
  };

  const updateQuantity = (index: number, delta: number) => {
    const updated = [...cart];
    updated[index].quantity = Math.max(1, updated[index].quantity + delta);
    updateCart(updated);
  };

  const removeItem = (index: number) => {
    updateCart(cart.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    const session = getSession();
    if (!session || cart.length === 0) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableNumber: session.tableNumber,
          customerName: session.customerName,
          phone: session.phone,
          items: cart,
          orderInstructions: orderInstructions.trim() || undefined,
        }),
      });

      if (!res.ok) throw new Error("Order failed");

      const { order } = await res.json();
      clearCart();
      router.push(`/t/${tableNumber}/confirmation?orderId=${order.id}`);
    } catch {
      alert("Failed to submit order. Please try again.");
      setSubmitting(false);
    }
  };

  if (!ready) return null;

  const total = getCartTotal(cart);

  return (
    <main style={{ minHeight: "100dvh", paddingBottom: 120 }}>
      <Header
        tableNumber={tableNumber}
        cartCount={getCartCount(cart)}
        title="Your Cart"
        backHref={`/t/${tableNumber}/menu`}
      />

      <div className="container" style={{ paddingTop: 16 }}>
        {cart.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🛒</div>
            <h2 style={{ color: "var(--burgundy)", marginBottom: 8 }}>Cart is Empty</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>
              Browse our menu and add some delicious items!
            </p>
            <Link href={`/t/${tableNumber}/menu`} className="btn btn-primary">
              Browse Menu
            </Link>
          </div>
        ) : (
          <>
            {cart.map((item, index) => (
              <div
                key={`${item.itemId}-${item.variant}-${index}`}
                className="card"
                style={{ padding: 16, marginBottom: 12 }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: 15, color: "var(--brown)" }}>
                      {item.name}
                    </h3>
                    {item.variant && (
                      <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                        {item.variant}
                      </span>
                    )}
                    {item.instructions && (
                      <p style={{ fontSize: 12, color: "var(--burgundy)", marginTop: 4 }}>
                        Note: {item.instructions}
                      </p>
                    )}
                  </div>
                  <span style={{ fontWeight: 700, color: "var(--burgundy)" }}>
                    {formatPrice(item.unitPrice * item.quantity)}
                  </span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      background: "var(--cream-dark)",
                      borderRadius: 8,
                      padding: "4px 8px",
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(index, -1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: "white",
                        fontSize: 16,
                      }}
                    >
                      −
                    </button>
                    <span style={{ fontWeight: 700 }}>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, 1)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 6,
                        background: "white",
                        fontSize: 16,
                      }}
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => removeItem(index)}
                    style={{ color: "#c62828", fontSize: 13, fontWeight: 600 }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="input-group" style={{ marginTop: 8 }}>
              <label htmlFor="order-notes">Order Instructions (optional)</label>
              <textarea
                id="order-notes"
                rows={2}
                placeholder="Any special requests for the whole order?"
                value={orderInstructions}
                onChange={(e) => setOrderInstructions(e.target.value)}
              />
            </div>

            <div
              className="card"
              style={{ padding: 16, marginTop: 16 }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ color: "var(--text-muted)" }}>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                  fontSize: 18,
                  color: "var(--burgundy)",
                  paddingTop: 12,
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                }}
              >
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </>
        )}
      </div>

      {cart.length > 0 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "12px 16px",
            paddingBottom: "max(12px, env(safe-area-inset-bottom))",
            background: "rgba(253,246,236,0.95)",
            borderTop: "1px solid rgba(0,0,0,0.08)",
          }}
        >
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ width: "100%", maxWidth: 480, margin: "0 auto", display: "flex" }}
          >
            {submitting ? "Placing Order..." : `Place Order — ${formatPrice(total)}`}
          </button>
        </div>
      )}
    </main>
  );
}
