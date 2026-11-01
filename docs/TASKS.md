# TASKS.md — DanaTerbuka

> **Nama file:** `docs/TASKS.md` · **Versi:** 1.0.0 · **Tanggal:** 1 November 2026
> **Prasyarat:** Semua dokumen spec v1.0.0 (`PRD`, `DATA_SPEC`, `ARCHITECTURE`, `UI_SPEC`, `AGENTS`).
> **Aturan:** Task ID (`T-xxx`) bersifat final. `depends_on` wajib selesai sebelum task dimulai. AC = perintah yang bisa dijalankan; exit 0 = lulus.

---

## 1. Ringkasan Milestone

| Milestone | Fokus | Task | Prasyarat |
|-----------|-------|------|-----------|
| **M0** | Scaffolding monorepo, CI, Data Discovery | T-001 – T-005 | — |
| **M1** | Pipeline ETL, fixture, metrik shared | T-006 – T-010 | M0 |
| **M2** | API Express (endpoint + middleware + fallback) | T-011 – T-016 | M1 |
| **M3** | Frontend inti (dashboard, filter, state, chart) | T-017 – T-025 | M2 |
| **M4** | Perbandingan + insight UI | T-026 – T-028 | M3 |
| **M5** | Edukasi, ekspor, microcopy, SEO halaman | T-029 – T-035 | M3 (T-027 untuk T-028) |
| **M6** | Aksesibilitas, performa, deploy, demo, gate akhir | T-036 – T-041 | M4, M5 |
| **M7** | Penggantian UI oleh tim desain | T-042 | M6 |

---

## 2. Daftar Task

Ukuran: **S** ≤ 2 jam · **M** ≤ ½ hari · **L** ≤ 1 hari.

### M0 — Scaffolding, CI, Data Discovery

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-001 | Scaffold monorepo pnpm | — | NFR-011 | `pnpm-workspace.yaml`, `tsconfig.base.json`, `package.json` (root + 5 paket), `.nvmrc`, `.env.example` | `pnpm install && pnpm -r typecheck` exit 0; folder `apps/web`, `apps/api`, `packages/shared`, `pipeline`, `e2e` ada | M |
| T-002 | Setup `packages/shared` | T-001 | NFR-011 | `packages/shared/package.json`, `tsconfig.json`, `vitest.config.ts`, `src/index.ts` | `pnpm --filter @danaterbuka/shared typecheck && pnpm --filter @danaterbuka/shared test` exit 0 | S |
| T-003 | ESLint + Prettier config | T-001 | NFR-011 | `eslint.config.js`, `prettier.config.cjs` (aturan impor ARCHITECTURE §3.2) | `pnpm lint` exit 0 | S |
| T-004 | Data Discovery Fase 0 | T-001 | A-02, A-03 | `docs/data/DISCOVERY.md`, `data/reference/discovery.json` | `discovery.json` lolos `DiscoveryReportSchema.parse`; tabel DS-01…DS-05 terisi status final | M |
| T-005 | Setup CI | T-003 | NFR-011 | `.github/workflows/ci.yml` | Push ke branch → 4 job (`quality`, `unit`, `build`, `e2e`) jalan; `quality` lulus | S |

### M1 — Pipeline & Fixture

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-006 | Data referensi | T-002 | A-04, A-13 | `data/reference/regions.json`, `sectors.json`, `aliases.json` | 5 region + 10 sector lolos `RegionSchema`/`SectorSchema` parse | S |
| T-007 | Fixture generator + verify | T-006 | FR-003, FX-01–06 | `data/fixtures/*.json`, `pipeline/src/fixtures/generate.ts` | `pnpm fixtures:generate && pnpm fixtures:verify` exit 0; 150 record; nilai anchor §6.3 persis | M |
| T-008 | Pipeline ETL | T-007 | FR-001, FR-004, NFR-020 | `pipeline/src/{index,extract/*,clean,normalize,validate,quality,write}.ts` | `pnpm pipeline` → `snapshot.v1.json` + `quality-report.json` ada; `received = accepted + rejected`; 3 corrupt record ditolak; hash stabil (`pnpm pipeline:check` exit 0) | L |
| T-009 | Metrik shared (M-01…M-06) | T-002 | FR-010–012, FR-030–031 | `packages/shared/src/metrics/*.ts` + `*.test.ts` | `pnpm --filter @danaterbuka/shared test` — semua metrik + `aggregateTotals` lulus; edge case pagu=0, null, >100% | M |
| T-010 | Adapter SIKD (stub) | T-008 | A-02 | `pipeline/src/extract/sikd.ts` | `import { extractSikd }` → throw `SOURCE_NOT_CONFIGURED` | S |

