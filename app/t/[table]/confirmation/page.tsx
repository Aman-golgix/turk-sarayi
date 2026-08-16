"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/Logo";
import { formatPrice } from "@/lib/menu-data";
import { getSession } from "@/lib/session";
import { Order } from "@/lib/types";

function ConfirmationContent({ tableNumber }: { tableNumber: number }) {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const session = getSession();

  useEffect(() => {
    if (!orderId) return;
    fetch("/api/orders")
      .then((r) => r.json())
      .then((data) => {
        const found = data.orders.find((o: Order) => o.id === orderId);
        if (found) setOrder(found);
      });
  }, [orderId]);

  return (
    <main className="geometric-bg" style={{ minHeight: "100dvh", padding: "32px 16px" }}>
      <div className="container animate-in" style={{ textAlign: "center" }}>
        <Logo size="md" />

        <div
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%",
            background: "var(--success)",
            color: "white",
            fontSize: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "32px auto 16px",
          }}
        >
          ✓
        </div>

        <h1 style={{ fontSize: 26, color: "var(--burgundy)" }}>
          Order Confirmed!
        </h1>
        <p style={{ color: "var(--text-muted)", marginTop: 8, fontSize: 15 }}>
          Your order has been sent to the kitchen.
        </p>

        <div
          className="card"
          style={{ marginTop: 32, padding: 24, textAlign: "left" }}
        >
          <div style={{ display: "grid", gap: 12, fontSize: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Table</span>
              <strong style={{ color: "var(--burgundy)", fontSize: 18 }}>
                {tableNumber}
              </strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Name</span>
              <strong>{session?.customerName ?? order?.customerName}</strong>
            </div>
            {order && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Order Total</span>
                  <strong style={{ color: "var(--burgundy)" }}>
                    {formatPrice(order.total)}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "var(--text-muted)" }}>Items</span>
                  <strong>{order.items.length}</strong>
                </div>
              </>
            )}
            <div
              style={{
                padding: 12,
                background: "var(--cream-dark)",
                borderRadius: 8,
                textAlign: "center",
                marginTop: 8,
              }}
            >
              <span style={{ fontSize: 13, color: "var(--text-muted)" }}>
                Estimated preparation time
              </span>
              <div style={{ fontSize: 22, fontWeight: 700, color: "var(--brown)", marginTop: 4 }}>
                20–30 minutes
              </div>
            </div>
          </div>
        </div>

        <p style={{ marginTop: 24, fontSize: 13, color: "var(--text-muted)" }}>
          Sit back and relax — we&apos;ll bring your order to Table {tableNumber}.
        </p>

        <Link
          href={`/t/${tableNumber}/menu`}
          className="btn btn-secondary"
          style={{ marginTop: 24, width: "100%" }}
        >
          Order More Items
        </Link>
      </div>
    </main>
  );
}

export default function ConfirmationPage({
  params,
}: {
  params: { table: string };
}) {
  const tableNumber = parseInt(params.table, 10);

  return (
    <Suspense fallback={<div style={{ padding: 40, textAlign: "center" }}>Loading...</div>}>
      <ConfirmationContent tableNumber={tableNumber} />
    </Suspense>
  );
}
