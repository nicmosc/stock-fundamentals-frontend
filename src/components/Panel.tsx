import { EllipsisOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Col, Popover, Row } from 'antd';

import { Color, Size } from '../utils';
import { Box } from './Box';
import { Text } from './Text';

const styles = {
  panel: css`
    padding: ${Size.MEDIUM}px;
    border-radius: ${Size.EXTRA_LARGE}px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background: ${Color.white};
    width: 100%;
    height: 100%;
  `,
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

const SortBy = () => {
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
              }}
            >
              <Text>Alphabetical Order</Text>
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
              }}
            >
              <Text>Largest disconut</Text>
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
              }}
            >
              <Text>Fundamentals Score</Text>
            </Box>
          </div>
        </div>
      }
    >
      <EllipsisOutlined className={styles.moreIcon} style={{ fontSize: Size.LARGE }} />
    </Popover>
  );
};

export const Panel = () => {
  return (
    <div className={styles.panel}>
      <Row justify="end">
        <Col>
          <Box size={{ right: Size.MEDIUM, top: Size.SMALL }}>
            <SortBy />
          </Box>
        </Col>
      </Row>
    </div>
  );
};
