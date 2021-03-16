import { css, cx } from '@emotion/css';

import { Color, normalize } from '../../utils';

const styles = {
  container: css`
    position: relative;
    font-size: 0.9rem;
    margin: auto;
    width: 100%;

    > svg {
      height: 100%;
      width: 100%;
    }
  `,
  circle: css`
    stroke-width: 20px;
    transform-origin: 50% 50%;
    transform: rotate(18deg);
    fill: none;
  `,
  background: css`
    stroke: ${Color.grey[2]};
  `,
  progress: css`
    stroke: url(#gradient);
    filter: url(#shadow);
  `,
};

interface AnimatedProgressProps {
  value: number;
  height: number;
}

export const AnimatedProgress = ({ value, height }: AnimatedProgressProps) => {
  const circumference = 84 * Math.PI;
  const normalizedValue = normalize(value, 100, 0, 40, 100) / 100;
  const offset = normalizedValue * circumference;

  return (
    <div
      className={styles.container}
      style={{ height: height, transform: `translateY(${height / 2}px)` }}>
      <svg viewBox="0 0 120 120">
        <defs>
          <filter id="shadow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
            <feOffset dx="0" dy="4" result="offsetblur" />
            <feFlood floodColor="rgba(24, 144, 255, 0.4)" />
            <feComposite in2="offsetblur" operator="in" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <linearGradient
          id="gradient"
          x1="0%"
          y1="50%"
          x2="80%"
          y2="0%"
          gradientUnits="userSpaceOnUse">
          <stop offset="0%" style={{ stopColor: Color.blue.primary, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: Color.geekblue[4], stopOpacity: 1 }} />
        </linearGradient>
        <circle cx="60" cy="60" r="42" className={cx(styles.circle, styles.background)} />
        <circle
          cx="60"
          cy="60"
          r="42"
          strokeLinecap="round"
          data-element="circle"
          className={cx(styles.circle, styles.progress)}
          style={{ strokeDasharray: `${offset}, ${circumference}` }}
        />
      </svg>
    </div>
  );
};
