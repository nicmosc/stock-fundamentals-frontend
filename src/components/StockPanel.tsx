import { InfoCircleFilled, LeftOutlined, LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { css, cx } from '@emotion/css';
import { Col, Row, Spin, Tooltip, Typography } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useEffect, useState } from 'react';

import { Stock } from '../types';
import {
  ANIMATION_CURVE,
  ANIMATION_TIME,
  Color,
  Size,
  getSectorColors,
  round,
  screenL,
  useScreenSize,
} from '../utils';
import { Box } from './Box';
import { StarsRating } from './StarsRating';
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
    transform: translateZ(0);

    @media ${screenL} {
      padding: ${Size.LARGE}px;
    }
  `,
  close: css`
    position: absolute;
    top: ${Size.LARGE}px;
    right: ${Size.LARGE}px;
    font-size: ${Size.LARGE}px;
    transform: rotate(45deg);
    display: flex;
    color: ${Color.tertiary};
    z-index: 5;

    &:hover {
      cursor: pointer;
      color: ${Color.secondary};
    }
  `,
  spinner: css`
    position: absolute;
    bottom: ${Size.LARGE}px;
    left: 50%;
    transform: translateX(-50%);

    @media ${screenL} {
      bottom: ${Size.EXTRA_LARGE}px;
    }
  `,
  chart: css`
    position: absolute;
    bottom: 0;
    left: -${Size.EXTRA_LARGE}px;
    height: 170px;
    width: calc(100% + ${Size.EXTRA_LARGE}px * 2);
    pointer-events: none;
    z-index: 0;
    opacity: 0;
    transform-origin: bottom;
    transform: scaleY(0.5);
    transition: all ${ANIMATION_TIME} ${ANIMATION_CURVE};

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
  visible: css`
    opacity: 1;
    transform: scaleY(1);
  `,
  disclaimer: css`
    position: absolute;
    bottom: ${Size.MEDIUM}px;
    right: ${Size.LARGE}px;
    z-index: 2;
  `,
  back: css`
    color: ${Color.tertiary};

    path {
      stroke: ${Color.tertiary};
      stroke-width: 70;
    }

    &:hover {
      cursor: pointer;
      color: ${Color.secondary};

      span {
        color: ${Color.secondary} !important;
      }

      path {
        stroke: ${Color.secondary};
      }
    }
  `,
};

type Keys = keyof Omit<Stock['stats'], 'est10YearEPS' | 'est10thYearPrice' | 'currentPrice'>;

const StatMapping: { [key in Keys]: string } = {
  revenueGrowth: 'Revenue Growth',
  profitMargin: 'Profit Margins',
  EPS: 'Earnings Per Share (EPS)',
  growthRate: 'Growth Rate (5 years est.)',
  PE: 'PE Ratio',
  debtToEquity: 'Debt to Equity (D/E)', // TODO color if < 1 (good), > 2 (bad)
  FCFYield: 'Free Cash Flow Yield',
  ROIC: 'ROIC',
};

const percentages = ['revenueGrowth', 'profitMargin', 'growthRate', 'FCFYield', 'ROIC'];

const Stats = ({ stats, onClickBack }: { stats: Stock['stats']; onClickBack: VoidFunction }) => {
  const { screenSize, ScreenSizes } = useScreenSize();
  const isMobile = screenSize <= ScreenSizes.L;

  return (
    <div>
      <div onClick={onClickBack} className={styles.back}>
        <Row gutter={Size.EXTRA_SMALL}>
          <Col>
            <LeftOutlined />
          </Col>
          <Col>
            <Text color={Color.tertiary} size={Size.MEDIUM}>
              Back
            </Text>
          </Col>
        </Row>
      </div>
      <Box size={{ top: Size.MEDIUM }}>
        <Row gutter={[Size.EXTRA_LARGE, isMobile ? Size.EXTRA_SMALL : Size.SMALL]}>
          {Object.keys(StatMapping).map((key) => {
            const value = stats[key as Keys];
            if (value == null) {
              return undefined;
            }
            return (
              <Fragment key={key}>
                <Col span={isMobile ? 16 : 6} style={{ whiteSpace: 'nowrap' }}>
                  <Text color={Color.secondary}>{StatMapping[key as Keys]}</Text>
                </Col>
                <Col span={isMobile ? 8 : 6} style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                  <Text>{percentages.includes(key) ? `${round(value * 100)}%` : round(value)}</Text>
                </Col>
              </Fragment>
            );
          })}
        </Row>
      </Box>
    </div>
  );
};

