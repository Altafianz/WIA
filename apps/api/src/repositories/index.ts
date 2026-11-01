import { BudgetRepository } from "./budget-repository.js";
import { FixtureRepository } from "./fixture.repository.js";

let repositoryInstance: BudgetRepository | null = null;

export function getRepository(): BudgetRepository {
  if (!repositoryInstance) {
    repositoryInstance = new FixtureRepository();
  }
  return repositoryInstance;
}

export function setRepository(repo: BudgetRepository): void {
  repositoryInstance = repo;
}

export * from "./budget-repository.js";
export * from "./fixture.repository.js";
