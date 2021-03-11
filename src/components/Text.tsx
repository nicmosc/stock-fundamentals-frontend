import { Typography } from 'antd';
import { ReactNode } from 'react';

import { Color, Size } from '../utils';

interface TextProps {
  children: ReactNode;
  size?: Size;
  color?: string;
  bold?: boolean;
  light?: boolean;
}

export const Text = ({
  size = Size.MEDIUM,
  children,
  color = Color.primary,
  bold,
  light,
}: TextProps) => {
  return (
    <Typography.Text style={{ fontSize: size, color, fontWeight: bold ? 800 : light ? 600 : 700 }}>
      {children}
    </Typography.Text>
  );
};
