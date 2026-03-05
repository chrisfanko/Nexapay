// NexaPay fee: 1.5% of the merchant amount
export const NEXAPAY_FEE_PERCENT = 0.015;

// Minimum NexaPay fee per transaction (50 XAF)
export const NEXAPAY_MIN_FEE = 50;

// Approximate provider fees (for recording purposes)
export const PROVIDER_FEES: Record<string, number> = {
  notchpay: 0.01,   // ~1%
  paypal: 0.0349,   // ~3.49%
  stripe: 0.029,    // ~2.9%
};

/**
 * Calculate NexaPay's fee on top of the merchant amount
 * Minimum fee is 50 XAF
 */
export function calculateNexapayFee(merchantAmount: number): number {
  const fee = merchantAmount * NEXAPAY_FEE_PERCENT;
  return Math.round(Math.max(fee, NEXAPAY_MIN_FEE));
}

/**
 * Calculate the estimated provider fee
 * Based on the gross amount (merchant amount + NexaPay fee)
 */
export function calculateProviderFee(grossAmount: number, provider: string): number {
  const rate = PROVIDER_FEES[provider] ?? 0;
  return Math.round(grossAmount * rate);
}

/**
 * Calculate the net amount the merchant receives
 * Net = Gross - Provider Fee - NexaPay Fee
 */
export function calculateNetAmount(
  grossAmount: number,
  providerFee: number,
  nexapayFee: number
): number {
  return grossAmount - providerFee - nexapayFee;
}

/**
 * Full fee breakdown for a given merchant amount and provider
 */
export function getFeeBreakdown(merchantAmount: number, provider: string) {
  const nexapayFee = calculateNexapayFee(merchantAmount);
  const grossAmount = merchantAmount + nexapayFee;
  const providerFee = calculateProviderFee(grossAmount, provider);
  const netAmount = calculateNetAmount(grossAmount, providerFee, nexapayFee);

  return {
    merchantAmount,
    nexapayFee,
    grossAmount,
    providerFee,
    netAmount,
  };
}