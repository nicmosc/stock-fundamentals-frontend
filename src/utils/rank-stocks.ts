import { Stock, StockFromServer } from '../types';
import { round } from './round';

function normalize(_value: number, max: number, min: number): number {
  const value = Math.min(Math.max(_value, min), max);
  return (value - min) / (max - min);
}

function filterExtremeStats(stocks: Array<StockFromServer>): Array<StockFromServer> {
  return stocks.filter((stock) => stock.stats.growthRate > 0.1 && stock.stats.growthRate < 1);
}

function filterExtremeScores(stocks: Array<Stock>): Array<Stock> {
  return stocks.filter((stock) => stock.fairPrice > 0 && stock.discountScore < 1.1);
}

function computeFairPrice(
  roi: number,
  safety: number,
  stockStats: StockFromServer['stats'],
): number {
  const { est10thYearPrice } = stockStats;
  const fairValue = [...Array(9)].reduce((memo) => memo / (1 + roi), est10thYearPrice);
  return round(fairValue * safety);
}

const ranges = {
  debtToEquity: {
    // Higher is worse
    worst: 2,
    best: 0.2,
  },
  revenueGrowth: {
    // Higher is better (2 = 200% growth)
    worst: 0.1,
    best: 2,
  },
  growthRate: {
    worst: 0.1,
    best: 1,
  },
  profitMargin: {
    // Higher is better (1 = 100% profit margins)
    worst: 0,
    best: 1,
  },
  FCFYield: {
    // Higher is better (below 0 = no revenue, 1 = 100%)
    worst: 0,
    best: 1,
  },
  ROIC: {
    // Higher is better (1 = 100% return on invested capital)
    worst: 0,
    best: 1,
  },
};

const weights = {
  ROIC: 1,
  revenueGrowth: 1,
  growthRate: 1,
  profitMargin: 1,
  FCFYield: 1,
  debtToEquity: 1,
};
const totalWeights = Object.values(weights).reduce((w, m) => w + m, 0);

function computeFundamentalsScore(stats: StockFromServer['stats']): number {
  const {
    ROIC = (ranges.ROIC.best + ranges.ROIC.worst) / 2,
    revenueGrowth,
    growthRate,
    profitMargin,
    FCFYield = (ranges.FCFYield.best + ranges.FCFYield.worst) / 2,
    debtToEquity = (ranges.debtToEquity.best + ranges.debtToEquity.worst) / 2,
  } = stats;
  const ROICScore =
    normalize(ROIC, ranges.ROIC.worst, ranges.ROIC.best) * (weights.ROIC / totalWeights);
  const revenueGrowthScore =
    normalize(revenueGrowth, ranges.revenueGrowth.worst, ranges.revenueGrowth.best) *
    (weights.revenueGrowth / totalWeights);
  const growthRateScore =
    normalize(growthRate, ranges.growthRate.worst, ranges.growthRate.best) *
    (weights.growthRate / totalWeights);
  const profitMarginScore =
    normalize(profitMargin, ranges.profitMargin.worst, ranges.profitMargin.best) *
    (weights.profitMargin / totalWeights);
  const FCFYieldScore =
    normalize(FCFYield, ranges.FCFYield.worst, ranges.FCFYield.best) *
    (weights.FCFYield / totalWeights);
  const debtToEquityScore =
    normalize(debtToEquity, ranges.debtToEquity.worst, ranges.debtToEquity.best) *
    (weights.debtToEquity / totalWeights);
  return (
    ROICScore +
    revenueGrowthScore +
    growthRateScore +
    profitMarginScore +
    FCFYieldScore +
    debtToEquityScore
  );
}

export function computeRankScores(
  roi: number,
  safety: number,
  stocks: Array<StockFromServer>,
): Array<Stock> {
  const computed = filterExtremeStats(stocks).map((stock) => {
    const fairPrice = computeFairPrice(roi, safety, stock.stats);
    return {
      ...stock,
      fairPrice,
      discountScore: round(stock.stats.currentPrice / fairPrice),
      fundamentalsScore: computeFundamentalsScore(stock.stats),
    };
  });
  const filtered = filterExtremeScores(computed);
  return filtered;
}
