export function parseIDRCurrency(input: string): number {
  if (input == null) return 0;
  let clean = String(input).toLowerCase().replace(/\./g, "").replace(/,/g, "").trim();
  clean = clean.replace(/(\d),(\d)/g, "$1.$2");

  const endsWith = (s: string) => clean.endsWith(s);
  const numeric = parseFloat(clean.replace(/[^\d.]/g, ""));
  if (Number.isNaN(numeric)) return 0;

  if (endsWith("jt") || endsWith("m")) {
    return Math.round(numeric * 1_000_000);
  }
  if (endsWith("b")) {
    return Math.round(numeric * 1_000_000_000);
  }
  return Number.isFinite(numeric) ? numeric : 0;
}

