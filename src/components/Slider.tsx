import { css } from '@emotion/css';
import { motion, useMotionTemplate, useMotionValue, useTransform } from 'framer-motion';
import { useEffect } from 'react';

const HANDLE_WIDTH = 30;
const SLIDER_WIDTH = 300;

const styles = {
  slider: css`
    position: relative;
    width: ${SLIDER_WIDTH + HANDLE_WIDTH / 2}px;
    background: blue;
  `,
  filledTrack: css`
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    background: green;
    z-index: 1;
  `,
  handle: css`
    height: 20px;
    width: ${HANDLE_WIDTH}px;
    background: red;
    position: relative;
    z-index: 2;
  `,
};

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
}

export const Slider = ({ value, onChange }: SliderProps) => {
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
    <div className={styles.slider}>
      <motion.div
        className={styles.handle}
        drag="x"
        style={{ x }}
        dragElastic={0}
        dragTransition={{ power: 0 }}
        dragConstraints={{
          top: 0,
          left: -HANDLE_WIDTH / 2,
          right: SLIDER_WIDTH,
          bottom: 0,
        }}
      />
      <motion.div className={styles.filledTrack} style={{ width }} />
    </div>
  );
};