### M2 — API

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-011 | API scaffolding + middleware | T-002 | NFR-007, NFR-008, NFR-013 | `apps/api/src/{index,app,env,config/*,middleware/*,lib/*}.ts` | `pnpm --filter @danaterbuka/api dev` → listening 3001; `curl -I localhost:3001/api/health` punya header helmet; rate-limit test lulus | M |
| T-012 | Repository (snapshot + fixture + fallback) | T-008, T-011 | FR-001, FR-005, NFR-009 | `apps/api/src/repositories/*.ts` | Startup dengan snapshot valid → `dataStatus: ready`; snapshot korup → fallback fixture + `dataStatus: degraded` + log `SNAPSHOT_INVALID`; tes `health.test.ts`, `fallback.test.ts` lulus | M |
| T-013 | Endpoint health, meta, regions, sectors | T-012 | FR-002, NFR-004 | `apps/api/src/{routes,controllers,services}/{health,meta,regions,sectors}.*` | `GET /api/health` → 200 `{ status, dataStatus, recordCount }`; `GET /api/meta` → 200 + `availableYears`, `defaultRegionSlug`; respons lolos `SourceMetaSchema`; `meta.contract.test.ts` lulus | M |
| T-014 | Endpoint budget (summary, sectors, trend) | T-013, T-009 | FR-010–012 | `apps/api/src/{routes,controllers,services}/budget.*` | `GET /api/budget/summary?region=provinsi-nusa-utara&year=2024` → pagu 2.4T, realisasi 1.8T, rate 75.0; sectors → 10+1 slices; trend → 5 titik; tes `budget.*.test.ts` lulus | M |
| T-015 | Endpoint budget/compare | T-014 | FR-030, FR-031 | `budget.route.ts` (tambah), `budget.service.ts`, `budget.compare.test.ts` | `mode=region` → 3 rows + 3 topSectorDeltas; `a===b` → 400; delta 400M, 20.0%; tes lulus | M |
| T-016 | Endpoint insights | T-009, T-013 | FR-040, FR-041 | `apps/api/src/{routes,controllers,services}/insights.*` | `GET /api/insights?region=provinsi-nusa-utara&year=2024` → 3–5 items; INS-01 memuat "30,0%"; 0 kata terlarang; tes `insights.test.ts` lulus | M |

