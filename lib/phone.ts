export function normalizePhone(phone: string): string {
  const cleaned = phone.replace(/[\s\-+()]/g, "");
  if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return cleaned.slice(2);
  }
  return cleaned;
}

export function validatePhone(phone: string): boolean {
  return /^\d{10}$/.test(normalizePhone(phone));
}

export function maskPhone(phone: string): string {
  const n = normalizePhone(phone);
  if (n.length !== 10) return phone;
  return `+91 ${n.slice(0, 2)}****${n.slice(6)}`;
}
