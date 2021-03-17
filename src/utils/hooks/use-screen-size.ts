import { useEffect, useState } from 'react';

import { screenL, screenM, screenS, screenXl, screenXs } from '../media-queries';

const ScreenSizes = {
  XS: 1,
  S: 2,
  M: 3,
  L: 4,
  XL: 5,
};

function _parseMaxWidth(mediaQuery: string) {
  // @ts-ignore
  const [, maxWidth] = mediaQuery.match(/max-width: (\d+)/);
  return parseInt(maxWidth);
}

function getScreenSize(): number {
  if (window.innerWidth <= _parseMaxWidth(screenXs)) {
    return 1;
  } else if (window.innerWidth <= _parseMaxWidth(screenS)) {
    return 2;
  } else if (window.innerWidth <= _parseMaxWidth(screenM)) {
    return 3;
  } else if (window.innerWidth <= _parseMaxWidth(screenL)) {
    return 4;
  } else if (window.innerWidth <= _parseMaxWidth(screenXl)) {
    return 5;
  }
  return window.innerWidth;
}

export function useScreenSize() {
  const [size, setSize] = useState(getScreenSize());

  useEffect(() => {
    const handleResize = () => {
      setSize(getScreenSize());
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { screenSize: size, ScreenSizes };
}
