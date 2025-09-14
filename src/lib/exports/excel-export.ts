import ExcelJS from 'exceljs';
import { type WizardStore } from '@/lib/store/wizard';
import { storeToScenario } from '@/lib/calc/adapter';
import { computeResults } from '@/lib/calc/metrics';

// Accept the full wizard store for parity
type ExcelExportData = WizardStore;

interface SheetConfig {
  name: string;
  columns: { header: string; key: string; width: number }[];
}

export async function exportToExcel(data: ExcelExportData): Promise<Blob> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'KoSim';
  workbook.lastModifiedBy = 'KoSim';
  workbook.created = new Date();
  workbook.modified = new Date();

  const scn = storeToScenario(data);
  const { results: fin } = computeResults(scn);

  // Configure sheets
  const sheets: SheetConfig[] = [
    {
      name: 'Project Overview',
      columns: [
        { header: 'Parameter', key: 'parameter', width: 25 },
        { header: 'Value', key: 'value', width: 15 },
        { header: 'Unit', key: 'unit', width: 10 }
      ]
    },
    {
      name: 'Room Distribution',
      columns: [
        { header: 'Type', key: 'type', width: 15 },
        { header: 'Size', key: 'size', width: 12 },
        { header: 'Monthly Rent', key: 'rent', width: 15 },
        { header: 'Fitout Cost', key: 'fitout', width: 15 },
        { header: 'Count', key: 'count', width: 10 },
        { header: 'Mix (%)', key: 'mix', width: 10 }
      ]
    },
    {
      name: 'CAPEX',
      columns: [
        { header: 'Cost Item', key: 'item', width: 25 },
        { header: 'Amount', key: 'amount', width: 20 }
      ]
    },
    {
      name: 'OPEX',
      columns: [
        { header: 'Cost Item', key: 'item', width: 25 },
        { header: 'Monthly Amount', key: 'amount', width: 20 }
      ]
    },
    {
      name: 'Financials',
      columns: [
        { header: 'Metric', key: 'metric', width: 30 },
        { header: 'Value', key: 'value', width: 20 }
      ]
    }
  ];

  // Create and populate sheets
  sheets.forEach(sheetConfig => {
    const sheet = workbook.addWorksheet(sheetConfig.name);
    sheet.columns = sheetConfig.columns;

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF666666' }
    };

    // Add data based on sheet type
    switch (sheetConfig.name) {
      case 'Project Overview':
        sheet.addRows([
          { parameter: 'Site Area', value: data.siteArea, unit: 'm²' },
          { parameter: 'Building Coverage (KDB)', value: data.kdb, unit: '%' },
          { parameter: 'Floor Area Ratio (KLB)', value: data.klb, unit: 'ratio' },
          { parameter: 'Number of Floors', value: data.floors, unit: 'floors' },
          { parameter: 'Corridor Type', value: data.corridorType, unit: '-' },
          { parameter: 'Parking Spots', value: data.parkingSpots, unit: 'spots' },
          { parameter: 'Occupancy Rate', value: `${data.occupancyRatePercent}%`, unit: '%' },
          { parameter: 'Total Rooms Target', value: data.totalRoomsTarget, unit: 'rooms' }
        ]);
        break;

      case 'Room Distribution':
        sheet.addRows(
          data.roomModules.map(room => ({
            type: room.type,
            size: room.size,
            rent: room.rent.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
            fitout: room.fitout.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }),
            count: room.count || 0,
            mix: Math.round(room.mix || 0)
          }))
        );
        break;

      case 'CAPEX':
        sheet.addRows([
          { item: 'Land Cost', amount: data.capex.landCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Structure Cost', amount: data.capex.structureCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Fitout Cost', amount: data.capex.fitoutCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Shared Area Cost', amount: data.capex.sharedAreaCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Branding Cost', amount: data.capex.brandingCost.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Working Capital', amount: data.capex.workingCapital.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }
        ]);
        break;

      case 'OPEX':
        sheet.addRows([
          { item: 'Caretaker Salary', amount: data.opex.caretakerSalary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Cleaning Staff Salary', amount: data.opex.cleaningSalary.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Utilities', amount: data.opex.utilities.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Internet', amount: data.opex.internet.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Maintenance', amount: data.opex.maintenance.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Marketing', amount: data.opex.marketing.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { item: 'Tax', amount: data.opex.tax.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) }
        ]);
        break;
      case 'Financials':
        sheet.addRows([
          { metric: 'Total Investment (CAPEX)', value: fin.capex.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { metric: 'Monthly Revenue', value: (fin.revenue/12).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { metric: 'Monthly Expenses', value: (fin.opex/12).toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { metric: 'EBITDA (Annual)', value: fin.ebitda.toLocaleString('id-ID', { style: 'currency', currency: 'IDR' }) },
          { metric: 'ROI', value: `${(fin.roi*100).toFixed(1)}%` },
          { metric: 'Payback Period', value: `${fin.paybackYears.toFixed(1)} years` },
          { metric: 'Occupancy Rate', value: `${data.occupancyRatePercent}%` },
        ]);
        break;
    }

    // Auto-fit columns
    sheet.columns.forEach(column => {
      column.alignment = { vertical: 'middle' };
    });
  });

  // Generate Excel file
  const buffer = await workbook.xlsx.writeBuffer();
  return new Blob([buffer], { 
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
  });
}
