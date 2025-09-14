"use client";

import { useWizardStore } from "@/lib/store/wizard";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { validateLandRules, validateRumahKosConstraints } from "@/lib/validations/land-rules";
import { useState, useEffect } from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { ValidationMessage } from "@/components/ui/validation-message";
import { ParkingAccessibilityForm } from "./ParkingAccessibilityForm";
import { ParkingSummary } from "./ParkingSummary";
import { TransportAccessibility, AreaType, calculateParkingRequirement } from "@/lib/utils/parking-calculator";
import { estimateTotalRooms } from "@/lib/utils/yield-calculator";
import { PRESET_JAKARTA_24_BOUTIQUE, PRESET_YOGYA_16_STUDENT } from "@/lib/presets";
import { scenarioToStore } from "@/lib/calc/adapter";

interface ValidationState {
  errors: Record<string, string>;
  warnings: Record<string, string>;
}

import { CityCode, CITY_REGULATIONS } from "@/lib/config/city-regulations";

type ParkingCalcResult = {
  baseSpots: number;
  reducedSpots: number;
  finalSpots: number;
  reductions: { source: string; amount: number }[];
  adjustments: { source: string; amount: number }[];
};

export function LandRulesForm() {
  const { siteArea, kdb, klb, floors, corridorType, parkingSpots, roomModules, updateLandRules, updateRoomModules, updateCosts, setTotalRoomsTarget } =
    useWizardStore();
  
  const [selectedCity, setSelectedCity] = useState<CityCode>('default');
  const [transport, setTransport] = useState<TransportAccessibility>({
    mrt: false,
    lrt: false,
    busway: false,
    trainStation: false,
    busStop: false,
    distance: 1000,
  });
  const [areaType, setAreaType] = useState<AreaType>("residential");
  const [parkingCalc, setParkingCalc] = useState<{
    baseSpots: number;
    reducedSpots: number;
    finalSpots: number;
    reductions: { source: string; amount: number }[];
    adjustments: { source: string; amount: number }[];
  } | null>(null);
  
  const [validation, setValidation] = useState<ValidationState>({
    errors: {},
    warnings: {},
  });

  // Validate on any input change
  useEffect(() => {
    const data = { siteArea, kdb, klb, floors, corridorType, parkingSpots };
    const { errors } = validateLandRules(data, selectedCity);
    const warnings = validateRumahKosConstraints(data, selectedCity);
    setValidation({ errors, warnings });
  }, [siteArea, kdb, klb, floors, corridorType, parkingSpots, selectedCity]);

  // Estimate total rooms target based on yield formula
  useEffect(() => {
    const target = estimateTotalRooms(siteArea, kdb, floors, corridorType, roomModules);
    setTotalRoomsTarget(target);
  }, [siteArea, kdb, floors, corridorType, roomModules, setTotalRoomsTarget]);

  const cityRules = CITY_REGULATIONS[selectedCity];

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="text-sm text-muted-foreground">
          Start with a realistic example, then tune to your land and market. All fields are editable.
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              const patch = scenarioToStore(PRESET_JAKARTA_24_BOUTIQUE);
              updateLandRules({
                siteArea: patch.siteArea!,
                kdb: patch.kdb!,
                klb: patch.klb!,
                floors: patch.floors!,
                corridorType: patch.corridorType!,
                parkingSpots: patch.parkingSpots!,
              });
              if (patch.roomModules) updateRoomModules(patch.roomModules);
              if (patch.capex && patch.opex) updateCosts({ capex: patch.capex, opex: patch.opex });
              if (typeof (patch as any).occupancyRatePercent === 'number') {
                (useWizardStore as any).setState({ occupancyRatePercent: (patch as any).occupancyRatePercent });
              }
              if (typeof patch.totalRoomsTarget === 'number') setTotalRoomsTarget(patch.totalRoomsTarget);
            }}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Load: Jakarta 24-room Boutique
          </button>
          <button
            type="button"
            onClick={() => {
              const patch = scenarioToStore(PRESET_YOGYA_16_STUDENT);
              updateLandRules({
                siteArea: patch.siteArea!,
                kdb: patch.kdb!,
                klb: patch.klb!,
                floors: patch.floors!,
                corridorType: patch.corridorType!,
                parkingSpots: patch.parkingSpots!,
              });
              if (patch.roomModules) updateRoomModules(patch.roomModules);
              if (patch.capex && patch.opex) updateCosts({ capex: patch.capex, opex: patch.opex });
              if (typeof (patch as any).occupancyRatePercent === 'number') {
                (useWizardStore as any).setState({ occupancyRatePercent: (patch as any).occupancyRatePercent });
              }
              if (typeof patch.totalRoomsTarget === 'number') setTotalRoomsTarget(patch.totalRoomsTarget);
            }}
            className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
          >
            Load: Yogya 16-room Student
          </button>
        </div>
      </div>
      {/* City Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Location</CardTitle>
          <CardDescription>Select your project's city for specific regulations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Select
              value={selectedCity}
              onValueChange={(value: CityCode) => setSelectedCity(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a city" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {(Object.entries(CITY_REGULATIONS) as [CityCode, typeof cityRules][])
                    .filter(([code]) => code !== 'default')
                    .map(([code, rules]) => (
                      <SelectItem key={code} value={code}>
                        {rules.name}
                      </SelectItem>
                    ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {cityRules.specialRules && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <h4 className="font-medium mb-2">Special Rules for {cityRules.name}:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {cityRules.specialRules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Site Area Section */}
      <Card>
        <CardHeader>
          <CardTitle>Site Details</CardTitle>
          <CardDescription>Enter your land dimensions and area</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="siteArea">Site Area (m²)</Label>
            <Input
              id="siteArea"
              type="number"
              min={0}
              value={siteArea || ""}
              onChange={(e) =>
                updateLandRules({ siteArea: parseFloat(e.target.value) || 0 })
              }
              className={validation.errors.siteArea ? "border-destructive" : ""}
              placeholder="e.g. 200"
            />
            <ValidationMessage
              error={validation.errors.siteArea}
              warning={validation.warnings.siteArea}
            />
          </div>
        </CardContent>
      </Card>

      {/* Building Regulations */}
      <Card>
        <CardHeader>
          <CardTitle>Building Regulations</CardTitle>
          <CardDescription>Set KDB (BCR) and KLB (FAR) values</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>KDB - Building Coverage Ratio (%)</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[kdb]}
                  min={40}
                  max={80}
                  step={1}
                  onValueChange={([value]) => updateLandRules({ kdb: value })}
                  className={`flex-1 ${validation.errors.kdb ? "border-destructive" : ""}`}
                />
                <span className="w-12 text-right">{kdb}%</span>
              </div>
              <ValidationMessage
                error={validation.errors.kdb}
                warning={validation.warnings.kdb}
              />
            </div>

            <div className="space-y-2">
              <Label>KLB - Floor Area Ratio</Label>
              <div className="flex items-center space-x-4">
                <Slider
                  value={[klb]}
                  min={0.5}
                  max={4}
                  step={0.1}
                  onValueChange={([value]) => updateLandRules({ klb: value })}
                  className={`flex-1 ${validation.errors.klb ? "border-destructive" : ""}`}
                />
                <span className="w-12 text-right">{klb}x</span>
              </div>
              <ValidationMessage
                error={validation.errors.klb}
                warning={validation.warnings.klb}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Building Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Building Configuration</CardTitle>
          <CardDescription>Define your building layout</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="floors">Number of Floors</Label>
            <Input
              id="floors"
              type="number"
              min={1}
              max={4}
              value={floors}
              onChange={(e) =>
                updateLandRules({ floors: parseInt(e.target.value) || 1 })
              }
              className={validation.errors.floors ? "border-destructive" : ""}
            />
            <ValidationMessage
              error={validation.errors.floors}
              warning={validation.warnings.floors}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="corridorType">Corridor Type</Label>
            <Select
              value={corridorType}
              onValueChange={(value: 'central' | 'external') =>
                updateLandRules({ corridorType: value })
              }
            >
              <SelectTrigger className={validation.errors.corridorType ? "border-destructive" : ""}>
                <SelectValue placeholder="Select corridor type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="central">Central Corridor</SelectItem>
                  <SelectItem value="external">External Corridor</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
            <ValidationMessage
              error={validation.errors.corridorType}
              warning={validation.warnings.corridorType}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="parkingSpots">Parking Spots</Label>
            <Input
              id="parkingSpots"
              type="number"
              min={0}
              value={parkingSpots}
              onChange={(e) =>
                updateLandRules({ parkingSpots: parseInt(e.target.value) || 0 })
              }
              className={validation.errors.parkingSpots ? "border-destructive" : ""}
            />
            <ValidationMessage
              error={validation.errors.parkingSpots}
              warning={validation.warnings.parkingSpots}
            />
          </div>
        </CardContent>
      </Card>

      {/* Parking Accessibility */}
      <ParkingAccessibilityForm 
        onChange={({ transport: newTransport, areaType: newAreaType }) => {
          setTransport(newTransport);
          setAreaType(newAreaType);
          
          // Calculate parking requirements
          const cityRules = CITY_REGULATIONS[selectedCity];
          const roomCount = Math.floor((siteArea * (klb || 0)) / 20); // Assuming average room size of 20m²
          
          if (cityRules.parkingRequirements) {
            const result = calculateParkingRequirement(
              roomCount,
              cityRules.parkingRequirements,
              newTransport,
              newAreaType
            );
            setParkingCalc(result);
            updateLandRules({ parkingSpots: result.finalSpots });
          } else {
            const ratio = (cityRules as any).parkingRatio ?? 0;
            const fallbackSpots = Math.max(1, Math.ceil(roomCount * ratio));
            setParkingCalc(null);
            updateLandRules({ parkingSpots: fallbackSpots });
          }
        }}
      />

      {/* Parking Summary */}
      {parkingCalc && (
        <ParkingSummary
          baseSpots={parkingCalc.baseSpots}
          reducedSpots={parkingCalc.reducedSpots}
          finalSpots={parkingCalc.finalSpots}
          reductions={parkingCalc.reductions}
          adjustments={parkingCalc.adjustments}
        />
      )}

      {/* Building Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Building Summary</CardTitle>
          <CardDescription>Calculated based on your inputs</CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Total Built Area
              </dt>
              <dd className="text-2xl font-bold">
                {Math.round(siteArea * (kdb / 100))} m²
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Total Floor Area
              </dt>
              <dd className="text-2xl font-bold">
                {Math.round(siteArea * klb)} m²
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-muted-foreground">
                Estimated Room Count
              </dt>
              <dd className="text-2xl font-bold">
                {estimateTotalRooms(siteArea, kdb, floors, corridorType, roomModules)} rooms
              </dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  );
}
