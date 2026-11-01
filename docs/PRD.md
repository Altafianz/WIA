# PRD.md — DanaTerbuka

> **Nama file:** `docs/PRD.md`
> **Versi:** 1.0.0 · **Tanggal:** 1 November 2026 · **Status:** Baseline eksekusi (frozen untuk M0–M6)
> **Produk:** DanaTerbuka — *Memahami Anggaran, Mengawasi Pembangunan*
> **Konteks:** Lomba WIA MIA 2026 (Multimedia In Action), tema *Designing Digital Futures – Powering Public Transparency*, subtema *Open Government Data*.
> **Dokumen saudara:** `docs/DATA_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/UI_SPEC.md`, `docs/AGENTS.md`, `docs/TASKS.md`.
> **Aturan:** Dokumen ini tidak boleh menghasilkan pertanyaan balik. Semua ketidakpastian sudah dikunci sebagai ASSUMPTION (`A-xx`) dengan nilai default yang wajib dipakai agent.

---

## 1. Ringkasan Produk

**DanaTerbuka** adalah aplikasi web yang mengubah data anggaran daerah (APBD) dan realisasinya menjadi jawaban sederhana atas tiga pertanyaan warga:

1. Berapa uang yang direncanakan dan berapa yang sudah terealisasi?
2. Sektor apa yang mendapat alokasi terbesar?
3. Apa yang **tidak** bisa disimpulkan dari angka ini?

Produk ini bukan sekadar menampilkan tabel: data mentah dinormalisasi oleh pipeline, dihitung menjadi metrik turunan (persentase realisasi, pangsa sektor, pertumbuhan tahunan, peringkat), dibandingkan antar wilayah/periode, lalu diterjemahkan menjadi kalimat insight netral oleh mesin aturan yang dapat diuji unit. Semua angka selalu ditemani metadata sumber, periode, dan tanggal pembaruan.

### 1.1 Tiga usulan nama

| # | Nama | Tagline | Penilaian |
|---|------|---------|-----------|
| 1 | **DanaTerbuka** | *Memahami anggaran, mengawasi pembangunan.* | **[DIPILIH]** Deskriptif, mudah diingat, domain netral, langsung menjelaskan manfaat. Dipakai sebagai nama produk, brand, dan `package.json` scope (`@danaterbuka/*`). |
| 2 | AnggaranWarga | *Anggaran daerah, dalam bahasa manusia.* | Kuat secara emosional, tetapi kata "warga" menyempitkan audiens (jurnalis/peneliti kurang terwakili). |
| 3 | RuangFiskal | *Satu ruang untuk membaca uang publik.* | Terdengar institusional/teknis; istilah "fiskal" justru menaikkan ambang pemahaman warga awam. |

**Keputusan:** nama produk = **DanaTerbuka**. Nama tidak boleh diubah di dokumen lain tanpa memperbarui file ini.

### 1.2 Prinsip produk (mengikat, berlaku di UI_SPEC dan TASKS)

| ID | Prinsip | Konsekuensi konkret |
|----|---------|---------------------|
| PP-01 | **Jujur soal data** | Setiap angka punya `SourceMeta` + stempel "Diperbarui: …". Tidak ada klaim *real-time*; label yang dipakai: "snapshot berkala". |
| PP-02 | **Tidak menuduh** | Insight memakai bahasa deskriptif ("alokasi X lebih besar 2,1× dari median"), dilarang kata "korupsi", "boros", "gagal", "menyeleweng". |
| PP-03 | **Batas kesimpulan selalu tampil** | Setiap insight dan setiap halaman data punya teks keterbatasan. |
| PP-04 | **Ramah warga awam** | Setiap istilah teknis punya tooltip glosarium; mode "Penjelasan Sederhana" mengubah label. |
| PP-05 | **Bisa dipakai saat internet buruk** | Build awal ≤ 220 KB gzip; data snapshot di-cache; aplikasi tetap jalan 100% dengan fixture. |
| PP-06 | **Bisa dibagikan** | Seluruh state filter hidup di URL; satu tautan mereproduksi tampilan yang sama. |

---

## 2. Problem Statement

Data APBD tersedia di portal pemerintah (SIKD Kemenkeu, Satu Data Indonesia), namun:

- **P-01** Istilah keuangan (pagu, realisasi, SILPA, belanja tidak langsung) tidak dipahami warga non-akuntan.
- **P-02** Angka pagu dan realisasi tersaji terpisah; membandingkannya butuh perhitungan manual.
- **P-03** Tidak ada peringkat visual "sektor mana yang paling besar" dalam satu tampilan.
- **P-04** Perbandingan antarwilayah/antartahun dilakukan manual (unduh, olah spreadsheet).
- **P-05** Pengguna tidak tahu kapan data terakhir diperbarui, dari mana, dan apa keterbatasannya — sehingga sulit menilai kredibilitas.
- **P-06** Insight yang beredar di media sosial sering melampaui batas data (mis. menyimpulkan korupsi dari realisasi rendah).

**Problem statement (satu paragraf):** Warga, jurnalis, dan mahasiswa membutuhkan cara cepat dan tepercaya untuk memahami serta membandingkan anggaran dan realisasi daerah, tetapi data resmi tersedia dalam format teknis yang terpisah-pisah, tanpa konteks, tanpa peringkat, dan tanpa penjelasan batas kesimpulan — sehingga pengawasan publik berbasis data sulit dilakukan.

---

## 3. Tujuan & Success Metrics

### 3.1 Tujuan produk

| ID | Tujuan | Alasan |
|----|--------|--------|
| G-01 | Pengguna awam dapat menjawab 3 pertanyaan inti (pagu, realisasi, sektor terbesar) dalam ≤ 60 detik tanpa membaca dokumentasi. | Nilai inti produk. |
| G-02 | Pengguna dapat membandingkan 2 wilayah atau 2 tahun dan membagikan hasilnya lewat URL. | Mendorong diskusi publik berbasis data. |
| G-03 | Setiap angka dapat ditelusuri ke sumber, periode, dan tanggal pembaruan. | Kepercayaan publik. |
| G-04 | Sistem tetap berfungsi penuh tanpa akses internet ke portal pemerintah. | Keandalan saat demo & saat sumber down. |

### 3.2 Success metrics (terukur, diverifikasi di M6)

| ID | Metrik | Target | Cara verifikasi |
|----|--------|--------|-----------------|
| SM-01 | Waktu menyelesaikan tugas inti (pilih wilayah → baca pagu/realisasi → sektor terbesar) | ≤ 60 detik, tanpa scroll horizontal di 360 px | Uji kegunaan 3 orang non-teknis, dicatat di `docs/demo/DEMO_SCRIPT.md` |
| SM-02 | Lighthouse Performance (mobile, throttling 4G) halaman `/dashboard` | ≥ 85 | `npx lighthouse http://localhost:4173/dashboard --preset=desktop` + mode mobile CI |
| SM-03 | Lighthouse Accessibility | ≥ 95 di `/`, `/dashboard`, `/bandingkan`, `/glosarium`, `/metodologi` | Lighthouse CI (`@lhci/cli`) |
| SM-04 | Pelanggaran axe-core tingkat `serious` + `critical` | 0 | `pnpm test:e2e` (Playwright + `@axe-core/playwright`) |
| SM-05 | Cakupan tes untuk FR berprioritas Must | 100% FR Must punya ≥ 1 tes otomatis | Tabel traceability `docs/TASKS.md` + laporan `pnpm test --coverage` |
| SM-06 | Akurasi mesin insight pada golden set | 18/18 kasus (6 aturan × 3 kasus) lulus | `pnpm --filter @danaterbuka/shared test insight` |
| SM-07 | Reproduksibilitas tautan | URL `/bandingkan?...` yang dibuka di jendela incognito menghasilkan state & angka identik | E2E `compare-share-link.spec.ts` |
| SM-08 | Kelengkapan atribusi | 100% halaman yang menampilkan angka memuat komponen `SourceInfoCard` + badge data | Uji E2E `source-attribution.spec.ts` (5 halaman) |
| SM-09 | Kesiapan demo offline | Aplikasi lulus seluruh E2E dengan `DATA_ADAPTER=fixture` dan jaringan eksternal diblokir | `pnpm test:e2e:offline` |
| SM-10 | Tidak ada angka tanpa sumber | 0 angka hardcoded di `apps/web/src` (selain fixture & konstanta format) | `pnpm lint:no-hardcoded-numbers` (ESLint rule kustom, lihat ARCHITECTURE.md) |
| SM-11 | Kecepatan pipeline | `pnpm pipeline` membangun snapshot (≤ 1.000 record) dalam ≤ 15 detik | `Measure-Command { pnpm pipeline }` (Windows) / `time pnpm pipeline` |
| SM-12 | Ukuran bundle awal | JS awal ≤ 220 KB gzip | `pnpm build:analyze` (vite-plugin-visualizer) |

