import { css } from '@emotion/css';

import { Color, Size } from '../../utils';
import { Box } from '../Box';
import { Text } from '../Text';
import { Title } from '../Title';
import { AnimatedProgress } from './AnimatedProgress';
import { Slider } from './Slider';

const styles = {
  margin: css`
    margin-top: -${Size.EXTRA_LARGE}px;
  `,
  gradientText: css`
    display: inline-block;
    position: relative;
    background: linear-gradient(90deg, ${Color.blue.primary}, 50%, ${Color.geekblue[4]} 60.61%);
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0px 4px 8px rgba(24, 144, 255, 0.4);

    z-index: 1;

    &::before {
      content: ' ';
      position: absolute;
      top: 70%;
      left: 0;
      width: 100%;
      height: 15px;
      filter: blur(40px);
      opacity: 0.4;
      background: ${Color.blue.primary};
      z-index: 0;
    }
  `,
  chart: css`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
  `,
};

interface MarginProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm: VoidFunction;
}

export const Margin = ({ value, onChange, onConfirm }: MarginProps) => {
  return (
    <div className={styles.margin}>
      <Title inversed={false} level={1} align="center">
        Then, the margin of safety you require
      </Title>
      <Box size={Size.LARGE} style={{ textAlign: 'center' }}>
        <Text>
          Lower margin means more risk taken, resulting in more stocks to pick from. More risk means
          higher chance of failure
        </Text>
      </Box>
      <Box size={{ top: Size.LARGE * 3 }} style={{ textAlign: 'center' }}>
        <div className={styles.gradientText}>
          <Text size={Size.EXTRA_LARGE * 2}>+{value}</Text>
          <Text size={Size.EXTRA_LARGE}>%</Text>
        </div>
      </Box>
      <Box size={{ top: Size.LARGE * 3 }} style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider color="blue" value={value} onChange={onChange} onConfirm={onConfirm} />
      </Box>
      <div className={styles.chart}>
        <AnimatedProgress value={value} height={500} />
      </div>
    </div>
  );
};
