import { normalizePhone } from "./phone";

export async function sendOtpSms(
  phone: string,
  otp: string
): Promise<{ sent: boolean; demo: boolean; error?: string }> {
  const apiKey = process.env.FAST2SMS_API_KEY;
  const number = normalizePhone(phone);

  if (!apiKey) {
    return { sent: false, demo: true };
  }

  try {
    const res = await fetch("https://www.fast2sms.com/dev/bulkV2", {
      method: "POST",
      headers: {
        authorization: apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route: "otp",
        variables_values: otp,
        numbers: number,
      }),
    });

    const data = await res.json();
    if (!res.ok || data.return === false) {
      return {
        sent: false,
        demo: false,
        error: data.message || "SMS delivery failed",
      };
    }

    return { sent: true, demo: false };
  } catch {
    return { sent: false, demo: false, error: "Could not send SMS" };
  }
}
