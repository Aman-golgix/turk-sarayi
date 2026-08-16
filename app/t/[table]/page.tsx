"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import { saveSession, getSession } from "@/lib/session";
import { validatePhone, maskPhone } from "@/lib/phone";

type Step = "phone" | "verify";

export default function TableLandingPage({
  params,
}: {
  params: { table: string };
}) {
  const router = useRouter();
  const tableNumber = parseInt(params.table, 10);
  const [step, setStep] = useState<Step>("phone");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [resendIn, setResendIn] = useState(0);

  useEffect(() => {
    const existing = getSession();
    if (existing && existing.tableNumber === tableNumber) {
      router.replace(`/t/${tableNumber}/menu`);
    }
  }, [tableNumber, router]);

  useEffect(() => {
    if (resendIn <= 0) return;
    const t = setTimeout(() => setResendIn((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [resendIn]);

  if (isNaN(tableNumber) || tableNumber < 1) {
    return (
      <main style={{ padding: 40, textAlign: "center" }}>
        <h1>Invalid Table</h1>
        <p>Please scan a valid table QR code.</p>
      </main>
    );
  }

  const sendOtp = async () => {
    if (!validatePhone(phone)) {
      setErrors({ phone: "Enter a valid 10-digit mobile number" });
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ phone: data.error || "Could not send OTP" });
        return;
      }

      setStep("verify");
      setResendIn(30);
      setOtp("");
    } catch {
      setErrors({ phone: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = "Name is required";
    if (!otp.trim() || otp.trim().length !== 6) {
      newErrors.otp = "Enter the 6-digit OTP";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp: otp.trim() }),
      });
      const data = await res.json();

      if (!res.ok) {
        setErrors({ otp: data.error || "Invalid OTP" });
        setLoading(false);
        return;
      }

      saveSession({
        tableNumber,
        customerName: name.trim(),
        phone: data.phone,
      });
      router.push(`/t/${tableNumber}/menu`);
    } catch {
      setErrors({ otp: "Network error. Please try again." });
      setLoading(false);
    }
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
          {step === "phone" ? (
            <>
              <h1 style={{ fontSize: 22, color: "var(--burgundy)", marginBottom: 8 }}>
                Verify Your Number
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 24 }}>
                We&apos;ll send a one-time code via SMS to your mobile.
              </p>

              <div className="input-group">
                <label htmlFor="phone">Mobile Number *</label>
                <input
                  id="phone"
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setErrors({});
                  }}
                  autoComplete="tel"
                  inputMode="numeric"
                />
                {errors.phone && (
                  <span className="input-error">{errors.phone}</span>
                )}
              </div>

              <button
                type="button"
                className="btn btn-primary"
                disabled={loading}
                onClick={sendOtp}
                style={{ marginTop: 20, width: "100%" }}
              >
                {loading ? "Sending OTP..." : "Send OTP →"}
              </button>
            </>
          ) : (
            <>
              <h1 style={{ fontSize: 22, color: "var(--burgundy)", marginBottom: 8 }}>
                Enter OTP
              </h1>
              <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 20 }}>
                Check SMS on <strong>{maskPhone(phone)}</strong>
              </p>

              <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div className="input-group">
                  <label htmlFor="otp">6-Digit OTP *</label>
                  <input
                    id="otp"
                    type="text"
                    placeholder="Enter OTP from SMS"
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6));
                      setErrors((prev) => ({ ...prev, otp: "" }));
                    }}
                    inputMode="numeric"
                    maxLength={6}
                    autoComplete="one-time-code"
                    style={{ letterSpacing: "0.2em", fontSize: 20, textAlign: "center" }}
                  />
                  {errors.otp && <span className="input-error">{errors.otp}</span>}
                </div>

                <div className="input-group">
                  <label htmlFor="name">Your Name *</label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }}
                    autoComplete="name"
                  />
                  {errors.name && <span className="input-error">{errors.name}</span>}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                  style={{ width: "100%" }}
                >
                  {loading ? "Verifying..." : "Verify & Browse Menu →"}
                </button>
              </form>

              <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: 13 }}
                  onClick={() => {
                    setStep("phone");
                    setOtp("");
                  }}
                >
                  ← Change Number
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  style={{ flex: 1, fontSize: 13 }}
                  disabled={resendIn > 0 || loading}
                  onClick={sendOtp}
                >
                  {resendIn > 0 ? `Resend in ${resendIn}s` : "Resend OTP"}
                </button>
              </div>
            </>
          )}
        </div>

        <p
          style={{
            marginTop: 24,
            textAlign: "center",
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Secure login · OTP valid for 5 minutes
        </p>
      </div>
    </main>
  );
}
