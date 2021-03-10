import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';

import { Stock } from '../types';
import { Color, Size } from '../utils';
import { TradingViewChart } from './TradingViewChart';

const styles = {
  panel: css`
    position: relative;
    height: 370px;
    padding: ${Size.EXTRA_LARGE}px calc(${Size.EXTRA_LARGE}px + ${Size.MEDIUM}px);
    border-radius: ${Size.EXTRA_LARGE}px;
    background: ${Color.white};
    width: 100%;
    margin-bottom: ${Size.LARGE}px;
    box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15), 0px 50px 20px -34px rgba(0, 0, 0, 0.08);
    overflow: hidden;
  `,
  close: css`
    position: absolute;
    top: ${Size.LARGE}px;
    right: ${Size.LARGE}px;
    font-size: ${Size.LARGE}px;
    transform: rotate(45deg);
    display: flex;
    color: ${Color.tertiary};

    &:hover {
      cursor: pointer;
      color: ${Color.secondary};
    }
  `,
  chart: css`
    position: absolute;
    bottom: 0;
    left: -${Size.EXTRA_LARGE}px;
    height: 180px;
    width: calc(100% + ${Size.EXTRA_LARGE}px * 2);
    pointer-events: none;

    &::after {
      content: ' ';
      position: absolute;
      height: 40px;
      width: 200px;
      top: ${Size.EXTRA_SMALL}px;
      left: ${Size.EXTRA_LARGE}px;
      background: ${Color.white};
    }
  `,
};

interface StockPanelProps {
  stock: Stock;
  onClickClose: VoidFunction;
}

export const StockPanel = ({ stock, onClickClose }: StockPanelProps) => {
  return (
    <div className={styles.panel}>
      <div className={styles.close} onClick={onClickClose}>
        <PlusOutlined />
      </div>
      {stock.name}
      <div className={styles.chart}>
        <TradingViewChart symbol={stock.symbol} sector={stock.profile.sector} />
      </div>
    </div>
  );
};
