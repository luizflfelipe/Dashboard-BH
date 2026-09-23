# People Analytics MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive, read-only People Analytics dashboard with four navigable screens and clearly labeled fictional demonstration data.

**Architecture:** React/Vite/TypeScript frontend with a small normalized domain model and local demo repository. Keep the data access boundary replaceable by a future Apps Script JSON endpoint; avoid asserting that demo metrics or event rules match the real spreadsheet.

**Tech Stack:** React, Vite, TypeScript strict, Tailwind CSS, Recharts, lucide-react.

**Spec:** `PEOPLE_ANALYTICS_MVP.md`

## Global Constraints

- Dashboard is read-only and Google Sheets remains the official source once integrated.
- Do not expose unnecessary personal data; demo and frontend models exclude sensitive fields.
- Do not invent business rules as validated; demo values are clearly marked fictional.
- Sidebar contains only Visão Geral, Quadro Atual, Movimentações, Histórico.
- Keep executive home minimal; historical data only represents the available monthly consolidations.
- Treat event data as illustrative until source mappings are validated.

## Review Focus

- Empty or unavailable data: show a clear empty state and never imply demo data is live.
- Search/filter combinations: preserve consistent counts and rows.
- Missing dates and non-numeric metrics: avoid fabricated chart points or crashes.
- Narrow screens: keep navigation and tables usable without clipped content.
- API failure/missing endpoint: show demo-mode label and a clear integration status.

---

### Task 1: Scaffold the frontend

**Files:** `package.json`, `index.html`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `postcss.config.js`, `tailwind.config.ts`, `src/main.tsx`, `src/index.css`

**Interfaces:** Produces a runnable React/Vite/TypeScript strict application shell.

- [ ] Create Vite React TypeScript project configuration and dependencies for Tailwind, Recharts and icons.
- [ ] Add HTML entrypoint, Tailwind directives and responsive base styling.
- [ ] Run `npm install` and `npm run build`; resolve configuration errors.

### Task 2: Define normalized models and demo data boundary

**Files:** `src/types/people.ts`, `src/data/demoPeopleData.ts`, `src/data/peopleRepository.ts`

**Interfaces:** `Employee`, `MonthlySnapshot`, `Movement`, `DashboardData`, `PeopleRepository.getDashboardData(): Promise<DashboardData>`.

- [ ] Define privacy-safe employee, snapshot, movement, and KPI types.
- [ ] Add small coherent fictional demo data and mark dataset metadata `source: 'demo'` / `isFictional: true`.
- [ ] Expose data through an async repository function so Apps Script can replace it later.
- [ ] Ensure no sensitive fields (CPF, RG, address, phone, birth date, personal email) exist in frontend types/data.

### Task 3: Build shared shell and navigation

**Files:** `src/App.tsx`, `src/components/AppShell.tsx`, `src/components/Sidebar.tsx`, `src/components/DemoNotice.tsx`

**Interfaces:** Four page routes/views: overview, current roster, movements, history. Persistent fictional-data notice.

- [ ] Add compact responsive sidebar with exactly four navigation entries.
- [ ] Add page heading/content shell and mobile navigation treatment.
- [ ] Display a visible notice that all current numbers are fictional demonstration data.

### Task 4: Implement Overview

**Files:** `src/pages/OverviewPage.tsx`, `src/components/StatCard.tsx`, `src/components/HeadcountChart.tsx`, `src/components/StatusDistribution.tsx`

**Interfaces:** Consumes `DashboardData`; displays six specified KPIs, monthly headcount line, and simple current status composition.

- [ ] Render only Total Geral, Ativos, Afastados, Férias, Desligados, Transferidos KPIs.
- [ ] Render headcount trend from monthly demo snapshots.
- [ ] Render status distribution with accessible labels and restrained colors.
- [ ] Include loading, error, and no-data states.

### Task 5: Implement Current Roster

**Files:** `src/pages/RosterPage.tsx`, `src/components/DistributionBars.tsx`

**Interfaces:** Searchable/filterable privacy-safe employee table plus summaries grouped by site and channel.

- [ ] Add search by employee name and filters for Site, Canal, Equipe, Status.
- [ ] Add horizontal count summaries by site and channel based on filtered rows.
- [ ] Display only Nome, Função, Equipe, Site, Coordenador, Status.
- [ ] Keep the detail panel out of scope while leaving component state boundaries easy to extend.

### Task 6: Implement Movements

**Files:** `src/pages/MovementsPage.tsx`, `src/components/MovementsChart.tsx`

**Interfaces:** Displays demo admissions, dismissals, transfer counts, net balance, vacation summary, monthly series and recent movements.

- [ ] Label all metrics/events as fictional and illustrative.
- [ ] Calculate saldo as admissions minus dismissals only; do not include transfers.
- [ ] Render admissions/dismissals over time and compact vacation counters.
- [ ] Render recent movements table with date, person, type, role, site.
- [ ] Handle absent/invalid event dates by omitting those records from dated charts.

### Task 7: Implement History

**Files:** `src/pages/HistoryPage.tsx`, `src/components/HistoryTable.tsx`

**Interfaces:** Year selector, selectable monthly series (Total, Ativos, Afastados, Desligados), monthly table.

- [ ] Start with 2025 fictional monthly consolidated values.
- [ ] Allow choosing visible chart series without overcrowding.
- [ ] Render month, quadro, ativos, afastados, desligados table.
- [ ] Add clear no-year/no-monthly-data state.

### Task 8: Connect views and verify delivery

**Files:** `src/App.tsx`, project config as needed.

- [ ] Wire repository loading and view selection across all four pages.
- [ ] Run `npm run build` and resolve TypeScript/build failures.
- [ ] Review all four pages at desktop and narrow viewport widths.
- [ ] Document setup and the Apps Script integration boundary in `README.md`.
