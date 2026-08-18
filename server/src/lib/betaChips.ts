export const DEFAULT_BETA_STARTING_CHIPS = 1_000;
const MAX_BETA_STARTING_CHIPS = 1_000_000;

export function getBetaStartingChips(configured = process.env.BETA_STARTING_CHIPS) {
  if (configured === undefined || configured.trim() === "") {
    return DEFAULT_BETA_STARTING_CHIPS;
  }

  const amount = Number(configured);
  if (!Number.isSafeInteger(amount) || amount < 0 || amount > MAX_BETA_STARTING_CHIPS) {
    return DEFAULT_BETA_STARTING_CHIPS;
  }

  return amount;
}
