# UI_SPEC.md — DanaTerbuka

> **Nama file:** `docs/UI_SPEC.md` · **Versi:** 1.0.0 · **Tanggal:** 1 November 2026
> **Prasyarat:** `docs/PRD.md`, `docs/DATA_SPEC.md`, `docs/ARCHITECTURE.md` (v1.0.0).
> **Status visual: SEMUA keputusan visual di dokumen ini berlabel `SEMENTARA`.** Tim akan mengganti tampilan; agent dilarang mengoptimasi estetika.
> **Errata yang disengaja:** (1) `microcopy.ts` → **`copy.id.ts`** (ARCHITECTURE §2); (2) route **`/dev/components`** ditambahkan, dev-only (ARCHITECTURE §5.1); (3) `InsightsResponse.data.items` berubah dari `.min(3)` → `.max(5)` agar tidak mengarang insight (DATA_SPEC §3.8, dikerjakan T-027).

---

## 1. Sitemap, Route & Navigasi

| Path | Halaman | Tujuan | Query param | API |
|------|---------|--------|-------------|-----|
| `/` | `HomePage` | Menjelaskan nilai produk + 3 pertanyaan inti + CTA | — | — |
| `/dashboard` | `DashboardPage` | Ringkasan pagu/realisasi, sektor, tren, insight | `region`, `year`, `sector`, `simple` | summary, sectors, trend, insights, meta |
| `/bandingkan` | `ComparePage` | Bandingkan 2 wilayah / 2 tahun | `mode`, `a`, `b`, `year`, `yearA`, `yearB`, `simple` | compare, meta, insights |
| `/glosarium` | `GlossaryPage` | 15+ istilah anggaran, pencarian | `q`, `simple` | — (data `copy.id.ts` + `shared/content/glossary`) |
| `/metodologi` | `MethodologyPage` | Rumus, sumber, lisensi, batas kesimpulan | hash (`#INS-01`, `#M-01`) | meta |
| `/dev/components` | `ComponentGallery` | Galeri komponen + semua state; **hanya `import.meta.env.DEV`** | — | mock props |
| `*` | `NotFoundPage` | 404 ramah | — | — |

**Aturan URL:** filter = satu-satunya state (`useSearchParams`); param tak dikenal diabaikan; param invalid dikoreksi + toast (FR-022); canonical tanpa query (ARCHITECTURE §7.1).
**Default:** `region=provinsi-nusa-utara`, `year=2024` (dari `meta.latestFinalYear`), `sector=all`, `simple=0`, `mode=region`.
**SPA fallback:** Express `app.get(/^\/(?!api).*/)` → `index.html`; Vite dev memakai history fallback. Route tak dikenal → `NotFoundPage` dengan `<title>` sesuai ARCHITECTURE §7.2.
**Navigasi (SEMENTARA):** header sticky berisi logo teks + 4 tautan (`Dashboard`, `Bandingkan`, `Glosarium`, `Metodologi`) + `SimpleModeToggle`; mobile: tautan menjadi baris horizontal yang bisa di-scroll (tanpa drawer). Footer: atribusi sumber, lisensi, versi snapshot, tautan Metodologi.

---

## 2. Spesifikasi per Halaman

### 2.1 `HomePage`

| Komponen (props) | Data |
|------------------|------|
| `HeroSection({ headline, subheadline, primaryCta })` | `copy.id.ts` |
| `ValueCard({ icon, title, body })` ×3 | `copy.id.ts` |
| `DataSourceNote({ isFixture, sourceName })` | `meta` |
| `CtaButton({ href, children })` | — |

**Layout (SEMENTARA):** desktop 1 kolom, maks `72rem`, hero 60vh, 3 kartu sejajar. Mobile: kartu bertumpuk, CTA lebar penuh.
**State:** loading = skeleton hero (≤1 dtk, tidak blocking); empty = — (halaman statis); error = banner "Data sumber tidak tersedia" jika `meta` gagal, hero tetap tampil; data-contoh = `FixtureBadge` di bawah hero + catatan `DataSourceNote`.

### 2.2 `DashboardPage`

