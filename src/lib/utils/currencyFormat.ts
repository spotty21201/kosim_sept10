export function formatIDR(value: number): string {
  try {
    return new Intl.NumberFormat("id-ID").format(Math.round(value || 0));
  } catch {
    return String(value ?? 0);
  }
}

