export class CurrencyService {
  private static exchangeRate = 130;

  static getExchangeRate(): number {
    return this.exchangeRate;
  }

  static setExchangeRate(rate: number) {
    if (rate <= 0) {
      throw new Error("Exchange rate must be greater than zero.");
    }
    this.exchangeRate = rate;
  }

  static usdToKes(usd: number): number {
    return Math.max(1, Math.round(usd * this.exchangeRate));
  }
}
