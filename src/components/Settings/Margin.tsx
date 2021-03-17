import { css } from '@emotion/css';

import { Color, Size, screenM, useScreenSize } from '../../utils';
import { Box } from '../Box';
import { Text } from '../Text';
import { Title } from '../Title';
import { AnimatedProgress } from './AnimatedProgress';
import { Slider } from './Slider';

const styles = {
  margin: css`
    margin-top: -${Size.EXTRA_LARGE}px;

    @media ${screenM} {
      margin-top: 0;
    }
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
  const { screenSize, ScreenSizes } = useScreenSize();
  const isMobile = screenSize <= ScreenSizes.M;
  return (
    <div className={styles.margin}>
      <Box size={{ left: Size.LARGE, right: Size.LARGE }}>
        <Title inversed={false} level={isMobile ? 3 : 1} align={isMobile ? undefined : 'center'}>
          Then, the margin of safety you require
        </Title>
      </Box>
      <Box size={Size.LARGE} style={{ textAlign: isMobile ? undefined : 'center' }}>
        <Text>
          Lower margin means more risk taken, resulting in more stocks to pick from. More risk means
          higher chance of failure
        </Text>
      </Box>
      <Box size={{ top: isMobile ? undefined : Size.LARGE * 3 }} style={{ textAlign: 'center' }}>
        <div className={styles.gradientText}>
          <Text size={Size.EXTRA_LARGE * 2}>+{value}</Text>
          <Text size={Size.EXTRA_LARGE}>%</Text>
        </div>
      </Box>
      <Box
        size={{ top: isMobile ? Size.LARGE : Size.LARGE * 3 }}
        style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider color="blue" value={value} onChange={onChange} onConfirm={onConfirm} />
      </Box>
      <div className={styles.chart}>
        <AnimatedProgress value={value} height={isMobile ? 250 : 400} />
      </div>
    </div>
  );
};
