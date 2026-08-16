import { NextRequest, NextResponse } from "next/server";
import { createOtp } from "@/lib/otp-store";
import { validatePhone, normalizePhone } from "@/lib/phone";
import { sendOtpSms } from "@/lib/sms";

export async function POST(request: NextRequest) {
  try {
    const { phone } = await request.json();

    if (!phone || !validatePhone(phone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit mobile number" },
        { status: 400 }
      );
    }

    const normalized = normalizePhone(phone);
    const otp = createOtp(normalized);
    const sms = await sendOtpSms(normalized, otp);

    if (sms.error) {
      return NextResponse.json({ error: sms.error }, { status: 502 });
    }

    return NextResponse.json({
      success: true,
      phone: normalized,
      demo: sms.demo,
      // Shown on screen only in demo mode (no SMS API key configured)
      demoOtp: sms.demo ? otp : undefined,
      message: sms.demo
        ? "OTP generated (demo mode — shown on screen)"
        : "OTP sent to your mobile",
    });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
