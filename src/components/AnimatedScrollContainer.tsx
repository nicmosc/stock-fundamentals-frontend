import { css, cx } from '@emotion/css';
import { motion, useDragControls } from 'framer-motion';
import { ReactNode } from 'react';

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
    /* transform: translateY(calc(${TOP_HEIGHT}px + ${Size.LARGE}px)); */
  `,
};

interface AnimatedScrollContainerProps {
  top: ReactNode;
  bottom: ReactNode;
  active: boolean;
}

export const AnimatedScrollContainer = ({ top, bottom, active }: AnimatedScrollContainerProps) => {
  const dragControls = useDragControls();

  return (
    <div className={styles.container}>
      <motion.div className={cx(styles.top, { [styles.topActive]: active })}>{top}</motion.div>
      <motion.div
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
