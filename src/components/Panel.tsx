import { css } from '@emotion/css';

import { Color, Size } from '../utils';

const styles = {
  panel: css`
    padding: ${Size.MEDIUM}px;
    border-radius: ${Size.EXTRA_LARGE}px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background: ${Color.grey[0]};
    width: 100%;
    height: 100%;
  `,
};

export const Panel = () => {
  return <div className={styles.panel}></div>;
};
