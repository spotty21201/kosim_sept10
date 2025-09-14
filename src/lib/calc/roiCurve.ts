import { Scenario } from "@/lib/types";
import { computeResults } from "@/lib/calc/metrics";

export function generateRoiVsRooms(s: Scenario): { rooms: number; roi: number }[] {
  const baseRooms = s.rooms.reduce((sum, r) => sum + (r.count ?? 0), 0);
  const safeBase = baseRooms > 0 ? baseRooms : 1;
  const min = Math.max(5, Math.floor(safeBase * 0.5));
  const max = Math.max(min, Math.floor(safeBase * 1.5));

  const points: { rooms: number; roi: number }[] = [];
  for (let r = min; r <= max; r++) {
    const ratio = r / safeBase;
    const modified: Scenario = {
      ...s,
      rooms: s.rooms.map((rm) => ({ ...rm, count: Math.max(0, Math.round((rm.count ?? 0) * ratio)) })),
    };
    const res = computeResults(modified).results;
    points.push({ rooms: r, roi: res.roi * 100 });
  }
  return points;
}