const BasicInfo = ({ stock, onClickViewAll }: { stock: Stock; onClickViewAll: VoidFunction }) => {
  const { screenSize, ScreenSizes } = useScreenSize();
  const isMobile = screenSize <= ScreenSizes.L;

  return (
    <Fragment>
      <Text color={Color.secondary}>{stock.name}</Text>
      <Box size={{ top: Size.LARGE }}>
        <Row gutter={Size.LARGE}>
          {!isMobile ? (
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
          ) : null}
          <Col span={isMobile ? 24 : 8}>
            <Row gutter={Size.MEDIUM}>
              <Col>
                <Text>Fundamentals score:</Text>
                <Tooltip
                  title="Each fundamental parameter is given a weight and a weighted average is computed. More importance is given to profit margins and profit/revenue growth."
                  placement="top"
                  color={Color.white}
                  overlayInnerStyle={{
                    color: Color.primary,
                    padding: Size.MEDIUM,
                    borderRadius: Size.SMALL,
                  }}>
                  <InfoCircleFilled
                    style={{
                      color: Color.tertiary,
                      fontSize: Size.MEDIUM,
                      cursor: 'pointer',
                      marginLeft: Size.EXTRA_SMALL,
                    }}
                  />
                </Tooltip>
              </Col>
              <Col>
                <Typography.Link onClick={onClickViewAll} style={{ fontWeight: 'bold' }}>
                  See all
                </Typography.Link>
              </Col>
            </Row>
            <Box size={{ top: isMobile ? Size.SMALL : Size.MEDIUM }}>
              <StarsRating rating={stock.fundamentalsScore + 0.2} />
            </Box>
          </Col>
          <Col span={isMobile ? 24 : 8}>
            <Row
              style={{ marginTop: isMobile ? Size.MEDIUM : -Size.SMALL }}
              gutter={[Size.SMALL, Size.EXTRA_SMALL]}
              align="middle">
              <Col span={12}>
                <Text color={Color.secondary}>Current price</Text>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text bold size={Size.LARGE}>
                  ${round(stock.stats.currentPrice)}
                </Text>
              </Col>
              <Col span={12}>
                <Text color={Color.secondary}>Est. fair price</Text>
                <Tooltip
                  title="This price is calculated depending on the given settings, and may vary greatly given different parameters"
                  placement="top"
                  color={Color.white}
                  overlayInnerStyle={{
                    color: Color.primary,
                    padding: Size.MEDIUM,
                    borderRadius: Size.SMALL,
                  }}>
                  <InfoCircleFilled
                    style={{
                      color: Color.tertiary,
                      fontSize: Size.MEDIUM,
                      cursor: 'pointer',
                      marginLeft: Size.EXTRA_SMALL,
                    }}
                  />
                </Tooltip>
              </Col>
              <Col span={12} style={{ textAlign: 'right' }}>
                <Text bold size={Size.LARGE}>
                  ${round(stock.fairPrice)}
                </Text>
              </Col>
            </Row>
          </Col>
        </Row>
      </Box>
    </Fragment>
  );
};

interface StockPanelProps {
  stock?: Stock;
  onClickClose: VoidFunction;
}

export const StockPanel = ({ stock: _stock, onClickClose }: StockPanelProps) => {
  const [stock, setStock] = useState<Stock | undefined>(_stock);
  const [statsVisible, setStatsVisible] = useState(false);
  const [chartVisible, setChartVisible] = useState(false);

  useEffect(() => {
    if (_stock != null) {
      setStock(_stock);
      setStatsVisible(false);
    } else {
      setTimeout(() => setStock(undefined), 1000);
    }
  }, [_stock?.symbol]);

  useEffect(() => {
    if (stock != null) {
      setTimeout(() => setChartVisible(true), 2000);
    } else {
      setChartVisible(false);
    }
  }, [stock]);

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
              target="_blank">
              Details (Yahoo)
            </Typography.Link>
          </Col>
        </Row>
        <Box size={{ top: Size.EXTRA_SMALL }}>
          <AnimatePresence exitBeforeEnter>
            {statsVisible ? (
              <motion.div
                key="stats"
                transition={{ duration: 0.4, ease: [0.86, 0, 0.07, 1] }}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 50, opacity: 0 }}>
                <Stats stats={stock.stats} onClickBack={() => setStatsVisible(false)} />
              </motion.div>
            ) : (
              <motion.div
                key="basicInfo"
                transition={{ duration: 0.4, ease: [0.86, 0, 0.07, 1] }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}>
                <BasicInfo onClickViewAll={() => setStatsVisible(true)} stock={stock} />
              </motion.div>
            )}
          </AnimatePresence>
        </Box>
      </div>
      <div className={styles.disclaimer}>
        <Text light size={Size.MEDIUM - 3} color={getSectorColors(stock.profile.sector).default}>
          *Prices updated daily, fundamentals updated quarterly
        </Text>
      </div>
      {!chartVisible ? (
        <div className={styles.spinner}>
          <Spin
            style={{ color: getSectorColors(stock.profile.sector).default }}
            indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
          />
        </div>
      ) : null}
      <div className={cx(styles.chart, { [styles.visible]: chartVisible })}>
        <TradingViewChart symbol={stock.symbol} sector={stock.profile.sector} />
      </div>
    </div>
  );
};