### M3 — Frontend Inti

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-017 | Web scaffolding | T-001 | NFR-010, NFR-017 | `apps/web/{vite.config,tailwind.config,index.html,src/main.tsx,src/app/*,src/styles/*}.ts(x)` | `pnpm --filter @danaterbuka/web dev` → halaman kosong di localhost:5173; `pnpm --filter @danaterbuka/web build` sukses; proxy `/api` aktif | M |
| T-018 | Layout + komponen UI dasar | T-017 | NFR-005, UI-04 | `components/layout/*`, `components/ui/*` (Button, Card, Select, Tooltip, ChartWrapper) | Komponen render tanpa error; semua memakai token; `/dev/components` menampilkan setiap komponen | M |
| T-019 | HomePage | T-018 | — | `pages/HomePage.tsx`, `components/` (HeroSection, ValueCard, CtaButton, DataSourceNote) | `/` render hero + 3 kartu + CTA; `FixtureBadge` tampil saat `isFixture`; tes `home.test.tsx` lulus | S |
| T-020 | DashboardPage — SummaryCards | T-018, T-014 | FR-010, FR-014 | `pages/DashboardPage.tsx`, `components/dashboard/SummaryCards.tsx`, `hooks/useBudgetSummary.ts` | `/dashboard` → 4 kartu (`summary-pagu`, `summary-realisasi`, `summary-rate`, `summary-gap`) dengan nilai anchor; 4 state tampil; tes lulus | M |
| T-021 | SectorChart + tabel alternatif | T-020 | FR-011, FR-013 | `components/dashboard/SectorChart.tsx`, `components/common/ChartTableToggle.tsx`, `DataTable.tsx` | 10 bar + "Sektor lainnya"; toggle tabel ↔ chart; `<table>` semantik; sumbu mulai 0; tes lulus | M |
| T-022 | TrendChart | T-020 | FR-012 | `components/dashboard/TrendChart.tsx` | 5 titik tahun; 2025 menampilkan "Realisasi belum dirilis"; legenda pagu/realisasi; tes lulus | M |
| T-023 | useFilters + filter UI + validasi | T-020 | FR-020, FR-022 | `hooks/useFilters.ts`, `components/filters/*`, `lib/api-client.ts` | Pilih wilayah → URL berubah; reload → state sama; param invalid → koreksi + toast; tes `url-state.test.tsx`, `invalid-filter.test.tsx` lulus | M |
| T-024 | SourceInfoCard + FixtureBadge + PeriodNotice | T-020 | FR-003, FR-014, NFR-019 | `components/dashboard/{SourceInfoCard,FixtureBadge,PeriodNotice}.tsx` | Badge "Data contoh" ≥3 elemen; 6 baris info sumber; badge persistent saat filter berubah; tes `fixture-badge.spec.ts`, `source-attribution.spec.ts` lulus | M |
| T-025 | State components (Loading, Empty, Error) | T-018 | FR-014, EC-01–EC-10 | `components/states/*.tsx` | Skeleton tinggi tetap (CLS 0); EmptyState + tombol tahun; ErrorState + refetch; stale banner; tes unit lulus | S |

### M4 — Perbandingan & Insight UI

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-026 | ComparePage | T-023, T-015 | FR-030, FR-031 | `pages/ComparePage.tsx`, `components/compare/*` | `/bandingkan?mode=region&a=provinsi-nusa-utara&b=provinsi-selat-timur&year=2024` → 2 kolom + delta; `a===b` → koreksi; mobile `<dl>`; tes `compare.spec.ts` lulus | L |
| T-027 | Insight engine (shared) | T-009 | FR-040, FR-041 | `packages/shared/src/insights/{rules,engine,disclaimers}.ts` + `*.test.ts` | 18 test case (UI_SPEC §8.1) lulus; 0 kata terlarang; `limitation` tidak kosong; `pnpm --filter @danaterbuka/shared test insight` exit 0 | L |
| T-028 | InsightPanel UI | T-027, T-016 | FR-042 | `components/dashboard/InsightPanel.tsx` | Kartu insight + `limitation` + tautan "#INS-xx"; disclaimer global tampil; tes `insight-panel.spec.ts` lulus | M |

### M5 — Edukasi, Ekspor, Microcopy

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-029 | Microcopy terpusat (`copy.id.ts`) | T-018 | NFR-018 | `apps/web/src/content/copy.id.ts` | Semua namespace (`common`, `nav`, `home`, `dashboard`, `compare`, `glossary`, `methodology`, `states`, `a11y`, `insight`) ada; 0 string literal di JSX (ESLint) | M |
| T-030 | Mode Penjelasan Sederhana + sorot sektor | T-023 | FR-050, FR-023 | `hooks/useSimpleMode.ts`, `components/filters/SimpleModeToggle.tsx` | `?simple=1` → "Pagu" menjadi "Rencana anggaran"; `localStorage` persist; `sector=F07` → sorot; tes `simple-mode.spec.ts` lulus | M |
| T-031 | GlossaryPage | T-029 | FR-051 | `pages/GlossaryPage.tsx`, `packages/shared/src/content/glossary.ts` | ≥15 istilah; cari "silpa" → tampil; cari "xyz" → empty; definisi ≤25 kata; tes `glossary.test.tsx` lulus | M |
| T-032 | MethodologyPage | T-029, T-027 | FR-052 | `pages/MethodologyPage.tsx` | 6 metrik + 6 aturan insight + rumus tampil; heading `id` cocok anchor insight; tabel sumber + lisensi; tes `methodology.spec.ts` lulus | M |
| T-033 | Ekspor CSV | T-020 | FR-060 | `lib/export-csv.ts` | Unduh `danaterbuka_provinsi-nusa-utara_2024.csv`; header Indonesia; UTF-8 BOM; tes `csv-export.spec.ts` lulus | S |
| T-034 | Ekspor PNG | T-021 | FR-061 | `lib/export-png.ts` | Grafik tersimpan sebagai PNG skala 2×; tes `png-export.spec.ts` lulus | S |
| T-035 | CopyLinkButton + SEO PageMeta | T-023 | FR-021, NFR-014 | `components/common/CopyLinkButton.tsx`, `lib/seo.ts` | Salin → clipboard URL absolut + "Tautan disalin" `aria-live`; 5 halaman punya `<title>` + `<meta description>` sesuai ARCHITECTURE §7.2; tes `share-link.spec.ts` lulus | M |

