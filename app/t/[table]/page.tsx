"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import {
  saveSession,
  getSession,
  validatePhone,
} from "@/lib/session";

export default function TableLandingPage({
  params,
}: {
  params: { table: string };
}) {
  const router = useRouter();
  const tableNumber = parseInt(params.table, 10);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const existing = getSession();
    if (existing && existing.tableNumber === tableNumber) {
      router.replace(`/t/${tableNumber}/menu`);
    }
  }, [tableNumber, router]);

  if (isNaN(tableNumber) || tableNumber < 1) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <h1>Invalid Table</h1>
        <p>Please scan a valid table QR code.</p>
      </main>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { name?: string; phone?: string } = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(phone)) newErrors.phone = "Enter a valid 10-digit phone number";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    saveSession({
      tableNumber,
      customerName: name.trim(),
      phone: phone.trim(),
    });
    router.push(`/t/${tableNumber}/menu`);
  };

  return (
    <main className="geometric-bg" style={{ minHeight: "100dvh", padding: "32px 16px" }}>
      <div className="container animate-in">
        <Logo size="md" showTagline />

        <div
          style={{
            marginTop: 24,
            textAlign: "center",
            padding: "12px 20px",
            background: "var(--burgundy)",
            color: "white",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 15,
          }}
        >
          🪑 You&apos;re seated at Table {tableNumber}
        </div>

        <div className="card" style={{ marginTop: 32, padding: 24 }}>
          <h1 style={{ fontSize: 22, color: "var(--burgundy)", marginBottom: 8 }}>
            Welcome!
          </h1>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
            Tell us your name so we can bring your order to the right table.
          </p>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div className="input-group">
              <label htmlFor="name">Your Name *</label>
              <input
                id="name"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => ({ ...prev, name: undefined }));
                }}
                autoComplete="name"
              />
              {errors.name && <span className="input-error">{errors.name}</span>}
            </div>

            <div className="input-group">
              <label htmlFor="phone">Phone Number *</label>
              <input
                id="phone"
                type="tel"
                placeholder="10-digit mobile number"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setErrors((prev) => ({ ...prev, phone: undefined }));
                }}
                autoComplete="tel"
                inputMode="numeric"
              />
              {errors.phone && <span className="input-error">{errors.phone}</span>}
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ marginTop: 8, width: "100%" }}
            >
              {loading ? "Loading Menu..." : "Browse Menu →"}
            </button>
          </form>
        </div>

        <p
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Quick login · Order directly from your phone
        </p>
      </div>
    </main>
  );
}
