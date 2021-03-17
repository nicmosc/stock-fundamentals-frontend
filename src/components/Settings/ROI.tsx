import { css } from '@emotion/css';

import { Color, Size, screenM } from '../../utils';
import { useScreenSize } from '../../utils/hooks/use-screen-size';
import { Box } from '../Box';
import { Text } from '../Text';
import { Title } from '../Title';
import { AnimatedChart } from './AnimatedChart';
import { Slider } from './Slider';

const styles = {
  roi: css`
    margin-top: -${Size.EXTRA_LARGE}px;

    @media ${screenM} {
      margin-top: 0;
    }
  `,
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
    overflow: hidden;
  `,
};

interface ROIProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm: VoidFunction;
}

export const ROI = ({ value, onChange, onConfirm }: ROIProps) => {
  const { screenSize, ScreenSizes } = useScreenSize();
  const isMobile = screenSize <= ScreenSizes.M;
  return (
    <div className={styles.roi}>
      <Box size={{ left: Size.LARGE, right: Size.LARGE }}>
        <Title inversed={false} level={isMobile ? 3 : 1} align={isMobile ? undefined : 'center'}>
          First, adjust your desired rate of return.
        </Title>
      </Box>

      <Box size={Size.LARGE} style={{ textAlign: isMobile ? undefined : 'center' }}>
        <Text>Over the next 10 years, year over year. Recommended: 10-30.</Text>
      </Box>
      <Box size={{ top: isMobile ? Size.SMALL : Size.LARGE * 3 }} style={{ textAlign: 'center' }}>
        <div className={styles.gradientText}>
          <Text size={Size.EXTRA_LARGE * 2}>+{value}</Text>
          <Text size={Size.EXTRA_LARGE}>%</Text>
        </div>
      </Box>
      <Box
        size={{ top: isMobile ? Size.EXTRA_LARGE : Size.LARGE * 3 }}
        style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider value={value} onChange={onChange} onConfirm={onConfirm} />
      </Box>
      <div className={styles.chart}>
        <AnimatedChart height={isMobile ? 220 : 400} value={value} />
      </div>
    </div>
  );
};
