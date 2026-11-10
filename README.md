# DanaTerbuka

**Memahami Anggaran, Mengawasi Pembangunan.**

DanaTerbuka adalah aplikasi web yang mengubah data anggaran daerah (APBD) menjadi jawaban sederhana: berapa yang direncanakan dan terealisasi, sektor mana yang terbesar, dan apa yang tidak bisa disimpulkan dari angka tersebut. Dilengkapi insight otomatis, perbandingan antarwilayah, ekspor CSV, mode penjelasan dalam bahasa sehari-hari, dan kotak saran untuk pengembangan situs.

Dibuat untuk lomba **WIA MIA 2026**, tema _Designing Digital Futures – Powering Public Transparency_, subtema _Open Government Data_.

## Demo Online

- **Alamat situs:** [<ALAMAT-SITUS>](http://danaterbuka-production.up.railway.app/)
- Demo dijalankan di layanan hosting dengan masa percobaan dan dapat tidak tersedia setelah masa itu berakhir. Bila alamat di atas tidak dapat dibuka, aplikasi tetap bisa dijalankan sendiri dengan langkah di bagian [Cara Menjalankan](#cara-menjalankan).
- Layanan gratis atau percobaan dapat membutuhkan beberapa detik untuk bangun pada akses pertama.

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
| Tampilan                         | Font Inter (self-host), palet hijau dan krem, desain responsif                   |

Saat pengembangan, frontend dan backend berjalan terpisah: web di `localhost:5173` dan API di `localhost:3001`, dihubungkan lewat proxy `/api`. Pada mode produksi, satu server Express melayani hasil build web dan `/api` sekaligus. API membaca snapshot lewat adapter (`DATA_ADAPTER=snapshot`, bawaan); adapter fixture tersedia sebagai cadangan.

## Cara Menjalankan

Prasyarat: **Node.js 20 atau lebih baru** dan **pnpm**.

```bash
# 0. Install pnpm secara global jika belum (perhatikan flag -g)
npm install -g pnpm

# 1. Clone
git clone https://github.com/Altafianz/WIA.git
cd WIA

# 2. Install dependensi
pnpm install

# 3. Jalankan web dan API bersamaan (mode pengembangan)
pnpm dev
```

Lalu buka `http://localhost:5173`. API tersedia di `http://localhost:3001/api/health`.

Jangan menjalankan `npm install pnpm` di dalam folder proyek (tanpa `-g`), karena akan merusak `node_modules`. Bila port 3001 atau 5173 sudah terpakai, hentikan proses `pnpm dev` yang masih berjalan sebelum menjalankannya lagi.

### Mode produksi (satu server)

```bash
pnpm build
pnpm start
```

Lalu buka `http://localhost:3001`. Web dan API dilayani dari server yang sama.

### Perintah lain

```bash
pnpm test        # unit test semua paket
pnpm typecheck   # pengecekan tipe TypeScript
pnpm lint        # ESLint
pnpm build       # build shared, api, lalu web
pnpm start       # jalankan server produksi (setelah build)
```

## Konfigurasi (environment)

Salin `.env.example` menjadi `.env` bila ingin mengubah pengaturan (file `.env` tidak ikut repositori). Semua variabel memiliki nilai bawaan.

| Variabel               | Fungsi                                                                              |
| ---------------------- | ----------------------------------------------------------------------------------- |
| `PORT`, `HOST`         | Port dan host server (bawaan 3001 dan 0.0.0.0)                                      |
| `NODE_ENV`             | `development` atau `production`                                                     |
| `DATA_ADAPTER`         | `snapshot` (bawaan) atau `fixture`                                                  |
| `DEFAULT_REGION_SLUG`  | Wilayah awal (bawaan `provinsi-jawa-barat`)                                         |
| `FEEDBACK_FILE`        | Lokasi berkas saran (format JSONL)                                                  |
| `FEEDBACK_WEBHOOK_URL` | Opsional. Webhook (format kompatibel Discord) untuk menerima notifikasi saran baru  |
| `TRUST_PROXY`          | Isi `1` bila server berada di belakang satu proxy (hosting), agar IP pengguna benar |

## Deploy

Aplikasi dideploy sebagai satu layanan Node yang melayani web dan API.

- **Build command:** `pnpm install --frozen-lockfile --prod=false && pnpm run build`
- **Start command:** `pnpm run start`
- **Health check:** `/api/health`
- **Variabel:** `NODE_ENV=production`, `DATA_ADAPTER=snapshot`, `DEFAULT_REGION_SLUG=provinsi-jawa-barat`, `TRUST_PROXY=1`, dan `FEEDBACK_WEBHOOK_URL` (isi sendiri, jangan dimasukkan ke repositori). Jangan mengisi `PORT` bila hosting menyediakannya.
- Berkas `render.yaml` disertakan sebagai blueprint untuk Render. Demo saat ini berjalan di Railway dengan pengaturan yang sama.
- Berkas saran di server hosting bersifat sementara (tidak persisten); gunakan `FEEDBACK_WEBHOOK_URL` agar saran tersimpan di luar server.

## Struktur Proyek

```
apps/
  api/            REST API read-only (Express) + penyaji build web
  web/            Aplikasi React
packages/
  shared/         Skema, tipe, rumus metrik, mesin insight, glosarium
data/
  processed/      Snapshot data DJPK + laporan kualitas
  fixtures/       Data contoh (cadangan dan untuk tes)
  reference/      Referensi wilayah dan sektor
scripts/          Pembangun snapshot dan generator fixture
docs/             PRD, DATA_SPEC, ARCHITECTURE, UI_SPEC, TASKS
render.yaml       Blueprint deploy (Render)
```

## Fitur

- **Beranda:** pengantar, tiga pertanyaan kunci warga, jalan pintas ke Dashboard, informasi transparansi sumber, dan kotak **Kirim Saran** untuk pengembangan situs.
- **Dashboard:** kartu ringkasan pagu, realisasi, persentase realisasi, dan sisa anggaran; grafik alokasi per sektor dan tren tahunan, masing-masing dengan tabel alternatif; panel temuan dan catatan data.
- **Filter Provinsi dan Sub-wilayah** serta tahun, tersimpan di URL sehingga tautannya bisa dibagikan.
- **Insight otomatis** dengan batas kesimpulan di setiap kalimat.
- **Mode Penjelasan Sederhana** yang mengganti istilah teknis dengan bahasa sehari-hari.
- **Bandingkan:** dua wilayah atau dua tahun, dengan peringatan bila level wilayah berbeda.
- **Ekspor CSV** dari data yang sedang ditampilkan.
- **Glosarium** dan **Metodologi** (sumber, aturan pengolahan, keterbatasan), dengan sidebar daftar isi.
- **Pemberitahuan** (popup di kiri atas) untuk data tahun 2021-2022 dan perbandingan lintas level, yang tetap tampil sampai ditutup pengguna.
- **Tampilan responsif** dengan menu burger di perangkat seluler.
- **Kirim Saran:** saran pengguna divalidasi, dibatasi lajunya, disimpan ke berkas, dan dapat diteruskan ke webhook.
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
- [x] Menu burger seluler dan pembaruan tampilan
- [x] Fitur Kirim Saran
- [x] Deploy (satu layanan Express yang melayani web dan API)

## Lisensi Data

Data anggaran bersumber dari DJPK Kementerian Keuangan RI dan hak ciptanya tetap pada DJPK. Repositori ini menyertakan hasil olahan untuk keperluan lomba dan demonstrasi, dengan sumber dicantumkan. Data contoh (fixture) dibuat otomatis dan tidak merepresentasikan anggaran daerah yang sebenarnya.
