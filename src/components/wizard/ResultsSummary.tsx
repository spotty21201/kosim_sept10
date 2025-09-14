"use client";

import { useWizardStore, type WizardStore as StoreType } from "@/lib/store/wizard";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ExportButton } from "@/components/ui/export-button";
import { Download } from "lucide-react";
import { generateProjectPDF } from "@/lib/exports/pdf-export";
import { storeToScenario } from "@/lib/calc/adapter";
import { computeResults } from "@/lib/calc/metrics";
import { generateRoiVsRooms } from "@/lib/calc/roiCurve";
import { RoiVsRooms } from "@/components/charts/RoiVsRooms";

export function ResultsSummary() {
  const { siteArea, kdb, floors, roomModules, occupancyRatePercent } = useWizardStore();

  const scenario = storeToScenario(useWizardStore.getState?.() as StoreType);
  const { results } = computeResults(scenario);
  const roiCurve = generateRoiVsRooms(scenario);

  const handleDownloadPdf = async () => {
    const fullStore = useWizardStore.getState?.() as StoreType;
    const doc = await generateProjectPDF(fullStore);
    doc.save(`KoSim-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  // Calculate building metrics
  const buildingFootprint = (siteArea * kdb) / 100; // m²
  const totalBuildingArea = buildingFootprint * floors; // m²
  const buildingEfficiency = 0.85; // Assuming 85% efficiency
  const netLeasableArea = totalBuildingArea * buildingEfficiency; // m²

  // Calculate room metrics
  const totalRooms = roomModules.reduce((sum, r) => sum + (r.count || 0), 0);
  const averageRoomSize = totalRooms > 0
    ? roomModules.reduce((sum, room) => sum + room.size * (room.count || 0), 0) / totalRooms
    : 0;

  // Calculate financial metrics
  const totalCapex = results.capex;
  const annualOpex = results.opex;

  // Calculate revenue metrics
  const annualRevenue = results.revenue;
  const monthlyRevenue = annualRevenue / 12;
  const monthlyOpex = annualOpex / 12;
  const annualNetIncome = results.ebitda;

  // Calculate key financial ratios
  const operatingMargin = annualRevenue > 0 ? (annualNetIncome / annualRevenue) * 100 : 0;
  const roi = results.roi * 100;
  const paybackPeriod = results.paybackYears;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Results</h3>
        <div className="flex gap-2">
          <ExportButton />
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>
      {/* Building Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Building Metrics</CardTitle>
          <CardDescription>Physical characteristics and space utilization</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Land Area</p>
              <p className="text-2xl font-bold">{siteArea.toLocaleString()} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Building Footprint</p>
              <p className="text-2xl font-bold">{buildingFootprint.toLocaleString()} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Building Area</p>
              <p className="text-2xl font-bold">{totalBuildingArea.toLocaleString()} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Net Leasable Area</p>
              <p className="text-2xl font-bold">{netLeasableArea.toLocaleString()} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Number of Floors</p>
              <p className="text-2xl font-bold">{floors}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Parking Spots</p>
              <p className="text-2xl font-bold">{parkingSpots}</p>
            </div>
          </div>
          <div className="mt-6">
            <h4 className="font-semibold mb-2">ROI vs Rooms</h4>
            <RoiVsRooms data={roiCurve} currentRooms={totalRooms} />
          </div>
        </CardContent>
      </Card>

      {/* Room Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Room Configuration</CardTitle>
          <CardDescription>Room types and distribution</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Rooms</p>
              <p className="text-2xl font-bold">{totalRooms}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Room Size</p>
              <p className="text-2xl font-bold">{averageRoomSize.toFixed(1)} m²</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Room Types</p>
              <p className="text-2xl font-bold">{new Set(roomModules.map(r => r.type)).size}</p>
            </div>
          </div>
          
          {roomModules.length > 0 && (
            <>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Room Type Distribution</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Array.from(new Set(roomModules.map(r => r.type))).map(type => {
                    const count = roomModules
                      .filter(r => r.type === type)
                      .reduce((sum, r) => sum + (r.count || 0), 0);
                    return (
                      <div key={type} className="flex justify-between items-center">
                        <span className="capitalize">{type}</span>
                        <span className="font-semibold">{count} rooms</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Financial Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Financial Analysis</CardTitle>
          <CardDescription>Investment and returns overview</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Investment (CAPEX)</p>
              <p className="text-2xl font-bold">Rp {totalCapex.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Annual Revenue</p>
              <p className="text-2xl font-bold">Rp {annualRevenue.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Annual OPEX</p>
              <p className="text-2xl font-bold">Rp {annualOpex.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Annual Net Income</p>
              <p className="text-2xl font-bold">Rp {annualNetIncome.toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Operating Margin</p>
              <p className="text-2xl font-bold">{operatingMargin.toFixed(1)}%</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Return on Investment</p>
              <p className="text-2xl font-bold">{roi.toFixed(1)}%</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="font-semibold">Key Financial Indicators</h4>
            <div className="grid gap-4">
              <div className="flex justify-between items-center">
                <span>Payback Period</span>
                <span className="font-semibold">{paybackPeriod.toFixed(1)} years</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Monthly Revenue per m²</span>
                <span className="font-semibold">
                  Rp {(monthlyRevenue / netLeasableArea).toFixed(0).toLocaleString()}/m²
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Monthly OPEX per m²</span>
                <span className="font-semibold">
                  Rp {(monthlyOpex / netLeasableArea).toFixed(0).toLocaleString()}/m²
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span>Occupancy</span>
                <span className="font-semibold">{occupancyRatePercent}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
