export type TransportAccessibility = {
  mrt: boolean;
  lrt: boolean;
  busway: boolean;
  trainStation: boolean;
  busStop: boolean;
  distance: number; // in meters to nearest public transport
};

export type ParkingRequirement = {
  baseRatio: number;     // base parking spots per room
  maxReduction: number;  // maximum reduction possible (0-1)
  reductions: {
    mrt: number;        // reduction if near MRT
    lrt: number;        // reduction if near LRT
    busway: number;     // reduction if near Busway
    trainStation: number; // reduction if near train station
    busStop: number;    // reduction if near bus stop
  };
  distances: {
    mrt: number;        // max distance in meters for MRT reduction
    lrt: number;        // max distance in meters for LRT reduction
    busway: number;     // max distance in meters for Busway reduction
    trainStation: number; // max distance in meters for train station reduction
    busStop: number;    // max distance in meters for bus stop reduction
  };
  additionalRules: {
    commercialArea: number;      // additional ratio in commercial areas
    touristArea: number;        // additional ratio in tourist areas
    studentArea: number;        // additional ratio in student areas
    residentialArea: number;    // additional ratio in residential areas
  };
};

export type CityRegulation = {
  name: string;
  kdbRange: { min: number; max: number };
  klbRange: { min: number; max: number };
  maxFloors: number;
  minSiteArea: number;
  parkingRequirements: ParkingRequirement;
  setbacks: {
    front: number;
    side: number;
    back: number;
  };
  specialRules?: string[];
};

export type CityCode = 
  | 'JKT-C' | 'JKT-S' | 'JKT-E' | 'JKT-N' | 'JKT-W'  // Jakarta regions
  | 'BDG' | 'BDG-N' | 'BDG-S'  // Bandung regions
  | 'YOG' | 'SLM' | 'BTL'      // Yogyakarta regions
  | 'SBY' | 'SBY-W' | 'SBY-E'  // Surabaya regions
  | 'DPS' | 'BTB' | 'GYR'      // Bali regions
  | 'MLG' | 'SMG' | 'PKU' | 'PDG' | 'BKS' | 'TNG' | 'default';

