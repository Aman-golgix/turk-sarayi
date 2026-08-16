import Link from "next/link";
import Image from "next/image";
import Logo from "@/components/Logo";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&h=500&q=85";

export default function HomePage() {
  return (
    <main className="geometric-bg" style={{ minHeight: "100dvh" }}>
      <div
        style={{
          position: "relative",
          height: 220,
          overflow: "hidden",
        }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Turk Sarayi restaurant"
          fill
          priority
          sizes="100vw"
          style={{ objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(44,24,16,0.35), rgba(253,246,236,0.95))",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <Logo size="md" showTagline />
        </div>
      </div>

      <div className="container animate-in" style={{ padding: "24px 16px 40px", textAlign: "center" }}>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-muted)",
            lineHeight: 1.6,
          }}
        >
          Scan the QR code on your table to order. Enter your name, browse the menu, and we&apos;ll deliver to your table.
        </p>

        <div
          className="card"
          style={{
            marginTop: 24,
            padding: 24,
            textAlign: "left",
            border: "2px solid var(--gold-light)",
          }}
        >
          <h2 style={{ fontSize: 20, color: "var(--burgundy)", marginBottom: 8 }}>
            📱 Demo Flow
          </h2>
          <p style={{ fontSize: 14, color: "var(--text-muted)", marginBottom: 16 }}>
            Scan QR → Login (name + phone) → Menu → Cart → Kitchen receives order
          </p>
          <Link href="/t/1" className="btn btn-primary" style={{ width: "100%" }}>
            Try Table 1 Now
          </Link>
        </div>

        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <Link href="/qr" className="btn btn-gold">
            📱 Print Table QR Codes
          </Link>
          <Link href="/kitchen" className="btn btn-primary">
            👨‍🍳 Kitchen Dashboard
          </Link>
          <Link href="/demo" className="btn btn-secondary">
            📋 Demo Walkthrough
          </Link>
        </div>

        <p style={{ marginTop: 32, fontSize: 12, color: "var(--text-muted)" }}>
          One Bite, Endless Flavor · A Taste of Turkey
        </p>
      </div>
    </main>
  );
}
