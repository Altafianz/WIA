# DanaTerbuka

**Memahami Anggaran, Mengawasi Pembangunan.**

DanaTerbuka adalah aplikasi web yang mengubah data anggaran daerah (APBD) menjadi jawaban sederhana: berapa yang direncanakan dan terealisasi, sektor mana yang terbesar, dan apa yang tidak bisa disimpulkan dari angka tersebut. Dilengkapi insight otomatis, perbandingan antarwilayah, dan mode penjelasan dalam bahasa sehari-hari.

Dibuat untuk lomba **WIA MIA 2026**, tema *Designing Digital Futures – Powering Public Transparency*, subtema *Open Government Data*.

> **Catatan data:** seluruh angka yang tampil saat ini adalah **data contoh**, bukan data resmi pemerintah. Wilayah dan nilainya dibuat oleh generator fixture dan diberi label "Data contoh" di setiap halaman. Aplikasi disiapkan agar sumber data bisa diganti lewat adapter tanpa mengubah tampilan.

## Tech Stack

| Bagian | Teknologi |
|---|---|
| Frontend (`apps/web`) | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Recharts |
| Backend (`apps/api`) | Node.js, Express, TypeScript, Zod, Helmet |
| Kode bersama (`packages/shared`) | Skema Zod, rumus metrik, mesin insight (fungsi murni) |
| Tooling | pnpm workspace (monorepo), Vitest, Supertest, ESLint |

Frontend dan backend dipisah: web berjalan di `localhost:5173` dan memanggil API di `localhost:3001` lewat proxy `/api`.

## Cara Menjalankan

Prasyarat: **Node.js 20 atau lebih baru** dan **pnpm 9**.

```bash
# 1. Clone
git clone <url-repo-kamu>
cd <nama-folder-repo>

# 2. Install dependensi
pnpm install

# 3. Jalankan web dan API bersamaan
pnpm dev
```

Lalu buka `http://localhost:5173`. API tersedia di `http://localhost:3001/api/health`.

Perintah lain:

```bash
pnpm test        # unit test semua paket
pnpm typecheck   # pengecekan tipe TypeScript
pnpm lint        # ESLint
pnpm build       # build shared, api, lalu web
pnpm start       # jalankan API produksi (setelah build)
```

## Struktur Proyek

```
apps/
  api/            REST API read-only (Express)
  web/            Aplikasi React (landing page, dashboard)
packages/
  shared/         Skema, tipe, rumus metrik, mesin insight
data/
  fixtures/       Data contoh (150 record, 5 wilayah fiktif)
  reference/      Referensi wilayah dan sektor
scripts/          Generator fixture
docs/             PRD, DATA_SPEC, ARCHITECTURE, UI_SPEC, TASKS
```

## Progress Saat Ini

Draft ini berfokus pada satu alur lengkap: **landing page + dashboard** dengan data contoh.

- [x] Struktur monorepo pnpm (web, api, shared)
- [x] Data contoh: 150 record, 5 wilayah fiktif, berlabel "Data contoh"
- [x] Rumus metrik dan mesin insight dengan unit test (27 tes lulus)
- [x] API: health, meta, regions, sectors, ringkasan anggaran, sektor, tren, insight (6 tes lulus)
- [x] Komponen web: layout, kartu ringkasan, kartu sumber data, panel insight, badge "Data contoh", state loading/empty/error, tombol salin tautan
- [ ] Router dan halaman Beranda (landing page)
- [ ] Halaman Dashboard (filter wilayah dan tahun, grafik sektor, grafik tren)
- [ ] Halaman placeholder "Segera hadir" dan halaman 404
- [ ] Halaman Bandingkan, Glosarium, dan Metodologi (tahap berikutnya)

## Fitur yang Direncanakan

- Kartu ringkasan pagu, realisasi, persentase realisasi, dan sisa anggaran
- Grafik alokasi per sektor dan tren tahunan, masing-masing dengan tabel alternatif
- Filter wilayah dan tahun yang tersimpan di URL sehingga tautannya bisa dibagikan
- Insight otomatis dengan batas kesimpulan di setiap kalimat
- Mode "Penjelasan Sederhana" yang mengganti istilah teknis dengan bahasa sehari-hari
- Perbandingan dua wilayah atau dua tahun, glosarium, dan halaman metodologi

## Lisensi Data

Data contoh dibuat otomatis oleh generator fixture dan tidak merepresentasikan anggaran daerah yang sebenarnya.
