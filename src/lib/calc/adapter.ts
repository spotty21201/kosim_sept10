import { Scenario } from "@/lib/types";
import { useWizardStore, type WizardStore as StoreType } from "@/lib/store/wizard";
import { deriveEfficiency } from "@/lib/calc/efficiency";
import { computeYield } from "@/lib/calc/yield";
import { opexAnnual } from "@/lib/calc/opex";
import { capexTotal } from "@/lib/calc/capex";
import { revenueAnnual } from "@/lib/calc/revenue";

export function storeToScenario(store: StoreType): Scenario {
  const kdbRatio = (store.kdb || 0) / 100;
  const efficiency = deriveEfficiency(store.corridorType, 0.78);
  const usableGross = store.siteArea * kdbRatio * (store.floors || 1);
  const sharedArea = usableGross * (1 - efficiency);

  // derive per-sqm from totals, guard divide-by-zero
  const structureRpPerSqm = usableGross > 0 ? store.capex.structureCost / usableGross : 0;
  const sharedAreaRpPerSqm = sharedArea > 0 ? store.capex.sharedAreaCost / sharedArea : 0;

  const rooms = store.roomModules.map(r => ({
    type: r.type as Scenario['rooms'][number]['type'],
    size: r.size,
    rent: r.rent,
    fitout: r.fitout,
    count: r.count,
    sharePct: r.mix,
  }));

  // rough per-room splits for cleaning/maintenance
  const totalRooms = rooms.reduce((s, r) => s + (r.count || 0), 0) || 1;
  const utilitiesRpPerSqmMonthly = usableGross > 0 ? store.opex.utilities / usableGross : 0;
  const cleaningPerRoomMonthly = store.opex.cleaningSalary / totalRooms;
  const maintenancePerRoomMonthly = store.opex.maintenance / totalRooms;

  // Working capital months approximation
  const monthlyOpexFlat = store.opex.caretakerSalary + store.opex.cleaningSalary + store.opex.utilities + store.opex.internet + store.opex.maintenance + store.opex.marketing + store.opex.tax;
  const workingCapitalMonths = monthlyOpexFlat > 0 ? Math.round(store.capex.workingCapital / monthlyOpexFlat) : 0;

  const scn: Scenario = {
    id: 'local',
    name: 'Local Scenario',
    city: 'Jakarta',
    siteArea: store.siteArea,
    kdb: kdbRatio,
    klb: store.klb,
    floors: store.floors,
    corridor: store.corridorType,
    efficiency,
    rooms,
    capex: {
      land: { method: 'own', rpPerSqm: store.capex.landCost / Math.max(1, store.siteArea) },
      structureRpPerSqm,
      sharedAreaRpPerSqm,
      brandingLaunch: store.capex.brandingCost,
      workingCapitalMonths,
    },
    opex: {
      caretakerMonthly: store.opex.caretakerSalary,
      cleaningPerRoomMonthly,
      utilitiesRpPerSqmMonthly,
      internetMonthly: store.opex.internet,
      maintenancePerRoomMonthly,
      marketing: { method: 'flat', flat: store.opex.marketing },
      pbbOrLeaseAnnual: store.opex.tax * 12,
    },
    revenue: {
      occupancyPct: store.occupancyRatePercent,
      ancillary: {},
    },
  };

  return scn;
}

// convenience to fetch current state in client components
export function getCurrentScenario(): Scenario {
  const store = (useWizardStore as any).getState?.() as StoreType;
  return storeToScenario(store);
}

export function scenarioToStore(scn: Scenario): Partial<StoreType> {
  const y = computeYield(scn);
  const ug = y.usableGross;
  const sharedArea = ug * (1 - scn.efficiency);
  let opexA = opexAnnual(scn, { usableGrossArea: ug, roomsTotal: y.roomsTotal });
  const revA = revenueAnnual(scn, y.rooms);
  if (scn.opex.marketing.method === 'pctRevenue') {
    // included via later metrics; we use monthlyMarketing below
  }
  const capx = capexTotal(scn, { usableGrossArea: ug, efficiency: scn.efficiency, roomsTotal: y.roomsTotal, opexAnnualValue: opexA });

  const monthlyRevenue = revA / 12;
  const monthlyMarketing = scn.opex.marketing.method === 'pctRevenue'
    ? ((scn.opex.marketing.pct ?? 0) / 100) * monthlyRevenue
    : (scn.opex.marketing.flat ?? 0);

  return {
    siteArea: scn.siteArea,
    kdb: scn.kdb * 100,
    klb: scn.klb,
    floors: scn.floors,
    corridorType: scn.corridor,
    parkingSpots: 0,
    roomModules: scn.rooms.map(r => ({ type: r.type as any, size: r.size, rent: r.rent, fitout: r.fitout, count: r.count || 0, mix: r.sharePct ?? 0 })),
    totalRoomsTarget: y.roomsTotal,
    capex: {
      landCost: scn.capex.land.method === 'own' ? (scn.capex.land.rpPerSqm ?? 0) * scn.siteArea : (scn.capex.land.flat ?? 0),
      structureCost: Math.round(scn.capex.structureRpPerSqm * ug),
      sharedAreaCost: Math.round(scn.capex.sharedAreaRpPerSqm * sharedArea),
      fitoutCost: y.rooms.reduce((s, r) => s + (r.count || 0) * r.fitout, 0),
      brandingCost: scn.capex.brandingLaunch,
      workingCapital: Math.round((scn.capex.workingCapitalMonths / 12) * opexA),
    },
    opex: {
      caretakerSalary: scn.opex.caretakerMonthly,
      cleaningSalary: (scn.opex.cleaningPerRoomMonthly * y.roomsTotal),
      utilities: Math.round(scn.opex.utilitiesRpPerSqmMonthly * ug),
      internet: scn.opex.internetMonthly,
      maintenance: (scn.opex.maintenancePerRoomMonthly * y.roomsTotal),
      marketing: Math.round(monthlyMarketing),
      tax: Math.round((scn.opex.pbbOrLeaseAnnual ?? 0) / 12),
    },
    occupancyRatePercent: scn.revenue.occupancyPct,
  } as Partial<StoreType>;
}
