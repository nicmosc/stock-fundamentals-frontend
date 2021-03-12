import { LoadingOutlined, QuestionCircleFilled } from '@ant-design/icons';
import { css, injectGlobal } from '@emotion/css';
import { Button, Col, Row, Spin, Tooltip } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { AnimatedScrollContainer, Box, Logo, Panel, StockPanel, Title } from './components';
import { Stock } from './types';
import { Color, Size, computeRankScores, useFetchStocks } from './utils';

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
  const [margin] = useState<number>(50);
  const [roi] = useState<number>(20);
  const [activeStock, setActiveStock] = useState<Stock>();

  const safety = 1 - margin / 100;

  const computedStocks = computeRankScores(roi / 100, safety, stocks);
  // const sortedStocks = [...computedStocks].sort((a, b) => a.name.localeCompare(b.name));
  const sortedStocks = [...computedStocks].sort(
    (a, b) => b.fundamentalsScore - a.fundamentalsScore,
  );

  return (
    <div className={styles.app}>
      <Row justify="space-between">
        <Col>
          <Box size={Size.LARGE} inset>
            <Logo inversed={false} />
          </Box>
        </Col>
        <Col>
          <Box size={Size.LARGE} inset>
            <Button ghost className={styles.button}>
              Adjust settings
            </Button>
          </Box>
        </Col>
      </Row>
      <Box size={Size.LARGE}>
        <Title level={1} align="center">
          Stocks at a discounted price for <span style={{ fontStyle: 'italic' }}>you</span>
        </Title>
        <Title align="center" level={3}>
          We found {sortedStocks.length} <span style={{ fontStyle: 'italic' }}>value</span> stocks
          out of 11.244 that match your profile{' '}
          <Tooltip
            title="Only stocks with enough public financial data and solid fundamentals are considered. Growth rate > 0, profit margins > 0, revenue growth > 10%. Also, no penny stocks."
            placement="right"
            color={Color.white}
            overlayInnerStyle={{
              color: Color.primary,
              padding: Size.MEDIUM,
              borderRadius: Size.SMALL,
            }}>
            <QuestionCircleFilled style={{ fontSize: Size.MEDIUM, cursor: 'pointer' }} />
          </Tooltip>
        </Title>
      </Box>
      <Box
        style={{ display: 'flex', flex: 1, minHeight: 0 }}
        inset
        size={{ top: Size.SMALL, left: Size.SMALL, right: Size.SMALL }}>
        <div className={styles.container}>
          <AnimatedScrollContainer
            onResetPanel={() => setActiveStock(undefined)}
            active={activeStock != null}
            top={<StockPanel stock={activeStock} onClickClose={() => setActiveStock(undefined)} />}
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
    </div>
  );
};
