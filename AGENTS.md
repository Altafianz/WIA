# AGENTS.md — DanaTerbuka

> **Nama file:** `docs/AGENTS.md`
> **Versi:** 1.0.0 · **Tanggal:** 1 November 2026 · **Status:** Baseline eksekusi
> **Prasyarat:** `docs/PRD.md`, `docs/DATA_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/UI_SPEC.md` (v1.0.0).
> **Aturan:** Dokumen ini adalah instruksi operasional untuk AI coding agent. Agent **wajib** mengikuti semua aturan; pelanggaran harus dicatat alasannya di `BLOCKERS.md`.

---

## 1. Perintah Workspace

Monorepo pnpm. Semua perintah dijalankan dari **root** (`danaterbuka/`).

### 1.1 Perintah per paket

| Paket | Perintah | Fungsi |
|-------|----------|--------|
| `apps/web` | `pnpm --filter @danaterbuka/web dev` | Dev server Vite (port 5173, proxy `/api` → 3001) |
| `apps/web` | `pnpm --filter @danaterbuka/web build` | Build produksi → `apps/web/dist/` |
| `apps/web` | `pnpm --filter @danaterbuka/web build:analyze` | Build + visualizer bundle (NFR-003) |
| `apps/web` | `pnpm --filter @danaterbuka/web test` | Unit test Vitest |
| `apps/web` | `pnpm --filter @danaterbuka/web typecheck` | `tsc --noEmit` |
| `apps/api` | `pnpm --filter @danaterbuka/api dev` | Dev server Express (port 3001, `tsx watch`) |
| `apps/api` | `pnpm --filter @danaterbuka/api build` | Build → `apps/api/dist/` |
| `apps/api` | `pnpm --filter @danaterbuka/api test` | Unit test Vitest (Supertest) |
| `apps/api` | `pnpm --filter @danaterbuka/api typecheck` | `tsc --noEmit` |
| `packages/shared` | `pnpm --filter @danaterbuka/shared build` | Build → `packages/shared/dist/` |
| `packages/shared` | `pnpm --filter @danaterbuka/shared test` | Unit test Vitest (metrik, insight, skema) |
| `packages/shared` | `pnpm --filter @danaterbuka/shared test:coverage` | Coverage ≥ 90% (insight/metrik 100% cabang) |
| `packages/shared` | `pnpm --filter @danaterbuka/shared typecheck` | `tsc --noEmit` |
| `pipeline` | `pnpm --filter @danaterbuka/pipeline start` | `pnpm pipeline` — jalankan ETL |
| `pipeline` | `pnpm --filter @danaterbuka/pipeline start -- --check` | Cek hash tanpa menulis ulang |
| `pipeline` | `pnpm --filter @danaterbuka/pipeline test` | Unit test pipeline |

### 1.2 Perintah root (gabungan)

| Perintah | Fungsi |
|----------|--------|
| `pnpm dev` | Jalankan `apps/web` **dan** `apps/api` bersamaan (`pnpm -r --parallel dev`) |
| `pnpm build` | Build `shared` → `web` → `api` (urut, bukan paralel) |
| `pnpm start` | Produksi: `node apps/api/dist/index.js` (sajikan API + static) |
| `pnpm start:demo` | `cross-env DATA_ADAPTER=fixture node apps/api/dist/index.js` |
| `pnpm lint` | ESLint seluruh repo |
| `pnpm typecheck` | `pnpm -r typecheck` (semua paket) |
| `pnpm test` | `pnpm -r test` (unit test semua paket) |
| `pnpm test:coverage` | `pnpm -r test:coverage` |
| `pnpm test:e2e` | Playwright (`e2e/playwright.config.ts`) |
| `pnpm test:e2e:offline` | `cross-env OFFLINE=1` + Playwright |
| `pnpm pipeline` | ETL fixture → `data/processed/snapshot.v1.json` |
| `pnpm pipeline:check` | Verifikasi hash snapshot tanpa menulis ulang |
| `pnpm fixtures:generate` | Tulis ulang fixture dari seed deterministik |
| `pnpm fixtures:verify` | Assert nilai anchor DATA_SPEC §6.3 |

### 1.3 Gate wajib sebelum commit

```bash
pnpm lint && pnpm typecheck && pnpm test
```

Gate penuh (sebelum merge/PR):

```bash
pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm build && pnpm fixtures:verify && pnpm pipeline:check && pnpm test:e2e
```

---

## 2. DO / DON'T

### 2.1 DO (wajib)

