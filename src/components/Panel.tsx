import { EllipsisOutlined } from '@ant-design/icons';
import { css, cx } from '@emotion/css';
import { Col, Popover, Row } from 'antd';
import { CSSProperties, Fragment, useRef } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { Stock } from '../types';
import { ANIMATION_CURVE, ANIMATION_TIME, Color, Size, getSectorColors, round } from '../utils';
import { Box } from './Box';
import { Discount } from './Discount';
import { Text } from './Text';

const styles = {
  panel: css`
    position: relative;
    /* padding: ${Size.EXTRA_LARGE}px calc(${Size.EXTRA_LARGE}px + ${Size.MEDIUM}px); */
    /* padding: ${Size.EXTRA_LARGE}px 0; */
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
    padding-bottom: ${Size.EXTRA_LARGE * 3}px;
  `,
  row: css`
    white-space: nowrap;
    transition: all 0.1s ease-in-out;
    width: calc(100% - ${Size.EXTRA_LARGE * 2}px);

    &:hover {
      cursor: pointer;
      background: ${Color.grey[2]};
      box-shadow: 0px 0px 0px 10px ${Color.grey[2]};
      border-radius: ${Size.EXTRA_SMALL}px;
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
  const scrollDelta = useRef<number>(0);
  const prevScrollOffset = useRef<number>();
  return (
    <Fragment>
      <div className={styles.dragIcon} data-element="handle" />
      <div className={cx(styles.panel, { [styles.hidden]: hidden })}>
        {/* <Row justify="end">
          <Col>
            <SortBy />
          </Col>
        </Row> */}
        <AutoSizer>
          {({ height, width }) => (
            <List
              useIsScrolling
              className={styles.table}
              height={height - (60 + Size.MEDIUM) * 4}
              itemCount={stocks.length}
              itemSize={60 + Size.MEDIUM * 2}
              onScroll={({ scrollOffset }) => {
                const delta =
                  prevScrollOffset.current == null
                    ? 0
                    : Math.abs(prevScrollOffset.current - scrollOffset);
                prevScrollOffset.current = scrollOffset;
                scrollDelta.current = delta;
              }}
              width={width}>
              {({
                index,
                style,
                isScrolling,
              }: {
                index: number;
                style: CSSProperties;
                isScrolling?: boolean;
              }) => {
                const stock = stocks[index];
                return (
                  <Row
                    style={{
                      ...style,
                      width: (style.width as number) - Size.EXTRA_LARGE,
                      left: (style.left as number) + Size.EXTRA_LARGE,
                      top: (style.top as number) + Size.EXTRA_LARGE * 2,
                      height: (style.height as number) - Size.LARGE,
                      marginLeft: 0,
                      marginRight: 0,
                    }}
                    onClick={() => onClickStock(stock)}
                    className={styles.row}
                    gutter={Size.MEDIUM}
                    key={stock.symbol}
                    align="middle"
                    justify="space-between">
                    {isScrolling && scrollDelta.current > 100 ? (
                      <Fragment>
                        <Col span={3}>
                          <Text bold size={Size.LARGE}>
                            {stock.symbol}
                          </Text>
                        </Col>
                        <Col span={21}>Loading</Col>
                      </Fragment>
                    ) : (
                      <Fragment>
                        <Col span={3}>
                          <Text bold size={Size.LARGE}>
                            {stock.symbol}
                          </Text>
                        </Col>
                        <Col
                          span={6}
                          style={{
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                            color: Color.tertiary,
                          }}>
                          <Text color={Color.tertiary}>{stock.name}</Text>
                        </Col>
                        <Col span={5}>
                          <Text color={getSectorColors(stock.profile.sector).default}>
                            {stock.profile.sector}
                          </Text>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                          <Text color={Color.tertiary}>
                            Valued at &nbsp;<Text bold>${stock.fairPrice}</Text>
                          </Text>
                        </Col>
                        <Col span={4} style={{ textAlign: 'right' }}>
                          <Text bold size={Size.LARGE}>
                            ${round(stock.stats.currentPrice)}
                          </Text>
                        </Col>
                        <Col span={2}>
                          <Discount
                            amount={Math.round(
                              (1 - stock.stats.currentPrice / stock.fairPrice) * 100,
                            )}
                          />
                        </Col>
                      </Fragment>
                    )}
                  </Row>
                );
              }}
            </List>
          )}
        </AutoSizer>
      </div>
    </Fragment>
  );
};