---

## 4. Persona

| ID | Persona | Profil | Kebutuhan utama | Perangkat | Rasa frustrasi saat ini |
|----|---------|--------|-----------------|-----------|--------------------------|
| PER-01 | **Sari — Warga Awam** | 34 th, ibu rumah tangga, SMA, tidak paham istilah keuangan, akses internet 3G/4G terbatas (kuota 5 GB/bln) | "Saya ingin tahu uang daerah dipakai untuk apa, tanpa harus mengerti istilah akuntansi." | Android mid-range, layar 360 px | Tabel angka besar tanpa penjelasan; istilah "pagu", "SILPA" tidak dikenal |
| PER-02 | **Rangga — Jurnalis/Aktivis** | 27 th, reporter lokal, terbiasa Excel, butuh bukti | "Saya butuh angka yang bisa dikutip, tautan yang bisa dibagikan ke editor, dan CSV untuk analisis lanjutan." | Laptop 1366×768, Chrome | Tidak ada tautan stabil ke state tertentu; tidak bisa mengekspor; tidak tahu tanggal data |
| PER-03 | **Nadia — Mahasiswa/Peneliti** | 21 th, mahasiswa administrasi publik, menulis skripsi | "Saya butuh definisi rumus, sumber, periode, dan keterbatasan data untuk sitasi." | Laptop + HP | Metodologi tidak jelas; tidak ada info lisensi/atribusi |

**Konsekuensi desain:** satu antarmuka, dua kedalaman. Lapisan dasar (kartu + grafik + insight) untuk PER-01; lapisan dalam (metodologi, tabel, ekspor CSV, `SourceMeta` lengkap) untuk PER-02/PER-03.

---

## 5. User Stories per Epic

Penomoran `US-xx` dipakai konsisten di `docs/UI_SPEC.md` dan `docs/TASKS.md`.

### Epic E1 — Memahami anggaran (Dashboard)

| ID | User story | Persona | Prioritas |
|----|------------|---------|-----------|
| US-01 | Sebagai warga awam, saya ingin melihat total anggaran & realisasi wilayah saya dalam satu kartu, agar saya tahu besar uang dan serapannya. | PER-01 | Must |
| US-02 | Sebagai warga awam, saya ingin melihat grafik sektor terbesar, agar saya tahu ke mana sebagian besar uang pergi. | PER-01 | Must |
| US-03 | Sebagai warga awam, saya ingin membaca penjelasan istilah dengan menekan ikon "?", agar saya tidak perlu membuka tab lain. | PER-01 | Must |
| US-04 | Sebagai jurnalis, saya ingin melihat tren 5 tahun, agar saya bisa melihat arah kebijakan anggaran. | PER-02 | Must |
| US-05 | Sebagai mahasiswa, saya ingin membaca tabel alternatif dari grafik, agar angkanya bisa saya salin. | PER-03 | Must |

### Epic E2 — Menyaring & membagikan (Filter)

| ID | User story | Persona | Prioritas |
|----|------------|---------|-----------|
| US-06 | Sebagai jurnalis, saya ingin state filter tersimpan di URL, agar tautan yang saya kirim menampilkan hal yang sama. | PER-02 | Must |
| US-07 | Sebagai warga awam, saya ingin filter berupa pilihan yang jelas (bukan mengetik kode), agar tidak salah input. | PER-01 | Must |
| US-08 | Sebagai pengguna, saya ingin diberi tahu bila kombinasi filter tidak punya data, agar saya tidak mengira aplikasi rusak. | PER-01 | Must |

### Epic E3 — Membandingkan (Compare)

| ID | User story | Persona | Prioritas |
|----|------------|---------|-----------|
| US-09 | Sebagai jurnalis, saya ingin membandingkan 2 wilayah pada tahun yang sama, agar saya bisa menulis perbandingan yang adil. | PER-02 | Must |
| US-10 | Sebagai mahasiswa, saya ingin membandingkan 1 wilayah pada 2 tahun, agar saya bisa menghitung pertumbuhan. | PER-03 | Must |
| US-11 | Sebagai pengguna, saya ingin melihat selisih dan persentase selisih secara eksplisit, agar tidak menghitung manual. | PER-02 | Must |

### Epic E4 — Insight otomatis

| ID | User story | Persona | Prioritas |
|----|------------|---------|-----------|
| US-12 | Sebagai warga awam, saya ingin 3–5 kalimat insight yang otomatis, agar saya tahu hal penting tanpa menganalisis grafik. | PER-01 | Must |
| US-13 | Sebagai jurnalis, saya ingin setiap insight menyebut batas kesimpulan, agar saya tidak salah kutip. | PER-02 | Must |
| US-14 | Sebagai mahasiswa, saya ingin insight dapat disalin sebagai teks, agar mudah dipakai di catatan. | PER-03 | Should |

### Epic E5 — Edukasi & transparansi metode

| ID | User story | Persona | Prioritas |
|----|------------|---------|-----------|
| US-15 | Sebagai warga awam, saya ingin mengaktifkan "Penjelasan Sederhana", agar istilah teknis diganti bahasa sehari-hari. | PER-01 | Must |
| US-16 | Sebagai mahasiswa, saya ingin halaman metodologi memuat rumus & sumber, agar bisa disitasi. | PER-03 | Must |
| US-17 | Sebagai pengguna, saya ingin melihat data contoh ditandai jelas, agar saya tidak mengira itu data resmi. | Semua | Must |

### Epic E6 — Ekspor & jejak data

| ID | User story | Persona | Prioritas |
|----|------------|---------|-----------|
| US-18 | Sebagai jurnalis, saya ingin mengunduh CSV dari tampilan saat ini, agar bisa diolah di spreadsheet. | PER-02 | Should |
| US-19 | Sebagai jurnalis, saya ingin mengunduh grafik sebagai PNG, agar bisa dipakai di artikel/presentasi. | PER-02 | Should |

---

## 6. Daftar Fitur

Legenda: **MoSCoW** = Must / Should / Could / Won't. **Ukuran** = S (≤ 2 jam agent), M (½ hari agent), L (1 hari agent). Tag **[IDE-USER]** = berasal dari brief pengguna; **[TAMBAHAN]** = diusulkan spesifikasi ini beserta satu alasan.

### 6.1 MVP (wajib selesai sebelum hari-H)

