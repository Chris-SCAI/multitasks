export const VIP_STORAGE_KEY = "multitasks-admin-vip";
export const VIP_PLAN = "pro";

export function getAdminEmails(): string[] {
  const raw = process.env.NEXT_PUBLIC_ADMIN_EMAILS ?? "";
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const admins = getAdminEmails();
  if (admins.includes("*")) return true;
  return admins.includes(email.toLowerCase());
}
