import { ParkingRequirement } from "../config/city-regulations";

export type TransportAccessibility = {
  mrt: boolean;
  lrt: boolean;
  busway: boolean;
  trainStation: boolean;
  busStop: boolean;
  distance: number;
};

export type AreaType = "commercial" | "tourist" | "student" | "residential";

export function calculateParkingRequirement(
  roomCount: number,
  parkingReq: ParkingRequirement,
  transport: TransportAccessibility,
  areaType: AreaType
): {
  baseSpots: number;
  reducedSpots: number;
  finalSpots: number;
  reductions: { source: string; amount: number }[];
  adjustments: { source: string; amount: number }[];
} {
  // Calculate base parking requirement
  const baseSpots = Math.ceil(roomCount * parkingReq.baseRatio);

  // Calculate transport-based reductions
  const reductions: { source: string; amount: number }[] = [];
  let totalReduction = 0;

  // Check each transport type
  if (transport.mrt && transport.distance <= parkingReq.distances.mrt) {
    reductions.push({
      source: "MRT Access",
      amount: parkingReq.reductions.mrt
    });
    totalReduction += parkingReq.reductions.mrt;
  }

  if (transport.lrt && transport.distance <= parkingReq.distances.lrt) {
    reductions.push({
      source: "LRT Access",
      amount: parkingReq.reductions.lrt
    });
    totalReduction += parkingReq.reductions.lrt;
  }

  if (transport.busway && transport.distance <= parkingReq.distances.busway) {
    reductions.push({
      source: "Busway Access",
      amount: parkingReq.reductions.busway
    });
    totalReduction += parkingReq.reductions.busway;
  }

  if (transport.trainStation && transport.distance <= parkingReq.distances.trainStation) {
    reductions.push({
      source: "Train Station Access",
      amount: parkingReq.reductions.trainStation
    });
    totalReduction += parkingReq.reductions.trainStation;
  }

  if (transport.busStop && transport.distance <= parkingReq.distances.busStop) {
    reductions.push({
      source: "Bus Stop Access",
      amount: parkingReq.reductions.busStop
    });
    totalReduction += parkingReq.reductions.busStop;
  }

  // Cap the reduction at maxReduction
  totalReduction = Math.min(totalReduction, parkingReq.maxReduction);

  // Calculate area-type adjustments
  const adjustments: { source: string; amount: number }[] = [];
  let areaAdjustment = 0;

  switch (areaType) {
    case "commercial":
      if (parkingReq.additionalRules.commercialArea !== 0) {
        adjustments.push({
          source: "Commercial Area",
          amount: parkingReq.additionalRules.commercialArea
        });
        areaAdjustment += parkingReq.additionalRules.commercialArea;
      }
      break;
    case "tourist":
      if (parkingReq.additionalRules.touristArea !== 0) {
        adjustments.push({
          source: "Tourist Area",
          amount: parkingReq.additionalRules.touristArea
        });
        areaAdjustment += parkingReq.additionalRules.touristArea;
      }
      break;
    case "student":
      if (parkingReq.additionalRules.studentArea !== 0) {
        adjustments.push({
          source: "Student Area",
          amount: parkingReq.additionalRules.studentArea
        });
        areaAdjustment += parkingReq.additionalRules.studentArea;
      }
      break;
    case "residential":
      if (parkingReq.additionalRules.residentialArea !== 0) {
        adjustments.push({
          source: "Residential Area",
          amount: parkingReq.additionalRules.residentialArea
        });
        areaAdjustment += parkingReq.additionalRules.residentialArea;
      }
      break;
  }

  // Calculate reduced spots before area adjustment
  const reducedSpots = Math.max(
    Math.ceil(baseSpots * (1 - totalReduction)),
    1
  );

  // Calculate final spots with area adjustment
  const finalSpots = Math.max(
    Math.ceil(reducedSpots * (1 + areaAdjustment)),
    1
  );

  return {
    baseSpots,
    reducedSpots,
    finalSpots,
    reductions,
    adjustments
  };
}
