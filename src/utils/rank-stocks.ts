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
    worst: 4,
    best: 0.2,
  },
  revenueGrowth: {
    worst: 0.1,
    best: 0.5,
  },
  growthRate: {
    worst: 0.1,
    best: 0.5,
  },
  profitMargin: {
    worst: 0,
    best: 0.5,
  },
  FCFYield: {
    worst: 0,
    best: 0.5,
  },
  ROIC: {
    worst: 0,
    best: 0.3,
  },
};

const weights: { [x: string]: number } = {
  ROIC: 1,
  revenueGrowth: 2,
  growthRate: 2,
  profitMargin: 3,
  FCFYield: 1,
  debtToEquity: 1,
};

const totalWeights = Object.values(weights).reduce((m, w) => m + w, 0);

function computeFundamentalsScore(stats: StockFromServer['stats']): number {
  const {
    ROIC = (ranges.ROIC.best + ranges.ROIC.worst) / 2,
    revenueGrowth,
    growthRate,
    profitMargin,
    FCFYield = (ranges.FCFYield.best + ranges.FCFYield.worst) / 2,
    debtToEquity = (ranges.debtToEquity.best + ranges.debtToEquity.worst) / 2,
  } = stats;

  const debtToEquityScore =
    (1 -
      normalize(
        debtToEquity <= 0 ? 4 : debtToEquity,
        ranges.debtToEquity.worst,
        ranges.debtToEquity.best,
      )) *
    (weights.debtToEquity / totalWeights);
  const ROICScore =
    normalize(ROIC, ranges.ROIC.best, ranges.ROIC.worst) * (weights.ROIC / totalWeights);
  const revenueGrowthScore =
    normalize(revenueGrowth, ranges.revenueGrowth.best, ranges.revenueGrowth.worst) *
    (weights.revenueGrowth / totalWeights);
  const growthRateScore =
    normalize(growthRate, ranges.growthRate.best, ranges.growthRate.worst) *
    (weights.growthRate / totalWeights);
  const profitMarginScore =
    normalize(profitMargin, ranges.profitMargin.best, ranges.profitMargin.worst) *
    (weights.profitMargin / totalWeights);
  const FCFYieldScore =
    normalize(FCFYield, ranges.FCFYield.best, ranges.FCFYield.worst) *
    (weights.FCFYield / totalWeights);
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
