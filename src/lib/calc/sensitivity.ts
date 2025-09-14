import { Scenario } from "@/lib/types";
import { computeResults } from "@/lib/calc/metrics";

export function tornadoSensitivity(scn: Scenario) {
  const base = computeResults(scn).results;
  const items: { key: string; deltaRoiPct: number }[] = [];

  const pushDelta = (key: string, roiNew: number) => {
    const delta = base.roi === 0 ? 0 : ((roiNew - base.roi) / Math.abs(base.roi)) * 100;
    items.push({ key, deltaRoiPct: delta });
  };

  // Occupancy ±10 pts
  const occUp = { ...scn, revenue: { ...scn.revenue, occupancyPct: Math.min(100, scn.revenue.occupancyPct + 10) } };
  pushDelta('occupancy +10pt', computeResults(occUp).results.roi);
  const occDn = { ...scn, revenue: { ...scn.revenue, occupancyPct: Math.max(0, scn.revenue.occupancyPct - 10) } };
  pushDelta('occupancy -10pt', computeResults(occDn).results.roi);

  // Rent ±10%
  const rentScale = (s: Scenario, f: number): Scenario => ({
    ...s,
    rooms: s.rooms.map(r => ({ ...r, rent: Math.round(r.rent * f) }))
  });
  pushDelta('rent +10%', computeResults(rentScale(scn, 1.1)).results.roi);
  pushDelta('rent -10%', computeResults(rentScale(scn, 0.9)).results.roi);

  // Structure cost ±10%
  pushDelta('structure +10%', computeResults({ ...scn, capex: { ...scn.capex, structureRpPerSqm: scn.capex.structureRpPerSqm * 1.1 } }).results.roi);
  pushDelta('structure -10%', computeResults({ ...scn, capex: { ...scn.capex, structureRpPerSqm: scn.capex.structureRpPerSqm * 0.9 } }).results.roi);

  // Fitout ±10%
  const fitoutScale = (s: Scenario, f: number): Scenario => ({
    ...s,
    rooms: s.rooms.map(r => ({ ...r, fitout: Math.round(r.fitout * f) }))
  });
  pushDelta('fitout +10%', computeResults(fitoutScale(scn, 1.1)).results.roi);
  pushDelta('fitout -10%', computeResults(fitoutScale(scn, 0.9)).results.roi);

  // Utilities per sqm ±10%
  pushDelta('utilities +10%', computeResults({ ...scn, opex: { ...scn.opex, utilitiesRpPerSqmMonthly: scn.opex.utilitiesRpPerSqmMonthly * 1.1 } }).results.roi);
  pushDelta('utilities -10%', computeResults({ ...scn, opex: { ...scn.opex, utilitiesRpPerSqmMonthly: scn.opex.utilitiesRpPerSqmMonthly * 0.9 } }).results.roi);

  return items;
}

