import { RoomModule } from "@/lib/store/wizard";

export function estimateTotalRooms(
  siteArea: number,
  kdbPercent: number,
  floors: number,
  corridorType: 'central' | 'external',
  roomModules: RoomModule[]
): number {
  const efficiency = corridorType === 'external' ? 0.87 : 0.8;
  const buildingFootprint = siteArea * (kdbPercent / 100);
  const grossFloorArea = buildingFootprint * floors;
  const usableArea = grossFloorArea * efficiency;

  const avgSize = (() => {
    const counts = roomModules.reduce((sum, r) => sum + (r.count || 0), 0);
    if (counts > 0) {
      const weighted = roomModules.reduce((sum, r) => sum + r.size * (r.count || 0), 0);
      return weighted / counts;
    }
    if (roomModules.length > 0) {
      return roomModules.reduce((sum, r) => sum + r.size, 0) / roomModules.length;
    }
    return 16; // default average if no data
  })();

  if (avgSize <= 0) return 0;
  return Math.max(0, Math.floor(usableArea / avgSize));
}

