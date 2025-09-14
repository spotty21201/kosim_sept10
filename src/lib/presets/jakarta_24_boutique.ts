import { Scenario } from "@/lib/types";

export const PRESET_JAKARTA_24_BOUTIQUE: Scenario = {
  id: "example-jkt-24",
  name: "Jakarta • 24-room Boutique",
  city: "Jakarta",
  // Land & rules
  siteArea: 504,
  kdb: 0.60,
  klb: 2.4,
  floors: 4,
  corridor: "central",
  efficiency: 0.78,

  // Rooms & mix (24 total)
  rooms: [
    { type: "standard", size: 11, rent: 2_200_000, fitout: 12_000_000, count: 14 },
    { type: "ensuite",  size: 14, rent: 3_200_000, fitout: 16_000_000, count: 8  },
    { type: "premium",  size: 20, rent: 4_500_000, fitout: 22_000_000, count: 2  },
  ],

  // CAPEX assumptions (2025 Jakarta believable ranges)
  capex: {
    land: { method: "own", rpPerSqm: 14_000_000 },
    structureRpPerSqm: 7_500_000,
    sharedAreaRpPerSqm: 4_500_000,
    brandingLaunch: 30_000_000,
    workingCapitalMonths: 3,
  },

  // OPEX (monthly → annualized in calc)
  opex: {
    caretakerMonthly: 4_500_000,
    cleaningPerRoomMonthly: 120_000,
    utilitiesRpPerSqmMonthly: 45_000,
    internetMonthly: 700_000,
    maintenancePerRoomMonthly: 90_000,
    marketing: { method: "pctRevenue", pct: 2 },
    pbbOrLeaseAnnual: 8_000_000,
  },

  // Revenue & occupancy
  revenue: {
    occupancyPct: 85,
    ancillary: {
      parkingAnnual: 18_000_000,
      laundryAnnual: 9_000_000,
      utilitiesMarkupAnnual: 6_000_000,
      kiosksAnnual: 0,
    },
  },

  debt: undefined,
};

