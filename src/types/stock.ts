export interface Stock {
  symbol: string;
  name: string;
  profile: {
    country: string;
    industry: string;
    sector: string;
  };
  stats: {
    revenueGrowth: number; // yoy
    profitMargin: number;
    EPS: number;
    growthRate: number;
    PE: number;
    debtToEquity?: number;
    FCFYield?: number;
    ROIC?: number;
    est10YearEPS: number;
    est10thYearPrice: number;
    currentPrice: number;
  };
}
