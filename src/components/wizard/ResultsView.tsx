import { useWizardStore } from "@/lib/store/wizard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { storeToScenario } from "@/lib/calc/adapter";
import { computeResults } from "@/lib/calc/metrics";
import { Button } from "@/components/ui/button";
import { Download, Save } from "lucide-react";
import { ExportButton } from "@/components/ui/export-button";
import { generateProjectPDF } from "@/lib/exports/pdf-export";

export function ResultsView() {
  const store = useWizardStore();
  const scn = storeToScenario(store);
  const { results: financials } = computeResults(scn);
  const handleDownloadPdf = async () => {
    const doc = await generateProjectPDF(store);
    doc.save(`KoSim-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Project Summary</h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => {}}>
            <Save className="w-4 h-4 mr-2" />
            Save Project
          </Button>
          <ExportButton />
          <Button variant="outline" size="sm" onClick={handleDownloadPdf}>
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="financial">Financial Analysis</TabsTrigger>
          <TabsTrigger value="rooms">Room Distribution</TabsTrigger>
          <TabsTrigger value="assumptions">Assumptions</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
              <CardDescription>Overall project performance indicators</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {/* We'll implement these metrics */}
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Payback Period</p>
                <p className="text-2xl font-bold">{financials.paybackYears.toFixed(1)} years</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">Rp {financials.capex.toLocaleString()}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                <p className="text-2xl font-bold">Rp {(financials.revenue/12).toLocaleString()}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          {/* We'll implement detailed financial analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Analysis</CardTitle>
              <CardDescription>Detailed breakdown of costs and returns</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Add charts and detailed metrics */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rooms" className="space-y-4">
          {/* We'll implement room distribution analysis */}
          <Card>
            <CardHeader>
              <CardTitle>Room Distribution</CardTitle>
              <CardDescription>Analysis of room types and occupancy</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Add room distribution charts */}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="assumptions" className="space-y-4">
          {/* We'll list all assumptions used in calculations */}
          <Card>
            <CardHeader>
              <CardTitle>Calculation Assumptions</CardTitle>
              <CardDescription>Parameters used in financial projections</CardDescription>
            </CardHeader>
            <CardContent>
              {/* TODO: Add assumptions list */}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
