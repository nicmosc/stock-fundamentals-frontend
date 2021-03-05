import { Stock, StockFromServer } from '../types';
import { round } from './round';

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
      fundamentalsScore: 0,
    };
  });
  return filterExtremeScores(computed);
}
