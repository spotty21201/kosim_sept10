import { create } from 'zustand';

export type RoomModule = {
  type: 'standard' | 'ensuite' | 'premium';
  size: number;
  rent: number;
  fitout: number;
  count: number;
  mix: number; // percentage 0-100
};

export type WizardStore = {
  // Step 1: Land & Rules
  siteArea: number;
  kdb: number;
  klb: number;
  floors: number;
  corridorType: 'central' | 'external';
  parkingSpots: number;
  
  // Step 2: Rooms & Mix
  roomModules: RoomModule[];
  totalRoomsTarget: number;
  
  // Step 3: Costs & Ops
  capex: {
    landCost: number;
    structureCost: number;
    fitoutCost: number;
    sharedAreaCost: number;
    brandingCost: number;
    workingCapital: number;
  };
  opex: {
    caretakerSalary: number;
    cleaningSalary: number;
    utilities: number;
    internet: number;
    maintenance: number;
    marketing: number;
    tax: number;
  };

  // Assumptions
  occupancyRatePercent: number; // overall occupancy percentage
  
  // Current step
  currentStep: number;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateLandRules: (data: Partial<Pick<WizardStore, 'siteArea' | 'kdb' | 'klb' | 'floors' | 'corridorType' | 'parkingSpots'>>) => void;
  updateRoomModules: (modules: RoomModule[]) => void;
  setTotalRoomsTarget: (total: number) => void;
  updateCosts: (data: Partial<Pick<WizardStore, 'capex' | 'opex'>>) => void;
};

export const useWizardStore = create<WizardStore>((set) => ({
  // Initial state
  siteArea: 500, // 500m2 typical medium plot
  kdb: 60, // default 60%
  klb: 1.2, // default 1.2
  floors: 3, // 3 story building
  corridorType: 'central',
  parkingSpots: 8, // 8 car spots
  
  roomModules: [
    {
      type: 'standard',
      size: 12,
      rent: 2_500_000, // Rp 2.5jt
      fitout: 15_000_000, // Rp 15jt
      count: 12,
      mix: 50,
    },
    {
      type: 'ensuite',
      size: 16,
      rent: 3_500_000, // Rp 3.5jt
      fitout: 25_000_000, // Rp 25jt
      count: 8,
      mix: 33,
    },
    {
      type: 'premium',
      size: 20,
      rent: 4_500_000, // Rp 4.5jt
      fitout: 35_000_000, // Rp 35jt
      count: 4,
      mix: 17,
    },
  ],

  totalRoomsTarget: 24,
  
  capex: {
    landCost: 3_500_000_000, // Rp 3.5M (7jt/m2)
    structureCost: 4_500_000_000, // Rp 4.5M (10jt/m2 GFA)
    fitoutCost: 750_000_000, // Rp 750jt
    sharedAreaCost: 500_000_000, // Rp 500jt
    brandingCost: 250_000_000, // Rp 250jt
    workingCapital: 500_000_000, // Rp 500jt
  },
  
  opex: {
    caretakerSalary: 5_000_000, // Rp 5jt/month
    cleaningSalary: 4_000_000, // Rp 4jt/month
    utilities: 7_500_000, // Rp 7.5jt/month
    internet: 3_000_000, // Rp 3jt/month
    maintenance: 5_000_000, // Rp 5jt/month
    marketing: 3_500_000, // Rp 3.5jt/month
    tax: 2_000_000, // Rp 2jt/month
  },

  occupancyRatePercent: 85,
  
  currentStep: 1,
  
  // Actions
  setCurrentStep: (step) => set({ currentStep: step }),
  
  updateLandRules: (data) => set((state) => ({
    ...state,
    ...data,
  })),
  
  updateRoomModules: (modules) => set({ roomModules: modules }),

  setTotalRoomsTarget: (total) => set({ totalRoomsTarget: total }),
  
  updateCosts: (data) => set((state) => ({
    ...state,
    ...data,
  })),
}));
