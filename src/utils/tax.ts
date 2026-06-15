export function calculateUKTax(grossYearly: number): { tax: number; ni: number; netYearly: number; netMonthly: number } {
  const personalAllowance = 12570;
  const basicRateLimit = 50270;
  const higherRateLimit = 125140;

  let tax = 0;
  if (grossYearly > personalAllowance) {
    const basicRateable = Math.min(grossYearly, basicRateLimit) - personalAllowance;
    tax += basicRateable * 0.20;
  }
  if (grossYearly > basicRateLimit) {
    const higherRateable = Math.min(grossYearly, higherRateLimit) - basicRateLimit;
    tax += higherRateable * 0.40;
  }
  if (grossYearly > higherRateLimit) {
    tax += (grossYearly - higherRateLimit) * 0.45;
  }

  let ni = 0;
  const niLower = 12570;
  const niUpper = 50270;
  if (grossYearly > niLower) {
    const primary = Math.min(grossYearly, niUpper) - niLower;
    ni += primary * 0.12;
  }
  if (grossYearly > niUpper) {
    ni += (grossYearly - niUpper) * 0.02;
  }

  const netYearly = grossYearly - tax - ni;
  return { tax, ni, netYearly, netMonthly: netYearly / 12 };
}
