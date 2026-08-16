"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import QRCode from "qrcode";
import Logo from "@/components/Logo";

const TABLE_COUNT = 10;

export default function QRGeneratorPage() {
  const [baseUrl, setBaseUrl] = useState("");
  const [qrCodes, setQrCodes] = useState<{ table: number; dataUrl: string; url: string }[]>([]);

  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    setBaseUrl(origin);
  }, []);

  useEffect(() => {
    if (!baseUrl) return;

    const generate = async () => {
      const codes = await Promise.all(
        Array.from({ length: TABLE_COUNT }, async (_, i) => {
          const table = i + 1;
          const url = `${baseUrl}/t/${table}`;
          const dataUrl = await QRCode.toDataURL(url, {
            width: 280,
            margin: 2,
            color: { dark: "#8B1A1A", light: "#FDF6EC" },
          });
          return { table, dataUrl, url };
        })
      );
      setQrCodes(codes);
    };

    generate();
  }, [baseUrl]);

  const printQR = (table: number) => {
    const code = qrCodes.find((c) => c.table === table);
    if (!code) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html><head><title>Table ${table} QR - Turk Sarayi</title>
      <style>
        body { font-family: Georgia, serif; text-align: center; padding: 40px; }
        h1 { color: #8B1A1A; letter-spacing: 0.15em; }
        img { margin: 20px 0; }
        p { color: #666; }
      </style></head><body>
      <h1>TURK SARAYI</h1>
      <h2>Table ${table}</h2>
      <p>Scan to order from your table</p>
      <img src="${code.dataUrl}" width="280" />
      <p style="font-size:12px">${code.url}</p>
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <main className="geometric-bg" style={{ minHeight: "100dvh", padding: "32px 16px" }}>
      <div className="container-wide animate-in">
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <Logo size="md" showTagline />
          <h1 style={{ fontSize: 24, color: "var(--burgundy)", marginTop: 24 }}>
            Table QR Codes
          </h1>
          <p style={{ color: "var(--text-muted)", marginTop: 8, maxWidth: 500, margin: "8px auto 0" }}>
            Print and place these QR codes on each table. Customers scan to order directly.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 20,
          }}
        >
          {qrCodes.map(({ table, dataUrl, url }) => (
            <div
              key={table}
              className="card"
              style={{ padding: 24, textAlign: "center" }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: "var(--burgundy)",
                  marginBottom: 12,
                }}
              >
                🪑 Table {table}
              </div>
              {dataUrl ? (
                <img
                  src={dataUrl}
                  alt={`QR code for Table ${table}`}
                  style={{ margin: "0 auto", borderRadius: 8 }}
                />
              ) : (
                <div style={{ height: 280, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="pulse">Generating...</span>
                </div>
              )}
              <p style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 8, wordBreak: "break-all" }}>
                {url}
              </p>
              <button
                onClick={() => printQR(table)}
                className="btn btn-secondary"
                style={{ marginTop: 12, width: "100%" }}
              >
                🖨️ Print
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: 32 }}>
          <Link href="/" className="btn btn-primary">
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
