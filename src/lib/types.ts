export type Corridor = "central" | "external";
export type RoomType = "standard" | "ensuite" | "premium";

export type RoomModule = {
  type: RoomType;
  size: number;      // sqm (net)
  rent: number;      // Rp per month
  fitout: number;    // Rp per room
  count?: number;    // explicit count target
  sharePct?: number; // share if using mix (0..100)
};

export type Scenario = {
  id: string;
  name: string;
  city: "Jakarta" | "Bandung" | "Yogyakarta";
  siteArea: number;  // sqm
  kdb: number;       // 0..1
  klb: number;       // FAR
  floors: number;
  corridor: Corridor;
  efficiency: number; // 0..1 net:gross
  frontage?: number;
  depth?: number;
  parkingReq?: { carsPerUnit?: number; motosPerUnit?: number };

  rooms: RoomModule[];
  capex: {
    land: { method: "own" | "lease"; rpPerSqm?: number; years?: number; flat?: number };
    structureRpPerSqm: number;
    sharedAreaRpPerSqm: number;
    brandingLaunch: number;
    workingCapitalMonths: number;
  };
  opex: {
    caretakerMonthly: number;
    cleaningPerRoomMonthly: number;
    utilitiesRpPerSqmMonthly: number;
    internetMonthly: number;
    maintenancePerRoomMonthly: number;
    marketing: { method: "flat" | "pctRevenue"; flat?: number; pct?: number };
    pbbOrLeaseAnnual?: number;
  };
  revenue: {
    occupancyPct: number; // 0..100
    ancillary: {
      parkingAnnual?: number;
      laundryAnnual?: number;
      utilitiesMarkupAnnual?: number;
      kiosksAnnual?: number;
    };
  };
  debt?: { ltvPct: number; ratePct: number; years: number };
};

export type Results = {
  roomsTotal: number;
  capex: number;
  opex: number;
  revenue: number;
  ebitda: number;
  roi: number; // decimal
  paybackYears: number;
  dscr?: number;
  charts: {
    roiVsRooms: { rooms: number; roi: number }[];
    tornado: { key: string; deltaRoiPct: number }[];
    bepTimeline: { year: number; cumulative: number }[];
  };
};

