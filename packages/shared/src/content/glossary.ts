export interface GlossaryEntry {
  term: string;
  simpleDefinition: string;
  example: string;
  relatedTerms: string[];
}

export const GLOSSARY_ENTRIES: GlossaryEntry[] = [
  {
    term: "Pagu",
    simpleDefinition:
      "Batas maksimal anggaran belanja yang direncanakan dan dialokasikan untuk program kerja tertentu.",
    example: "Pagu anggaran sektor kesehatan ditetapkan sebesar Rp 500 miliar.",
    relatedTerms: ["Realisasi", "Alokasi", "APBD"],
  },
  {
    term: "Realisasi",
    simpleDefinition:
      "Jumlah uang anggaran yang benar-benar telah dikeluarkan atau dibelanjakan dalam pelaksanaan kegiatan.",
    example: "Realisasi belanja dinas pekerjaan umum mencapai 85% di akhir tahun.",
    relatedTerms: ["Pagu", "Persentase realisasi", "Belanja"],
  },
  {
    term: "APBD",
    simpleDefinition:
      "Rencana keuangan tahunan daerah yang dibahas dan disetujui bersama oleh pemerintah daerah dan DPRD.",
    example: "APBD 2024 difokuskan untuk peningkatan infrastruktur dan pelayanan dasar.",
    relatedTerms: ["Pagu", "Belanja", "Pendapatan"],
  },
  {
    term: "Fungsi/Sektor",
    simpleDefinition:
      "Pengelompokan program dan anggaran berdasarkan bidang urusan pelayanan masyarakat.",
    example: "Sektor pendidikan mencakup pengadaan sarana sekolah dan pelatihan guru.",
    relatedTerms: ["Alokasi", "Belanja", "Pagu"],
  },
  {
    term: "SILPA",
    simpleDefinition:
      "Sisa lebih perhitungan anggaran, yaitu sisa dana yang belum terpakai pada akhir tahun anggaran.",
    example: "SILPA tahun lalu dapat dialokasikan kembali pada APBD tahun berjalan.",
    relatedTerms: ["Sisa anggaran", "Realisasi", "APBD"],
  },
  {
    term: "Snapshot",
    simpleDefinition:
      "Potret atau salinan data pada waktu tertentu yang diperbarui secara berkala.",
    example: "Snapshot data per kuartal kedua menunjukkan kenaikan serapan anggaran.",
    relatedTerms: ["Data sementara", "Data final"],
  },
  {
    term: "Belanja",
    simpleDefinition:
      "Seluruh pengeluaran kas daerah untuk membiayai program kerja dan kebutuhan operasional.",
    example: "Belanja modal digunakan untuk pembangunan fasilitas kesehatan baru.",
    relatedTerms: ["Realisasi", "Pagu", "APBD"],
  },
  {
    term: "Pendapatan",
    simpleDefinition:
      "Seluruh penerimaan uang kas daerah yang menjadi hak daerah dalam satu periode anggaran.",
    example: "Pendapatan daerah bersumber dari pajak, retribusi, dan dana transfer pusat.",
    relatedTerms: ["APBD", "Pembiayaan"],
  },
  {
    term: "Pembiayaan",
    simpleDefinition:
      "Setiap penerimaan yang perlu dibayar kembali atau pengeluaran yang akan diterima kembali oleh daerah.",
    example: "Sisa anggaran tahun sebelumnya digunakan sebagai pos penerimaan pembiayaan.",
    relatedTerms: ["APBD", "SILPA", "Pendapatan"],
  },
  {
    term: "Persentase realisasi",
    simpleDefinition:
      "Perbandingan antara uang yang sudah dibelanjakan terhadap rencana anggaran awal, dihitung dalam persen.",
    example: "Persentase realisasi 75% berarti tiga perempat anggaran sudah terpakai.",
    relatedTerms: ["Realisasi", "Pagu"],
  },
  {
    term: "Sisa anggaran",
    simpleDefinition:
      "Selisih antara jumlah rencana anggaran belanja dengan uang yang telah terealisasi.",
    example: "Sisa anggaran yang belum terpakai tercatat sebesar Rp 50 miliar.",
    relatedTerms: ["Pagu", "Realisasi", "SILPA"],
  },
  {
    term: "Tahun fiskal",
    simpleDefinition:
      "Periode satu tahun yang digunakan untuk menyusun, mengelola, dan mempertanggungjawabkan anggaran keuangan.",
    example: "Tahun fiskal anggaran daerah berjalan dari 1 Januari hingga 31 Desember.",
    relatedTerms: ["APBD", "Data final"],
  },
  {
    term: "Data final",
    simpleDefinition:
      "Catatan anggaran dan realisasi yang telah selesai diperiksa serta disahkan pada akhir tahun.",
    example: "Laporan data final diterbitkan setelah proses audit tahunan selesai.",
    relatedTerms: ["Data sementara", "Snapshot", "Tahun fiskal"],
  },
  {
    term: "Data sementara",
    simpleDefinition:
      "Catatan anggaran yang masih berjalan dan dapat berubah seiring pembaruan laporan berikutnya.",
    example: "Data sementara kuartal berjalan akan diperbarui setelah audit resmi.",
    relatedTerms: ["Data final", "Snapshot"],
  },
  {
    term: "Alokasi",
    simpleDefinition:
      "Penetapan besaran porsi dana yang disediakan untuk sektor atau kegiatan tertentu.",
    example: "Alokasi terbesar APBD tahun ini diarahkan ke urusan pendidikan.",
    relatedTerms: ["Pagu", "Fungsi/Sektor", "Belanja"],
  },
];

export function findGlossaryEntry(term: string): GlossaryEntry | undefined {
  const normalized = term.toLowerCase().trim();
  return GLOSSARY_ENTRIES.find((entry) => {
    const entryTerm = entry.term.toLowerCase();
    return (
      entryTerm === normalized ||
      entryTerm.includes(normalized) ||
      normalized.includes(entryTerm)
    );
  });
}

export function getGlossaryMap(): Map<string, GlossaryEntry> {
  const map = new Map<string, GlossaryEntry>();
  for (const entry of GLOSSARY_ENTRIES) {
    map.set(entry.term, entry);
  }
  return map;
}

