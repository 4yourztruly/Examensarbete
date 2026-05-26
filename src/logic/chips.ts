export type ChipValue = 1 | 5 | 10 | 25 | 50 | 100 | 500 | 1000;

export function breakIntoChips(
  amount: number,
): Partial<Record<ChipValue, number>> {
  const denoms: ChipValue[] = [1000, 500, 100, 50, 25, 10, 5, 1];
  const result: Partial<Record<ChipValue, number>> = {};
  let remaining = amount;

  for (const d of denoms) {
    if (remaining >= d) {
      result[d] = Math.floor(remaining / d);
      remaining %= d;
    }
  }

  return result;
}
