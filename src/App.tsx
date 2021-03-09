import { css, injectGlobal } from '@emotion/css';

import { Box, Logo, Title } from './components';
import { Size, colors } from './utils';

injectGlobal`
  html, body {
    font-family: 'Raleway', sans-serif;
  }
`;

const styles = {
  app: css`
    height: 100vh;
    background: linear-gradient(17deg, ${colors.volcano[5]} 2.04%, ${colors.orange[5]} 90.35%);
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
          We found 23 value stocks out of 11.244 that match your profile
        </Title>
      </Box>
    </div>
  );
};
