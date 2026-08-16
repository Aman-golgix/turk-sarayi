import { normalizePhone } from "./phone";

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
}

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;

const globalForOtp = globalThis as unknown as {
  otpStore: Map<string, OtpRecord>;
};

if (!globalForOtp.otpStore) {
  globalForOtp.otpStore = new Map();
}

function storeKey(phone: string): string {
  return normalizePhone(phone);
}

export function createOtp(phone: string): string {
  const code = String(Math.floor(100000 + Math.random() * 900000));
  globalForOtp.otpStore.set(storeKey(phone), {
    code,
    expiresAt: Date.now() + OTP_TTL_MS,
    attempts: 0,
  });
  return code;
}

export function verifyOtp(phone: string, code: string): boolean {
  const key = storeKey(phone);
  const record = globalForOtp.otpStore.get(key);
  if (!record) return false;

  if (Date.now() > record.expiresAt) {
    globalForOtp.otpStore.delete(key);
    return false;
  }

  record.attempts += 1;
  if (record.attempts > MAX_ATTEMPTS) {
    globalForOtp.otpStore.delete(key);
    return false;
  }

  if (record.code !== code.trim()) {
    return false;
  }

  globalForOtp.otpStore.delete(key);
  return true;
}
