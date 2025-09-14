import { RoomModule, Scenario } from "@/lib/types";

export function usableGross(siteArea: number, kdb: number, floors: number): number {
  return siteArea * kdb * floors;
}

export function usableNet(usableGrossArea: number, efficiency: number): number {
  return usableGrossArea * efficiency;
}

export function reconcileCounts(rooms: RoomModule[], usableNetArea: number): RoomModule[] {
  const anyCounts = rooms.some(r => typeof r.count === 'number');
  if (anyCounts) {
    return rooms.map(r => ({ ...r, count: r.count ?? 0 }));
  }
  const shares = rooms.map(r => (r.sharePct ?? (100 / Math.max(rooms.length, 1))) / 100);
  return rooms.map((r, i) => ({
    ...r,
    count: Math.max(0, Math.floor((usableNetArea * shares[i]) / Math.max(1, r.size)))
  }));
}

export function computeRoomsTotal(rooms: RoomModule[]): number {
  return rooms.reduce((sum, r) => sum + (r.count || 0), 0);
}

export function computeYield(scn: Scenario) {
  const ug = usableGross(scn.siteArea, scn.kdb, scn.floors);
  const un = usableNet(ug, scn.efficiency);
  const rooms = reconcileCounts(scn.rooms, un);
  const roomsTotal = computeRoomsTotal(rooms);
  return { usableGross: ug, usableNet: un, rooms, roomsTotal };
}