| ID | Fitur | Deskripsi | Persona | MoSCoW | Ukuran | Tag |
|----|-------|-----------|---------|--------|--------|-----|
| F-01 | Kartu ringkasan anggaran | Total pagu, realisasi, % realisasi, sisa (gap) untuk wilayah+tahun terpilih | PER-01 | Must | M | [IDE-USER] |
| F-02 | Grafik alokasi per sektor | Bar chart horizontal pagu vs realisasi, urut menurun, Top 10 + "Lainnya" | PER-01 | Must | M | [IDE-USER] |
| F-03 | Filter wilayah & tahun | Dropdown provinsi/kota + tahun, state di URL | Semua | Must | M | [IDE-USER] |
| F-04 | Perbandingan 2 wilayah / 2 periode | Mode `region` (2 wilayah, 1 tahun) & `year` (1 wilayah, 2 tahun) + delta | PER-02 | Must | M | [IDE-USER] |
| F-05 | Insight otomatis | 3–5 kalimat dari 6 aturan murni (INS-01…INS-06) | PER-01 | Must | M | [IDE-USER] |
| F-06 | Info sumber & periode | `SourceInfoCard`: sumber, URL, tanggal ambil, tanggal update, lisensi, status fixture | Semua | Must | S | [IDE-USER] |
| F-07 | Tren tahunan | Line/bar pagu & realisasi 2021–2025 untuk wilayah terpilih | PER-02 | Must | M | [TAMBAHAN] — melengkapi pertanyaan "bagaimana perubahan dari tahun ke tahun" yang belum punya visual di MVP awal. |
| F-08 | Mode "Penjelasan Sederhana" | Toggle global: label teknis → frasa awam, istilah bergaris putus + tooltip | PER-01 | Must | M | [TAMBAHAN] — inti diferensiasi terhadap portal pemerintah yang hanya menampilkan istilah teknis. |
| F-09 | Glosarium | Halaman `/glosarium`, ≥ 15 istilah, pencarian klien | PER-01 | Must | S | [TAMBAHAN] — menutup masalah P-01 secara mandiri (bisa dibuka tanpa konteks halaman). |
| F-10 | Halaman metodologi & sumber | Rumus metrik, keterbatasan, atribusi, tanggal pembaruan | PER-03 | Must | M | [TAMBAHAN] — syarat kredibilitas & sitasi; sekaligus menjawab rubrik "transparansi metode". |
| F-11 | Tabel alternatif grafik | Toggle "Lihat sebagai tabel" pada setiap grafik (aksesibilitas + salin angka) | PER-03 | Must | S | [TAMBAHAN] — WCAG AA butuh alternatif teks; sekaligus memenuhi kebutuhan ekspor manual. |
| F-12 | Tautan filter dapat dibagikan | Tombol "Salin tautan" + parameter URL kanonik | PER-02 | Must | S | [TAMBAHAN] — memperbesar dampak sosial: temuan bisa disebar dan diverifikasi ulang. |
| F-13 | Badge "Data contoh" | Badge persisten di header + kartu saat `isFixture=true` | Semua | Must | S | [TAMBAHAN] — kepatuhan etika data (prinsip 6 pada brief). |
| F-14 | Empat state wajib | Loading, empty, error, dan data-contoh/stale di setiap halaman data | Semua | Must | M | [TAMBAHAN] — mencegah demo gagal & mencegah misinterpretasi "0" sebagai fakta. |

### 6.2 Fase 2 (hanya jika M0–M5 selesai lebih awal)

| ID | Fitur | Deskripsi | Persona | MoSCoW | Ukuran | Tag |
|----|-------|-----------|---------|--------|--------|-----|
| F-15 | Ekspor CSV | Unduh data tampilan aktif (wilayah, tahun, sektor) | PER-02 | Should | M | [TAMBAHAN] — jurnalis butuh bahan olah lanjut; murah karena data sudah di memori. |
| F-16 | Ekspor PNG grafik | Simpan grafik sebagai PNG 2× untuk artikel | PER-02 | Should | S | [TAMBAHAN] — mempercepat distribusi temuan ke media sosial. |
| F-17 | Sorot sektor | Klik legenda untuk menyorot satu sektor di grafik & tabel | PER-03 | Should | S | [TAMBAHAN] — membaca 10 sektor sekaligus sulit di layar 360 px. |
| F-18 | Salin teks insight | Tombol "Salin" per insight | PER-03 | Should | S | [TAMBAHAN] — mengurangi salah kutip. |
| F-19 | Peringkat nasional | Peringkat % realisasi antarwilayah dalam dataset | PER-02 | Could | M | [TAMBAHAN] — konteks antarwilayah; ditunda karena bergantung cakupan data riil yang belum terverifikasi. |
| F-20 | Unduh snapshot JSON | Unduh snapshot mentah ternormalisasi | PER-03 | Could | S | [TAMBAHAN] — mendukung riset reproduktif. |

### 6.3 Out of Scope (dinyatakan tegas agar agent tidak mengerjakannya)

| ID | Fitur | Alasan dikecualikan |
|----|-------|---------------------|
| X-01 | Login/akun/personal dashboard | Tidak ada kebutuhan; menambah permukaan keamanan & waktu. |
| X-02 | Input/unggah data oleh pengguna | Risiko integritas & moderasi; produk bersifat read-only. |
| X-03 | Klaim *real-time streaming* / WebSocket | Sumber data tidak menyediakan streaming; klaim akan menyesatkan (melanggar PP-01). |
| X-04 | Peta choropleth interaktif | Butuh GeoJSON per wilayah yang belum terverifikasi + menambah beban bundle. |
| X-05 | Prediksi/forecasting anggaran (ML) | Data terlalu pendek & berisiko menyesatkan; insight berbasis aturan cukup. |
| X-06 | Integrasi pembayaran/pengaduan warga | Di luar subtema Open Government Data. |
| X-07 | Multi-bahasa (EN) | Audiens lomba Indonesia; seluruh microcopy id-ID. |
| X-08 | Mode gelap | Nice-to-have; menambah pekerjaan token warna & uji kontras ganda. |
| X-09 | Chatbot/LLM tanya-jawab data | Tidak dapat dijamin akurat & auditable dalam waktu lomba; insight deterministik lebih dapat dipertanggungjawabkan. |
| X-10 | Analisis per OPD/SKPD | Data per OPD belum terverifikasi ketersediaannya; fungsi/sektor sudah cukup untuk MVP. |

---

## 7. Functional Requirements (FR)

Skala prioritas memakai MoSCoW. Kolom **Milestone** mengacu pada `docs/TASKS.md`.

### 7.1 Data & integritas

| ID | Requirement | Prioritas | Milestone | FR turunan AC |
|----|-------------|-----------|-----------|---------------|
| FR-001 | API memuat snapshot JSON ternormalisasi dari `data/processed/snapshot.v1.json` ke memori saat startup dan menyajikan seluruh data tanpa panggilan jaringan eksternal saat *request*. | Must | M1/M2 | AC-001 |
| FR-002 | Setiap respons endpoint data menyertakan objek `meta` berisi `sourceName`, `sourceUrl`, `retrievedAt`, `sourceUpdatedAt`, `license`, `isFixture`, `snapshotVersion`. | Must | M2 | AC-002 |
| FR-003 | Ketika `meta.isFixture = true`, UI menampilkan badge teks "Data contoh" pada header global dan pada setiap kartu angka/grafik. | Must | M3 | AC-003 |
| FR-004 | Pipeline ETL menulis `data/processed/quality-report.json` berisi jumlah record masuk, diterima, ditolak, dan daftar alasan penolakan per kode. | Must | M1 | AC-004 |
| FR-005 | Snapshot divalidasi dengan skema Zod saat startup; jika gagal, API beralih ke fixture dan menandai `meta.dataStatus = "degraded"` tanpa crash. | Must | M2 | AC-005 |

### 7.2 Dashboard

