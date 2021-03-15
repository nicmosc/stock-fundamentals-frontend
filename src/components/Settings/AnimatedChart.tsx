import { css } from '@emotion/css';

function _randomBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const POINTS_COUNT = 100;

const styles = {
  chart: css`
    position: relative;
  `,
  point: css`
    position: absolute;
    left: 0;
    bottom: 0;
    background: red;
    height: 10px;
    width: 10px;
  `,
};

const randomSequence = [...Array(POINTS_COUNT)].map(() => _randomBetween(0, 50));

interface AnimatedChartProps {
  value: number;
  height: number;
}

export const AnimatedChart = ({ value, height }: AnimatedChartProps) => {
  const heights = [...Array(POINTS_COUNT)].map((_, i) => i * (value / 100));
  return (
    <div className={styles.chart} style={{ height }}>
      {heights.map((height, i) => (
        <div
          key={i}
          className={styles.point}
          style={{
            left: `${i}%`,
            bottom: `${
              height +
              (randomSequence[i] * (Math.max(i / 100), 0.4) * Math.min(Math.max(height, 20), 80)) /
                100
            }%`,
          }}
        />
      ))}
    </div>
  );
};