| Komponen (props) | Konsumsi |
|------------------|----------|
| `RegionSelect({ regions, value, onChange, disabled })` | `meta.regions` |
| `YearSelect({ years, value, onChange, disabled })` | `meta.availableYears` |
| `SimpleModeToggle({ value, onChange })` | state `simple` |
| `CopyLinkButton({ url })` | URL saat ini |
| `SummaryCards({ summary, simple, state })` | `SummaryResponse.data` |
| `SectorChart({ slices, totalPagu, simple, state })` | `BudgetSectorsResponse.data` |
| `TrendChart({ points, simple, state })` | `TrendResponse.data.points` |
| `InsightPanel({ items, disclaimer, state })` | `InsightsResponse.data` |
| `SourceInfoCard({ meta, periodStatus })` | `meta` |
| `FixtureBadge({ visible })`, `PeriodNotice({ status, asOf, complete })` | `meta`, `summary.periodStatus` |
| `LoadingSkeleton`, `EmptyState`, `ErrorState` | `hooks/*` |

**Layout (SEMENTARA):** desktop — filter bar di atas, 4 kartu (grid 4), grafik sektor (60%) + insight (40%), tren lebar penuh, kartu sumber di bawah. Mobile — kartu 2×2, grafik selebar layar (min 320 px), insight setelah grafik, tanpa scroll horizontal.
**State:** loading = 4 skeleton kartu + skeleton chart (tinggi tetap, CLS 0); empty = `EmptyState` "Belum ada data untuk wilayah dan tahun ini." + tombol tahun tersedia; error = `ErrorState` + "Coba lagi" (`refetch`), filter tetap aktif; stale/contoh = `FixtureBadge` + `PeriodNotice` ("Data contoh — bukan data resmi", "Realisasi belum dirilis", "Realisasi melebihi pagu").

### 2.3 `ComparePage`

| Komponen (props) | Konsumsi |
|------------------|----------|
| `CompareForm({ mode, a, b, years, value, onChange, regions })` | `meta` |
| `DeltaStat({ label, aValue, bValue, delta, deltaPercent, format })` ×3 | `CompareResponse.data.rows` |
| `CompareTable({ rows, a, b, simple })` | idem |
| `SectorDeltaList({ items })` | `topSectorDeltas` |
| `CopyLinkButton({ url })`, `SimpleModeToggle`, states | — |

**Layout (SEMENTARA):** desktop — form 2 kolom, 3 `DeltaStat` sejajar, tabel di bawah. Mobile — form bertumpuk, `DeltaStat` vertikal, tabel berubah menjadi daftar `<dl>` (bukan tabel sempit).
**State:** loading = skeleton 3 kartu; empty = "Wilayah pembanding belum tersedia." (EC-02/03); error = `ErrorState`; stale = badge + catatan periode per sisi.

### 2.4 `GlossaryPage`

| Komponen (props) | Data |
|------------------|------|
| `GlossarySearch({ value, onChange, resultCount })` | `useState` lokal |
| `GlossaryList({ terms, query, emptyQuery })` | `shared/content/glossary.ts` |
| `TermTooltip({ term, definition, children })` | idem |

**Layout (SEMENTARA):** desktop — pencarian sticky + daftar `<dl>` 2 kolom. Mobile — 1 kolom, pencarian di atas. **State:** loading = — (data statis, render langsung); empty = "Istilah tidak ditemukan" + "Hapus pencarian"; error = — (tidak ada I/O); stale = tidak berlaku.

### 2.5 `MethodologyPage`

| Komponen (props) | Data |
|------------------|------|
| `MethodologySection({ id, title, children })` | `copy.id.ts` |
| `MetricFormulaTable({ metrics })` | konstanta `M-01…M-06` |
| `InsightRuleList({ rules })` | `shared/insights/rules.ts` |
| `SourceAttributionTable({ sources })` | `meta` |
| `LimitationList({ items })` | `copy.id.ts` |

**Layout (SEMENTARA):** 1 kolom maks `68ch`, daftar isi anchor di kiri (desktop). Mobile: daftar isi menjadi `<details>`.
**State:** loading = skeleton paragraf; empty = —; error = blok "Sumber tidak dapat dimuat" (isi statis tetap tampil); stale = tanggal pembaruan + badge.

### 2.6 `NotFoundPage` & `/dev/components`

- `NotFoundPage`: judul "Halaman tidak ditemukan", tautan ke `/dashboard` + `/`, status HTTP konsep 404, tanpa API.
- `ComponentGallery`: menampilkan `Button` (default/hover/focus/disabled), `Card`, `Select` (normal/error/disabled), `Tooltip`, `ChartWrapper`, `EmptyState`, `ErrorState`, `LoadingSkeleton`, `FixtureBadge`, `SummaryCards`, `SectorChart`. **Hanya di `DEV`; tidak masuk sitemap/robots.**

