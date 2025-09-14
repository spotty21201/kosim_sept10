# KoSim — RumahKost Simulator PRD (v1.0)

## 0) One-Liner
A predictive design & financial modeling tool for Indonesian **Rumah Kos** developers (Bapak-Ibu Kos, small/mid developers, investors). Converts land size, design modules, and operating assumptions into **room yield, ROI, payback, and scenario comparisons**, exportable to **PDF/XLS/GSheet**.

---

## 1) User Goals (Ranked)
1. **Estimate yield fast** → How many rooms fit my land? ROI/payback at a glance.
2. **Adjust safely** → Guardrails + local presets to avoid unrealistic numbers.
3. **Compare scenarios** → 2–5 side-by-side (e.g., 10 vs 20 vs boutique upgrade).
4. **Export investor-ready outputs** (PDF/XLS/Sheets).
5. **Save/share** → reload later, share read-only link.

---

## 2) Personas
- **Bapak-Ibu Kos (primary)**: landowners, not finance pros, want simple ROI clarity.
- **Small Developer (secondary)**: familiar with CAPEX/OPEX, wants to test scale-up scenarios.
- **Investor/Lender (tertiary)**: checks viability, needs Excel/Sheets for due diligence.

---

## 3) Core User Journey
1. **Welcome** → concise what/why + sample presets (Jakarta, Bandung, Yogya).
2. **Wizard (4 steps)**:
   - **Land & Rules**: site area, KDB/KLB, floors, corridor type, parking.
   - **Rooms & Mix**: module sizes (standard, ensuite, premium), mix %, absolute room targets.
   - **Costs & Ops**: CAPEX/OPEX with city presets (Rp/m², wages, utilities).
   - **Results**: tiles (CAPEX, OPEX, Revenue, EBITDA, ROI, Payback, DSCR optional).
3. **Scenario Manager** → Duplicate → tweak → Compare.
4. **Export** → PDF Board Pack, XLS, optional Google Sheets.
5. **Save/Share** → login with Clerk; share link.

---

## 4) UX Principles & Visual System
- **Mobile-first, wizard style**; thumb-reachable inputs.
- **Dark theme** with muted neutrals; accent color for CTAs.
- **Dual input mode**: sliders (%) and absolute sqm/room counts.
- **Explain-as-you-go** tooltips; avoid manuals.
- **Red flags** if thresholds crossed (Occ <70%, Payback >7 yrs, DSCR <1.2).
- **Local defaults**: Jakarta, Bandung, Yogya typical costs & rents.

---

## 5) Features (MVP Scope)
- Guided wizard (Land → Rooms → Costs → Results).
- Room yield calculator from site area & corridor strategy.
- Scenario manager (duplicate/compare).
- Presets: 10-room Yogya student, 20-room Bandung worker, 24-room Jakarta boutique.
- Sensitivity engine (Occ, Rent, Build cost, Fit-out, Utilities).
- Exports: PDF (Board Pack), XLS workbook (Assumptions, Calcs, Results, Scenarios, Sensitivity).
- Save/share projects with Clerk + Neon DB.

---

## 6) Domain Logic (Key Formulas)
### 6.1 Room Yield
```ts
usableArea = siteArea * KDB * floors * efficiency;
roomCount = floor(usableArea / avgRoomSize);
```

### 6.2 Revenue
```ts
rev = Σ (roomCount[type] * rent[type] * occupancy%) + ancillary;
```
Ancillary = parking + laundry + utilities markup + kiosks.

### 6.3 CAPEX
Land (lease/own) + structure (Rp/m²) + room fit-out + shared area + branding + working capital.

### 6.4 OPEX
Caretaker + cleaning + utilities (Rp/m²) + internet + maintenance + marketing + PBB/lease.

### 6.5 Metrics
EBITDA = Revenue – OPEX  
ROI = EBITDA ÷ CAPEX  
Payback = CAPEX ÷ EBITDA  
DSCR = NOI ÷ Debt Service (optional).