| ID | Requirement | Prioritas | Milestone |
|----|-------------|-----------|-----------|
| FR-010 | Halaman `/dashboard` menampilkan 4 angka: `totalPagu`, `totalRealisasi`, `realizationRate` (persen, 1 desimal), `remainingBudget` untuk `region` + `year` terpilih. | Must | M3 |
| FR-011 | Grafik sektor menampilkan maksimum 10 sektor teratas berdasarkan `pagu` (urut menurun) + baris agregat "Sektor lainnya" bila sektor > 10. | Must | M3 |
| FR-012 | Grafik tren menampilkan `pagu` dan `realisasi` untuk 5 tahun fiskal terakhir yang tersedia (maksimum 2021–2025) pada wilayah terpilih. | Must | M3 |
| FR-013 | Setiap grafik memiliki tombol "Lihat sebagai tabel" yang menampilkan data identik dalam `<table>` semantik (dapat difokus keyboard). | Must | M3 |
| FR-014 | Dashboard menampilkan `SourceInfoCard` berisi nama sumber, tautan, tanggal ambil, tanggal pembaruan sumber, lisensi, dan status periode. | Must | M3 |

### 7.3 Filter & berbagi

| ID | Requirement | Prioritas | Milestone |
|----|-------------|-----------|-----------|
| FR-020 | `region`, `year`, `sector`, `simple` disimpan sebagai URL search params (bukan state internal saja) dan menjadi satu-satunya sumber kebenaran filter. | Must | M3 |
| FR-021 | Tombol "Salin tautan" menyalin URL absolut state saat ini ke clipboard dan menampilkan konfirmasi "Tautan disalin". | Must | M3 |
| FR-022 | Nilai param tidak valid/tidak dikenal dikoreksi ke default (`region=provinsi-nusa-utara`, `year`=tahun terbaru berstatus final) + toast "Filter dikembalikan ke nilai default." | Must | M3 |
| FR-023 | Memilih satu sektor (`sector=<sectorId>`) menyorot sektor tersebut di grafik sektor dan menampilkan kartunya; `sector=all` = default. | Should | M5 |

### 7.4 Perbandingan

| ID | Requirement | Prioritas | Milestone |
|----|-------------|-----------|-----------|
| FR-030 | `/bandingkan?mode=region&a=…&b=…&year=…` membandingkan 2 wilayah pada tahun sama; `mode=year&a=…&yearA=…&yearB=…` membandingkan 2 tahun pada wilayah sama. | Must | M4 |
| FR-031 | Halaman perbandingan menampilkan delta absolut dan delta persen untuk `totalPagu`, `totalRealisasi`, `realizationRate`, plus 3 sektor dengan selisih pagu terbesar. | Must | M4 |

### 7.5 Insight otomatis

| ID | Requirement | Prioritas | Milestone |
|----|-------------|-----------|-----------|
| FR-040 | Endpoint `/api/insights` mengembalikan 3–5 insight dari aturan INS-01…INS-06 (fungsi murni di `packages/shared`), diurutkan berdasarkan `severity` lalu `ruleId`. | Must | M4 |
| FR-041 | Setiap objek insight memuat `ruleId`, `sentence` (Bahasa Indonesia), `limitation` (batas kesimpulan), `supportingValues`, dan `disclaimer` global. | Must | M4 |
| FR-042 | Setiap kartu insight menampilkan `sentence`, `limitation`, dan tautan "Bagaimana ini dihitung?" ke `/metodologi#<ruleId>`. | Must | M4 |

### 7.6 Edukasi & metode

| ID | Requirement | Prioritas | Milestone |
|----|-------------|-----------|-----------|
| FR-050 | Toggle "Penjelasan Sederhana" (`simple=1`) mengganti label teknis dengan frasa awam pada dashboard & perbandingan, dan tetap aktif saat navigasi. | Must | M5 |
| FR-051 | `/glosarium` memuat ≥ 15 istilah, masing-masing: `term`, `simpleDefinition` (≤ 25 kata), `example`, `relatedTerms`; pencarian klien tidak case-sensitive. | Must | M5 |
| FR-052 | `/metodologi` memuat: sumber & lisensi, rumus setiap metrik (M-01…M-06), 6 aturan insight + rumus, daftar keterbatasan, tanggal pembaruan, dan cara melaporkan kesalahan data. | Must | M5 |

### 7.7 Fase 2

| ID | Requirement | Prioritas | Milestone |
|----|-------------|-----------|-----------|
| FR-060 | Tombol "Unduh CSV" mengunduh data tampilan aktif dengan header bahasa Indonesia, delimiter `,`, encoding UTF-8 + BOM, nama file `danaterbuka_<region>_<year>.csv`. | Should | M5 |
| FR-061 | Tombol "Unduh PNG" menyimpan grafik aktif sebagai PNG skala 2. | Should | M5 |

---

## 8. Non-Functional Requirements (NFR)

| ID | Kategori | Requirement | Target terukur | Milestone |
|----|----------|-------------|----------------|-----------|
| NFR-001 | Performa | LCP halaman `/dashboard` (mobile, 4G lambat: RTT 150 ms, 1,6 Mbps) | ≤ 2,5 s | M6 |
| NFR-002 | Performa | CLS seluruh halaman | < 0,1 | M6 |
| NFR-003 | Performa | Bundle JS awal (route `/` + `/dashboard`) | ≤ 220 KB gzip | M6 |
| NFR-004 | Performa | Respons API p95 untuk snapshot ≤ 1.000 record | ≤ 150 ms lokal | M2 |
| NFR-005 | Aksesibilitas | WCAG 2.1 AA: kontras teks ≥ 4,5:1 (≥ 3:1 untuk teks ≥ 24 px), semua kontrol dapat dioperasikan keyboard, fokus terlihat, `aria-live` untuk perubahan filter | 0 pelanggaran axe serious/critical | M6 |
| NFR-006 | Aksesibilitas | Setiap grafik punya ringkasan teks (`aria-describedby`) + tabel alternatif | 100% grafik | M3/M6 |
| NFR-007 | Keamanan | Header `helmet` aktif (CSP dasar, `X-Content-Type-Options`, `Referrer-Policy: strict-origin-when-cross-origin`), `cors` allowlist origin dari env `CORS_ORIGINS` | Lulus `curl -I` check di CI | M2 |
| NFR-008 | Keamanan | Rate limit 120 request/menit/IP untuk `/api/*`, balasan `429` + `{ error.code: "RATE_LIMITED" }` | Lulus tes Supertest | M2 |
| NFR-009 | Keandalan | API tetap hidup & menyajikan fixture bila snapshot korup/hilang; `/api/health` melaporkan `dataStatus` | Lulus tes fallback | M2 |
| NFR-010 | Keandalan | Aplikasi berfungsi penuh tanpa internet eksternal setelah build (tanpa CDN font/chart) | E2E offline lulus | M6 |
| NFR-011 | Maintainability | TypeScript `strict: true` di semua paket; `pnpm typecheck` 0 error | 0 error | M0–M6 |
| NFR-012 | Maintainability | Cakupan baris `packages/shared` | ≥ 90% (insight & metrik 100% cabang aturan) | M2/M4 |
| NFR-013 | Observability | Log JSON pino dengan `requestId`, `route`, `status`, `durationMs`; tidak ada PII | Format log tervalidasi tes | M2 |
| NFR-014 | SEO | `<title>`, `<meta name="description">`, canonical, OG/Twitter tag per halaman | 5 halaman terverifikasi | M6 |
| NFR-015 | SEO | `sitemap.xml` & `robots.txt` tersedia di root build | HTTP 200 + isi valid | M6 |
| NFR-016 | Privasi | Tanpa cookie tracking, tanpa login, tanpa penyimpanan data pribadi; `localStorage` hanya untuk preferensi `simple` | Audit kode + CSP | M6 |
| NFR-017 | Kompatibilitas | Chrome/Edge/Firefox/Safari 2 versi terakhir; lebar minimum 360 px; tanpa scroll horizontal | Uji manual + Playwright viewport | M6 |
| NFR-018 | Bahasa | 100% microcopy UI Bahasa Indonesia; angka `id-ID` (`1.234,5`), mata uang ringkas `Rp 1,2 T` | Uji snapshot format | M3 |
| NFR-019 | Atribusi | Nama sumber + tautan + lisensi tampil di setiap halaman data dan di footer | 5 halaman | M3/M6 |
| NFR-020 | Ukuran data | Snapshot ≤ 2 MB (JSON) agar masuk memori & cepat diunduh | Cek `Get-Item` di CI | M1 |

