# DanaTerbuka

**Memahami Anggaran, Mengawasi Pembangunan.**

DanaTerbuka adalah aplikasi web yang mengubah data anggaran daerah (APBD) menjadi jawaban sederhana: berapa yang direncanakan dan terealisasi, sektor mana yang terbesar, dan apa yang tidak bisa disimpulkan dari angka tersebut. Dilengkapi insight otomatis, perbandingan antarwilayah, ekspor CSV, dan mode penjelasan dalam bahasa sehari-hari.

Dibuat untuk lomba **WIA MIA 2026**, tema _Designing Digital Futures – Powering Public Transparency_, subtema _Open Government Data_.

> **Catatan data:** angka yang tampil berasal dari data resmi **DJPK Kementerian Keuangan** (Belanja Daerah menurut Fungsi) untuk lima provinsi. Data diproses menjadi snapshot yang disertakan di repositori, sehingga aplikasi berjalan tanpa mengunduh apa pun. Detail sumber, cakupan, dan keterbatasan ada di halaman **Metodologi** di dalam aplikasi.

## Data

- **Sumber:** DJPK Kemenkeu, _Belanja Daerah menurut Fungsi_ (https://djpk.kemenkeu.go.id/?p=5412). Hak cipta data ada pada DJPK Kemenkeu; DanaTerbuka hanya mengolah dan menampilkannya dengan mencantumkan sumber.
- **Cakupan:** 5 provinsi (DKI Jakarta, Jawa Barat, Jawa Tengah, Jawa Timur, Banten), memuat pemerintah provinsi dan kabupaten/kota di dalamnya: 113 wilayah. Untuk DKI Jakarta, berkas DJPK hanya memuat pemerintah provinsi.
- **Periode:** 2021 sampai 2026. Pagu tersedia untuk semua tahun; realisasi tersedia untuk 2021 sampai 2024.
- **Sektor:** 9 fungsi yang tersedia di data DJPK (Pelayanan Umum, Ketertiban dan Keamanan, Ekonomi, Perlindungan Lingkungan Hidup, Perumahan dan Fasilitas Umum, Kesehatan, Pariwisata, Pendidikan, Perlindungan Sosial).
- **Keterbatasan penting:**
  - Angka 2021-2022 kurang tepat untuk dibandingkan. Pagu dicatat pada pertengahan tahun, sedangkan realisasi berasal dari laporan terpisah yang disusun belakangan, sehingga persentase realisasi per sektor bisa tampak terlalu tinggi atau terlalu rendah.
  - Anggaran "Provinsi X" adalah anggaran pemerintah provinsi itu sendiri, bukan jumlah kabupaten/kota di dalamnya, sehingga tidak sebanding langsung dengan kabupaten/kota.

### Membangun ulang data (opsional)

Snapshot sudah tersedia di `data/processed/snapshot.v1.json`. Untuk membangun ulang dari berkas asli, unduh berkas Belanja per Fungsi dari DJPK ke `data/raw/` (folder ini tidak ikut repositori), lalu:

```bash
pnpm data:build   # olah data/raw menjadi snapshot + laporan kualitas
pnpm data:check   # validasi snapshot terhadap skema
```

## Tech Stack

| Bagian                           | Teknologi                                                                        |
| -------------------------------- | -------------------------------------------------------------------------------- |
| Frontend (`apps/web`)            | React 18, TypeScript, Vite, Tailwind CSS, React Router, TanStack Query, Recharts |
| Backend (`apps/api`)             | Node.js, Express, TypeScript, Zod, Helmet                                        |
| Kode bersama (`packages/shared`) | Skema Zod, rumus metrik, mesin insight, glosarium (fungsi murni)                 |
| Tooling                          | pnpm workspace (monorepo), Vitest, Supertest, ESLint                             |

Frontend dan backend dipisah: web berjalan di `localhost:5173` dan memanggil API di `localhost:3001` lewat proxy `/api`. API membaca snapshot lewat adapter (`DATA_ADAPTER=snapshot`, bawaan); adapter fixture tersedia sebagai cadangan.

## Cara Menjalankan

Prasyarat: **Node.js 20 atau lebih baru** dan **pnpm 9**.

```bash
# 0. Install pnpm jika belum
npm install -g pnpm

# 1. Clone
git clone https://github.com/Altafianz/WIA.git
cd WIA

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
  web/            Aplikasi React
packages/
  shared/         Skema, tipe, rumus metrik, mesin insight, glosarium
data/
  processed/      Snapshot data DJPK + laporan kualitas
  fixtures/       Data contoh (cadangan dan untuk tes)
  reference/      Referensi wilayah dan sektor
scripts/          Pembangun snapshot dan generator fixture
docs/             PRD, DATA_SPEC, ARCHITECTURE, UI_SPEC, TASKS
```

## Fitur

- **Beranda:** pengantar dan jalan pintas ke Dashboard.
- **Dashboard:** kartu ringkasan pagu, realisasi, persentase realisasi, dan sisa anggaran; grafik alokasi per sektor dan tren tahunan, masing-masing dengan tabel alternatif.
- **Filter Provinsi dan Sub-wilayah** serta tahun, tersimpan di URL sehingga tautannya bisa dibagikan.
- **Insight otomatis** dengan batas kesimpulan di setiap kalimat.
- **Mode Penjelasan Sederhana** yang mengganti istilah teknis dengan bahasa sehari-hari.
- **Bandingkan:** dua wilayah atau dua tahun, dengan catatan bila levelnya berbeda.
- **Ekspor CSV** dari data yang sedang ditampilkan.
- **Glosarium** dan **Metodologi** (sumber, aturan pengolahan, keterbatasan).
- Label sumber dan catatan kualitas data di setiap halaman.

## Progress

- [x] Struktur monorepo pnpm (web, api, shared)
- [x] Rumus metrik dan mesin insight dengan unit test
- [x] API read-only: health, meta, regions, sectors, ringkasan, sektor, tren, insight, bandingkan, ekspor
- [x] Halaman Beranda, Dashboard, Bandingkan, Glosarium, Metodologi, dan 404
- [x] Mode Penjelasan Sederhana
- [x] Ekspor CSV, metadata SEO
- [x] Data resmi DJPK (snapshot) menggantikan data contoh
- [x] Cakupan 5 provinsi dengan filter Provinsi dan Sub-wilayah terpisah
- [x] Deploy (satu layanan Express yang melayani web dan API)

## Lisensi Data

Data anggaran bersumber dari DJPK Kementerian Keuangan RI dan hak ciptanya tetap pada DJPK. Repositori ini menyertakan hasil olahan untuk keperluan lomba dan demonstrasi, dengan sumber dicantumkan. Data contoh (fixture) dibuat otomatis dan tidak merepresentasikan anggaran daerah yang sebenarnya.
