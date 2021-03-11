import { PlusOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Col, Row, Typography } from 'antd';
import { useEffect, useState } from 'react';

import { Stock } from '../types';
import { Color, Size, getSectorColors } from '../utils';
import { Box } from './Box';
import { Text } from './Text';
import { TradingViewChart } from './TradingViewChart';

const styles = {
  panel: css`
    position: relative;
    height: 100%;
    padding: ${Size.EXTRA_LARGE}px calc(${Size.EXTRA_LARGE}px + ${Size.MEDIUM}px);
    border-radius: ${Size.EXTRA_LARGE}px;
    background: ${Color.white};
    width: 100%;
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
    z-index: 0;

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
  stock?: Stock;
  onClickClose: VoidFunction;
}

export const StockPanel = ({ stock: _stock, onClickClose }: StockPanelProps) => {
  const [stock, setStock] = useState<Stock | undefined>(_stock);

  useEffect(() => {
    if (_stock != null) {
      setStock(_stock);
    } else {
      setTimeout(() => setStock(undefined), 1000);
    }
  }, [_stock?.symbol]);

  if (stock == null) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <div className={styles.close} onClick={onClickClose}>
        <PlusOutlined />
      </div>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <Row gutter={Size.MEDIUM} align="middle">
          <Col>
            <Text bold size={Size.LARGE}>
              {stock.symbol}
            </Text>
          </Col>
          <Col>
            <Typography.Link
              style={{ fontWeight: 'bold' }}
              href={`https://finance.yahoo.com/quote/${stock.symbol}`}
              target="_blank"
            >
              Details (Yahoo)
            </Typography.Link>
          </Col>
        </Row>
        <Box size={{ top: Size.EXTRA_SMALL }}>
          <Text color={Color.secondary}>{stock.name}</Text>
        </Box>
        <Box size={{ top: Size.LARGE }}>
          <Row gutter={Size.LARGE}>
            <Col span={8}>
              <Row gutter={[Size.SMALL, Size.EXTRA_SMALL]}>
                <Col span={6}>
                  <Text color={Color.secondary}>Sector</Text>
                </Col>
                <Col span={18}>
                  <Text color={getSectorColors(stock.profile.sector).default}>
                    {stock.profile.sector}
                  </Text>
                </Col>
                <Col span={6}>
                  <Text color={Color.secondary}>Industry</Text>
                </Col>
                <Col span={18}>
                  <Text>{stock.profile.industry}</Text>
                </Col>
                <Col span={6}>
                  <Text color={Color.secondary}>Country</Text>
                </Col>
                <Col span={18}>
                  <Text>{stock.profile.country}</Text>
                </Col>
              </Row>
            </Col>
            <Col span={8}>
              <Row gutter={Size.MEDIUM}>
                <Col>
                  <Text>Fundamentals score:</Text>
                </Col>
                <Col>
                  <Typography.Link style={{ fontWeight: 'bold' }}>See all</Typography.Link>
                </Col>
              </Row>
              <Box size={{ top: Size.MEDIUM }}>stars</Box>
            </Col>
            <Col span={8}>three</Col>
          </Row>
        </Box>
      </div>

      <div className={styles.chart}>
        <TradingViewChart symbol={stock.symbol} sector={stock.profile.sector} />
      </div>
    </div>
  );
};
