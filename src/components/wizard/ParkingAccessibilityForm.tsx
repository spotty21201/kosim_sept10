"use client";

import { TransportAccessibility, AreaType } from "@/lib/utils/parking-calculator";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ParkingFormProps {
  onChange: (data: { transport: TransportAccessibility; areaType: AreaType }) => void;
}

export function ParkingAccessibilityForm({ onChange }: ParkingFormProps) {
  const [transport, setTransport] = useState<TransportAccessibility>({
    mrt: false,
    lrt: false,
    busway: false,
    trainStation: false,
    busStop: false,
    distance: 1000,
  });

  const [areaType, setAreaType] = useState<AreaType>("residential");

  const handleTransportChange = (key: keyof TransportAccessibility, value: boolean) => {
    const newTransport = { ...transport, [key]: value };
    setTransport(newTransport);
    onChange({ transport: newTransport, areaType });
  };

  const handleDistanceChange = (value: string) => {
    const distance = parseInt(value) || 0;
    const newTransport = { ...transport, distance };
    setTransport(newTransport);
    onChange({ transport: newTransport, areaType });
  };

  const handleAreaTypeChange = (value: AreaType) => {
    setAreaType(value);
    onChange({ transport, areaType: value });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transport Accessibility</CardTitle>
        <CardDescription>
          Specify nearby public transport options to calculate parking requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="mrt">MRT Station Nearby</Label>
            <Switch
              id="mrt"
              checked={transport.mrt}
              onCheckedChange={(checked) => handleTransportChange("mrt", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="lrt">LRT Station Nearby</Label>
            <Switch
              id="lrt"
              checked={transport.lrt}
              onCheckedChange={(checked) => handleTransportChange("lrt", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="busway">Busway Stop Nearby</Label>
            <Switch
              id="busway"
              checked={transport.busway}
              onCheckedChange={(checked) => handleTransportChange("busway", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="trainStation">Train Station Nearby</Label>
            <Switch
              id="trainStation"
              checked={transport.trainStation}
              onCheckedChange={(checked) => handleTransportChange("trainStation", checked)}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="busStop">Bus Stop Nearby</Label>
            <Switch
              id="busStop"
              checked={transport.busStop}
              onCheckedChange={(checked) => handleTransportChange("busStop", checked)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="distance">Distance to Nearest Transport (meters)</Label>
          <Input
            id="distance"
            type="number"
            min={0}
            max={2000}
            value={transport.distance}
            onChange={(e) => handleDistanceChange(e.target.value)}
            placeholder="e.g. 500"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areaType">Area Type</Label>
          <Select value={areaType} onValueChange={handleAreaTypeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select area type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="commercial">Commercial Area</SelectItem>
              <SelectItem value="tourist">Tourist Area</SelectItem>
              <SelectItem value="student">Student Area</SelectItem>
              <SelectItem value="residential">Residential Area</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
