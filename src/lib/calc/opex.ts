import { Scenario } from "@/lib/types";

export function opexAnnual(
  scn: Scenario,
  { usableGrossArea, roomsTotal }: { usableGrossArea: number; roomsTotal: number }
): number {
  const caret = scn.opex.caretakerMonthly * 12;
  const clean = scn.opex.cleaningPerRoomMonthly * roomsTotal * 12;
  const util = scn.opex.utilitiesRpPerSqmMonthly * usableGrossArea * 12;
  const net = scn.opex.internetMonthly * 12;
  const maint = scn.opex.maintenancePerRoomMonthly * roomsTotal * 12;
  const lease = scn.opex.pbbOrLeaseAnnual ?? 0;
  // marketing
  const marketing = scn.opex.marketing.method === 'pctRevenue'
    ? 0 // placeholder, filled in metrics where revenue is known
    : (scn.opex.marketing.flat ?? 0) * 12;

  return caret + clean + util + net + maint + lease + marketing;
}

