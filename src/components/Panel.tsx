import { css } from '@emotion/css';

import { colors } from '../utils/colors';
import { Size } from '../utils/size';

const styles = {
  panel: css`
    padding: ${Size.MEDIUM}px;
    border-radius: ${Size.EXTRA_LARGE}px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background: ${colors.grey[0]};
    width: 100%;
    height: 100%;
  `,
};

export const Panel = () => {
  return <div className={styles.panel}></div>;
};
