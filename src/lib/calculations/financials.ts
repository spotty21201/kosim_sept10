import { WizardStore } from "@/lib/store/wizard";

interface FinancialMetrics {
  irr: number; // placeholder for now
  paybackPeriod: number; // years
  totalInvestment: number;
  monthlyRevenue: number;
  roi: number; // %
  monthlyExpenses: number;
  yearlyProfit: number; // EBITDA annual
  occupancyRate: number; // %
  cashflows: number[]; // annual cashflows for 5 years
}

function calculatePaybackPeriodFromEBITDA(totalInvestment: number, annualEBITDA: number): number {
  if (annualEBITDA <= 0) return Infinity;
  return totalInvestment / annualEBITDA;
}

export function calculateFinancials(store: WizardStore): FinancialMetrics {
  const occ = (store.occupancyRatePercent ?? 85) / 100;

  // Investment (CAPEX)
  const totalInvestment =
    store.capex.landCost +
    store.capex.structureCost +
    store.capex.fitoutCost +
    store.capex.sharedAreaCost +
    store.capex.brandingCost +
    store.capex.workingCapital;

  // OPEX monthly
  const monthlyExpenses =
    store.opex.caretakerSalary +
    store.opex.cleaningSalary +
    store.opex.utilities +
    store.opex.internet +
    store.opex.maintenance +
    store.opex.marketing +
    store.opex.tax;

  // Revenue monthly = sum(count * rent * occ)
  const monthlyRevenue = store.roomModules.reduce((total, room) => {
    const cnt = room.count || 0;
    return total + cnt * room.rent * occ;
  }, 0);

  // EBITDA annual
  const yearlyProfit = (monthlyRevenue - monthlyExpenses) * 12;

  // Simple 5y cashflow (no growth for alignment with MVP)
  const cashflows = [-totalInvestment];
  for (let year = 1; year <= 5; year++) {
    cashflows.push(yearlyProfit);
  }

  // Metrics
  const paybackPeriod = calculatePaybackPeriodFromEBITDA(totalInvestment, yearlyProfit);
  const roi = totalInvestment > 0 ? (yearlyProfit / totalInvestment) * 100 : 0;

  return {
    irr: 0, // not computed in MVP
    paybackPeriod,
    totalInvestment,
    monthlyRevenue,
    roi,
    monthlyExpenses,
    yearlyProfit,
    occupancyRate: Math.round((occ * 100) * 10) / 10,
    cashflows,
  };
}
