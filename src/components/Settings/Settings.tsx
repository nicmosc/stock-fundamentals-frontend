import { css } from '@emotion/css';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

import { Margin } from './Margin';
import { ROI } from './ROI';

const styles = {
  settings: css`
    height: 100%;
    width: 100%;
  `,
};

interface SettingsProps {
  roi: number;
  onChangeRoi: (roi: number) => void;
  margin: number;
  onChangeMargin: (margin: number) => void;
  onClickClose: VoidFunction;
}

export const Settings = ({
  roi,
  onChangeRoi,
  margin,
  onChangeMargin,
  onClickClose,
}: SettingsProps) => {
  const [page, setPage] = useState(1);
  return (
    <div className={styles.settings}>
      <AnimatePresence exitBeforeEnter>
        {page === 1 ? (
          <motion.div
            key="roi"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}>
            <ROI value={roi} onChange={onChangeRoi} onConfirm={() => setPage(2)} />
          </motion.div>
        ) : (
          <motion.div
            key="margin"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}>
            <Margin
              value={margin}
              onChange={onChangeMargin}
              onConfirm={() => {
                onClickClose();
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