| ID | Aturan |
|----|--------|
| DO-01 | Pakai nama file, path, komponen, dan ID **persis** seperti di `ARCHITECTURE.md` §2 dan `UI_SPEC.md`. |
| DO-02 | Impor lintas paket memakai `@danaterbuka/shared`, **bukan** path relatif `../../packages/shared`. |
| DO-03 | Semua rumus & aturan insight di `packages/shared`; UI & API hanya **memanggil**, tidak menghitung sendiri. |
| DO-04 | Warna, font, spacing, radius, shadow **hanya** dari CSS variables di `tokens.css` / Tailwind config. |
| DO-05 | Komponen tampilan (`components/**`) menerima data via **props saja**; dilarang memanggil API/fetch/hook data. |
| DO-06 | Semua chart dibungkus `ChartWrapper`; memakai token untuk warna/tipografi. |
| DO-07 | Microcopy terpusat di `apps/web/src/content/copy.id.ts`; dilarang string literal di JSX. |
| DO-08 | E2E memakai `getByRole`, `getByLabel`, `getByText`, atau `data-testid`; **dilarang** selector class CSS. |
| DO-09 | Setiap angka punya `SourceMeta`; setiap insight punya `limitation` + `disclaimer`. |
| DO-10 | Filter state di URL search params (`useFilters`); satu-satunya localStorage: `danaterbuka.simple`. |
| DO-11 | 4 state wajib per halaman data: loading (skeleton tinggi tetap), empty, error, data-contoh/stale. |
| DO-12 | `TypeScript strict: true` di semua paket; `pnpm typecheck` 0 error. |
| DO-13 | Fixture memakai nama wilayah **fiktif** + `isFixture: true` pada setiap entity. |
| DO-14 | Log pino JSON dengan `requestId`, tanpa PII; error format seragam (`ApiErrorSchema`). |
| DO-15 | Satu task = satu commit; maksimum 300 baris perubahan & ≤ 8 file per sesi. |

### 2.2 DON'T (dilarang)

| ID | Larangan | Alasan |
|----|----------|--------|
| DNT-01 | Jangan hardcode warna/hex/rgb di komponen | UI-03 UI_SPEC; menghambat rebranding M7 |
| DNT-02 | Jangan panggil `fetch` langsung di komponen React | Wajib lewat `hooks/*` → `lib/api-client.ts` |
| DNT-03 | Jangan impor `apps/api` dari `apps/web` atau sebaliknya | Batas modul ARCHITECTURE §3.1 |
| DNT-04 | Jangan impor React/DOM di `packages/shared` atau `pipeline` | Harus netral lingkungan |
| DNT-05 | Jangan tambah dependensi baru tanpa alasan tertulis di commit message | Risiko R-12 PRD |
| DNT-06 | Jangan mengarang endpoint, nama kolom, lisensi, atau angka resmi | Semua UNVERIFIED sampai T-004 |
| DNT-07 | Jangan memakai kata terlarang di insight/UI: `korupsi`, `boros`, `gagal`, `menyeleweng`, `mencuri` | PP-02 PRD |
| DNT-08 | Jangan menukar `null` ↔ `0`; `null` = belum tersedia, `0` = nilai terukur nol | DATA_SPEC §3.1 |
| DNT-09 | Jangan potong sumbu Y bar chart; selalu mulai dari 0 | VZ-01 UI_SPEC |
| DNT-10 | Jangan memakai pie chart untuk membandingkan pagu vs realisasi | VZ-03 UI_SPEC |
| DNT-11 | Jangan simpan state filter di React state/Zustand/Context | FR-020 PRD; harus URL |
| DNT-12 | Jangan klaim data *real-time*; label yang benar: \"snapshot berkala\" | PP-01 PRD, X-03 |
| DNT-13 | Jangan memakai `toFixed()` untuk perhitungan lanjutan (hanya tampilan) | DATA_SPEC §7 |
| DNT-14 | Jangan membuat fuzzy matching di pipeline normalize | Risiko salah peta; DATA_SPEC §5.6 |
| DNT-15 | Jangan commit file `data/processed/*` yang hash-nya tidak stabil | Idempotensi DATA_SPEC §5.7 |

---

## 3. Format Commit (Conventional Commits)

```
<type>(<scope>): <deskripsi singkat>

[body opsional: apa & mengapa, bukan bagaimana]

[footer: Refs: T-xxx | Closes: FR-xxx | BREAKING CHANGE: ...]
```

### 3.1 Tipe

| Tipe | Kapan |
|------|-------|
| `feat` | Fitur baru (FR) |
| `fix` | Perbaikan bug |
| `refactor` | Perubahan struktur tanpa mengubah perilaku |
| `test` | Tambah/ubah tes |
| `docs` | Dokumentasi |
| `chore` | Scaffolding, config, CI, dependensi |
| `style` | Format kode (bukan visual UI) |
| `perf` | Optimasi performa |

