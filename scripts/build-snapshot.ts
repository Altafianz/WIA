import {
  buildSnapshot,
  checkBuildResult,
  writeBuildResult,
  type BuildOptions,
} from "./lib/build.js";

interface CliOptions extends BuildOptions {
  check: boolean;
}

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = { check: false };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--") continue;
    if (arg === "--check") options.check = true;
    if (arg === "--prefix") options.prefix = argv[index + 1];
    if (arg.startsWith("--prefix=")) options.prefix = arg.slice("--prefix=".length);
    if (arg === "--from-year") options.fromYear = Number(argv[index + 1]);
    if (arg.startsWith("--from-year=")) options.fromYear = Number(arg.slice("--from-year=".length));
    if (arg === "--raw") options.rawDir = argv[index + 1];
    if (arg.startsWith("--raw=")) options.rawDir = arg.slice("--raw=".length);
    if (arg === "--out") options.outDir = argv[index + 1];
    if (arg.startsWith("--out=")) options.outDir = arg.slice("--out=".length);
  }

  if (options.prefix === undefined || options.prefix.length === 0) {
    options.prefix = "09,10,11,13,28";
  }
  if (options.fromYear === undefined || Number.isNaN(options.fromYear)) {
    options.fromYear = 2021;
  }

  return options;
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  const result = await buildSnapshot(options);

  console.log(
    `Snapshot: ${result.snapshot.records.length} record, ` +
      `${result.snapshot.regions.length} wilayah, ${result.snapshot.sectors.length} sektor`,
  );
  console.log(
    `Kualitas: diterima ${result.quality.accepted}, ditolak ${result.quality.rejected}, ` +
      `peringatan ${result.quality.warnings}`,
  );
  console.log(`Hash: ${result.snapshot.contentHash}`);

  if (options.check) {
    const matches = checkBuildResult(result, options.outDir);
    if (!matches) {
      console.error("Snapshot tidak mutakhir: hash berbeda dari berkas tersimpan.");
      process.exitCode = 1;
      return;
    }
    console.log("Snapshot mutakhir: hash cocok.");
    return;
  }

  writeBuildResult(result, options.outDir);
  console.log("Snapshot dan laporan kualitas ditulis ke data/processed.");
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