---

## 3. Design Tokens (SEMENTARA — satu sumber)

`apps/web/src/styles/tokens.css` = sumber tunggal; `tailwind.config.ts` hanya memetakan ke CSS variable. **Dilarang** nilai warna/font/spacing/radius/shadow di komponen.

```css
/* tokens.css — SEMENTARA, ganti seluruh blok ini saat rebranding */
:root {
  --color-bg: #ffffff;        --color-surface: #f8fafc;   --color-border: #e2e8f0;
  --color-text: #0f172a;      --color-text-muted: #475569;--color-text-inverse: #ffffff;
  --color-brand-600: #0f766e; --color-brand-700: #115e59; --color-brand-50: #f0fdfa;
  --color-danger: #b91c1c;    --color-warning: #b45309;   --color-success: #15803d;
  --color-info: #1d4ed8;      --color-focus: #0f766e;
  --color-sector-1: #0f766e; --color-sector-2: #1d4ed8; --color-sector-3: #b45309;
  --color-sector-4: #7e22ce; --color-sector-5: #15803d; --color-sector-6: #be123c;
  --color-sector-7: #0369a1; --color-sector-8: #a16207; --color-sector-9: #4d7c0f;
  --color-sector-10: #334155;
  --font-sans: system-ui, "Segoe UI", Roboto, Arial, sans-serif;
  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem;
  --text-lg: 1.125rem; --text-xl: 1.25rem; --text-2xl: 1.5rem; --text-3xl: 2rem;
  --leading-tight: 1.25; --leading-normal: 1.5;
  --space-1: 0.25rem; --space-2: 0.5rem; --space-3: 0.75rem; --space-4: 1rem;
  --space-6: 1.5rem; --space-8: 2rem; --space-12: 3rem; --space-16: 4rem;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgb(15 23 42 / .06);
  --shadow-md: 0 4px 12px rgb(15 23 42 / .08);
  --container-max: 72rem; --content-max: 68ch;
}
@media (prefers-reduced-motion: reduce) { * { transition: none !important; animation: none !important; } }
```

| Kelompok | Aturan |
|----------|--------|
| Warna | Hanya token di atas. Teks biasa `--color-text`; sekunder `--color-text-muted`; permukaan `--color-surface`. |
| Tipografi | `--font-sans` (tanpa webfont/CDN — NFR-010). Skala 12/14/16/18/20/24/32 px; heading `600`, body `400`. |
| Spacing | Kelipatan 4 px dari skala; padding kartu `--space-4`, gap grid `--space-4`/`--space-6`. |
| Radius & shadow | `sm` untuk input, `md` untuk kartu, `lg` untuk panel; shadow maksimum `md` (SEMENTARA). |
| Kontras | Semua pasangan teks/latar wajib ≥ 4,5:1 (diuji axe). |

---

## 4. Aturan Visualisasi Jujur

| ID | Aturan |
|----|--------|
| VZ-01 | Bar chart **wajib** mulai dari 0 pada sumbu nilai; dilarang memotong sumbu. |
| VZ-02 | Line chart tren memakai 0 sebagai batas bawah kecuali semua nilai < 10% dari maksimum (tetap wajib label). |
| VZ-03 | Pie/donut **hanya** untuk ≤ 3 kategori dan tidak pernah untuk membandingkan pagu vs realisasi. MVP default: tidak memakai pie. |
| VZ-04 | Urutan bar menurun berdasarkan `pagu`; maksimum 10 + "Sektor lainnya" (agregat, warna netral `--color-text-muted`). |
| VZ-05 | Setiap grafik: judul, satuan ("Rupiah"), label sumbu, dan angka penuh di tooltip. |
| VZ-06 | Warna bukan satu-satunya pembeda: setiap seri punya label teks/legenda; nilai null ditandai pola/teks "belum dirilis", bukan `0`. |
| VZ-07 | Angka ringkas: `formatRupiahCompact` → `Rp 2,4 T`, `Rp 600,0 M`, `Rp 12,5 jt`, `Rp 950`; persen 1 desimal (`75,0%`); pemisah `id-ID`. |
| VZ-08 | Setiap grafik punya tombol "Lihat sebagai tabel" (FR-013) dan ringkasan `aria-label`. |
| VZ-09 | Tidak ada 3D, gradien dekoratif, atau animasi yang mengubah persepsi nilai. |

---

## 5. Aksesibilitas (WCAG 2.1 AA)

