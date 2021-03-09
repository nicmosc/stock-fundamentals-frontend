import { Typography } from 'antd';
import { ReactNode } from 'react';

import { colors } from '../utils';

interface TitleProps {
  level: 1 | 2 | 3 | 4 | 5;
  children: ReactNode;
  align?: 'center';
  inversed?: boolean;
}

export const Title = ({ level, children, align, inversed = true }: TitleProps) => {
  return (
    <Typography.Title
      level={level}
      style={{
        color: inversed ? colors.grey[0] : colors.grey[9],
        fontWeight: 500,
        textAlign: align,
      }}
    >
      {children}
    </Typography.Title>
  );
};
