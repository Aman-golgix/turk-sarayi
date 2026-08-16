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

    if (!sms.sent) {
      return NextResponse.json(
        { error: sms.error || "Failed to send OTP" },
        { status: sms.demo ? 503 : 502 }
      );
    }

    return NextResponse.json({
      success: true,
      phone: normalized,
      message: "OTP sent to your mobile",
    });
  } catch {
    return NextResponse.json({ error: "Failed to send OTP" }, { status: 500 });
  }
}
