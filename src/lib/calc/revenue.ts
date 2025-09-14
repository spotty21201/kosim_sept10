import { Scenario } from "@/lib/types";

export function ancillaryAnnual(scn: Scenario): number {
  const a = scn.revenue.ancillary || {};
  return (a.parkingAnnual ?? 0) + (a.laundryAnnual ?? 0) + (a.utilitiesMarkupAnnual ?? 0) + (a.kiosksAnnual ?? 0);
}

export function revenueAnnual(scn: Scenario, roomsWithCounts = scn.rooms): number {
  const occ = (scn.revenue.occupancyPct || 0) / 100;
  const revRooms = roomsWithCounts.reduce((sum, r) => sum + (r.count || 0) * r.rent * 12 * occ, 0);
  return revRooms + ancillaryAnnual(scn);
}