---

## 9. Acceptance Criteria (FR Must-have)

Format: Given/When/Then. Setiap AC punya ID yang dipakai di `docs/TASKS.md`.

### FR-001 — Snapshot dimuat saat startup
- **AC-001**
  - **Given** file `data/processed/snapshot.v1.json` valid tersedia,
  - **When** API dijalankan (`pnpm --filter @danaterbuka/api dev`) dan `GET /api/health` dipanggil,
  - **Then** respons `200` berisi `{ status: "ok", dataStatus: "ready", recordCount: <jumlah> }` dan tidak ada request keluar ke domain eksternal (diverifikasi dengan `nock`/`undici` mock yang melempar bila terjadi).

### FR-002 — Metadata sumber pada setiap respons
- **AC-002**
  - **Given** API berjalan dengan snapshot,
  - **When** `GET /api/budget/summary?region=provinsi-nusa-utara&year=2024` dipanggil,
  - **Then** body memuat `meta.sourceName`, `meta.sourceUrl`, `meta.retrievedAt` (ISO-8601), `meta.sourceUpdatedAt` (ISO-8601 atau `null`), `meta.license`, `meta.isFixture` (boolean), `meta.snapshotVersion` (string `1.0.0`), dan seluruh field lolos validasi `BudgetResponseSchema.parse`.

### FR-003 — Badge data contoh
- **AC-003**
  - **Given** `DATA_ADAPTER=fixture` (default saat demo),
  - **When** pengguna membuka `/dashboard`,
  - **Then** elemen dengan `data-testid="fixture-badge"` berisi teks "Data contoh" terlihat, dan `document.querySelectorAll('[data-testid="fixture-badge"]').length ≥ 3` (header + 2 kartu), dan badge tetap terlihat setelah filter diubah.

### FR-004 — Laporan kualitas data
- **AC-004**
  - **Given** fixture berisi 3 record sengaja rusak (pagu negatif, `regionId` tak dikenal, `realisasi` tanpa `periodStatus`),
  - **When** `pnpm pipeline` dijalankan,
  - **Then** `data/processed/quality-report.json` memuat `received = accepted + rejected`, `rejected = 3`, dan `reasons` memuat kode `NEGATIVE_PAGU`, `UNKNOWN_REGION`, `MISSING_PERIOD_STATUS` masing-masing ≥ 1.

### FR-005 — Validasi & fallback snapshot
- **AC-005**
  - **Given** `snapshot.v1.json` diubah menjadi `{"records": "bukan array"}`,
  - **When** API dijalankan lalu `GET /api/health` dipanggil,
  - **Then** proses tidak crash, respons `200` dengan `dataStatus: "degraded"`, `meta.isFixture: true`, dan log level `error` memuat `code: "SNAPSHOT_INVALID"`; `GET /api/budget/summary` tetap mengembalikan data contoh.

### FR-010 — Kartu ringkasan
- **AC-010**
  - **Given** snapshot dengan `region=provinsi-nusa-utara`, `year=2024` berisi total pagu 2.400.000.000.000 dan realisasi 1.800.000.000.000,
  - **When** halaman `/dashboard?region=provinsi-nusa-utara&year=2024` dibuka,
  - **Then** 4 kartu menampilkan `totalPagu` "Rp 2,4 T", `totalRealisasi` "Rp 1,8 T", `realizationRate` "75,0%", `remainingBudget` "Rp 600,0 M", masing-masing dengan `data-testid` (`summary-pagu`, `summary-realisasi`, `summary-rate`, `summary-gap`).

### FR-011 — Grafik sektor
- **AC-011**
  - **Given** satu wilayah/tahun memiliki 12 sektor,
  - **When** grafik sektor dirender,
  - **Then** tepat 10 batang sektor + 1 batang "Sektor lainnya" tampil; nilai batang terurut menurun; "Sektor lainnya" = jumlah 2 sektor sisanya; sumbu X dimulai dari 0 dan diberi label satuan "Rupiah".

### FR-012 — Tren tahunan
- **AC-012**
  - **Given** snapshot memuat data 2021–2025 untuk satu wilayah, dengan 2025 berstatus `approved` (realisasi `null`),
  - **When** grafik tren dirender,
  - **Then** 5 titik tahun tampil, titik 2025 menampilkan pagu dan penanda "Realisasi belum dirilis" (bukan `0`), dan legenda membedakan pagu vs realisasi.

### FR-013 — Tabel alternatif
- **AC-013**
  - **Given** grafik sektor dalam mode grafik,
  - **When** pengguna menekan tombol "Lihat sebagai tabel" (dapat difokus dengan `Tab`),
  - **Then** `<table>` muncul dengan kolom "Sektor", "Pagu", "Realisasi", "% Realisasi" dan jumlah baris data sama dengan jumlah batang grafik; menekan tombol lagi mengembalikan mode grafik.

### FR-014 — Kartu sumber
- **AC-014**
  - **Given** `meta` tersedia,
  - **When** dashboard dirender,
  - **Then** `SourceInfoCard` menampilkan 6 baris: Sumber, Tautan (target `_blank`, `rel="noopener noreferrer"`), Tanggal data diambil, Tanggal pembaruan sumber (atau "Tidak tersedia"), Lisensi, Status data (`Contoh`/`Final`/`Sementara`).

### FR-020 — Filter di URL
- **AC-020**
  - **Given** pengguna di `/dashboard` dengan default,
  - **When** memilih wilayah "Provinsi Selat Timur" dan tahun "2023",
  - **Then** URL berubah menjadi `/dashboard?region=provinsi-selat-timur&year=2023`, dan reload halaman menampilkan pilihan yang sama; tidak ada state filter yang disimpan di React state saja.

### FR-021 — Salin tautan
- **AC-021**
  - **Given** filter aktif di `/dashboard?region=provinsi-selat-timur&year=2023`,
  - **When** pengguna menekan "Salin tautan",
  - **Then** clipboard berisi URL absolut yang sama, teks "Tautan disalin" muncul pada elemen `aria-live="polite"` dan hilang setelah 3 detik.

### FR-022 — Filter tidak valid
- **AC-022**
  - **Given** URL `/dashboard?region=atlantis&year=1999`,
  - **When** halaman dimuat,
  - **Then** aplikasi memakai `region=provinsi-nusa-utara` & `year`=2025-atas-`final` (2024), menampilkan toast "Filter dikembalikan ke nilai default.", dan tidak menampilkan layar error.

### FR-030 — Perbandingan
- **AC-030**
  - **Given** 2 wilayah dengan data tahun 2024,
  - **When** `/bandingkan?mode=region&a=provinsi-nusa-utara&b=provinsi-selat-timur&year=2024` dibuka,
  - **Then** dua kolom metrik (pagu, realisasi, % realisasi) tampil berdampingan dengan label wilayah, dan tabel selisih menampilkan `delta` serta `deltaPercent`; jika `b` tidak punya data, tampil state "Wilayah pembanding belum tersedia" (bukan angka 0).

### FR-031 — Delta & sektor berbeda
- **AC-031**
  - **Given** perbandingan dengan `totalPagu` A = 2.400.000.000.000 dan B = 2.000.000.000.000,
  - **When** halaman dirender,
  - **Then** `deltaPagu` = 400.000.000.000 dan `deltaPaguPercent` = 20,0%, serta daftar 3 sektor dengan selisih pagu terbesar diurutkan menurun berdasarkan `abs(deltaPagu)`.

