import { BudgetRepository } from "./budget-repository.js";
import { FixtureRepository } from "./fixture.repository.js";
import { SnapshotRepository } from "./snapshot.repository.js";
import { env } from "../env.js";

export interface RepositoryOptions {
  adapter?: "fixture" | "snapshot";
  snapshotPath?: string;
  fixturesDir?: string;
}

let repositoryInstance: BudgetRepository | null = null;

function logSnapshotInvalid(error: unknown): void {
  console.error(
    JSON.stringify({
      level: "error",
      event: "SNAPSHOT_INVALID",
      message: error instanceof Error ? error.message : String(error),
    }),
  );
}

export function createRepository(options: RepositoryOptions = {}): BudgetRepository {
  const adapter = options.adapter ?? env.DATA_ADAPTER;

  if (adapter === "fixture") {
    return new FixtureRepository(options.fixturesDir);
  }

  try {
    return new SnapshotRepository(options.snapshotPath);
  } catch (error) {
    logSnapshotInvalid(error);
    const fixture = new FixtureRepository(options.fixturesDir);
    fixture.getMeta().dataStatus = "degraded";
    return fixture;
  }
}

export function getRepository(): BudgetRepository {
  if (!repositoryInstance) {
    repositoryInstance = createRepository();
  }
  return repositoryInstance;
}

export function setRepository(repo: BudgetRepository | null): void {
  repositoryInstance = repo;
}

export * from "./budget-repository.js";
export * from "./fixture.repository.js";
export * from "./snapshot.repository.js";
