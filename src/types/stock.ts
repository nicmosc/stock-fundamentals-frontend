export enum Sector {
  BASIC_MATERIALS = 'Basic Materials',
  COMMUNICATION_SERVICES = 'Communication Services',
  CONSUMER_CYCLICAL = 'Consumer Cyclical',
  CONSUMER_DEFENSIVE = 'Consumer Defensive',
  ENERGY = 'Energy',
  FINANCIAL_SERVICES = 'Financial Services',
  HEALTHCARE = 'Healthcare',
  INDUSTRIALS = 'Industrials',
  TECHNOLOGY = 'Technology',
}

export interface StockFromServer {
  symbol: string;
  name: string;
  profile: {
    country: string;
    industry: string;
    sector: Sector;
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

export interface Stock extends StockFromServer {
  fairPrice: number;
  discountScore: number;
  fundamentalsScore: number;
}
