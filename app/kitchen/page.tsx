"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { formatPrice } from "@/lib/menu-data";
import { Order } from "@/lib/types";

const STATUS_COLORS: Record<Order["status"], string> = {
  pending: "#c62828",
  preparing: "#e65100",
  ready: "#2e7d32",
  delivered: "#6d4c41",
};

export default function KitchenDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const lastSeenIdRef = useRef<string | null>(null);
  const initializedRef = useRef(false);
  const [newOrderAlert, setNewOrderAlert] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [connected, setConnected] = useState(true);

  const playAlert = useCallback(() => {
    if (!soundEnabled) return;
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 880;
      gain.gain.value = 0.3;
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.frequency.value = 1100;
        gain2.gain.value = 0.3;
        osc2.start();
        osc2.stop(ctx.currentTime + 0.2);
      }, 180);
    } catch {
      /* audio not available */
    }
  }, [soundEnabled]);

  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders?status=active");
      const data = await res.json();
      setOrders(data.orders);
      setConnected(true);

      if (data.lastOrderId) {
        if (initializedRef.current && data.lastOrderId !== lastSeenIdRef.current) {
          setNewOrderAlert(true);
          playAlert();
          setTimeout(() => setNewOrderAlert(false), 5000);
        }
        lastSeenIdRef.current = data.lastOrderId;
        initializedRef.current = true;
      }
    } catch {
      setConnected(false);
    }
  }, [playAlert]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000);
    return () => clearInterval(interval);
  }, [fetchOrders]);

  const updateStatus = async (id: string, status: Order["status"]) => {
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchOrders();
  };

  const dismissAlert = () => {
    setNewOrderAlert(false);
    fetch("/api/orders", { method: "DELETE" });
  };

  const formatTime = (iso: string) =>
    new Date(iso).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main
      style={{
        minHeight: "100dvh",
        background: "#1a1210",
        color: "#f5e6d0",
        padding: "16px",
      }}
    >
      {newOrderAlert && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 200,
            background: "#c62828",
            color: "white",
            padding: "16px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            animation: "slideDown 0.3s ease-out",
            boxShadow: "0 4px 24px rgba(198,40,40,0.5)",
          }}
        >
          <span style={{ fontSize: 18, fontWeight: 700 }}>
            🔔 NEW ORDER RECEIVED!
          </span>
          <button
            onClick={dismissAlert}
            style={{
              background: "white",
              color: "#c62828",
              padding: "8px 16px",
              borderRadius: 8,
              fontWeight: 700,
            }}
          >
            Dismiss
          </button>
        </div>
      )}

      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 28,
              color: "#C9A227",
              letterSpacing: "0.1em",
            }}
          >
            👨‍🍳 KITCHEN DASHBOARD
          </h1>
          <p style={{ fontSize: 13, color: "#a1887f", marginTop: 4 }}>
            Turk Sarayi — Live Orders
          </p>
        </div>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: connected ? "#4caf50" : "#c62828",
              }}
            />
            {connected ? "Live" : "Reconnecting..."}
          </span>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              padding: "8px 14px",
              borderRadius: 8,
              background: "#2c1810",
              color: "#f5e6d0",
              fontSize: 13,
            }}
          >
            {soundEnabled ? "🔔 Sound On" : "🔕 Sound Off"}
          </button>
        </div>
      </header>

      {orders.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: "#a1887f",
          }}
        >
          <div style={{ fontSize: 64, marginBottom: 16 }}>⏳</div>
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>Waiting for Orders</h2>
          <p>New orders will appear here automatically.</p>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 16,
          }}
        >
          {orders.map((order) => (
            <article
              key={order.id}
              className={order.status === "pending" ? "pulse" : ""}
              style={{
                background: "#2c1810",
                borderRadius: 16,
                border: `2px solid ${STATUS_COLORS[order.status]}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  background: STATUS_COLORS[order.status],
                  padding: "12px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    color: "white",
                  }}
                >
                  TABLE {order.tableNumber}
                </div>
                <div style={{ textAlign: "right", color: "white" }}>
                  <div style={{ fontSize: 13, opacity: 0.9 }}>
                    {formatTime(order.createdAt)}
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {order.status}
                  </div>
                </div>
              </div>

              <div style={{ padding: 16 }}>
                <div style={{ marginBottom: 12 }}>
                  <strong>{order.customerName}</strong>
                  <span style={{ color: "#a1887f", marginLeft: 8, fontSize: 13 }}>
                    📞 {order.phone}
                  </span>
                </div>

                <div style={{ borderTop: "1px solid #4e342e", paddingTop: 12 }}>
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: 8,
                        fontSize: 14,
                      }}
                    >
                      <span>
                        <strong>{item.quantity}x</strong> {item.name}
                        {item.variant && (
                          <span style={{ color: "#a1887f" }}> ({item.variant})</span>
                        )}
                        {item.instructions && (
                          <div style={{ fontSize: 12, color: "#C9A227", marginTop: 2 }}>
                            ↳ {item.instructions}
                          </div>
                        )}
                      </span>
                      <span>{formatPrice(item.lineTotal)}</span>
                    </div>
                  ))}
                </div>

                {order.orderInstructions && (
                  <div
                    style={{
                      marginTop: 8,
                      padding: 8,
                      background: "#1a1210",
                      borderRadius: 8,
                      fontSize: 13,
                      color: "#C9A227",
                    }}
                  >
                    📝 {order.orderInstructions}
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: 16,
                    paddingTop: 12,
                    borderTop: "1px solid #4e342e",
                    fontWeight: 700,
                    fontSize: 18,
                    color: "#C9A227",
                  }}
                >
                  <span>Total</span>
                  <span>{formatPrice(order.total)}</span>
                </div>

                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  {order.status === "pending" && (
                    <button
                      onClick={() => updateStatus(order.id, "preparing")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        background: "#e65100",
                        color: "white",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Start Preparing
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button
                      onClick={() => updateStatus(order.id, "ready")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        background: "#2e7d32",
                        color: "white",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Mark Ready
                    </button>
                  )}
                  {(order.status === "ready" || order.status === "preparing") && (
                    <button
                      onClick={() => updateStatus(order.id, "delivered")}
                      style={{
                        flex: 1,
                        padding: "10px",
                        borderRadius: 8,
                        background: "#6d4c41",
                        color: "white",
                        fontWeight: 700,
                        fontSize: 13,
                      }}
                    >
                      Delivered
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
