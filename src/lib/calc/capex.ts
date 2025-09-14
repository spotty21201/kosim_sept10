import { Scenario } from "@/lib/types";

export type CapexBreakdown = {
  land: number;
  structure: number;
  shared: number;
  fitout: number;
  branding: number;
  workingCapital: number;
  total: number;
};

export function capexTotal(
  scn: Scenario,
  {
    usableGrossArea,
    efficiency,
    opexAnnualValue,
  }: { usableGrossArea: number; efficiency: number; roomsTotal: number; opexAnnualValue: number }
): CapexBreakdown {
  const land = scn.capex.land.method === 'own'
    ? (scn.capex.land.rpPerSqm ?? 0) * scn.siteArea
    : (scn.capex.land.flat ?? (((scn.capex.land.rpPerSqm ?? 0) * scn.siteArea) * (scn.capex.land.years ?? 0)));

  const structure = scn.capex.structureRpPerSqm * usableGrossArea;
  const sharedArea = usableGrossArea * (1 - efficiency);
  const shared = scn.capex.sharedAreaRpPerSqm * sharedArea;
  const fitout = scn.rooms.reduce((sum, r) => sum + (r.count || 0) * r.fitout, 0);
  const branding = scn.capex.brandingLaunch;
  const workingCapital = (scn.capex.workingCapitalMonths / 12) * opexAnnualValue;
  const total = land + structure + shared + fitout + branding + workingCapital;
  return { land, structure, shared, fitout, branding, workingCapital, total };
}
