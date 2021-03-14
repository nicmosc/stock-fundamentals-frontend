import { css } from '@emotion/css';

import { Color, Size } from '../utils';
import { Box } from './Box';
import { Slider } from './Slider';
import { Text } from './Text';
import { Title } from './Title';

const styles = {
  settings: css`
    height: 100%;
    width: 100%;
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
};

interface SettingsProps {
  roi: number;
  onChangeRoi: (roi: number) => void;
  margin: number;
  onChangeMargin: (margin: number) => void;
}

export const Settings = ({ roi, onChangeRoi }: SettingsProps) => {
  return (
    <div className={styles.settings}>
      <Title inversed={false} level={1} align="center">
        First, adjust your desired rate of return
      </Title>
      <Box size={Size.LARGE} style={{ textAlign: 'center' }}>
        <Text>Over the next 10 years, year over year</Text>
      </Box>
      <Box size={{ top: Size.LARGE * 3 }} style={{ textAlign: 'center' }}>
        <div className={styles.gradientText}>
          <Text size={Size.EXTRA_LARGE * 2}>+{roi}</Text>
          <Text size={Size.EXTRA_LARGE}>%</Text>
        </div>
      </Box>
      <Box size={{ top: Size.LARGE * 3 }} style={{ display: 'flex', justifyContent: 'center' }}>
        <Slider value={roi} onChange={onChangeRoi} />
      </Box>
    </div>
  );
};