### FR-040/041 — Insight
- **AC-040**
  - **Given** fixture wilayah/tahun dengan sektor Kesehatan berpagu 30% dari total,
  - **When** `GET /api/insights?region=provinsi-nusa-utara&year=2024` dipanggil,
  - **Then** respons memuat 3–5 item, salah satunya `ruleId: "INS-01"` dengan `sentence` memuat "30,0%" dan "Kesehatan", setiap item memiliki `limitation` tidak kosong, dan semua `sentence` lolos filter kata terlarang (`korupsi|boros|gagal|menyeleweng|mencuri`).

### FR-042 — Batas kesimpulan terlihat
- **AC-042**
  - **Given** panel insight dirender,
  - **When** pengguna membaca kartu insight,
  - **Then** setiap kartu menampilkan teks `limitation` dan tautan "Bagaimana ini dihitung?" dengan `href="/metodologi#INS-01"`; panel juga menampilkan `disclaimer` global.

### FR-050 — Mode penjelasan sederhana
- **AC-050**
  - **Given** `simple` tidak aktif,
  - **When** pengguna menekan toggle "Penjelasan Sederhana",
  - **Then** URL mendapat `simple=1`, label "Pagu" berubah menjadi "Rencana anggaran", "Realisasi" menjadi "Uang yang sudah terpakai", "SILPA" menjadi "Sisa anggaran", preferensi tersimpan di `localStorage['danaterbuka.simple']`, dan bertahan setelah navigasi ke `/bandingkan`.

### FR-051 — Glosarium
- **AC-051**
  - **Given** halaman `/glosarium` dibuka,
  - **When** pengguna mengetik "silpa" di kotak pencarian,
  - **Then** minimal 1 entri "SILPA" tampil, definisi ≤ 25 kata, dan mengetik "xyz" menampilkan empty state "Istilah tidak ditemukan" dengan tombol "Hapus pencarian".

### FR-052 — Metodologi
- **AC-052**
  - **Given** halaman `/metodologi` dibuka,
  - **When** pengguna membuka bagian "Rumus",
  - **Then** 6 metrik (M-01…M-06) dan 6 aturan insight (INS-01…INS-06) tampil lengkap dengan rumus, dan setiap heading aturan memiliki `id` yang cocok dengan anchor dari kartu insight; tabel sumber memuat lisensi & tautan.

---

## 10. Edge Case

| ID | Kondisi | Perilaku wajib | Pesan UI (id-ID) |
|----|---------|----------------|------------------|
| EC-01 | Data kosong untuk kombinasi filter valid | Tampilkan empty state, bukan `0` | "Belum ada data untuk wilayah dan tahun ini." + tombol "Kembali ke tahun tersedia (2023)" |
| EC-02 | Periode belum dirilis (`periodStatus = "approved"`, `realisasi = null`) | Tampilkan pagu saja; realisasi = "Belum dirilis", rate = "—" | "Realisasi untuk tahun ini belum dirilis." |
| EC-03 | Wilayah tanpa data sama sekali | Wilayah tetap muncul di dropdown dengan penanda "(belum ada data)" dan tidak bisa dipilih sebagai default | "Wilayah ini belum memiliki data pada snapshot kami." |
| EC-04 | `realisasi > pagu` | Jangan di-clamp; tampilkan rate > 100% + badge informasi | "Realisasi melebihi pagu (kemungkinan karena pergeseran anggaran)." |
| EC-05 | Nilai negatif pada `pagu`/`realisasi` | Record ditolak pipeline (`NEGATIVE_PAGU` / `NEGATIVE_REALISASI`), dicatat di quality report, tidak pernah dikirim ke UI | — (data tidak tampil) |
| EC-06 | `pagu = 0` | Rate = `null` (bukan `Infinity`/`NaN`), tampil "—" | "Pagu belum ditetapkan." |
| EC-07 | Tahun di URL di luar rentang (mis. 2030) | Koreksi ke tahun final terbaru + toast | "Tahun 2030 belum tersedia. Menampilkan 2024." |
| EC-08 | Snapshot hilang/korup | Fallback fixture, `dataStatus = "degraded"`, badge "Data contoh" + banner | "Data asli tidak dapat dimuat. Menampilkan data contoh." |
| EC-09 | API mati saat halaman dibuka | Error state dengan tombol "Coba lagi" (refetch TanStack Query), tidak blank | "Gagal memuat data. Periksa koneksi lalu coba lagi." |
| EC-10 | Respons API > 8 detik | Skeleton tetap tampil; setelah 8 detik muncul teks "Memuat lebih lama dari biasanya…" | sama seperti EC-09 bila akhirnya gagal |
| EC-11 | Filter `mode=region` dengan `a === b` | Tolak & koreksi: `b` diganti wilayah berbeda pertama | "Pilih dua wilayah berbeda untuk dibandingkan." |
| EC-12 | Snapshot hanya punya 1 tahun | Grafik tren menyembunyikan diri, insight INS-03 (YoY) tidak dihasilkan | "Tren tahunan membutuhkan minimal 2 tahun data." |
| EC-13 | Pengguna menonaktifkan JavaScript | `<noscript>` menampilkan penjelasan + tautan metodologi statis | "Aktifkan JavaScript untuk melihat dashboard interaktif." |
| EC-14 | Snapshot > 2 MB | Pipeline gagal dengan exit code 1 + pesan batas ukuran | — (build-time) |

---

## 11. Strategi Lomba

### 11.1 Bagaimana produk menjawab "mengolah, mengintegrasikan, menyajikan"

| Klaim rubrik | Bukti konkret di produk | Artefak yang bisa ditunjukkan juri |
|--------------|--------------------------|-------------------------------------|
| **Mengolah** | ETL menormalkan kode wilayah & sektor, menolak data kotor, lalu menghitung 6 metrik turunan (M-01…M-06) dan 6 aturan insight (INS-01…INS-06) sebagai fungsi murni ber-unit-test | `data/processed/quality-report.json`, `packages/shared/src/metrics/*.test.ts` |
| **Mengintegrasikan** | Satu snapshot kanonik menggabungkan data anggaran + realisasi + metadata sumber; API berlapis menyajikannya lewat kontrak Zod yang dipakai bersama UI | `docs/DATA_SPEC.md` (ERD), `packages/shared/src/schemas/*` |
| **Menyajikan** | Dashboard, grafik dengan tabel alternatif, perbandingan, insight berbatas kesimpulan, mode bahasa sederhana, tautan yang bisa dibagikan | URL demo, `docs/UI_SPEC.md` |
| **Akuntabilitas** | Setiap angka punya sumber, periode, tanggal ambil, status fixture, dan halaman metodologi | `SourceInfoCard`, `/metodologi` |

### 11.2 Pembeda (vs portal data pemerintah & dashboard anggaran biasa)

1. **Batas kesimpulan eksplisit** — setiap insight menyebut apa yang *tidak* bisa disimpulkan; ini jarang ada di dashboard publik.
2. **Mode Penjelasan Sederhana** — satu toggle mengubah jargon menjadi bahasa awam, bukan sekadar tooltip.
3. **Tautan temuan** — perbandingan apa pun bisa dibagikan sebagai URL yang reproducible.
4. **Kejujuran status data** — badge "Data contoh"/"Sementara", tanggal pembaruan, dan penanganan "belum dirilis" yang eksplisit (bukan `0`).
5. **Deterministik & auditabel** — insight dihasilkan aturan yang dapat diuji, bukan model bahasa yang tidak dapat dipertanggungjawabkan.

### 11.3 Alur demo 3–5 menit + wow moment

