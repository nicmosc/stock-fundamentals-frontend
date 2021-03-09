import { Typography } from 'antd';
import { ReactNode } from 'react';

import { Color, Size } from '../utils';

interface TextProps {
  children: ReactNode;
  size?: Size;
  color?: string;
}

export const Text = ({ size = Size.MEDIUM, children, color = Color.primary }: TextProps) => {
  return <Typography.Text style={{ fontSize: size, color }}>{children}</Typography.Text>;
};
