export class InsufficientChipsError extends Error {
  constructor(
    readonly available: number,
    readonly required: number,
  ) {
    super("Insufficient chip balance");
    this.name = "InsufficientChipsError";
  }

  get shortfall() {
    return Math.max(0, this.required - this.available);
  }
}
