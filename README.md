# KoSim — RumahKost Simulator (MVP)

**Predictive design & financial modeling for Rumah Kos (boarding houses) in Indonesia.**
KoSim helps developers, Bapak-Ibu Kos, and investors turn **land, building modules, and operations** into clear outputs: **room yield, ROI, payback timeline, and sensitivity analysis**.

It’s like a **spreadsheet + design simulator**, but faster, visual, and export-ready.

---

## ✨ Features

* **4-Step Wizard**: Land & Rules → Building Config → Financial Inputs → Results
* **Predictive Calculations**:

  * Room yield & average room size
  * Net leasable vs gross floor area
  * CAPEX, OPEX, Revenue, EBITDA, ROI, Payback
* **Charts**:

  * ROI vs Rooms curve (with current & peak markers)
  * Payback timeline (breakeven visualization)
* **Currency Inputs**: Supports shorthand common in Indonesia:

  * `2.4jt` → Rp 2,400,000
  * `2M` → Rp 2,000,000
  * `1.2B` → Rp 1,200,000,000
* **Exports**: Excel (ExcelJS) + PDF (jsPDF) with parity to on-screen numbers
* **Presets**: Jakarta, Yogya, and other city archetypes with KDB/KLB, land sizes, and market rents

---

## 🧑‍💻 User Story & Workflow

### Who uses KoSim?

* **Bapak-Ibu Kos / Small Owners** → explore if a plot of land can turn profitable with 10–30 rooms.
* **Developers / Architects** → simulate efficiency and ROI before committing to design.
* **Investors / Funders** → review scenarios with board-ready outputs (Excel/PDF).

### Workflow

1. **Enter Land & Rules**
   Input land area, KDB (coverage), KLB (FAR), and floors → instantly see maximum build potential.
2. **Configure Building & Rooms**
   Add room modules, circulation type, parking → get room counts & average size.
3. **Financial Inputs**
   Define rents, fit-out costs, OPEX assumptions → KoSim computes CAPEX, OPEX, and revenue.
4. **Results & Exports**
   View ROI %, payback years, and breakeven charts → export Excel/PDF to share with clients or partners.

---

## 🚀 Quick Start

```bash
npm install
npm run dev   # open http://localhost:3000
```

---

## 📂 Project Structure

* `/app/wizard` → 4-step wizard flow
* `/app/sim/[id]/summary` → Final summary page with export actions
* `/lib/calc` → Pure TS calculation engine (yield, capex, opex, revenue, ROI, payback)
* `/lib/exports` → Excel & PDF builders
* `/lib/presets` → City presets (Jakarta, Yogya, etc.)

---

## 🛠️ Tech Stack

* **Frontend**: Next.js 15 (App Router), Tailwind CSS 5, ShadCN UI
* **State**: Zustand (scenario store)
* **Charts**: Recharts (ROI, Payback visualizations)
* **Exports**: ExcelJS, jsPDF
* **Deploy**: Vercel (serverless, edge-ready)

---

## 📊 Example Outputs

* **Building Metrics**: land area, footprint, GFA, NLA, efficiency
* **Room Configuration**: total rooms, average room size, room type breakdown
* **Financial Metrics**: CAPEX, OPEX, Revenue, EBITDA, ROI %, Payback (years)
* **Sensitivity Flags**: ROI < 10% or Payback > 7 years marked as weak projects

---

## 📌 Roadmap

* [ ] Add Sensitivity Tornado (visualize rent/occupancy impact)
* [ ] Expand Presets (Bandung student hub, Bali co-living)
* [ ] Public Share Links (read-only project summaries)
* [ ] Map Integration (Jakarta Satu + Sentuh Tanahku APIs)
* [ ] Multi-scenario comparison dashboard
* [ ] Co-living / Airbnb diversification mode

---

## 🤝 Credits

Developed by:

* [**HDA Design**](https://hda.design) — Architecture & Urban Design
* [**AIM (Alami Intermedia)**](https://alamiintermedia.com) — AI-driven Design & Planning
* [**Kolabs.Design**](https://kolabs.design) — Innovation & Technology Lab

Version: `v0.1.0` (MVP)
