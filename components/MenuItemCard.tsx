"use client";

import { useState } from "react";
import Image from "next/image";
import {
  formatPrice,
  getDisplayPrice,
  DIETARY_LABELS,
} from "@/lib/menu-data";
import { MenuItem, CartItem } from "@/lib/types";

interface MenuItemCardProps {
  item: MenuItem;
  onAdd: (cartItem: CartItem) => void;
}

export default function MenuItemCard({ item, onAdd }: MenuItemCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string>("");
  const [instructions, setInstructions] = useState("");

  const variants =
    item.priceType === "sizes"
      ? item.sizes
      : item.priceType === "portions"
        ? item.portions
        : null;

  const defaultVariant = variants?.[0]?.label ?? "";
  const activeVariant = selectedVariant || defaultVariant;

  const getUnitPrice = (): number => {
    if (item.priceType === "single") return item.price ?? 0;
    const list = variants ?? [];
    const found = list.find((v) => v.label === activeVariant);
    return found?.price ?? list[0]?.price ?? 0;
  };

  const handleAdd = () => {
    if (variants && !activeVariant) return;
    onAdd({
      itemId: item.id,
      name: item.name,
      quantity,
      unitPrice: getUnitPrice(),
      variant: variants ? activeVariant : undefined,
      instructions: instructions.trim() || undefined,
    });
    setExpanded(false);
    setQuantity(1);
    setInstructions("");
  };

  return (
    <article className="card animate-in" style={{ marginBottom: 12 }}>
      <div
        style={{ display: "flex", gap: 12, padding: 12, cursor: "pointer" }}
        onClick={() => setExpanded(!expanded)}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            border: "3px solid var(--gold)",
            position: "relative",
          }}
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="88px"
            style={{ objectFit: "cover" }}
          />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 8,
            }}
          >
            <h3 style={{ fontSize: 15, color: "var(--brown)" }}>{item.name}</h3>
            <span
              style={{
                fontWeight: 700,
                color: "var(--burgundy)",
                fontSize: 14,
                whiteSpace: "nowrap",
              }}
            >
              {getDisplayPrice(item)}
            </span>
          </div>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              marginTop: 4,
              lineHeight: 1.4,
              display: "-webkit-box",
              WebkitLineClamp: expanded ? undefined : 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {item.description}
          </p>
          <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
            {item.dietary?.map((d) => (
              <span
                key={d}
                className="badge"
                style={{
                  background: `${DIETARY_LABELS[d]?.color}18`,
                  color: DIETARY_LABELS[d]?.color,
                }}
              >
                {DIETARY_LABELS[d]?.label}
              </span>
            ))}
            {item.note && (
              <span className="badge" style={{ background: "#f3e5f5", color: "#6a1b9a" }}>
                {item.note}
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div
          style={{
            padding: "0 12px 16px",
            borderTop: "1px solid rgba(0,0,0,0.05)",
            animation: "fadeIn 0.2s ease-out",
          }}
        >
          {variants && (
            <div style={{ marginTop: 12 }}>
              <label
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "var(--brown)",
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Select {item.priceType === "sizes" ? "Size" : "Portion"}
              </label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {variants.map((v) => (
                  <button
                    key={v.label}
                    onClick={() => setSelectedVariant(v.label)}
                    style={{
                      padding: "8px 14px",
                      borderRadius: 8,
                      fontSize: 13,
                      fontWeight: 600,
                      border:
                        activeVariant === v.label
                          ? "2px solid var(--burgundy)"
                          : "1.5px solid rgba(0,0,0,0.1)",
                      background:
                        activeVariant === v.label ? "rgba(139,26,26,0.08)" : "white",
                      color:
                        activeVariant === v.label ? "var(--burgundy)" : "var(--text)",
                    }}
                  >
                    {v.label} — {formatPrice(v.price)}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ marginTop: 12 }}>
            <label
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: "var(--brown)",
                display: "block",
                marginBottom: 6,
              }}
            >
              Special Instructions (optional)
            </label>
            <input
              type="text"
              placeholder="e.g. extra spicy, no onions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: 8,
                border: "1.5px solid rgba(0,0,0,0.1)",
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 16,
              gap: 12,
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
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "white",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                −
              </button>
              <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 6,
                  background: "white",
                  fontSize: 18,
                  fontWeight: 700,
                }}
              >
                +
              </button>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleAdd}
              style={{ flex: 1 }}
            >
              Add — {formatPrice(getUnitPrice() * quantity)}
            </button>
          </div>
        </div>
      )}
    </article>
  );
}