| ID | Kewajiban | Verifikasi |
|----|-----------|-----------|
| A11Y-01 | Kontras teks ≥ 4,5:1; komponen/grafik ≥ 3:1 | axe + cek manual token |
| A11Y-02 | Semua fungsi dapat dicapai keyboard; urutan fokus logis; `:focus-visible` memakai `--color-focus` (ring 2 px + offset 2 px) | Playwright `keyboard.spec` |
| A11Y-03 | `Skip to content` sebagai elemen fokus pertama | tes manual + e2e |
| A11Y-04 | Filter `<select>` punya `<label>`; perubahan hasil diumumkan lewat `aria-live="polite"` ("Menampilkan Provinsi Nusa Utara, 2024") | e2e `aria-live` |
| A11Y-05 | Grafik: `role="img"` + `aria-label` ringkas + `aria-describedby` ke deskripsi teks/tabel | unit test komponen |
| A11Y-06 | Tabel alternatif `<table>` dengan `<caption>`, `<th scope="col">` | unit test |
| A11Y-07 | Status tidak bergantung warna: badge memuat teks ("Data contoh", "Belum dirilis") | review |
| A11Y-08 | Target sentuh ≥ 44×44 px; `lang="id"` pada `<html>`; heading berurutan tanpa lompatan | axe |
| A11Y-09 | `prefers-reduced-motion` dihormati; tanpa animasi wajib | review |
| A11Y-10 | Pesan error terhubung ke input via `aria-describedby`, bukan hanya warna merah | unit test |

---

## 6. Mode "Penjelasan Sederhana"

| Aspek | Aturan |
|-------|--------|
| Pemicu | Toggle di header + `?simple=1`; tersimpan di `localStorage["danaterbuka.simple"]`; param menang atas localStorage |
| Cakupan | Label metrik, judul grafik, istilah di tabel, dan teks insight (kata teknis diganti) |
| Tidak berubah | Angka, grafik, rumus, sumber — mode ini **tidak** menyederhanakan data |
| Tooltip | `TermTooltip` muncul untuk istilah bergaris putus; konten dari `shared/content/glossary.ts` |
| Aksesibilitas | Toggle `<button role="switch" aria-checked>`; perubahan diumumkan `aria-live="polite"` |

| Teknis (default) | Sederhana |
|-----------------|-----------|
| Pagu | Rencana anggaran |
| Realisasi | Uang yang sudah terpakai |
| % Realisasi | Seberapa banyak sudah terpakai |
| Sisa anggaran (gap) | Uang yang belum terpakai |
| SILPA | Sisa anggaran di akhir tahun |
| Fungsi/Sektor | Kelompok belanja |
| Periode final | Angka akhir tahun |

---

## 7. Microcopy (`apps/web/src/content/copy.id.ts`)

| Aturan | Detail |
|--------|--------|
| Satu file | Semua string UI di `copy.id.ts` dengan namespace: `common`, `nav`, `home`, `dashboard`, `compare`, `glossary`, `methodology`, `states`, `a11y`, `insight`. |
| Larangan | Tidak ada string literal teks di komponen (kecuali `data-testid`); ditegakkan ESLint `no-restricted-syntax` untuk JSX text. |
| Bahasa | 100% Indonesia; sapaan netral ("Anda"), tanpa singkatan tak umum. |
| Nada | Netral, tidak menuduh, tidak clickbait; dilarang "korupsi/boros/gagal" (lihat `forbidden-words.ts`). |
| Angka | Diformat runtime oleh `lib/format.ts`, bukan ditulis di copy. |
| Contoh kunci | `states.empty.noData` = "Belum ada data untuk wilayah dan tahun ini."; `states.error.generic` = "Gagal memuat data. Periksa koneksi lalu coba lagi."; `dashboard.fixtureBadge` = "Data contoh"; `dashboard.disclaimer` = "Data contoh, bukan data resmi. Gunakan untuk melihat cara kerja produk." |

---

## 8. Spesifikasi Insight Otomatis

**Fungsi murni:** `generateInsights(input: InsightInput): InsightResult` di `packages/shared/src/insights/engine.ts`.
`InsightInput = { region, year, records, prevYearRecords, sectors, meta }`; `InsightResult = { items: Insight[]; disclaimer: string }`.
Urutan: `caution` → `attention` → `info`, lalu `ruleId` asc; maksimum 5; jika < 3 aturan aktif, kembalikan apa adanya (UI menampilkan catatan "Insight terbatas pada data yang tersedia").