```mermaid
flowchart LR
  A["0:00-0:30<br/>Hook: 'Uang daerah Anda<br/>dipakai untuk apa?'"] --> B["0:30-1:30<br/>/dashboard: kartu ringkasan<br/>+ grafik sektor"]
  B --> C["1:30-2:00<br/>Toggle 'Penjelasan Sederhana'<br/>jargon -> bahasa awam"]
  C --> D["2:00-3:00<br/>WOW: bandingkan 2 wilayah<br/>+ insight otomatis + salin tautan"]
  D --> E["3:00-4:00<br/>/metodologi: rumus, sumber,<br/>batas kesimpulan"]
  E --> F["4:00-5:00<br/>Dampak: siapa yang bisa<br/>memakai, apa langkah berikutnya"]
```

| Waktu | Adegan | Yang diklik | Poin yang diucapkan |
|-------|--------|-------------|---------------------|
| 0:00 | Hook | — | "Warga ingin tahu uang daerah dipakai untuk apa, tapi data resminya berupa tabel istilah akuntansi." |
| 0:30 | Dashboard | `region=provinsi-nusa-utara`, `year=2024` | "Tiga detik: pagu, realisasi, sisa. Grafik langsung menunjukkan sektor terbesar." |
| 1:30 | Mode sederhana | Toggle "Penjelasan Sederhana" | "Satu klik: 'pagu' jadi 'rencana anggaran'. Tidak ada warga yang perlu kursus akuntansi." |
| 2:00 | **Wow moment** | `/bandingkan?mode=region&a=…&b=…&year=2024` lalu "Salin tautan" | "Bandingkan dua wilayah, lihat selisih 20%, dan bagikan tautannya — editor bisa membuka hasil yang sama persis." |
| 3:00 | Insight | Panel insight | "Sistem menyebut alasan dan batas kesimpulannya: alokasi besar bukan otomatis berarti serapan baik." |
| 3:40 | Metodologi | `/metodologi` | "Semua rumus, sumber, tanggal, dan lisensi terbuka. Ini yang membuat angka ini bisa dikutip." |
| 4:20 | Penutup | — | "DanaTerbuka mengubah data terbuka menjadi pemahaman publik — dan pemahaman menjadi pengawasan." |

**Wow moment (dipilih):** perbandingan dua wilayah + insight otomatis + tautan yang bisa dibagikan dalam < 30 detik, dengan badge data & batas kesimpulan tetap terlihat.

### 11.4 Rencana kontinjensi demo

| Skenario | Aksi |
|----------|------|
| Internet panggung mati | Jalankan `pnpm start:demo` (fixture, seluruh aset lokal, tanpa CDN). Sudah dilatih di `docs/demo/DEMO_SCRIPT.md`. |
| Sumber data resmi berubah format | Tidak memengaruhi demo: adapter memakai snapshot terakhir yang tersimpan + fixture. |
| Proyektor resolusi rendah | Mode presentasi: `?simple=1` + zoom browser 125%, kontras sudah diuji. |
| Waktu presentasi dipotong 2 menit | Jalankan segmen 0:00 → 2:00 (dashboard + wow moment) saja. |

---

## 12. ASSUMPTION

Semua asumsi dipakai apa adanya oleh agent. Kolom **Verifikasi** adalah cara membuktikan/menggugurkan asumsi; bila salah, jalankan **Dampak**.

| ID | Asumsi | Nilai default yang dipakai | Cara verifikasi | Dampak jika salah |
|----|--------|----------------------------|-----------------|-------------------|
| A-01 | Runtime Node.js | Node 20 LTS, pnpm 9 | `node -v` di CI | Jika < 20: naikkan ke Node 22 LTS, tidak ada perubahan kode |
| A-02 | Ketersediaan data APBD riil yang bisa diunduh/diakses legal | **Tidak diasumsikan tersedia**; MVP berjalan 100% dengan fixture | Fase 0 di `DATA_SPEC.md` (cek SIKD & Satu Data) | Jika tersedia: isi adapter `sikd`; jika tidak: kirim dengan fixture + dokumentasi (tetap sah untuk lomba) |
| A-03 | Skema/kolom sumber resmi | **UNVERIFIED** — tidak ada nama kolom yang dikarang | Wajib dicatat di tabel Verified/Unverified pada `DATA_SPEC.md` | Pemetaan kolom diubah di satu file adapter saja |
| A-04 | Cakupan wilayah showcase | 5 wilayah fiktif: `provinsi-nusa-utara`, `provinsi-selat-timur`, `provinsi-bukit-selatan`, `kota-bahari`, `kabupaten-rimba-hulu` | Generator fixture | Nama/ID wilayah diganti di `data/fixtures/regions.ts`; UI tidak berubah |
| A-05 | Rentang tahun | 2021–2025; 2025 `approved` (realisasi `null`), 2024 `final` | Generator fixture | Ubah konstanta `FISCAL_YEARS` |
| A-06 | Wilayah/lisensi data tidak menyertakan PII | Tidak ada data pribadi diproses | Audit skema | Jika ada: field dibuang di pipeline, tidak masuk snapshot |
| A-07 | Format angka | `Intl.NumberFormat('id-ID')`, ringkas: `Rp 1,2 T`, `Rp 600,0 M`, `Rp 12,5 jt`; rate 1 desimal | Unit test `format.test.ts` | Ubah satu fungsi `formatRupiahCompact` |
| A-08 | Zona waktu | `Asia/Jakarta` untuk semua tampilan tanggal; simpan ISO-8601 UTC | Tes format tanggal | Ubah konstanta `APP_TIMEZONE` |
| A-09 | Hosting demo | Satu service (Express menyajikan static build React), gratis/low-cost, tanpa cold start | `ARCHITECTURE.md` §Deploy | Jika dipilih opsi B (hosting terpisah), risiko cold start dimitigasi dengan *warm-up* + fixture |
| A-10 | Browser target | 2 versi terakhir Chrome/Edge/Firefox/Safari, min-width 360 px | Uji Playwright + manual | Tambah polyfill bila perlu (tidak diharapkan) |
| A-11 | Akses internet saat pengembangan | Tersedia untuk `pnpm install`; setelah itu build harus offline-capable | `pnpm build` lalu putus jaringan | Vendor font/aset lokal (sudah diwajibkan NFR-010) |
| A-12 | Tidak ada autentikasi/otorisasi | Semua endpoint publik, read-only | Desain API | Jika perlu: tambah API key statis di env (bukan fitur produk) |
| A-13 | Istilah "sektor" = fungsi belanja daerah (10 fungsi) | Taksonomi fungsi 10 item, kode internal `F01`–`F10` | Cek klasifikasi resmi di Fase 0 | Mapping diperbaiki di `data/reference/sectors.ts`; UI tidak berubah |
| A-14 | Bahasa UI | 100% Bahasa Indonesia; identifier kode Bahasa Inggris | Review | — |
| A-15 | Repo awal berisi `Frontend/` (React+Vite+Tailwind starter, JSX) dan `Backend/` kosong | Keduanya **digantikan** oleh monorepo `pnpm` di root pada T-001; folder lama dihapus setelah `apps/web` berjalan | `git log`/diff M0 | Jika ingin dipertahankan sebagai referensi: pindahkan ke `legacy/` (tidak diimpor siapa pun) |
| A-16 | Data contoh tidak boleh memakai nama daerah nyata | Fixture memakai nama fiktif | Review fixture | Jika diganti nama nyata, badge "Data contoh" wajib + disclaimer di setiap halaman |
| A-17 | Waktu pengerjaan agent | 1 sesi agent ≤ 300 baris perubahan & ≤ 8 file | Review diff | Pecah task (lihat `TASKS.md`) |
| A-18 | Insight dihitung di server & diuji di `packages/shared` | Satu implementasi, dua pemakai | Unit test | — |

