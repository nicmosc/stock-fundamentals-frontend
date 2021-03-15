import { css } from '@emotion/css';
import { useState } from 'react';

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

export const Settings = ({ roi, onChangeRoi, onClickClose }: SettingsProps) => {
  const [page] = useState(1);
  return (
    <div className={styles.settings}>
      {page === 1 ? <ROI value={roi} onChange={onChangeRoi} onConfirm={onClickClose} /> : null}
    </div>
  );
};