### 3.2 Scope

| Scope | Paket |
|-------|-------|
| `web` | `apps/web` |
| `api` | `apps/api` |
| `shared` | `packages/shared` |
| `pipeline` | `pipeline` |
| `e2e` | `e2e` |
| `root` | Config root, CI, monorepo |
| `data` | `data/fixtures`, `data/reference`, `data/processed` |

### 3.3 Contoh

```
feat(shared): implement INS-01 top sector share insight rule

Adds pure function for INS-01 with threshold ≥25.0%.
Includes 3 test cases per DATA_SPEC §7.

Refs: T-027 | Closes: FR-040
```

```
chore(root): scaffold pnpm monorepo with workspace config

Creates pnpm-workspace.yaml, tsconfig.base.json, and package.json
for apps/web, apps/api, packages/shared, pipeline, e2e.

Refs: T-001
```

---

## 4. Definition of Done (DoD)

Sebuah task dianggap **selesai** bila **semua** syarat berikut terpenuhi:

| # | Syarat | Verifikasi |
|---|--------|------------|
| 1 | Kode mengompilasi tanpa error | `pnpm typecheck` exit 0 |
| 2 | Lint bersih | `pnpm lint` exit 0 |
| 3 | Semua unit test lulus | `pnpm test` exit 0 |
| 4 | Acceptance criteria task terpenuhi | Perintah AC di `TASKS.md` exit 0 |
| 5 | Tidak ada TODO/FIXME baru tanpa task ID | `grep -r "TODO\|FIXME" --include="*.ts" --include="*.tsx"` kosong atau semua punya `T-xxx` |
| 6 | Commit message Conventional Commits + referensi task | Format §3 |
| 7 | Tidak ada dependensi baru tanpa alasan di commit body | Review `package.json` diff |
| 8 | File yang diubah ≤ 8; baris yang berubah ≤ 300 | `git diff --stat` |
| 9 | Coverage `packages/shared` ≥ 90% (insight & metrik 100% cabang) | `pnpm --filter @danaterbuka/shared test:coverage` |
| 10 | Tidak ada pelanggaran DO/DON'T di §2 | Self-review |

**DoD tambahan per milestone:**

| Milestone | Tambahan |
|-----------|----------|
| M2 | `pnpm --filter @danaterbuka/api test` lulus + fallback teruji |
| M3 | `pnpm build` sukses + 4 state teruji di setiap halaman baru |
| M4 | 18 test case insight lulus (`pnpm --filter @danaterbuka/shared test insight`) |
| M5 | `pnpm test:e2e` lulus untuk halaman terkait |
| M6 | Gate penuh §1.3 lulus + Lighthouse ≥ 85 perf, ≥ 95 a11y + 0 axe serious/critical |

---

## 5. Protokol Saat Terblokir

### 5.1 Kapan dianggap terblokir

- Dependensi task belum selesai (`depends_on` di TASKS.md).
- Informasi yang dibutuhkan tidak ada di dokumen spec (PRD/DATA_SPEC/ARCHITECTURE/UI_SPEC).
- Tes gagal karena bug di dependensi luar (library, platform).
- Data discovery (T-004) tidak menghasilkan sumber `Verified`.

### 5.2 Prosedur (urut, wajib)

| Langkah | Aksi |
|---------|------|
| 1 | **Cari jawaban di dokumen spec** — semua asumsi (A-01…A-18) dan keputusan sudah dikunci di PRD §12. |
| 2 | **Pakai fallback/default** — jika asumsi berlaku, pakai nilai default. Contoh: data tidak tersedia → fixture (`A-02`); skema belum diverifikasi → `UNVERIFIED` + fixture (`A-03`). |
| 3 | **Catat di `BLOCKERS.md`** — format tabel §5.3; teruskan ke task lain yang tidak ter-blocked. |
| 4 | **Jangan berhenti** — lanjut mengerjakan task yang tidak tergantung pada blocker. |

### 5.3 Format `BLOCKERS.md`

```markdown
# BLOCKERS.md

| ID | Task | Deskripsi | Tanggal | Status | Fallback yang dipakai | Resolusi |
|----|------|-----------|---------|--------|-----------------------|----------|
| BLK-001 | T-004 | Portal SIKD tidak dapat diakses (HTTP 403) | 2026-11-02 | Open | Fixture (A-02) | — |
```
**Aturan:**
- Satu baris per blocker; `ID = BLK-<nomor urut>`.
- `Status`: `Open` / `Resolved` / `Won't Fix`.
- `Fallback yang dipakai` wajib diisi — agent tidak boleh berhenti tanpa fallback.
- Review `BLOCKERS.md` di setiap awal sesi; resolusi lama ditandai `Resolved`.

