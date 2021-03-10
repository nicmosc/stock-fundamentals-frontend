import { css, cx } from '@emotion/css';
import { Variants, motion, useDragControls, useMotionValue, useTransform } from 'framer-motion';
import { ReactNode, useEffect } from 'react';

import { Size } from '../utils';

const TOP_HEIGHT = 370;
const ANIMATION_DURATION = '0.8s';
const ANIMATION_CURVE = 'cubic-bezier(0.86,0,0.07,1)';

const styles = {
  container: css`
    position: relative;
    width: 100%;
    height: 100%;
    perspective: 1000px;
  `,
  top: css`
    width: 100%;
    height: ${TOP_HEIGHT}px;
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    /* transform: translateY(30px) scale(0.7) rotateX(15deg); */
    /* opacity: 0; */
    /* transition: all ${ANIMATION_DURATION} ${ANIMATION_CURVE}; */
  `,
  topActive: css`
    /* opacity: 1; */
    /* transform: translateY(0) scale(1) rotateX(0); */
  `,
  bottom: css`
    height: 100%;
    position: relative;
    /* transition: all ${ANIMATION_DURATION} ${ANIMATION_CURVE}; */
  `,
  bottomActive: css`
    > * {
      pointer-events: none;
    }
  `,
};

const topVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.7,
    rotateX: 15,
  },
};

const totalY = TOP_HEIGHT + Size.LARGE;

const bottomVariants: Variants = {
  default: {
    y: 0,
  },
  compact: (progress: number) => ({
    y: totalY * progress,
  }),
};

interface AnimatedScrollContainerProps {
  top: ReactNode;
  bottom: ReactNode;
  active: boolean;
}

export const AnimatedScrollContainer = ({ top, bottom, active }: AnimatedScrollContainerProps) => {
  const dragControls = useDragControls();
  const scrollYOffset = useMotionValue(0);
  const opacity = useTransform(scrollYOffset, [0, totalY], [0, 1]);
  const y = useTransform(scrollYOffset, [0, totalY], [30, 0]);
  const scale = useTransform(scrollYOffset, [0, totalY], [0.7, 1]);
  const rotateX = useTransform(scrollYOffset, [0, totalY], [15, 0]);

  const handleWheelChange = (e: WheelEvent) => {
    const { deltaY } = e;
    const currentValue = scrollYOffset.get();
    const newValue = Math.max(
      Math.min(currentValue + Math.abs(deltaY) * (deltaY < 0 ? 1 : -1), totalY),
      0,
    );
    scrollYOffset.set(newValue);
  };

  useEffect(() => {
    if (active) {
      document.addEventListener('wheel', handleWheelChange);

      return () => {
        document.removeEventListener('wheel', handleWheelChange);
      };
    }
  }, [active]);

  return (
    <div className={styles.container}>
      <motion.div
        transition={{ duration: 2 }}
        initial="hidden"
        style={{
          opacity,
          y,
          scale,
          rotateX,
        }}
        variants={topVariants}
        className={styles.top}
      >
        {top}
      </motion.div>
      <motion.div
        transition={{ duration: 2 }}
        variants={bottomVariants}
        initial="default"
        style={{
          y: scrollYOffset,
        }}
        drag="y"
        dragControls={dragControls}
        onDrag={() => (document.body.style.cursor = 'grabbing')}
        onDragEnd={() => (document.body.style.cursor = '')}
        onDragStart={(e, info) => {
          if ((e.target as any).dataset.element !== 'handle') {
            (dragControls as any).componentControls.forEach((entry: any) => {
              entry.stop(e, info);
            });
          }
        }}
        dragElastic={0.2}
        dragConstraints={{ top: 0, bottom: 0 }}
        className={cx(styles.bottom, { [styles.bottomActive]: active })}
      >
        {bottom}
      </motion.div>
    </div>
  );
};
