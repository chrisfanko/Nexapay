// NexaPay fee: 1.5% of the merchant amount
export const NEXAPAY_FEE_PERCENT = 0.015;


export const NEXAPAY_MIN_FEE = 50;

// Approximate provider fees 
export const PROVIDER_FEES: Record<string, number> = {
  notchpay: 0.01,   
  paypal: 0.0349,   
  stripe: 0.029,    
};

 
export function calculateNexapayFee(merchantAmount: number): number {
  const fee = merchantAmount * NEXAPAY_FEE_PERCENT;
  return Math.round(Math.max(fee, NEXAPAY_MIN_FEE));
}

 
export function calculateProviderFee(grossAmount: number, provider: string): number {
  const rate = PROVIDER_FEES[provider] ?? 0;
  return Math.round(grossAmount * rate);
}

 
export function calculateNetAmount(
  grossAmount: number,
  providerFee: number,
  nexapayFee: number
): number {
  return grossAmount - providerFee - nexapayFee;
}

 
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