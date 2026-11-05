import { LIMITATIONS } from "../insights/disclaimers.js";

export interface MetricDefinition {
  id: "M-01" | "M-02" | "M-03" | "M-04" | "M-05" | "M-06";
  name: string;
  formula: string;
  edgeCases: string;
  example: string;
}

export const METRIC_DEFINITIONS: MetricDefinition[] = [
  {
    id: "M-01",
    name: "Persentase Realisasi",
    formula: "Realisasi dibagi pagu, lalu dikali 100 persen.",
    edgeCases:
      "Pagu 0 → null; realisasi null → null; nilai > 100% diperbolehkan jika realisasi melampaui pagu",
    example: "1,8 T / 2,4 T → 75,0%",
  },
  {
    id: "M-02",
    name: "Sisa Anggaran",
    formula: "Pagu dikurangi realisasi.",
    edgeCases:
      "Realisasi null → null; bernilai negatif jika realisasi melampaui rencana",
    example: "2,4 T − 1,8 T → Rp 600,0 M",
  },
  {
    id: "M-03",
    name: "Pangsa Sektor",
    formula:
      "Pagu sektor dibagi total pagu, lalu dikali 100 persen.",
    edgeCases: "Total pagu 0 → null; persentase dibulatkan ke 1 desimal",
    example: "720 M / 2,4 T → 30,0%",
  },
  {
    id: "M-04",
    name: "Pertumbuhan Tahunan (YoY)",
    formula:
      "Selisih pagu tahun berjalan dan tahun sebelumnya dibagi pagu tahun sebelumnya, lalu dikali 100 persen.",
    edgeCases: "Tahun sebelumnya tidak ada atau bernilai 0 → null",
    example: "(288 M − 240 M) / 240 M → +20,0%",
  },
  {
    id: "M-05",
    name: "Peringkat Sektor",
    formula:
      "Peringkat menurun berdasarkan nilai pagu atau metrik terpilih; nilai seri mendapat peringkat sama.",
    edgeCases:
      "Semua nilai null ditempatkan di posisi akhir; urutan deterministik id sektor asc",
    example: "Sektor F07 dengan pangsa 30,0% menduduki peringkat 1",
  },
  {
    id: "M-06",
    name: "Selisih Perbandingan",
    formula:
      "Selisih sama dengan nilai A dikurangi nilai B; selisih persen membagi selisih dengan nilai B, lalu dikali 100 persen.",
    edgeCases:
      "B = 0 atau null → delta persen null, selisih nominal tetap dihitung",
    example: "A = 2,4 T, B = 2,0 T → delta +Rp 400 M (+20,0%)",
  },
];

export interface InsightRuleMeta {
  id: "INS-01" | "INS-02" | "INS-03" | "INS-04" | "INS-05" | "INS-06";
  name: string;
  formulaThreshold: string;
  exampleSentence: string;
  limitation: string;
  severity: "info" | "attention" | "caution";
}

export const INSIGHT_RULE_META: InsightRuleMeta[] = [
  {
    id: "INS-01",
    name: "Pangsa Sektor Teratas",
    formulaThreshold:
      "share = pagu_sektor / totalPagu × 100%; aktif bila share ≥ 25,0%",
    exampleSentence:
      "Sektor Kesehatan menerima 30,0% dari total pagu 2024, porsi terbesar di wilayah ini.",
    limitation: LIMITATIONS.INS_01,
    severity: "info",
  },
  {
    id: "INS-02",
    name: "Realisasi Terendah",
    formulaThreshold:
      "rate = realisasi/pagu × 100%; aktif bila rate < 50,0% dan gap ≥ 0,5% totalPagu; pilih rate terendah",
    exampleSentence:
      "Sektor Kesehatan baru terealisasi 41,7%, terendah di wilayah ini; selisih pagu-realisasi mencapai Rp 14,0 M.",
    limitation: LIMITATIONS.INS_02,
    severity: "attention",
  },
  {
    id: "INS-03",
    name: "Perubahan Tahunan",
    formulaThreshold:
      "yoy = (pagu_t − pagu_{t−1})/pagu_{t−1} × 100%; aktif bila |yoy| ≥ 15,0%; pilih |yoy| terbesar",
    exampleSentence:
      "Pagu sektor Ekonomi naik 20,0% pada 2024 dibanding 2023.",
    limitation: LIMITATIONS.INS_03,
    severity: "info",
  },
  {
    id: "INS-04",
    name: "Selisih Terbesar",
    formulaThreshold:
      "gap = pagu − realisasi; gapShare = gap/totalPagu × 100%; aktif bila gapShare ≥ 5,0%",
    exampleSentence:
      "Sektor Kesehatan memiliki selisih pagu-realisasi terbesar: Rp 170,0 M, setara 7,1% dari total pagu.",
    limitation: LIMITATIONS.INS_04,
    severity: "attention",
  },
  {
    id: "INS-05",
    name: "Konsentrasi Anggaran",
    formulaThreshold:
      "top3 = Σ 3 pagu terbesar / totalPagu × 100%; aktif bila top3 ≥ 50,0% dan jumlah sektor ≥ 3",
    exampleSentence:
      "Tiga sektor teratas menyerap 69,0% dari total pagu: Pelayanan, Pertahanan, Ekonomi.",
    limitation: LIMITATIONS.INS_05,
    severity: "info",
  },
  {
    id: "INS-06",
    name: "Kelengkapan Periode",
    formulaThreshold:
      "aktif bila ada record dengan periodStatus ∈ {approved, partial}",
    exampleSentence:
      "Data 2025 berstatus belum final; angka realisasi dapat berubah setelah pembaruan.",
    limitation: LIMITATIONS.INS_06,
    severity: "caution",
  },
];