| ID | Nama | Input | Rumus & ambang | Template (id-ID) | Batas kesimpulan | Sev |
|----|------|-------|----------------|------------------|------------------|-----|
| INS-01 | Pangsa sektor teratas | `records` | `share = pagu_sektor / totalPagu × 100`; aktif bila `share ≥ 25,0` | "Sektor {sector} menerima {share}% dari total pagu {year}, porsi terbesar di wilayah ini." | "Porsi besar tidak menunjukkan kualitas serapan atau hasil pembangunan." | info |
| INS-02 | Realisasi terendah | `records` | `rate = realisasi/pagu × 100`; aktif bila `rate < 50,0` **dan** `gap ≥ 0,5% totalPagu`; pilih rate terendah | "Sektor {sector} baru terealisasi {rate}%, terendah di wilayah ini; selisih pagu-realisasi mencapai {gap}." | "Realisasi rendah dapat disebabkan jadwal pengadaan atau tahapan administrasi, bukan otomatis masalah." | attention |
| INS-03 | Perubahan tahunan | `records`, `prevYearRecords` | `yoy = (pagu_t − pagu_{t−1})/pagu_{t−1} × 100`; aktif bila `|yoy| ≥ 15,0`; pilih `|yoy|` terbesar | "Pagu sektor {sector} {naik/turun} {absYoy}% pada {year} dibanding {prevYear}." | "Perubahan alokasi dapat berasal dari kebijakan, refocusing, atau perubahan klasifikasi." | info |
| INS-04 | Selisih terbesar | `records` | `gap = pagu − realisasi`; `gapShare = gap/totalPagu × 100`; aktif bila `gapShare ≥ 5,0` | "Sektor {sector} memiliki selisih pagu-realisasi terbesar: {gap}, setara {gapShare}% dari total pagu." | "Selisih mencerminkan sisa anggaran, bukan otomatis dana hilang atau tidak digunakan." | attention |
| INS-05 | Konsentrasi anggaran | `records` | `top3 = Σ 3 pagu terbesar / totalPagu × 100`; aktif bila `top3 ≥ 50,0` dan jumlah sektor ≥ 3 | "Tiga sektor teratas menyerap {top3}% dari total pagu: {daftar 3 sektor}." | "Konsentrasi tinggi belum tentu buruk; penilaian membutuhkan konteks kebutuhan daerah." | info |
| INS-06 | Kelengkapan periode | `records`, `meta` | aktif bila ada `periodStatus ∈ {approved, partial}` | "Data {year} berstatus {status}; angka realisasi dapat berubah setelah pembaruan." | "Angka sementara tidak dapat dibandingkan langsung dengan tahun final." | caution |

**Disclaimer global (wajib tampil di panel):** "Insight dihasilkan otomatis dari snapshot data. Insight tidak menunjukkan sebab, kualitas layanan, atau indikasi pelanggaran."

### 8.1 Test case wajib (18)

| Rule | Input | Output yang diharapkan |
|------|-------|------------------------|
| INS-01 | share 30,0% | memuat "30,0%" dan "Kesehatan" |
| INS-01 | share 24,9% | tidak menghasilkan item |
| INS-01 | `totalPagu = 0` | tidak menghasilkan item |
| INS-02 | rate 41,7%; gap Rp 14 M; total Rp 2,4 T | memuat "41,7%" dan "terendah" |
| INS-02 | rate 55,0% | tidak menghasilkan item |
| INS-02 | rate 41,7%; gap 0,42% total | tidak menghasilkan item |
| INS-03 | 240 M → 288 M | memuat "naik 20,0%" |
| INS-03 | 200 M → 168 M | memuat "turun 16,0%" |
| INS-03 | `prev = 0` | tidak menghasilkan item |
| INS-04 | gap 7,1% total | memuat "7,1%" dan "selisih" |
| INS-04 | gap 5,0% total | menghasilkan item (ambang inklusif) |
| INS-04 | gap 4,9% total | tidak menghasilkan item |
| INS-05 | top-3 69,0% | memuat "69,0%" |
| INS-05 | top-3 49,9% | tidak menghasilkan item |
| INS-05 | hanya 2 sektor | tidak menghasilkan item |
| INS-06 | tahun 2025 `approved` | memuat "belum final" atau "sementara" |
| INS-06 | semua `final` | tidak menghasilkan item |
| INS-06 | `records = []` | tidak menghasilkan item |

