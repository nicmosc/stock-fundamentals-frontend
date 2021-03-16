import { css } from '@emotion/css';
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
      {page === 1 ? (
        <ROI value={roi} onChange={onChangeRoi} onConfirm={() => setPage(2)} />
      ) : (
        <Margin value={margin} onChange={onChangeMargin} onConfirm={onClickClose} />
      )}
    </div>
  );
};
