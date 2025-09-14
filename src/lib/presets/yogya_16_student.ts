import { Scenario } from "@/lib/types";

export const PRESET_YOGYA_16_STUDENT: Scenario = {
  id: "example-ygy-16",
  name: "Yogyakarta • 16-room Student Kos",
  city: "Yogyakarta",
  siteArea: 420,
  kdb: 0.65,
  klb: 2.0,
  floors: 3,
  corridor: "external",
  efficiency: 0.80,

  rooms: [
    { type: "standard", size: 10, rent: 1_500_000, fitout: 9_000_000,  count: 12 },
    { type: "ensuite",  size: 13, rent: 2_200_000, fitout: 13_000_000, count: 4  },
  ],

  capex: {
    land: { method: "own", rpPerSqm: 5_500_000 },
    structureRpPerSqm: 6_200_000,
    sharedAreaRpPerSqm: 3_800_000,
    brandingLaunch: 15_000_000,
    workingCapitalMonths: 2,
  },

  opex: {
    caretakerMonthly: 3_500_000,
    cleaningPerRoomMonthly: 80_000,
    utilitiesRpPerSqmMonthly: 35_000,
    internetMonthly: 550_000,
    maintenancePerRoomMonthly: 70_000,
    marketing: { method: "pctRevenue", pct: 1.5 },
    pbbOrLeaseAnnual: 4_000_000,
  },

  revenue: {
    occupancyPct: 88,
    ancillary: {
      parkingAnnual: 6_000_000,
      laundryAnnual: 4_200_000,
      utilitiesMarkupAnnual: 3_600_000,
      kiosksAnnual: 0,
    },
  },

  debt: undefined,
};

