export const FORBIDDEN_WORDS = [
  "korupsi",
  "boros",
  "gagal",
  "menyeleweng",
  "mencuri"
] as const;

export function containsForbiddenWords(text: string): boolean {
  const lower = text.toLowerCase();
  return FORBIDDEN_WORDS.some((word) => lower.includes(word));
}
