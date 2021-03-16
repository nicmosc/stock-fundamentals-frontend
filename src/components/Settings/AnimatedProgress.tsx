import { css, cx } from '@emotion/css';

import { Color, normalize } from '../../utils';

const styles = {
  container: css`
    position: relative;
    font-size: 0.9rem;
    margin: auto;

    > svg {
      height: 100%;
      width: 100%;
    }
  `,
  circle: css`
    stroke-width: 8px;
    /* transform-origin: 50% 50%; */
    fill: none;
  `,
  background: css`
    stroke: ${Color.grey[2]};
  `,
  progress: css`
    stroke: ${Color.blue.primary};
  `,
};

interface AnimatedProgressProps {
  value: number;
  height: number;
}

export const AnimatedProgress = ({ value, height }: AnimatedProgressProps) => {
  const circumference = 84 * Math.PI;
  const normalizedValue = normalize(value, 100, 0, 50, 100) / 100;
  const offset = normalizedValue * circumference;

  return (
    <div
      className={styles.container}
      style={{ height: height, width: height, transform: `translateY(${height / 2}px)` }}>
      <svg viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="42" className={cx(styles.circle, styles.background)} />
        <circle
          cx="50"
          cy="50"
          r="42"
          data-element="circle"
          className={cx(styles.circle, styles.progress)}
          style={{ strokeDasharray: `${offset}, ${circumference}` }}
        />
      </svg>
    </div>
  );
};
