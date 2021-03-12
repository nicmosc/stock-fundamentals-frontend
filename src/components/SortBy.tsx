import { EllipsisOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Popover } from 'antd';

import { Color, Size } from '../utils';
import { Box } from './Box';
import { Text } from './Text';

const styles = {
  moreIcon: css`
    color: ${Color.tertiary};

    path {
      stroke: ${Color.tertiary};
      stroke-width: 70;
    }

    &:hover {
      cursor: pointer;
      color: ${Color.secondary};

      path {
        stroke: ${Color.secondary};
      }
    }
  `,
  option: css`
    border-radius: ${Size.EXTRA_SMALL}px;

    &:hover {
      cursor: pointer;
      background: ${Color.grey[2]};
    }
  `,
};

export const SortBy = () => {
  return (
    <Popover
      placement="bottomRight"
      arrowPointAtCenter
      trigger="click"
      overlayInnerStyle={{
        color: Color.primary,
        padding: 0,
        borderRadius: Size.SMALL,
      }}
      content={
        <div>
          <Box size={{ bottom: Size.SMALL, left: Size.MEDIUM, right: Size.MEDIUM }}>
            <Text color={Color.secondary}>Sort by</Text>
          </Box>
          <div className={styles.option}>
            <Box
              inset
              size={{
                right: Size.MEDIUM,
                left: Size.MEDIUM,
                bottom: Size.EXTRA_SMALL,
                top: Size.EXTRA_SMALL,
              }}>
              <Text light>Alphabetical Order</Text>
            </Box>
          </div>
          <div className={styles.option}>
            <Box
              inset
              size={{
                right: Size.MEDIUM,
                left: Size.MEDIUM,
                bottom: Size.EXTRA_SMALL,
                top: Size.EXTRA_SMALL,
              }}>
              <Text light>Largest disconut</Text>
            </Box>
          </div>
          <div className={styles.option}>
            <Box
              inset
              size={{
                right: Size.MEDIUM,
                left: Size.MEDIUM,
                bottom: Size.EXTRA_SMALL,
                top: Size.EXTRA_SMALL,
              }}>
              <Text light>Fundamentals Score</Text>
            </Box>
          </div>
        </div>
      }>
      <EllipsisOutlined className={styles.moreIcon} style={{ fontSize: Size.LARGE }} />
    </Popover>
  );
};
