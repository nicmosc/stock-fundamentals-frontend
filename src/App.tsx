import { QuestionCircleFilled } from '@ant-design/icons';
import { css, injectGlobal } from '@emotion/css';
import { Button, Col, Row, Tooltip } from 'antd';
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
    display: flex;
    flex-direction: column;
    background: linear-gradient(17deg, ${Color.volcano[5]} 2.04%, ${Color.orange[5]} 90.35%);
  `,
  container: css`
    width: 100%;
    max-width: 1000px;
    height: 100%;
    margin: 0 auto;
  `,
  button: css`
    color: ${Color.white} !important;
    border-color: ${Color.white} !important;
    border-radius: ${Size.EXTRA_SMALL}px;

    &:hover {
      background: rgba(255, 255, 255, 0.3) !important;
    }
  `,
};

export const App = () => {
  const { stocks = [] } = useFetchStocks();
  const [margin] = useState<number>(50);
  const [roi] = useState<number>(20);
  const [activeStock, setActiveStock] = useState<Stock>();

  const safety = 1 - margin / 100;

  const computedStocks = computeRankScores(roi / 100, safety, stocks);
  const sortedStocks = [...computedStocks].sort((a, b) => a.name.localeCompare(b.name));

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
            }}
          >
            <QuestionCircleFilled style={{ fontSize: Size.MEDIUM, cursor: 'pointer' }} />
          </Tooltip>
        </Title>
      </Box>
      <Box style={{ height: '100%', overflow: 'hidden' }} size={{ top: Size.SMALL }}>
        <div className={styles.container}>
          <AnimatedScrollContainer
            active={activeStock != null}
            top={<StockPanel stock={activeStock} onClickClose={() => setActiveStock(undefined)} />}
            bottom={<Panel stocks={sortedStocks} onClickStock={setActiveStock} />}
          />
        </div>
      </Box>
    </div>
  );
};
