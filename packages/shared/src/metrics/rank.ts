export interface RankItem<T = unknown> {
  id: string;
  value: number | null;
  data: T;
}

export interface RankedItem<T = unknown> extends RankItem<T> {
  rank: number;
}

/**
 * M-05: Rank
 * Dense rank menurun atas nilai metrik; nilai null selalu di bawah;
 * seri -> rank sama; urutan deterministik id asc.
 */
export function calculateDenseRank<T>(items: RankItem<T>[]): RankedItem<T>[] {
  const sorted = [...items].sort((a, b) => {
    if (a.value === null && b.value === null) return a.id.localeCompare(b.id);
    if (a.value === null) return 1;
    if (b.value === null) return -1;
    if (b.value !== a.value) return b.value - a.value;
    return a.id.localeCompare(b.id);
  });

  let currentRank = 0;
  let prevValue: number | null = null;

  return sorted.map((item) => {
    if (item.value === null) {
      return {
        ...item,
        rank: currentRank + 1,
      };
    }
    if (prevValue === null || item.value !== prevValue) {
      currentRank += 1;
      prevValue = item.value;
    }
    return {
      ...item,
      rank: currentRank,
    };
  });
}
