import { NextRequest, NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp-store";
import { validatePhone, normalizePhone } from "@/lib/phone";

export async function POST(request: NextRequest) {
  try {
    const { phone, otp } = await request.json();

    if (!phone || !validatePhone(phone)) {
      return NextResponse.json(
        { error: "Invalid phone number" },
        { status: 400 }
      );
    }

    if (!otp || !/^\d{6}$/.test(String(otp).trim())) {
      return NextResponse.json(
        { error: "Enter the 6-digit OTP" },
        { status: 400 }
      );
    }

    const normalized = normalizePhone(phone);
    const valid = verifyOtp(normalized, String(otp).trim());

    if (!valid) {
      return NextResponse.json(
        { error: "Invalid or expired OTP. Please request a new one." },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true, phone: normalized });
  } catch {
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
