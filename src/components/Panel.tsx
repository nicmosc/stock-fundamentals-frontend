import { EllipsisOutlined } from '@ant-design/icons';
import { css, cx } from '@emotion/css';
import { Col, Popover, Row } from 'antd';
import { Fragment } from 'react';

import { Stock } from '../types';
import { ANIMATION_CURVE, ANIMATION_TIME, Color, Size, getSectorColors, round } from '../utils';
import { Box } from './Box';
import { Discount } from './Discount';
import { Text } from './Text';

const styles = {
  panel: css`
    position: relative;
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

    &::after {
      content: ' ';
      position: fixed;
      border-radius: ${Size.EXTRA_LARGE}px;
      border-bottom-right-radius: 0;
      border-bottom-left-radius: 0;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: ${Color.white};
      opacity: 0;
      pointer-events: none;
      z-index: 1;
      transition: all ${ANIMATION_TIME} ${ANIMATION_TIME} ${ANIMATION_CURVE};
    }
  `,
  hidden: css`
    pointer-events: none;

    &::after {
      opacity: 0.6;
      pointer-events: auto;
    }
  `,
  dragIcon: css`
    position: absolute;
    top: ${Size.MEDIUM}px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 5px;
    border-radius: 10px;
    background: ${Color.tertiary};
    z-index: 2;
    pointer-events: all !important;

    &::after {
      content: ' ';
      position: absolute;
      left: -20px;
      top: -20px;
      width: 120px;
      height: 45px;
    }

    &:hover {
      cursor: grab;
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

interface PanelProps {
  stocks: Array<Stock>;
  onClickStock: (stock: Stock) => void;
  hidden: boolean;
}

export const Panel = ({ stocks, onClickStock, hidden }: PanelProps) => {
  return (
    <Fragment>
      <div className={styles.dragIcon} data-element="handle" />
      <div className={cx(styles.panel, { [styles.hidden]: hidden })}>
        <Row justify="end">
          <Col>
            <SortBy />
          </Col>
        </Row>
        <div className={styles.table}>
          {stocks.map((stock) => (
            <Row
              onClick={() => onClickStock(stock)}
              className={styles.row}
              gutter={Size.MEDIUM}
              key={stock.symbol}
              align="middle"
              justify="space-between">
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
                  color: Color.tertiary,
                }}>
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
    </Fragment>
  );
};
