import { css } from '@emotion/css';

import { Color, Size } from '../../utils';
import { Box } from '../Box';
import { Text } from '../Text';
import { Title } from '../Title';
import { AnimatedChart } from './AnimatedChart';
import { Slider } from './Slider';

const styles = {
  gradientText: css`
    display: inline-block;
    position: relative;
    background: linear-gradient(
      90deg,
      ${Color.orange.primary},
      50%,
      ${Color.volcano.primary} 60.61%
    );
    background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0px 4px 8px rgba(255, 100, 38, 0.4);

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
      background: ${Color.volcano.primary};
      z-index: 0;
    }
  `,
  chart: css`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
  `,
};

interface ROIProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm: VoidFunction;
}

export const ROI = ({ value, onChange, onConfirm }: ROIProps) => {
  return (
    <div>
      <Title inversed={false} level={1} align="center">
        First, adjust your desired rate of return.
      </Title>
      <Box size={Size.LARGE} style={{ textAlign: 'center' }}>
        <Text>Over the next 10 years, year over year. Recommended: 10-30.</Text>
      </Box>
      <Box size={{ top: Size.LARGE * 3 }} style={{ textAlign: 'center' }}>
        <div className={styles.gradientText}>
          <Text size={Size.EXTRA_LARGE * 2}>+{value}</Text>
          <Text size={Size.EXTRA_LARGE}>%</Text>
        </div>
      </Box>
      <Box size={{ top: Size.LARGE * 3 }} style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider value={value} onChange={onChange} onConfirm={onConfirm} />
      </Box>
      <div className={styles.chart}>
        <AnimatedChart height={400} value={value} />
      </div>
    </div>
  );
};
