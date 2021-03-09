import { QuestionCircleFilled } from '@ant-design/icons';
import { css, injectGlobal } from '@emotion/css';

import { Box, Logo, Panel, Title } from './components';
import { Color, Size } from './utils';

injectGlobal`
  html, body {
    font-family: 'Raleway', sans-serif;
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
};

export const App = () => {
  return (
    <div className={styles.app}>
      <Box size={Size.LARGE} inset>
        <Logo inversed={false} />
      </Box>
      <Box size={Size.LARGE}>
        <Title level={1} align="center">
          Stocks at a discounted price for <span style={{ fontStyle: 'italic' }}>you</span>
        </Title>
        <Title align="center" level={3}>
          We found 23 value stocks out of 11.244 that match your profile{' '}
          <QuestionCircleFilled style={{ fontSize: Size.MEDIUM }} />
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
