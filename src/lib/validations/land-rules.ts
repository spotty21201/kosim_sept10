import { z } from "zod";
import { CITY_REGULATIONS, type CityCode } from "../config/city-regulations";

export const landRulesSchema = (cityCode: CityCode = 'default') => {
  const cityRules = CITY_REGULATIONS[cityCode];

  return z.object({
    siteArea: z
      .number()
      .positive("Site area must be positive")
      .min(cityRules.minSiteArea, `Site area must be at least ${cityRules.minSiteArea}m² in ${cityRules.name}`)
      .max(10000, "Site area cannot exceed 10,000m²"),
    
    kdb: z
      .number()
      .min(
        cityRules.kdbRange.min,
        `KDB cannot be less than ${cityRules.kdbRange.min}% in ${cityRules.name}`
      )
      .max(
        cityRules.kdbRange.max,
        `KDB cannot exceed ${cityRules.kdbRange.max}% in ${cityRules.name}`
      ),
    
    klb: z
      .number()
      .min(
        cityRules.klbRange.min,
        `KLB cannot be less than ${cityRules.klbRange.min} in ${cityRules.name}`
      )
      .max(
        cityRules.klbRange.max,
        `KLB cannot exceed ${cityRules.klbRange.max} in ${cityRules.name}`
      ),
    
    floors: z
      .number()
      .int("Number of floors must be a whole number")
      .min(1, "Building must have at least 1 floor")
      .max(
        cityRules.maxFloors,
        `Maximum ${cityRules.maxFloors} floors allowed in ${cityRules.name}`
      ),
    
    corridorType: z.enum(["central", "external"]),
    
    parkingSpots: z
      .number()
      .int("Number of parking spots must be a whole number")
      .min(0, "Parking spots cannot be negative"),
  })
  .superRefine((data, ctx) => {
    // Floors vs KLB/KDB
    const kdbRatio = (data.kdb ?? 0) / 100;
    if (kdbRatio > 0) {
      const maxFloorsByRatio = Math.ceil((data.klb ?? 0) / kdbRatio);
      if ((data.floors ?? 0) > maxFloorsByRatio) {
        ctx.addIssue({
          path: ["floors"],
          code: z.ZodIssueCode.custom,
          message: "Number of floors cannot exceed KLB/KDB ratio",
        });
      }
    }

    // Parking spots space check
    const openSpace = (data.siteArea ?? 0) * (1 - kdbRatio);
    const setbackArea = 2 * (cityRules.setbacks.front + cityRules.setbacks.back)
      + 2 * (cityRules.setbacks.side + cityRules.setbacks.side);
    const usableOpenSpace = Math.max(0, openSpace - setbackArea);
    const maxSpots = Math.floor(usableOpenSpace / 12.5);
    if ((data.parkingSpots ?? 0) > maxSpots) {
      ctx.addIssue({
        path: ["parkingSpots"],
        code: z.ZodIssueCode.custom,
        message: "Not enough open space for this many parking spots considering setbacks",
      });
    }
  });
};

export type LandRulesFormData = z.infer<ReturnType<typeof landRulesSchema>>;

export const validateLandRules = (data: Partial<LandRulesFormData>, cityCode: CityCode = 'default') => {
  try {
    const schema = landRulesSchema(cityCode);
    const result = schema.safeParse(data);
    if (!result.success) {
      const issues = (result.error as z.ZodError).issues ?? [];
      const errors = issues.reduce((acc: Record<string, string>, issue) => {
        const key = (issue.path?.[0] ?? 'general').toString();
        acc[key] = issue.message;
        return acc;
      }, {});
      return { isValid: false, errors };
    }
    return { isValid: true, errors: {} };
  } catch (error) {
    return {
      isValid: false,
      errors: { general: "Invalid input data" },
    };
  }
};

export const validateRumahKosConstraints = (
  data: Partial<LandRulesFormData>,
  cityCode: CityCode = 'default'
) => {
  const warnings: Record<string, string> = {};
  const cityRules = CITY_REGULATIONS[cityCode];

  if (data.siteArea && data.siteArea < cityRules.minSiteArea * 1.2) {
    warnings.siteArea = `Site area below ${Math.round(cityRules.minSiteArea * 1.2)}m² may be too small for efficient RumahKos in ${cityRules.name}`;
  }

  if (data.kdb && data.kdb > cityRules.kdbRange.max * 0.9) {
    warnings.kdb = `KDB above ${Math.round(cityRules.kdbRange.max * 0.9)}% may not leave enough open space for amenities in ${cityRules.name}`;
  }

  if (data.floors && data.floors > cityRules.maxFloors - 1) {
    warnings.floors = `More than ${cityRules.maxFloors - 1} floors may require additional permits in ${cityRules.name}`;
  }

  const totalBuildingArea = (data.siteArea || 0) * (data.klb || 0);
  const cityThreshold = cityRules.name === 'Jakarta' ? 1000 : 800;
  if (totalBuildingArea > cityThreshold) {
    warnings.klb = `Total building area above ${cityThreshold}m² requires special permits in ${cityRules.name}`;
  }

  // Add city-specific special rules warnings
  if (cityRules.specialRules) {
    cityRules.specialRules.forEach(rule => {
      warnings.general = warnings.general 
        ? `${warnings.general}\n${rule}`
        : `Special rule for ${cityRules.name}: ${rule}`;
    });
  }

  return warnings;
};
