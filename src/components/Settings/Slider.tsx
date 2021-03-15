import { CheckOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';

import { Color, Size } from '../../utils';
import { Box } from '../Box';
import { Text } from '../Text';

const HANDLE_WIDTH = 50;
const SLIDER_WIDTH = 300;

const styles = {
  slider: css`
    position: relative;
    width: ${SLIDER_WIDTH + HANDLE_WIDTH / 2}px;
  `,
  backgroundTrack: css`
    width: 100%;
    height: 10px;
    background: ${Color.grey[2]};
    border-radius: ${Size.LARGE}px;
  `,
  filledTrack: css`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    z-index: 1;
    height: 10px;
    border-radius: ${Size.LARGE}px;
    background: linear-gradient(
      270deg,
      ${Color.volcano.primary} 2.49%,
      ${Color.orange.primary} 107.46%
    );
    box-shadow: 0px 4px 8px rgba(255, 100, 38, 0.4);

    &::before {
      content: ' ';
      position: absolute;
      top: 100%;
      left: 0;
      width: 100%;
      height: 15px;
      filter: blur(40px);
      opacity: 0.4;
      background: ${Color.volcano.primary};
      z-index: 0;
    }
  `,
  handle: css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${HANDLE_WIDTH}px;
    height: 30px;
    background: ${Color.white};
    position: absolute;
    left: 0;
    top: -10px;
    z-index: 2;
    border-radius: ${Size.LARGE}px;
    box-shadow: 0px 4px 7px rgba(0, 0, 0, 0.15), 0px 9px 23px -1px rgba(0, 11, 49, 0.05);

    &:hover {
      cursor: pointer;
    }
  `,
};

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  onConfirm: VoidFunction;
}

export const Slider = ({ value, onChange, onConfirm }: SliderProps) => {
  const [canConfirm, setCanConfirm] = useState(true);
  const x = useMotionValue(value);
  const _width = useTransform(x, (value) => value / 3);
  const width = useMotionTemplate`${_width}%`;

  useEffect(
    () =>
      _width.onChange((latest) => {
        onChange(Math.round(Math.max(Math.min(latest, 100), 0)));
      }),
    [],
  );

  return (
    <div>
      <div className={styles.slider}>
        <div className={styles.backgroundTrack} />
        <motion.div
          className={styles.handle}
          drag="x"
          style={{ x }}
          dragElastic={0}
          dragTransition={{ power: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4, ease: [0.86, 0, 0.07, 1] }}
          onDragStart={() => setCanConfirm(false)}
          onDragEnd={() => {
            setTimeout(() => {
              setCanConfirm(true);
            }, 200);
          }}
          onClick={canConfirm ? onConfirm : undefined}
          dragConstraints={{
            top: 0,
            left: -HANDLE_WIDTH / 2,
            right: SLIDER_WIDTH,
            bottom: 0,
          }}>
          <CheckOutlined
            style={{
              color: Color.volcano.primary,
              strokeWidth: 100,
              stroke: Color.volcano.primary,
            }}
          />
        </motion.div>
        <motion.div className={styles.filledTrack} style={{ width }} />
      </div>
      <Box size={{ top: Size.LARGE }} style={{ textAlign: 'center' }}>
        <Text light color={Color.tertiary}>
          Click to confirm
        </Text>
      </Box>
    </div>
  );
};