---

## 13. Risiko & Mitigasi

| ID | Risiko | Peluang | Dampak | Mitigasi | Pemilik |
|----|--------|---------|--------|----------|---------|
| R-01 | Data APBD riil tidak dapat diakses legal/teknis sebelum hari-H | Tinggi | Tinggi | Fixture berlabel + dokumentasi transparan + adapter siap; demo tidak bergantung sumber eksternal (A-02) | Data lead |
| R-02 | Angka fixture disalahartikan sebagai data resmi | Sedang | Tinggi | Badge "Data contoh" persisten, nama wilayah fiktif, disclaimer di `/metodologi`, watermark pada ekspor PNG | UI lead |
| R-03 | Insight dianggap menuduh/berbau politis | Sedang | Tinggi | Template netral + filter kata terlarang di unit test + `limitation` wajib (PP-02, AC-040) | Insight lead |
| R-04 | Waktu pengembangan mepet | Tinggi | Tinggi | Prioritas MoSCoW, daftar fitur yang dikorbankan di `TASKS.md`, Fase 2 dipotong lebih dulu | PM |
| R-05 | Demo gagal karena internet panggung | Sedang | Tinggi | `pnpm start:demo` offline, aset lokal, latihan minimal 2× | Ops |
| R-06 | Grafik berat di HP kelas bawah | Sedang | Sedang | Library chart ringan, code-split, data agregat di server, budget 220 KB (NFR-003) | Web lead |
| R-07 | Aksesibilitas terlewat (warna kontras, keyboard) | Sedang | Sedang | axe-core di CI sejak M3, checklist WCAG di M6, tabel alternatif wajib | Web lead |
| R-08 | Perbedaan tafsir metrik (mis. realisasi > pagu) | Sedang | Sedang | Rumus pasti di `DATA_SPEC.md` + halaman metodologi + badge EC-04 | Data lead |
| R-09 | Scope creep (peta, login, chatbot) | Tinggi | Sedang | Out of Scope X-01…X-10 mengikat; perubahan scope harus mengubah dokumen ini lebih dulu | PM |
| R-10 | Tautan demo rusak karena perubahan skema URL | Rendah | Sedang | Param kanonik + tes E2E tautan (SM-07) | Web lead |
| R-11 | Snapshot membengkak > 2 MB | Rendah | Sedang | Batas di pipeline (EC-14), agregasi per sektor, hanya 5 wilayah | Data lead |
| R-12 | Agent menambah dependensi tanpa alasan | Sedang | Rendah | Aturan DON'T di `AGENTS.md` + review `package.json` per task | Reviewer |

---

## 14. Definisi Istilah (ringkas; versi lengkap di `/glosarium`)

| Istilah | Definisi awam (≤ 25 kata) |
|---------|---------------------------|
| Pagu anggaran | Batas tertinggi belanja yang direncanakan pemerintah untuk satu tahun. |
| Realisasi | Jumlah uang yang benar-benar sudah dibelanjakan sampai tanggal tertentu. |
| APBD | Rencana keuangan tahunan pemerintah daerah. |
| Fungsi/Sektor | Pengelompokan belanja menurut tujuan layanan, misalnya kesehatan atau pendidikan. |
| SILPA | Sisa lebih pembiayaan anggaran: uang yang tidak terpakai di akhir tahun. |
| Snapshot | Salinan data pada satu waktu tertentu, bukan aliran langsung. |

---

## 15. Traceability Ringkas (FR → Epic → Milestone → Task)

Detail lengkap ada di `docs/TASKS.md`; tabel ini memastikan setiap FR punya rumah.

| FR | Epic | Milestone | Task utama | Tes |
|----|------|-----------|------------|-----|
| FR-001 | E1 | M2 | T-012 | `api/health.test.ts` |
| FR-002 | E1 | M2 | T-012, T-013 | `meta.contract.test.ts` |
| FR-003 | E5 | M3 | T-024 | `fixture-badge.spec.ts` |
| FR-004 | E6 | M1 | T-008 | `pipeline.test.ts` |
| FR-005 | E1 | M2 | T-012 | `fallback.test.ts` |
| FR-010 | E1 | M3 | T-020 | `summary.test.tsx` |
| FR-011 | E1 | M3 | T-021 | `sector-chart.test.tsx` |
| FR-012 | E1 | M3 | T-022 | `trend-chart.test.tsx` |
| FR-013 | E1 | M3 | T-021 | `chart-table-toggle.test.tsx` |
| FR-014 | E5 | M3 | T-024 | `source-attribution.spec.ts` |
| FR-020 | E2 | M3 | T-023 | `url-state.test.tsx` |
| FR-021 | E2 | M3 | T-035 | `share-link.spec.ts` |
| FR-022 | E2 | M3 | T-023 | `invalid-filter.test.tsx` |
| FR-023 | E2 | M5 | T-030 | `sector-highlight.test.tsx` |
| FR-030 | E3 | M4 | T-026 | `compare.test.ts` |
| FR-031 | E3 | M4 | T-026 | `compare-delta.test.ts` |
| FR-040 | E4 | M4 | T-027 | `insight.rules.test.ts` |
| FR-041 | E4 | M4 | T-027 | `insight.schema.test.ts` |
| FR-042 | E4 | M4 | T-028 | `insight-panel.spec.ts` |
| FR-050 | E5 | M5 | T-030 | `simple-mode.spec.ts` |
| FR-051 | E5 | M5 | T-031 | `glossary.test.tsx` |
| FR-052 | E5 | M5 | T-032 | `methodology.spec.ts` |
| FR-060 | E6 | M5 | T-033 | `csv-export.spec.ts` |
| FR-061 | E6 | M5 | T-034 | `png-export.spec.ts` |
| NFR-001…020 | — | M2/M3/M6 | T-002, T-011, T-036, T-037, T-038, T-041 | Lighthouse CI, axe, `typecheck`, `test:coverage` |

---

## 16. Self-check

- [x] **Setiap requirement punya task**: 24 FR + 20 NFR semuanya terhubung ke task (T-001…T-041) pada §15; tidak ada FR "menggantung".
- [x] **Setiap task punya acceptance criteria yang bisa dijalankan**: PRD hanya menetapkan AC untuk FR Must (AC-001…AC-052); perintah konkret per task ada di `TASKS.md`, dan setiap AC di sini punya padanan tes bernama (`*.test.ts`, `*.spec.ts`).
- [x] **Tidak ada angka/endpoint karangan**: seluruh angka pada contoh AC ditandai sebagai data fixture (`provinsi-nusa-utara`, nilai bulat sintetis 2,4 T / 1,8 T). Tidak ada endpoint pemerintah, nama kolom, atau lisensi yang diklaim nyata — semuanya `UNVERIFIED` dan dirujuk ke Fase 0 `DATA_SPEC.md`.
- [x] **Tidak ada pertanyaan balik**: 18 asumsi terkunci di §12 dengan nilai default, cara verifikasi, dan dampak.
- [x] **Konsisten**: nama produk `DanaTerbuka`, ID (`FR-`, `NFR-`, `F-`, `US-`, `A-`, `R-`, `T-`), route (`/dashboard`, `/bandingkan`, `/glosarium`, `/metodologi`), dan param (`region`, `year`, `sector`, `simple`, `mode`, `a`, `b`, `yearA`, `yearB`) dipakai seragam dan akan diulang identik di dokumen berikutnya.
- [x] **Batasan etika**: fixture memakai wilayah fiktif (A-16), badge wajib (FR-003), atribusi wajib (NFR-019), tanpa scraping agresif (ditetapkan di `DATA_SPEC.md`).

---

**Berhenti di sini.** Dokumen berikutnya: `docs/DATA_SPEC.md` — tunggu instruksi "lanjut".
