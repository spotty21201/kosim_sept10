import { Scenario, Results } from "@/lib/types";
import { computeYield } from "@/lib/calc/yield";
import { revenueAnnual } from "@/lib/calc/revenue";
import { opexAnnual } from "@/lib/calc/opex";
import { capexTotal, type CapexBreakdown } from "@/lib/calc/capex";

function annualDebtService(principal: number, ratePct: number, years: number): number {
  const r = (ratePct / 100);
  const n = years;
  if (r <= 0 || n <= 0) return principal / Math.max(1, n);
  const annuity = (principal * r) / (1 - Math.pow(1 + r, -n));
  return annuity;
}

type ResultsContext = { yield: ReturnType<typeof computeYield>; capex: CapexBreakdown };

export function computeResults(scn: Scenario): { results: Results; context: ResultsContext } {
  const y = computeYield(scn);
  // opex preview without marketing pct
  let opexA = opexAnnual(scn, { usableGrossArea: y.usableGross, roomsTotal: y.roomsTotal });
  const revA = revenueAnnual(scn, y.rooms);
  // add marketing pct if applicable
  if (scn.opex.marketing.method === 'pctRevenue') {
    opexA += (scn.opex.marketing.pct ?? 0) / 100 * revA;
  }
  // capex with working capital using computed opex
  const capx = capexTotal(scn, { usableGrossArea: y.usableGross, efficiency: scn.efficiency, roomsTotal: y.roomsTotal, opexAnnualValue: opexA });

  const ebitda = revA - opexA;
  const roi = capx.total > 0 ? ebitda / capx.total : 0;
  const paybackYears = ebitda > 0 ? capx.total / ebitda : Infinity;

  let dscr: number | undefined;
  if (scn.debt) {
    const principal = capx.total * (scn.debt.ltvPct / 100);
    const debtService = annualDebtService(principal, scn.debt.ratePct, scn.debt.years);
    dscr = debtService > 0 ? ebitda / debtService : undefined;
  }

  const results: Results = {
    roomsTotal: y.roomsTotal,
    capex: Math.round(capx.total),
    opex: Math.round(opexA),
    revenue: Math.round(revA),
    ebitda: Math.round(ebitda),
    roi,
    paybackYears,
    dscr,
    charts: {
      roiVsRooms: [
        { rooms: Math.max(1, y.roomsTotal - 4), roi },
        { rooms: y.roomsTotal, roi },
        { rooms: y.roomsTotal + 4, roi },
      ],
      tornado: [],
      bepTimeline: [
        { year: 1, cumulative: -capx.total + ebitda },
        { year: 2, cumulative: -capx.total + 2 * ebitda },
        { year: 3, cumulative: -capx.total + 3 * ebitda },
      ],
    },
  };

  return { results, context: { yield: y, capex: capx } };
}
