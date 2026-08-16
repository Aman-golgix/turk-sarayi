"use client";

import Link from "next/link";
import { getCartCount } from "@/lib/session";

interface HeaderProps {
  tableNumber?: number;
  cartCount?: number;
  showCart?: boolean;
  title?: string;
  backHref?: string;
}

export default function Header({
  tableNumber,
  cartCount = 0,
  showCart = true,
  title,
  backHref,
}: HeaderProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(253, 246, 236, 0.95)",
        backdropFilter: "blur(8px)",
        borderBottom: "1px solid rgba(139, 26, 26, 0.1)",
        padding: "12px 16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {backHref && (
            <Link
              href={backHref}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "50%",
                background: "var(--cream-dark)",
                fontSize: 18,
              }}
              aria-label="Go back"
            >
              ←
            </Link>
          )}
          <div>
            {title ? (
              <h1 style={{ fontSize: 18, color: "var(--burgundy)" }}>{title}</h1>
            ) : (
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "var(--burgundy)",
                  letterSpacing: "0.1em",
                }}
              >
                TURK SARAYI
              </span>
            )}
            {tableNumber && (
              <div style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>
                Table {tableNumber}
              </div>
            )}
          </div>
        </div>

        {showCart && tableNumber && (
          <Link
            href={`/t/${tableNumber}/cart`}
            style={{
              position: "relative",
              width: 44,
              height: 44,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              background: "var(--burgundy)",
              color: "white",
              fontSize: 20,
            }}
            aria-label={`Cart with ${cartCount} items`}
          >
            🛒
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  background: "var(--gold)",
                  color: "var(--brown)",
                  fontSize: 11,
                  fontWeight: 700,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}

export { getCartCount };
