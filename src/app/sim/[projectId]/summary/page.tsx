"use client";

import { useRouter, useParams, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useWizardStore } from "@/lib/store/wizard";
import { ExportButton } from "@/components/ui/export-button";
import { Button } from "@/components/ui/button";
import { generateProjectPDF } from "@/lib/exports/pdf-export";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { storeToScenario } from "@/lib/calc/adapter";
import { computeResults } from "@/lib/calc/metrics";
import { generateRoiVsRooms } from "@/lib/calc/roiCurve";
import { formatIDR } from "@/lib/utils/currencyFormat";

const RoiVsRooms = dynamic(() => import("@/components/charts/RoiVsRooms").then(m => m.RoiVsRooms), { ssr: false });

export default function SummaryPage() {
  const router = useRouter();
  const { projectId } = useParams<{ projectId: string }>();
  const q = useSearchParams();
  const isPublic = (q.get("view") || "").toLowerCase() === "public";
  const store = (useWizardStore as any).getState?.();

  if (!store) {
    if (typeof window !== "undefined") router.replace(`/sim/${projectId}`);
    return null;
  }

  const onPdf = async () => {
    const doc = await generateProjectPDF(store);
    doc.save(`KoSim-Report-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const onShare = async () => {
    const url = window.location.href.replace(/[#?].*$/, "") + "?view=public";
    try { await navigator.clipboard.writeText(url); } catch {}
  };

  const [stamp, setStamp] = useState("");
  useEffect(() => {
    setStamp(new Date().toLocaleString());
  }, []);

  // Build scenario + results and derived stats
  const scenario = useMemo(() => storeToScenario(store), [store]);
  const { results } = useMemo(() => computeResults(scenario), [scenario]);
  const roiCurve = useMemo(() => generateRoiVsRooms(scenario), [scenario]);
  const footprint = scenario.siteArea * scenario.kdb;
  const gfa = footprint * scenario.floors;
  const nla = gfa * scenario.efficiency;
  const totalRooms = scenario.rooms.reduce((a: number, r: any) => a + (r.count ?? 0), 0);
  const avgRoomSz = totalRooms ? scenario.rooms.reduce((a: number, r: any) => a + r.size * (r.count ?? 0), 0) / totalRooms : 0;
  const fmtNum = (n: number) => new Intl.NumberFormat("id-ID").format(Math.round(n || 0));

  return (
    <div className={`max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-6 ${isPublic ? 'public-watermark' : ''}`}>
      <div className="actions sticky top-0 z-10 flex items-center justify-end gap-2 bg-white border-b border-slate-200 py-2 px-4 no-print" role="toolbar" aria-label="Summary actions">
        <ExportButton />
        <Button variant="outline" size="sm" onClick={onPdf} disabled={isPublic} aria-label="Export PDF">Export PDF</Button>
        <Button variant="outline" size="sm" onClick={onShare} aria-label="Share Link">Share Link</Button>
        <Button variant="outline" size="sm" onClick={() => router.push('/wizard')} disabled={isPublic} aria-label="Back to Edit">Back to Edit</Button>
      </div>

      <h1 className="text-xl font-semibold">Project Summary</h1>

      {/* Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
          <CardDescription>Investor-ready snapshot</CardDescription>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <tbody>
              <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Project ID</td><td className="py-2 font-medium">{projectId}</td></tr>
              <tr className="border-b"><td className="py-2 pr-4 text-slate-500">City</td><td className="py-2 font-medium">{scenario.city}</td></tr>
              <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Version</td><td className="py-2 font-medium">{process.env.NEXT_PUBLIC_APP_VERSION ?? 'v0.9'}</td></tr>
              <tr><td className="py-2 pr-4 text-slate-500">Generated At</td><td className="py-2 font-medium"><span suppressHydrationWarning>{stamp}</span></td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Land & Rules and Financials */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Land & Rules</CardTitle>
            <CardDescription>Site and building</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Land Area</td><td className="py-2 font-medium">{fmtNum(scenario.siteArea)} m²</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">KDB (BCR)</td><td className="py-2 font-medium">{(scenario.kdb * 100).toFixed(0)}%</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">KLB (FAR)</td><td className="py-2 font-medium">{scenario.klb}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Floors</td><td className="py-2 font-medium">{scenario.floors}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Corridor</td><td className="py-2 font-medium capitalize">{scenario.corridor}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Building Footprint</td><td className="py-2 font-medium">{fmtNum(footprint)} m²</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">GFA (Total Floor Area)</td><td className="py-2 font-medium">{fmtNum(gfa)} m²</td></tr>
                <tr><td className="py-2 pr-4 text-slate-500">NLA (Net Leasable)</td><td className="py-2 font-medium">{fmtNum(nla)} m²</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Metrics</CardTitle>
            <CardDescription>Calculated totals</CardDescription>
          </CardHeader>
          <CardContent>
            <table className="w-full text-sm">
              <tbody>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">CAPEX</td><td className="py-2 font-medium">{formatIDR(results.capex)}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">OPEX / year</td><td className="py-2 font-medium">{formatIDR(results.opex)}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">Revenue / year</td><td className="py-2 font-medium">{formatIDR(results.revenue)}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">EBITDA / year</td><td className="py-2 font-medium">{formatIDR(results.ebitda)}</td></tr>
                <tr className="border-b"><td className="py-2 pr-4 text-slate-500">ROI</td><td className="py-2 font-medium">{(results.roi * 100).toFixed(1)}%</td></tr>
                <tr><td className="py-2 pr-4 text-slate-500">Payback (years)</td><td className="py-2 font-medium">{results.paybackYears.toFixed(1)}</td></tr>
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>

      {/* Rooms */}
      <Card>
        <CardHeader>
          <CardTitle>Room Configuration</CardTitle>
          <CardDescription>Totals and breakdown</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div><p className="text-sm text-muted-foreground">Total Rooms</p><p className="text-2xl font-bold">{fmtNum(totalRooms)}</p></div>
            <div><p className="text-sm text-muted-foreground">Average Room Size</p><p className="text-2xl font-bold">{avgRoomSz.toFixed(1)} m²</p></div>
            <div><p className="text-sm text-muted-foreground">Occupancy</p><p className="text-2xl font-bold">{scenario.revenue.occupancyPct}%</p></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-slate-500">
                <tr>
                  <th className="text-left py-2">Type</th>
                  <th className="text-right">Count</th>
                  <th className="text-right">Size (m²)</th>
                  <th className="text-right">Rent (Rp/mo)</th>
                  <th className="text-right">Fitout (Rp/room)</th>
                </tr>
              </thead>
              <tbody>
                {scenario.rooms.map((r: any, i: number) => (
                  <tr key={i} className="border-t">
                    <td className="py-2 capitalize">{r.type}</td>
                    <td className="text-right">{fmtNum(r.count ?? 0)}</td>
                    <td className="text-right">{fmtNum(r.size)}</td>
                    <td className="text-right">{formatIDR(r.rent)}</td>
                    <td className="text-right">{formatIDR(r.fitout)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Charts</CardTitle>
          <CardDescription>ROI vs Rooms</CardDescription>
        </CardHeader>
        <CardContent>
          <RoiVsRooms data={roiCurve} currentRooms={totalRooms} />
        </CardContent>
      </Card>

      <div className="print-footer no-print">KoSim • <span suppressHydrationWarning>{stamp}</span></div>
    </div>
  );
}