export const CITY_REGULATIONS: Record<CityCode, CityRegulation> = {
  // Jakarta Regions
  'JKT-C': {
    name: 'Jakarta Central',
    kdbRange: { min: 40, max: 55 },
    klbRange: { min: 1.2, max: 3.0 },
    maxFloors: 4,
    minSiteArea: 120,
    parkingRequirements: {
      baseRatio: 0.4, // 4 spots per 10 rooms base requirement
      maxReduction: 0.6, // up to 60% reduction possible
      reductions: {
        mrt: 0.3,    // 30% reduction if near MRT
        lrt: 0.2,    // 20% reduction if near LRT
        busway: 0.15, // 15% reduction if near Busway
        trainStation: 0.2, // 20% reduction if near train station
        busStop: 0.1  // 10% reduction if near bus stop
      },
      distances: {
        mrt: 500,        // within 500m of MRT
        lrt: 400,        // within 400m of LRT
        busway: 300,     // within 300m of Busway
        trainStation: 750, // within 750m of train station
        busStop: 200     // within 200m of bus stop
      },
      additionalRules: {
        commercialArea: 0.2,      // +20% in CBD
        touristArea: 0.1,        // +10% in tourist areas
        studentArea: 0.0,        // no change in student areas
        residentialArea: -0.1    // -10% in residential areas
      }
    },
    setbacks: { front: 6, side: 2.5, back: 3 },
    specialRules: [
      'Premium building materials required in CBD area',
      'Minimum 35% green space in Menteng area',
      'Heritage building preservation rules in Kota Tua',
      'TOD parking reduction only applies with dedicated pedestrian access',
    ],
  },
  'JKT-S': {
    name: 'Jakarta South',
    kdbRange: { min: 40, max: 60 },
    klbRange: { min: 1.0, max: 2.8 },
    maxFloors: 4,
    minSiteArea: 100,
    parkingRatio: 0.35,
    setbacks: { front: 5, side: 2, back: 2.5 },
    specialRules: [
      'Extra drainage requirements in flood-prone areas',
      'Green building certification for sites > 500m²',
    ],
  },
  'JKT-E': {
    name: 'Jakarta East',
    kdbRange: { min: 45, max: 65 },
    klbRange: { min: 1.0, max: 2.6 },
    maxFloors: 4,
    minSiteArea: 90,
    parkingRatio: 0.3,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Industrial zone buffer requirements',
      'Additional noise insulation near airport',
    ],
  },
  'JKT-N': {
    name: 'Jakarta North',
    kdbRange: { min: 40, max: 60 },
    klbRange: { min: 1.0, max: 2.4 },
    maxFloors: 3,
    minSiteArea: 100,
    parkingRatio: 0.3,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Coastal zone building restrictions',
      'Extra foundation requirements in reclamation areas',
    ],
  },
  'JKT-W': {
    name: 'Jakarta West',
    kdbRange: { min: 45, max: 65 },
    klbRange: { min: 1.0, max: 2.6 },
    maxFloors: 4,
    minSiteArea: 95,
    parkingRatio: 0.3,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Transit-oriented development incentives near MRT',
      'Additional parking for commercial areas',
    ],
  },

  // Bandung Regions
  'BDG': {
    name: 'Bandung Central',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 0.9, max: 2.4 },
    maxFloors: 3,
    minSiteArea: 80,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 1.5, back: 2 },
    specialRules: [
      'Heritage zone restrictions in Braga area',
      'Art deco façade requirements in historic district',
    ],
  },
  'BDG-N': {
    name: 'Bandung North',
    kdbRange: { min: 40, max: 65 },
    klbRange: { min: 0.8, max: 2.0 },
    maxFloors: 3,
    minSiteArea: 90,
    parkingRatio: 0.2,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Hill slope construction restrictions',
      'View corridor preservation rules',
    ],
  },
  'BDG-S': {
    name: 'Bandung South',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 0.9, max: 2.2 },
    maxFloors: 3,
    minSiteArea: 85,
    parkingRatio: 0.3,
    setbacks: { front: 4, side: 1.5, back: 2 },
    specialRules: [
      'Educational zone specific requirements',
      'Student housing density restrictions',
    ],
  },

  // Yogyakarta Region
  'YOG': {
    name: 'Yogyakarta City',
    kdbRange: { min: 50, max: 75 },
    klbRange: { min: 0.8, max: 2.0 },
    maxFloors: 3,
    minSiteArea: 60,
    parkingRatio: 0.2,
    setbacks: { front: 3, side: 1.5, back: 1.5 },
    specialRules: [
      'Kraton cultural heritage zone restrictions',
      'Traditional Javanese architectural elements required',
    ],
  },
  'SLM': {
    name: 'Sleman',
    kdbRange: { min: 50, max: 80 },
    klbRange: { min: 0.8, max: 2.2 },
    maxFloors: 3,
    minSiteArea: 70,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 1.5, back: 2 },
    specialRules: [
      'University area development guidelines',
      'Volcanic hazard zone restrictions',
    ],
  },
  'BTL': {
    name: 'Bantul',
    kdbRange: { min: 55, max: 80 },
    klbRange: { min: 0.7, max: 1.8 },
    maxFloors: 2,
    minSiteArea: 65,
    parkingRatio: 0.2,
    setbacks: { front: 3, side: 1.5, back: 1.5 },
    specialRules: [
      'Rural area development guidelines',
      'Agricultural land preservation rules',
    ],
  },

  // Surabaya Regions
  'SBY': {
    name: 'Surabaya Central',
    kdbRange: { min: 40, max: 65 },
    klbRange: { min: 1.0, max: 2.8 },
    maxFloors: 4,
    minSiteArea: 90,
    parkingRatio: 0.3,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Commercial zone specific requirements',
      'Heritage building preservation in old town',
    ],
  },
  'SBY-W': {
    name: 'Surabaya West',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 0.9, max: 2.4 },
    maxFloors: 3,
    minSiteArea: 85,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Industrial buffer zone requirements',
      'Port area development restrictions',
    ],
  },
  'SBY-E': {
    name: 'Surabaya East',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 1.0, max: 2.6 },
    maxFloors: 4,
    minSiteArea: 85,
    parkingRatio: 0.3,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Coastal development guidelines',
      'New CBD area incentives',
    ],
  },

  // Bali Regions
  'DPS': {
    name: 'Denpasar',
    kdbRange: { min: 50, max: 65 },
    klbRange: { min: 0.8, max: 2.0 },
    maxFloors: 3,
    minSiteArea: 70,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Traditional Balinese architecture requirements',
      'Temple zone height restrictions',
    ],
  },
  'BTB': {
    name: 'Badung',
    kdbRange: { min: 45, max: 60 },
    klbRange: { min: 0.8, max: 1.8 },
    maxFloors: 3,
    minSiteArea: 80,
    parkingRatio: 0.3,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Tourist area development guidelines',
      'Beach setback requirements',
    ],
  },
  'GYR': {
    name: 'Gianyar',
    kdbRange: { min: 50, max: 70 },
    klbRange: { min: 0.7, max: 1.6 },
    maxFloors: 2,
    minSiteArea: 75,
    parkingRatio: 0.2,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Cultural heritage preservation rules',
      'Rice field view preservation',
    ],
  },

  // Other Major Cities
  'MLG': {
    name: 'Malang',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 0.8, max: 2.2 },
    maxFloors: 3,
    minSiteArea: 75,
    parkingRatio: 0.2,
    setbacks: { front: 3.5, side: 1.5, back: 2 },
    specialRules: [
      'University area specific requirements',
      'Colonial architecture preservation',
    ],
  },
  'SMG': {
    name: 'Semarang',
    kdbRange: { min: 40, max: 65 },
    klbRange: { min: 0.9, max: 2.4 },
    maxFloors: 4,
    minSiteArea: 85,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Coastal flood zone requirements',
      'Old town heritage preservation',
    ],
  },
  'PKU': {
    name: 'Pekanbaru',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 0.8, max: 2.2 },
    maxFloors: 3,
    minSiteArea: 80,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Peatland construction restrictions',
      'Fire safety requirements',
    ],
  },
  'PDG': {
    name: 'Padang',
    kdbRange: { min: 40, max: 65 },
    klbRange: { min: 0.8, max: 2.0 },
    maxFloors: 3,
    minSiteArea: 85,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 2, back: 2 },
    specialRules: [
      'Tsunami evacuation requirements',
      'Earthquake resistant construction',
    ],
  },
  'BKS': {
    name: 'Bekasi',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 1.0, max: 2.6 },
    maxFloors: 4,
    minSiteArea: 90,
    parkingRatio: 0.3,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Industrial area buffer requirements',
      'Transit-oriented development incentives',
    ],
  },
  'TNG': {
    name: 'Tangerang',
    kdbRange: { min: 45, max: 70 },
    klbRange: { min: 1.0, max: 2.6 },
    maxFloors: 4,
    minSiteArea: 90,
    parkingRatio: 0.3,
    setbacks: { front: 5, side: 2, back: 2 },
    specialRules: [
      'Airport zone noise insulation requirements',
      'Modern township development guidelines',
    ],
  },

  // Default fallback
  default: {
    name: 'Default',
    kdbRange: { min: 40, max: 70 },
    klbRange: { min: 0.8, max: 2.4 },
    maxFloors: 3,
    minSiteArea: 80,
    parkingRatio: 0.25,
    setbacks: { front: 4, side: 2, back: 2 },
  },
};
