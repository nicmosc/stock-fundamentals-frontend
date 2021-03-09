import { CSSProperties, ReactNode } from 'react';

function _isObject(prop: number | Object): prop is BoxObject {
  return typeof prop !== 'number';
}

type BoxObject = {
  left?: number;
  right?: number;
  top?: number;
  bottom?: number;
};

interface BoxProps {
  children: ReactNode;
  size: number | BoxObject;
  inset?: boolean;
  style?: CSSProperties;
}

export const Box = ({ children, size, inset, style = {} }: BoxProps) => {
  const styles =
    inset === true
      ? {
          paddingRight: _isObject(size) ? size.right : size,
          paddingLeft: _isObject(size) ? size.left : size,
          paddingTop: _isObject(size) ? size.top : size,
          paddingBottom: _isObject(size) ? size.bottom : size,
        }
      : {
          marginRight: _isObject(size) ? size.right : size,
          marginLeft: _isObject(size) ? size.left : size,
          marginTop: _isObject(size) ? size.top : size,
          marginBottom: _isObject(size) ? size.bottom : size,
        };

  return <div style={{ ...styles, ...style }}>{children}</div>;
};