### 5.4 Keputusan saat data tidak tersedia

| Kondisi | Keputusan otomatis |
|---------|--------------------|
| T-004 semua sumber `Not Available` | Kirim dengan fixture; tulis keterbatasan di `/metodologi`; `BLOCKERS.md` mencatat; **bukan kegagalan** |
| Sumber `Verified` tapi format berubah | Perbaiki hanya `pipeline/src/extract/*.ts` + `data/reference/aliases.json`; snapshot & UI tidak berubah |
| Library bermasalah | Cari alternatif yang sudah ada di lockfile; jika tidak ada, catat di BLOCKERS.md + pakai mock |
| Tes E2E flaky | Retry 2×; jika tetap gagal, catat dan lanjut; jangan disable tes |

---

## 6. Aturan Khusus UI Mudah Diganti

Ringkasan dari UI_SPEC §9 dan §10, diformat sebagai instruksi agent:
### 6.1 Prinsip

Semua keputusan visual berlabel **SEMENTARA**. Tim akan mengganti tampilan di M7. Agent **wajib** memastikan penggantian bisa dilakukan tanpa mengubah logika.
### 6.2 Checklist per komponen baru

| # | Cek | Cara verifikasi |
|---|-----|-----------------|
| 1 | Props hanya data + callback, bukan fetch/hook | Review kode |
| 2 | Warna/font/spacing dari token, bukan literal | `grep -E "#[0-9a-fA-F]{3,8}\|rgb\|hsl" <file>` kosong |
| 3 | Terdaftar di `/dev/components` dengan semua state | Buka halaman dev |
| 4 | `data-testid` unik + `aria-label` bila interaktif | Unit test |
| 5 | Microcopy dari `copy.id.ts`, bukan string literal | ESLint |
### 6.3 Ringkasan file yang boleh diubah saat rebranding M7

| Ubah | File |
|------|------|
| Tema | `tokens.css`, `tailwind.config.ts` |
| Layout | `pages/*.tsx`, `components/layout/*` |
| Komponen dasar | `components/ui/*` |
| Chart estetika | `SectorChart.tsx`, `TrendChart.tsx` (dalam `ChartWrapper`) |
| Teks | `copy.id.ts` |
| Glosarium | `shared/content/glossary.ts` |

**Jangan sentuh saat rebranding:** `hooks/`, `lib/api-client.ts`, `lib/format.ts`, `apps/api/**`, `packages/shared/schemas|metrics|insights`, `docs/*`.

---

## 7. Konvensi Kode

| Aspek | Aturan |
|-------|--------|
| Bahasa kode | Inggris (variabel, fungsi, komentar teknis) |
| Bahasa UI | Indonesia (microcopy, error message, insight) |
| Format angka | `Intl.NumberFormat('id-ID')`; ringkas via `formatRupiahCompact` |
| TypeScript | `strict: true`; hindari `any` (pakai `unknown` + guard); expor tipe eksplisit |
| Impor | Urut: node built-in → external → `@danaterbuka/shared` → `@/` lokal → relative |
| File baru | Kebab-case (`budget-service.ts`); komponen React PascalCase (`SummaryCards.tsx`) |
| Tes | Colocated `*.test.ts(x)` atau di `__tests__/`; nama deskriptif bahasa Inggris |
| Komentar | Hanya untuk *mengapa*, bukan *apa*; setiap ASSUMPTION diberi tag `// ASSUMPTION A-xx` |

---

## 8. Self-check

- [x] **Perintah lengkap**: 16 perintah per-paket + 14 perintah root + gate; semua mengacu script di ARCHITECTURE §10.1.
- [x] **DO/DON'T terukur**: 15 DO + 15 DON'T, masing-masing punya penegakan (ESLint, tes, review) dan rujukan ke dokumen sumber.
- [x] **Commit format jelas**: tipe, scope, contoh, + referensi task ID dan FR.
- [x] **DoD bertingkat**: 10 syarat umum + tambahan per milestone; semua berupa perintah yang bisa dijalankan.
- [x] **Protokol blocker lengkap**: 4 langkah + format tabel + keputusan otomatis untuk 4 skenario umum.
- [x] **UI mudah diganti masuk DO/DON'T**: DO-04/05/06/07, DNT-01/02, §6 checklist + ringkasan file M7.
- [x] **Konsisten**: nama paket (`@danaterbuka/web|api|shared|pipeline`), task ID (`T-xxx`), FR ID, route, dan param identik dengan 4 dokumen sebelumnya.

---

**Berhenti di sini.** Dokumen berikutnya: `docs/TASKS.md` — tunggu instruksi "lanjut".
