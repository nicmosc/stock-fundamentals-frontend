import { css } from '@emotion/css';
import {
  PanInfo,
  Variants,
  animate,
  motion,
  useDragControls,
  useMotionValue,
  useTransform,
} from 'framer-motion';
import { ReactNode, useEffect } from 'react';

import { Size, screenL } from '../utils';

const TOP_HEIGHT = 370;
const MOBILE_TOP_HEIGHT = 430;

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

    @media ${screenL} {
      height: ${MOBILE_TOP_HEIGHT}px;
    }
  `,
  bottom: css`
    height: 100%;
    position: relative;
  `,
};

function _getTotalY() {
  const isMobile = window.innerWidth <= 768;

  return (isMobile ? MOBILE_TOP_HEIGHT : TOP_HEIGHT) + Size.LARGE;
}

const topVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.7,
    rotateX: 15,
  },
};

const bottomVariants: Variants = {
  default: {
    y: 0,
  },
  compact: (progress: number) => ({
    y: _getTotalY() * progress,
  }),
};

interface AnimatedScrollContainerProps {
  top: ReactNode;
  bottom: ReactNode;
  active: boolean;
  onResetPanel: VoidFunction;
}

export const AnimatedScrollContainer = ({
  top,
  bottom,
  active,
  onResetPanel,
}: AnimatedScrollContainerProps) => {
  const dragControls = useDragControls();
  const scrollYOffset = useMotionValue(0);
  const opacity = useTransform(scrollYOffset, [0, _getTotalY()], [0, 1]);
  const y = useTransform(scrollYOffset, [0, _getTotalY()], [30, 0]);
  const scale = useTransform(scrollYOffset, [0, _getTotalY()], [0.7, 1]);
  const rotateX = useTransform(scrollYOffset, [0, _getTotalY()], [15, 0]);

  const handleActiveChange = () => {
    if (!active && scrollYOffset.get() !== 0) {
      animate(scrollYOffset, 0, {
        duration: 0.8,
        ease: [0.86, 0, 0.07, 1],
      });
    } else if (active && scrollYOffset.get() !== _getTotalY()) {
      animate(scrollYOffset, _getTotalY(), {
        duration: 0.8,
        ease: [0.86, 0, 0.07, 1],
      });
    }
  };

  const handleWheelChange = (e: WheelEvent) => {
    const { deltaY: _deltaY } = e;
    const deltaY = _deltaY * 1.5;
    const currentValue = scrollYOffset.get();
    const newValue = Math.max(
      Math.min(currentValue + Math.abs(deltaY) * (deltaY < 0 ? 1 : -1), _getTotalY()),
      0,
    );
    animate(scrollYOffset, newValue, {
      duration: 0.1,
    });

    if (newValue < _getTotalY() - _getTotalY() / 4) {
      onResetPanel();
    }
  };

  const handleDragPanel = (_: any, info: PanInfo) => {
    if (info.offset.y < -300) {
      onResetPanel();
    }

    document.body.style.cursor = 'grabbing';
  };

  useEffect(() => {
    handleActiveChange();

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
        initial="hidden"
        style={{
          opacity,
          y,
          scale,
          rotateX,
        }}
        variants={topVariants}
        className={styles.top}>
        {top}
      </motion.div>
      <motion.div
        variants={bottomVariants}
        initial="default"
        style={{
          y: scrollYOffset,
        }}
        drag="y"
        dragControls={dragControls}
        onDrag={handleDragPanel}
        onDragEnd={() => (document.body.style.cursor = '')}
        onDragStart={(e, info) => {
          if ((e.target as any).dataset.element !== 'handle') {
            (dragControls as any).componentControls.forEach((entry: any) => {
              entry.stop(e, info);
            });
          }
        }}
        dragElastic={0.3}
        dragConstraints={{ top: active ? _getTotalY() : 0, bottom: active ? _getTotalY() : 0 }}
        className={styles.bottom}>
        {bottom}
      </motion.div>
    </div>
  );
};