Aturan tambahan: setiap `sentence` & `limitation` ≤ 240 karakter; lolos filter `forbidden-words.ts`; `supportingValues` memuat angka mentah yang dipakai (untuk audit).

---

## 9. Aturan UI Mudah Diganti (mengikat)

| ID | Aturan | Penegakan |
|----|--------|-----------|
| UI-01 | Logika/data (hooks, `api-client`, filter URL, format, insight) berada di `hooks/`, `lib/`, `packages/shared` — **bukan** di komponen tampilan | review + struktur folder ARCHITECTURE §2 |
| UI-02 | Komponen tampilan menerima data via props; **dilarang** memanggil API/`fetch`/hook data di `components/**` | ESLint `no-restricted-imports` + `no-restricted-globals: fetch` |
| UI-03 | Warna, font, spacing, radius, shadow **hanya** dari tokens; dilarang hex/px hardcode di komponen | ESLint `no-restricted-syntax` (literal warna), review diff |
| UI-04 | Komponen dasar (`Button`, `Card`, `Select`, `Tooltip`, `ChartWrapper`) hanya di `components/ui/`; halaman merakit | struktur folder + review |
| UI-05 | Semua chart dibungkus `ChartWrapper` yang membaca token untuk warna/typografi | unit test `ChartWrapper` |
| UI-06 | `/dev/components` menampilkan semua komponen + state (default, hover, focus, disabled, loading, empty, error) | e2e `dev-gallery.spec.ts` |
| UI-07 | E2E memakai `getByRole`, `getByLabel`, `getByText`, atau `data-testid` — **dilarang** selector class CSS | lint e2e (`no-css-selector`), review |

---

## 10. Panduan Penggantian UI

| Mengganti | Ubah file | Jangan sentuh |
|-----------|-----------|--------------|
| Tema (warna/font/spacing/radius/shadow) | `apps/web/src/styles/tokens.css` + `tailwind.config.ts` (pemetaan) | komponen, hooks, `lib/`, `packages/shared` |
| Layout halaman | `apps/web/src/pages/*.tsx` + `components/layout/*` | kontrak props komponen dasar, hooks, API |
| Komponen dasar | `apps/web/src/components/ui/*` (Button, Card, Select, Tooltip, ChartWrapper) | nama props publik (kecuali diperbarui serentak + tes) |
| Chart (jenis/estetika) | `components/dashboard/SectorChart.tsx`, `TrendChart.tsx` di dalam `ChartWrapper` | `sectors` shape, aturan VZ-01…VZ-09, tabel alternatif |
| Teks | `apps/web/src/content/copy.id.ts` | struktur data, `data-testid`, `aria-label` wajib |
| Glosarium | `packages/shared/src/content/glossary.ts` | engine insight, skema |
| **Tidak boleh diubah saat rebranding** | — | `hooks/`, `lib/api-client.ts`, `lib/format.ts`, `apps/api/**`, `packages/shared/schemas|metrics|insights`, dokumen `docs/*` |

**Alur M7 (ringkas):** (1) salin desain tim ke `design/`; (2) ganti tokens → cek `/dev/components`; (3) ganti komponen dasar; (4) ganti halaman satu per satu (`Home → Dashboard → Compare → Glossary → Methodology`); (5) jalankan gate: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, axe 0 serious/critical.

---

## 11. Self-check

- [x] **Route & param konsisten** dengan ARCHITECTURE §5.1 (`/dashboard`, `/bandingkan`, `/glosarium`, `/metodologi`; `region|year|sector|simple|mode|a|b|yearA|yearB`); dua errata ditulis eksplisit.
- [x] **Setiap halaman punya komponen + props + sumber data + 4 state** (loading/empty/error/contoh-stale) atau alasan eksplisit bila state tidak berlaku.
- [x] **Semua visual berlabel SEMENTARA** dan bersumber dari satu file token; tidak ada nilai visual wajib di komponen.
- [x] **Insight dapat diuji**: 6 aturan, ambang identik DATA_SPEC §7, 18 test case input→output, disclaimer + batas kesimpulan per aturan, fungsi murni.
- [x] **Aturan mudah-diganti terukur**: 7 aturan dengan penegakan (ESLint/e2e/struktur), plus tabel "apa yang diubah vs jangan disentuh".
- [x] **Microcopy terpusat**: `copy.id.ts`, larangan string literal, contoh kunci empty/error/disclaimer.

---

**Berhenti di sini.** Dokumen berikutnya: `docs/AGENTS.md` — tunggu instruksi "lanjut".
