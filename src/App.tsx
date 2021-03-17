import { LoadingOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { css, cx, injectGlobal } from '@emotion/css';
import { Button, Col, Row, Spin, Tooltip } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { Fragment, useState } from 'react';

import {
  AnimatedScrollContainer,
  Box,
  Logo,
  Panel,
  Settings,
  StockPanel,
  Title,
} from './components';
import { SortByEnum } from './components/SortBy';
import { Stock } from './types';
import { Color, Size, ValueOf, computeRankScores, useFetchStocks, useScreenSize } from './utils';

injectGlobal`
  html, body {
    font-family: 'Raleway', sans-serif;

    *::selection {
      background: ${Color.volcano.primary}; /* WebKit/Blink Browsers */
    }
  }
`;

const styles = {
  app: css`
    height: 100vh;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    background: linear-gradient(17deg, ${Color.volcano[5]} 2.04%, ${Color.orange[5]} 90.35%);
  `,
  light: css`
    background: ${Color.white};
  `,
  container: css`
    width: 100%;
    max-width: 1000px;
    height: calc(100% + 400px);
    margin: 0 auto;
    padding-top: 100px;
    transform: translateY(-100px);
    pointer-events: none;

    * {
      pointer-events: auto;
    }
  `,
  button: css`
    color: ${Color.white} !important;
    border-color: ${Color.white} !important;
    border-radius: ${Size.EXTRA_SMALL}px;

    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  `,
  loader: css`
    width: 100%;
    margin-top: ${Size.EXTRA_LARGE}px;
    text-align: center;
  `,
};

export const App = () => {
  const { isLoading, stocks = [] } = useFetchStocks();
  const [margin, setMargin] = useState<number>(50);
  const [roi, setRoi] = useState<number>(20);
  const [activeStock, setActiveStock] = useState<Stock>();
  const [sortBy, setSortBy] = useState<ValueOf<typeof SortByEnum>>(SortByEnum.ALPHABETICAL);
  const [isSettingsVisible, setIsSettingsVisible] = useState(false);
  const { screenSize, ScreenSizes } = useScreenSize();

  const safety = 1 - margin / 100;
  const isMobile = screenSize <= ScreenSizes.L;

  const computedStocks = isSettingsVisible ? [] : computeRankScores(roi / 100, safety, stocks);
  const sortedStocks = [...computedStocks].sort((a, b) => {
    if (sortBy === SortByEnum.FUNDAMENTALS) {
      return b.fundamentalsScore - a.fundamentalsScore;
    } else if (sortBy === SortByEnum.DISCOUNT) {
      return a.discountScore - b.discountScore;
    } else {
      return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className={cx(styles.app, { [styles.light]: isSettingsVisible })}>
      <Row justify="space-between">
        <Col>
          <Box size={Size.LARGE} inset>
            <Logo inversed={!isSettingsVisible} />
          </Box>
        </Col>
        {!isSettingsVisible ? (
          <Col>
            <Box size={Size.LARGE} inset>
              <Button onClick={() => setIsSettingsVisible(true)} ghost className={styles.button}>
                Adjust settings
              </Button>
            </Box>
          </Col>
        ) : null}
      </Row>
      {isSettingsVisible ? (
        <Settings
          onClickClose={() => setIsSettingsVisible(false)}
          roi={roi}
          onChangeMargin={setMargin}
          margin={margin}
          onChangeRoi={setRoi}
        />
      ) : (
        <Fragment>
          <Box size={isMobile ? { left: Size.LARGE, right: Size.LARGE } : Size.LARGE}>
            <Title level={isMobile ? 3 : 1} align={isMobile ? undefined : 'center'}>
              Stocks at a discounted price for <span style={{ fontStyle: 'italic' }}>you</span>
            </Title>
            {!isMobile ? (
              <Title align="center" level={3}>
                We found {sortedStocks.length} <span style={{ fontStyle: 'italic' }}>value</span>{' '}
                stocks out of 11.244 that match your profile{' '}
                <Tooltip
                  title="Only stocks with enough public financial data and solid fundamentals are considered. Growth rate > 0, profit margins > 0, revenue growth > 10%. Also, no penny stocks."
                  placement="right"
                  color={Color.white}
                  overlayInnerStyle={{
                    color: Color.primary,
                    padding: Size.MEDIUM,
                    borderRadius: Size.SMALL,
                  }}>
                  <QuestionCircleFilled
                    style={{
                      fontSize: Size.MEDIUM,
                      cursor: 'pointer',
                      transform: 'translateY(-2px)',
                    }}
                  />
                </Tooltip>
              </Title>
            ) : null}
          </Box>
          <Box
            style={{ display: 'flex', flex: 1, minHeight: 0 }}
            inset
            size={{
              top: isMobile ? Size.MEDIUM : Size.SMALL,
              left: Size.MEDIUM,
              right: Size.MEDIUM,
            }}>
            <div className={styles.container}>
              <AnimatedScrollContainer
                onResetPanel={() => setActiveStock(undefined)}
                active={activeStock != null}
                top={
                  <StockPanel stock={activeStock} onClickClose={() => setActiveStock(undefined)} />
                }
                bottom={
                  <AnimatePresence>
                    {isLoading ? (
                      <div className={styles.loader}>
                        <Spin
                          style={{ color: Color.white }}
                          indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                        />
                      </div>
                    ) : (
                      <motion.div
                        style={{ height: '100%' }}
                        transition={{ duration: 0.8, ease: [0.86, 0, 0.07, 1] }}
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}>
                        <Panel
                          onChangeSort={setSortBy}
                          hidden={activeStock != null}
                          stocks={sortedStocks}
                          onClickStock={setActiveStock}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                }
              />
            </div>
          </Box>
        </Fragment>
      )}
    </div>
  );
};
