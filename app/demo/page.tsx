import Link from "next/link";
import Logo from "@/components/Logo";

const STEPS = [
  {
    step: 1,
    title: "Open Kitchen Dashboard",
    desc: "On a laptop or second screen, open the Kitchen Dashboard and keep it visible.",
    link: "/kitchen",
    linkLabel: "Open Kitchen Dashboard →",
  },
  {
    step: 2,
    title: "Scan Table QR Code",
    desc: "Use your phone to scan the Table 1 QR code (from the QR Generator page or demo link below).",
    link: "/t/1",
    linkLabel: "Simulate Table 1 Scan →",
  },
  {
    step: 3,
    title: "Enter Your Details",
    desc: "Enter your name and phone number. No OTP needed — this is the MVP flow.",
    link: null,
    linkLabel: null,
  },
  {
    step: 4,
    title: "Browse & Order",
    desc: "Browse categories (Specials, Mandi, Kunafa, etc.), tap items to expand, select size/portion, add to cart.",
    link: "/t/1/menu",
    linkLabel: "Go to Menu →",
  },
  {
    step: 5,
    title: "Review Cart & Submit",
    desc: "Open cart, review items, add special instructions, and place the order.",
    link: "/t/1/cart",
    linkLabel: "View Cart →",
  },
  {
    step: 6,
    title: "Watch Kitchen Dashboard",
    desc: "The order appears instantly on the Kitchen Dashboard with table number, customer info, items, and total. A visual alert highlights new orders.",
    link: "/kitchen",
    linkLabel: "Check Kitchen →",
  },
];

const FUTURE = [
  "Payment integration (UPI, cards)",
  "Full POS system connection",
  "Kitchen printer integration",
  "Real-time order status for customers",
  "Loyalty & rewards program",
  "OTP phone verification",
  "Multi-location support",
  "Analytics & sales reporting",
];

export default function DemoGuidePage() {
  return (
    <main className="geometric-bg" style={{ minHeight: "100dvh", padding: "32px 16px" }}>
      <div className="container animate-in">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size="md" showTagline />
          <h1 style={{ fontSize: 26, color: "var(--burgundy)", marginTop: 24 }}>
            Demo Walkthrough
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8 }}>
            Follow these steps during your meeting to show the full ordering flow.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {STEPS.map((s) => (
            <div key={s.step} className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: "50%",
                    background: "var(--burgundy)",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {s.step}
                </div>
                <div>
                  <h2 style={{ fontSize: 18, color: "var(--brown)" }}>{s.title}</h2>
                  <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 6, lineHeight: 1.5 }}>
                    {s.desc}
                  </p>
                  {s.link && s.linkLabel && (
                    <Link
                      href={s.link}
                      style={{
                        display: "inline-block",
                        marginTop: 10,
                        color: "var(--burgundy)",
                        fontWeight: 600,
                        fontSize: 14,
                      }}
                    >
                      {s.linkLabel}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="card" style={{ padding: 24, marginTop: 32 }}>
          <h2 style={{ fontSize: 20, color: "var(--burgundy)", marginBottom: 16 }}>
            Post-MVP — Next Phase Features
          </h2>
          <ul style={{ listStyle: "none", display: "grid", gap: 8 }}>
            {FUTURE.map((item) => (
              <li
                key={item}
                style={{
                  fontSize: 14,
                  color: "var(--text-muted)",
                  paddingLeft: 20,
                  position: "relative",
                }}
              >
                <span style={{ position: "absolute", left: 0, color: "var(--gold)" }}>→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            marginTop: 32,
          }}
        >
          <Link href="/qr" className="btn btn-gold" style={{ textAlign: "center" }}>
            📱 QR Code Generator
          </Link>
          <Link href="/kitchen" className="btn btn-primary" style={{ textAlign: "center" }}>
            👨‍🍳 Kitchen Dashboard
          </Link>
          <Link href="/" className="btn btn-secondary" style={{ textAlign: "center" }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
