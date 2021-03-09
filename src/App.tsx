import { QuestionCircleFilled } from '@ant-design/icons';
import { css, injectGlobal } from '@emotion/css';
import { Button, Col, Row, Tooltip } from 'antd';

import { Box, Logo, Panel, Title } from './components';
import { Color, Size } from './utils';

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
    max-width: 850px;
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
          We found 23 value stocks out of 11.244 that match your profile{' '}
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
      <Box style={{ height: '100%' }} size={{ top: Size.LARGE }}>
        <div className={styles.container}>
          <Panel></Panel>
        </div>
      </Box>
    </div>
  );
};
