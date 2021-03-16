import { css } from '@emotion/css';
import { useEffect, useState } from 'react';

import { Color } from '../../utils';

function _randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const POINTS_COUNT = 101;

const styles = {
  chart: css`
    position: relative;
  `,
  svg: css`
    transform-origin: bottom;
    transform: translateY(2px) scale(1.05);
    path {
      stroke: ${Color.volcano[6]};
      stroke-width: 2;
      fill: url(#gradient);
    }
  `,
};

const randomSequence = [...Array(POINTS_COUNT)].map(() => _randomBetween(0, 400));

const OFFSET = 40;

interface AnimatedChartProps {
  value: number;
  height: number;
}

export const AnimatedChart = ({ value, height }: AnimatedChartProps) => {
  const [key, setKey] = useState(Math.random());
  const width = window.innerWidth + OFFSET * 2;
  const heights = [...Array(POINTS_COUNT)].map(
    (_, i) => (i / 100) * width * (((value / 100) * height) / width),
  );

  const handleResize = () => {
    setKey(Math.random());
  };

  useEffect(() => {
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={styles.chart} style={{ height }}>
      <svg
        key={key}
        className={styles.svg}
        height={height}
        width={width}
        style={{ marginLeft: -OFFSET / 2 }}
        viewBox={`0 -${OFFSET} ${width} ${height + OFFSET}`}>
        <linearGradient
          id="gradient"
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
          gradientUnits="userSpaceOnUse"
          gradientTransform="rotate(80)">
          <stop offset="0%" style={{ stopColor: Color.volcano.primary, stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: Color.orange.primary, stopOpacity: 0.5 }} />
        </linearGradient>
        <path
          d={`M -${OFFSET} ${height}
        ${heights
          .map((pointHeight, i) => {
            const ri = width * (i / 100);
            return `L ${ri} ${
              height -
              (pointHeight +
                (randomSequence[i] *
                  (Math.max(i / 100), 0.4) *
                  Math.min(Math.max(pointHeight, 20), 120)) /
                  height)
            }`;
          })
          .join(' ')}
         L ${width} ${height - (value / 100) * height} L ${width} ${height}Z`}
        />
      </svg>
    </div>
  );
};
