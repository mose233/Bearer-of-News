const USD_TO_KES = 132;

export function convertUSDToKES(usd: number): number {
  return Number((usd * USD_TO_KES).toFixed(2));
}

export function convertUSDAmount(
  usd: number,
  currency: "USD" | "KES"
): number {
  switch (currency) {
    case "USD":
      return usd;

    case "KES":
      return convertUSDToKES(usd);

    default:
      return usd;
  }
}