### M6 — Aksesibilitas, Performa, Deploy, Demo

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-036 | Audit aksesibilitas | M4, M5 | NFR-005, NFR-006, A11Y-01–10 | `e2e/tests/a11y.spec.ts`, komponen terkait | 0 pelanggaran axe `serious`+`critical` di 5 halaman; keyboard nav; skip-to-content; `aria-live` filter; kontras ≥ 4.5:1 | M |
| T-037 | Optimasi performa | T-036 | NFR-001–003 | `vite.config.ts`, lazy routes | Bundle JS ≤ 220 KB gzip (`pnpm build:analyze`); chart di `manualChunks`; LCP ≤ 2.5s (Lighthouse mobile) | M |
| T-038 | SEO statis | T-035 | NFR-014, NFR-015 | `public/sitemap.xml`, `public/robots.txt`, `index.html` (OG), JSON-LD | `sitemap.xml` 5 URL valid; `robots.txt` Disallow `/api/`; OG tags di `index.html`; tes `curl` 200 | S |
| T-039 | Deploy setup | T-037 | A-09, NFR-010 | `Dockerfile`, env platform, `README.md` (instruksi deploy) | `docker build -t danaterbuka .` sukses; `docker run` → `curl localhost:3001/api/health` 200; `pnpm start:demo` berjalan tanpa internet | M |
| T-040 | Demo script + E2E offline | T-039 | SM-09, NFR-010 | `docs/demo/DEMO_SCRIPT.md`, `e2e/tests/offline.spec.ts` | `pnpm test:e2e:offline` lulus; skrip demo mencakup 6 segmen (PRD §11.3) | M |
| T-041 | Gate akhir | T-036–T-040 | SM-01–12 | — | `pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm build && pnpm fixtures:verify && pnpm pipeline:check && pnpm test:e2e` exit 0; Lighthouse perf ≥ 85, a11y ≥ 95; shared coverage ≥ 90% | M |

### M7 — Penggantian UI

| ID | Nama | depends_on | FR/NFR | File utama | AC (perintah) | Ukuran |
|----|------|-----------|--------|------------|---------------|--------|
| T-042 | Ganti desain (tim) | T-041 | UI-01–07 | `tokens.css`, `tailwind.config.ts`, `components/ui/*`, `pages/*`, `copy.id.ts` | Alur UI_SPEC §10: tokens → `/dev/components` → komponen → halaman → gate: `pnpm lint && pnpm typecheck && pnpm test && pnpm test:e2e` exit 0; 0 axe serious/critical | L |

---

## 3. Tabel Traceability (FR → Task → Test)

