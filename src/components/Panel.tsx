import { EllipsisOutlined } from '@ant-design/icons';
import { css } from '@emotion/css';
import { Col, Popover, Row } from 'antd';

import { Stock } from '../types';
import { Color, Size, getSectorColors, round } from '../utils';
import { Box } from './Box';
import { Discount } from './Discount';
import { Text } from './Text';

const styles = {
  panel: css`
    padding: ${Size.EXTRA_LARGE}px calc(${Size.EXTRA_LARGE}px + ${Size.MEDIUM}px);
    border-radius: ${Size.EXTRA_LARGE}px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    background: ${Color.white};
    width: 100%;
    height: 100%;
    overflow: auto;

    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* Internet Explorer 10+ */

    &::-webkit-scrollbar {
      /* WebKit */
      width: 0;
      height: 0;
    }
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
  table: css`
    display: table;
    width: 100%;
    border-collapse: separate;
    border-spacing: 0 ${Size.EXTRA_LARGE}px;
  `,
  row: css`
    display: table-row;
    width: 100%;
    padding-bottom: ${Size.LARGE}px;
    white-space: nowrap;
    transition: all 0.1s ease-in-out;

    &:hover {
      cursor: pointer;
      background: ${Color.grey[2]};
      box-shadow: 0px 0px 0px 10px ${Color.grey[2]};
      border-radius: ${Size.EXTRA_SMALL}px;
    }
  `,
  cell: css`
    display: table-cell;
    vertical-align: middle;
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
              }}
            >
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
              }}
            >
              <Text light>Fundamentals Score</Text>
            </Box>
          </div>
        </div>
      }
    >
      <EllipsisOutlined className={styles.moreIcon} style={{ fontSize: Size.LARGE }} />
    </Popover>
  );
};

interface PanelProps {
  stocks: Array<Stock>;
}

export const Panel = ({ stocks }: PanelProps) => {
  return (
    <div className={styles.panel}>
      <Row justify="end">
        <Col>
          <SortBy />
        </Col>
      </Row>
      <div className={styles.table}>
        {stocks.map((stock) => (
          <Row
            className={styles.row}
            gutter={Size.MEDIUM}
            key={stock.symbol}
            align="middle"
            justify="space-between"
          >
            <Col className={styles.cell}>
              <Text bold size={Size.LARGE}>
                {stock.symbol}
              </Text>
            </Col>
            <Col
              className={styles.cell}
              style={{
                maxWidth: 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              <Text color={Color.tertiary}>{stock.name}</Text>
            </Col>
            <Col className={styles.cell}>
              <Text color={getSectorColors(stock.profile.sector).default}>
                {stock.profile.sector}
              </Text>
            </Col>
            <Col className={styles.cell} style={{ textAlign: 'right' }}>
              <Text color={Color.tertiary}>
                Valued at &nbsp;<Text bold>${stock.fairPrice}</Text>
              </Text>
            </Col>
            <Col className={styles.cell} style={{ textAlign: 'right' }}>
              <Text bold size={Size.LARGE}>
                ${round(stock.stats.currentPrice)}
              </Text>
            </Col>
            <Col className={styles.cell}>
              <Box size={{ left: Size.SMALL }}>
                <Discount
                  amount={Math.round((1 - stock.stats.currentPrice / stock.fairPrice) * 100)}
                />
              </Box>
            </Col>
          </Row>
        ))}
      </div>
    </div>
  );
};
