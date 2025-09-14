import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { WizardStore } from '@/lib/store/wizard';
import { storeToScenario } from '@/lib/calc/adapter';
import { computeResults } from '@/lib/calc/metrics';

export async function generateProjectPDF(store: WizardStore) {
  const doc = new jsPDF();\n  const scn = storeToScenario(store);\n  const { results: financials } = computeResults(scn);\n  const getY = (delta: number = 0) => {\n    const last = (doc as any).lastAutoTable?.finalY;\n    return (typeof last === 'number' ? last : 40) + delta;\n  };

  // Add title
  doc.setFontSize(20);
  doc.text('Project Feasibility Report', 20, 20);

  // Add project overview
  doc.setFontSize(16);
  doc.text('Project Overview', 20, 40);
  
  const overview = [
    ['Site Area', `${store.siteArea} m²`],
    ['Building Coverage', `${store.kdb}%`],
    ['Floor Area Ratio', store.klb.toString()],
    ['Number of Floors', store.floors.toString()],
    ['Corridor Type', store.corridorType],
    ['Parking Spots', store.parkingSpots.toString()],
  ];

  autoTable(doc, {
    startY: 50,
    head: [['Metric', 'Value']],
    body: overview,
  });

  // Add financial metrics
  doc.setFontSize(16);
  doc.text('Financial Analysis', 20, getY(20));

  const metrics = [
    ['Total Investment (CAPEX)', `Rp ${financials.capex.toLocaleString()}`],
    ['Monthly Revenue', `Rp ${(financials.revenue/12).toLocaleString()}`],
    ['Monthly Expenses', `Rp ${(financials.opex/12).toLocaleString()}`],
    ['EBITDA (Annual)', `Rp ${financials.ebitda.toLocaleString()}`],
    ['Payback Period', `${financials.paybackYears.toFixed(1)} years`],
    ['ROI', `${(financials.roi*100).toFixed(1)}%`],
  ];

  autoTable(doc, {
    startY: getY(30),
    head: [['Metric', 'Value']],
    body: metrics,
  });

  // Add room distribution
  doc.setFontSize(16);
  doc.text('Room Distribution', 20, getY(20));

  const roomDistribution = store.roomModules.map(room => [
    room.type,
    `${room.size} m²`,
    `Rp ${room.rent.toLocaleString()}`,
    `Rp ${room.fitout.toLocaleString()}`,
    `${room.count ?? 0}`,
  ]);

  autoTable(doc, {
    startY: getY(30),
    head: [['Type', 'Size', 'Rent', 'Fitout Cost', 'Count']],
    body: roomDistribution,
  });

  // Add operating costs breakdown
  doc.setFontSize(16);
  doc.text('Operating Costs', 20, getY(20));

  const opex = [
    ['Caretaker Salary', `Rp ${store.opex.caretakerSalary.toLocaleString()}`],
    ['Cleaning Salary', `Rp ${store.opex.cleaningSalary.toLocaleString()}`],
    ['Utilities', `Rp ${store.opex.utilities.toLocaleString()}`],
    ['Internet', `Rp ${store.opex.internet.toLocaleString()}`],
    ['Maintenance', `Rp ${store.opex.maintenance.toLocaleString()}`],
    ['Marketing', `Rp ${store.opex.marketing.toLocaleString()}`],
    ['Tax', `Rp ${store.opex.tax.toLocaleString()}`],
  ];

  autoTable(doc, {
    startY: getY(30),
    head: [['Cost Item', 'Monthly Amount']],
    body: opex,
  });

  // Add footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Generated on ${new Date().toLocaleDateString()}`,
      20,
      doc.internal.pageSize.height - 10
    );
    doc.text(
      `Page ${i} of ${pageCount}`,
      doc.internal.pageSize.width - 40,
      doc.internal.pageSize.height - 10
    );
  }

  return doc;
}