| FR | Deskripsi ringkas | Task | File tes |
|----|-------------------|------|----------|
| FR-001 | Snapshot dimuat saat startup | T-008, T-012 | `health.test.ts`, `snapshot.test.ts` |
| FR-002 | Metadata sumber pada respons | T-012, T-013 | `meta.contract.test.ts` |
| FR-003 | Badge data contoh | T-007, T-024 | `fixture-badge.spec.ts` |
| FR-004 | Laporan kualitas pipeline | T-008 | `pipeline.test.ts` |
| FR-005 | Fallback snapshot korup | T-012 | `fallback.test.ts` |
| FR-010 | Kartu ringkasan 4 angka | T-020 | `summary.test.tsx` |
| FR-011 | Grafik sektor top 10 + lainnya | T-021 | `sector-chart.test.tsx` |
| FR-012 | Tren tahunan 5 tahun | T-022 | `trend-chart.test.tsx` |
| FR-013 | Tabel alternatif grafik | T-021 | `chart-table-toggle.test.tsx` |
| FR-014 | SourceInfoCard 6 baris | T-024 | `source-attribution.spec.ts` |
| FR-020 | Filter di URL search params | T-023 | `url-state.test.tsx` |
| FR-021 | Salin tautan | T-035 | `share-link.spec.ts` |
| FR-022 | Filter invalid → koreksi + toast | T-023 | `invalid-filter.test.tsx` |
| FR-023 | Sorot sektor | T-030 | `sector-highlight.test.tsx` |
| FR-030 | Perbandingan 2 wilayah/tahun | T-026 | `compare.test.ts`, `compare.spec.ts` |
| FR-031 | Delta + 3 sektor terbesar | T-026 | `compare-delta.test.ts` |
| FR-040 | Insight 3–5 item dari 6 aturan | T-027 | `insight.rules.test.ts` |
| FR-041 | Objek insight lengkap | T-027 | `insight.schema.test.ts` |
| FR-042 | Kartu insight + limitation + tautan | T-028 | `insight-panel.spec.ts` |
| FR-050 | Mode Penjelasan Sederhana | T-030 | `simple-mode.spec.ts` |
| FR-051 | Glosarium ≥ 15 istilah | T-031 | `glossary.test.tsx` |
| FR-052 | Halaman metodologi lengkap | T-032 | `methodology.spec.ts` |
| FR-060 | Ekspor CSV | T-033 | `csv-export.spec.ts` |
| FR-061 | Ekspor PNG | T-034 | `png-export.spec.ts` |
| NFR-001–003 | Performa (LCP, CLS, bundle) | T-037 | Lighthouse CI |
| NFR-005–006 | Aksesibilitas WCAG AA | T-036, T-041 | `a11y.spec.ts`, axe |
| NFR-007–008 | Keamanan (helmet, rate limit) | T-011 | `rate-limit.test.ts` |
| NFR-009 | Fallback fixture | T-012 | `fallback.test.ts` |
| NFR-010 | Offline-capable | T-039, T-040 | `offline.spec.ts` |
| NFR-011 | TypeScript strict 0 error | T-001–T-042 | `pnpm typecheck` |
| NFR-012 | Coverage shared ≥ 90% | T-009, T-027 | `pnpm test:coverage` |
| NFR-014–015 | SEO (title, sitemap, robots) | T-035, T-038 | `curl` check |
| NFR-018 | Format angka id-ID | T-009, T-029 | `format.test.ts` |
| NFR-019 | Atribusi sumber di setiap halaman | T-024 | `source-attribution.spec.ts` |

---

## 4. Self-check

- [x] **42 task, T-001…T-042**: mencakup M0 (scaffolding + CI + discovery) sampai M7 (penggantian UI); tidak ada FR Must yang "menggantung" tanpa task.
- [x] **Setiap task punya AC berupa perintah**: semua AC bisa dijalankan di terminal; exit 0 = lulus.
- [x] **`depends_on` membentuk DAG valid**: tidak ada siklus; urutan M0→M1→M2→M3→M4/M5→M6→M7.
- [x] **Traceability lengkap**: 24 FR + 13 NFR dipetakan ke task + file tes; tidak ada requirement tanpa rumah.
- [x] **Konsisten dengan 5 dokumen sebelumnya**: task ID di PRD §15 (T-001…T-041 + T-042 baru untuk M7) cocok; route, param, nama file, slug, dan ID identik.
- [x] **Ukuran terkontrol**: tidak ada task L yang bisa dipecah lebih kecil tanpa menambah overhead dependensi.

---

**Spec package selesai.** Enam dokumen (`PRD.md`, `DATA_SPEC.md`, `ARCHITECTURE.md`, `UI_SPEC.md`, `AGENTS.md`, `TASKS.md`) siap dipakai AI coding agent secara mandiri.
