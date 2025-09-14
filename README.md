# KoSim — RumahKost Simulator (MVP)

Predictive design & financial modeling for Rumah Kos in Indonesia. Converts land + modules + ops into room yield, ROI, payback. Includes presets, calc pipeline, and exports (PDF/XLS).

## Quick Start
- npm install
- npm run dev  # open http://localhost:3000

## Scripts
- dev    — Next dev (Turbopack)
- build  — Next build
- start  — Next start

## Structure
- /app/wizard           # 4-step wizard
- /app/sim/[id]/summary # final summary page
- /lib/calc             # pure TS calculations (yield, capex, opex, revenue, metrics)
- /lib/exports          # Excel/PDF builders
- /lib/presets          # Jakarta/Yogya example scenarios

## Exports
- Excel (ExcelJS) and PDF (jsPDF) matching on-screen numbers.

## Notes
- Currency inputs support shorthand: 2.4jt, 2M, 1.2B
- ROI vs Rooms chart with current & peak markers
