import { useLayoutEffect } from 'react';

import { Stock } from '../types';
import { getSectorColors } from '../utils';

interface TradingViewChartProps {
  symbol: Stock['symbol'];
  sector: Stock['profile']['sector'];
}

export const TradingViewChart = ({ symbol, sector }: TradingViewChartProps) => {
  const initWidget = () => {
    const colors = getSectorColors(sector);

    new TradingView.MediumWidget({
      symbols: [[' ', symbol]],
      chartOnly: true,
      width: '100%',
      height: '100%',
      locale: 'en',
      colorTheme: 'light',
      gridLineColor: 'rgba(0, 0, 0, 0)',
      trendLineColor: colors.default,
      fontColor: 'rgba(0, 0, 0, 0)',
      underLineColor: colors.light,
      isTransparent: true,
      autosize: true,
      container_id: 'tradingview-container',
    });
  };

  useLayoutEffect(() => {
    initWidget();
  }, []);

  return (
    <div className="tradingview-widget-container">
      <div id="tradingview-container" />
    </div>
  );
};
