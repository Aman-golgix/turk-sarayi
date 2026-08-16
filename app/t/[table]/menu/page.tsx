"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import MenuItemCard from "@/components/MenuItemCard";
import CartBar from "@/components/CartBar";
import {
  CATEGORIES,
  MENU_ITEMS,
  getItemsByCategory,
} from "@/lib/menu-data";
import {
  getSession,
  getCart,
  saveCart,
  getCartCount,
} from "@/lib/session";
import { CartItem } from "@/lib/types";

export default function MenuPage({ params }: { params: { table: string } }) {
  const router = useRouter();
  const tableNumber = parseInt(params.table, 10);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("specials");
  const [search, setSearch] = useState("");
  const [addedToast, setAddedToast] = useState<string | null>(null);
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

  const filteredItems = useMemo(() => {
    if (search.trim()) {
      const q = search.toLowerCase();
      return MENU_ITEMS.filter(
        (item) =>
          item.name.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q)
      );
    }
    return getItemsByCategory(activeCategory);
  }, [search, activeCategory]);

  const handleAdd = (item: CartItem) => {
    const updated = [...cart, item];
    setCart(updated);
    saveCart(updated);
    setAddedToast(item.name);
    setTimeout(() => setAddedToast(null), 2000);
  };

  if (!ready) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <p className="pulse">Loading menu...</p>
      </main>
    );
  }

  return (
    <main style={{ minHeight: "100dvh", paddingBottom: 100 }}>
      <Header tableNumber={tableNumber} cartCount={getCartCount(cart)} />

      <div className="container" style={{ paddingTop: 16 }}>
        <div style={{ position: "relative", marginBottom: 16 }}>
          <input
            type="search"
            placeholder="🔍 Search menu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1.5px solid rgba(0,0,0,0.1)",
              background: "white",
            }}
          />
        </div>

        {!search && (
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 8,
              marginBottom: 16,
              scrollbarWidth: "none",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  flexShrink: 0,
                  padding: "8px 14px",
                  borderRadius: 999,
                  fontSize: 13,
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                  background:
                    activeCategory === cat.id ? "var(--burgundy)" : "white",
                  color: activeCategory === cat.id ? "white" : "var(--brown)",
                  border:
                    activeCategory === cat.id
                      ? "none"
                      : "1px solid rgba(0,0,0,0.1)",
                }}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
        )}

        {search && (
          <p style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 12 }}>
            {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""} for &quot;{search}&quot;
          </p>
        )}

        {!search && (
          <h2
            style={{
              fontSize: 22,
              color: "var(--burgundy)",
              marginBottom: 16,
            }}
          >
            {CATEGORIES.find((c) => c.id === activeCategory)?.icon}{" "}
            {CATEGORIES.find((c) => c.id === activeCategory)?.name}
          </h2>
        )}

        {filteredItems.map((item) => (
          <MenuItemCard key={item.id} item={item} onAdd={handleAdd} />
        ))}

        {filteredItems.length === 0 && (
          <div style={{ textAlign: "center", padding: 40, color: "var(--text-muted)" }}>
            No items found. Try a different search.
          </div>
        )}
      </div>

      <CartBar cart={cart} tableNumber={tableNumber} />

      {addedToast && (
        <div
          style={{
            position: "fixed",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            background: "var(--success)",
            color: "white",
            padding: "12px 24px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 14,
            zIndex: 200,
            animation: "slideDown 0.3s ease-out",
            boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          }}
        >
          ✓ Added {addedToast}
        </div>
      )}
    </main>
  );
}
