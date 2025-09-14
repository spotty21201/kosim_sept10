import { Corridor } from "@/lib/types";

export function deriveEfficiency(corridor: Corridor, baseEff = 0.78): number {
  if (corridor === "central") return Math.max(0, Math.min(1, baseEff - 0.04));
  return Math.max(0, Math.min(1, baseEff + 0.02)); // external
}