---

## 7) Scenario Comparison
- Table: CAPEX | OPEX | Revenue | EBITDA | ROI | Payback | DSCR.
- Charts: ROI vs Rooms, Tornado sensitivity, BEP timeline.
- Export scenario compare.

---

## 8) Exports
**PDF (Board Pack)**
- Page 1: Summary tiles + map snippet + risk flags.
- Page 2: Assumptions (city preset + user overrides).
- Page 3: Sensitivity tornado + ROI vs Rooms.
- Page 4: Scenario comparison.

**XLS**
- Tabs: Assumptions, Calcs, Results, Scenarios, Sensitivity.
- Named ranges, clean formulas.

**Google Sheets (optional)**
- Same structure as XLS; one-click API export.

---

## 9) Tech Design
### Frontend
- **Next.js 15 + TypeScript** on **Vercel**.
- Tailwind v5 + shadcn/ui; dark mode default.
- Zustand for scenario state; react-hook-form + zod for validation.
- Recharts (MVP); upgrade path to ECharts for tornado/waterfall.
- Mapbox GL JS for site picker; later Jakarta Satu + ATR/BPN layers.

### Backend
- Next.js API routes; server actions for export.
- Auth: Clerk (Email/Google).
- DB: Neon Postgres (Prisma).
- Storage: Vercel Blob or Supabase.
- Telemetry: PostHog; Errors: Sentry.

### Exports
- PDF: Playwright PDF (server HTML → PDF) or @react-pdf/renderer.
- XLS: ExcelJS with templates.

---

## 10) Data Model
```ts
type RoomModule = { type:"standard"|"ensuite"|"premium", size:number, rent:number, fitout:number };

type Scenario = {
  id: string; name: string; siteArea: number;
  kdb: number; klb: number; floors: number;
  corridor: "central"|"external";
  rooms: RoomModule[];
  capex: {...}; opex: {...}; revenue: {...};
};

type Results = { capex:number; opex:number; revenue:number;
  ebitda:number; roi:number; payback:number; dscr?:number;
};
```

---

## 11) Components Inventory
- `<WizardStep />` — guided flow.
- `<RoomMixForm />` — modules, counts, efficiency calc.
- `<SummaryTiles />` — CAPEX/OPEX/Revenue/ROI/Payback/DSCR.
- `<SensitivityChart />` — tornado.
- `<ScenarioCompare />` — table + charts.
- `<ExportBar />` — PDF/XLS/Sheets.
- `<MapPicker />` — site location.

---

## 12) Usability Details
- Wizard with sticky Next/Back.
- Numeric inputs → currency/percent formatted.
- Sliders + stepper + direct input.
- Mobile Lighthouse ≥85.
- Risk flags appear inline.

---

## 13) Acceptance Criteria
- Input changes recalc results <150ms.
- Scenario duplication works with all values.
- PDF/XLS exports match on-screen numbers.
- XLS opens cleanly in Excel & Google Sheets.
- Risk flags trigger at thresholds.

---

## 14) Build Plan (1-Week MVP)
- **Day 1–2:** Scaffold repo, Tailwind theme, calc engine (yield, capex, opex, revenue, metrics).
- **Day 3–4:** Wizard UI, Summary tiles, Scenario manager, Sensitivity charts.
- **Day 5:** PDF + XLS exports.
- **Day 6:** Risk flags, mobile polish, PostHog + Sentry.
- **Day 7:** City presets refined, Investor Pack polish, Demo ready.

---

## 15) Extensions (Post-MVP)
- Loan modeling (LTV, DSCR).
- Seasonality curve for rents.
- Co-living/Airbnb pivot mode.
- Preset editor (admin).
- i18n (EN/ID).

---

## 16) Risks & Mitigations
- **Input overload** → guided wizard, presets, reset-to-default.
- **Local accuracy** → presets by city+year, source note.
- **Export polish** → keep templates opinionated, add branding slot.

---

**End of PRD — KoSim v1.0**

