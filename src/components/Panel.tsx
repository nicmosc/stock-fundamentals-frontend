import { css, cx } from '@emotion/css';
import { Col, Empty, Row } from 'antd';
import { CSSProperties, Fragment, useRef, useState } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList as List } from 'react-window';

import { Stock } from '../types';
import {
  ANIMATION_CURVE,
  ANIMATION_TIME,
  Color,
  Size,
  ValueOf,
  getSectorColors,
  round,
  screenM,
  useScreenSize,
} from '../utils';
import { Box } from './Box';
import { Discount } from './Discount';
import { SortBy, SortByEnum } from './SortBy';
import { Text } from './Text';

const styles = {
  panel: css`
    position: relative;
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

  table: css`
    padding-bottom: ${Size.EXTRA_LARGE * 3}px;

    @media ${screenM} {
      padding-bottom: 0px;
    }
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

    @media ${screenM} {
      width: calc(100% - ${Size.MEDIUM * 2}px);
    }
  `,
  loader: css`
    height: 40px;
    width: 100%;
    border-radius: ${Size.SMALL}px;
    background: ${Color.grey[2]};
  `,
  sortBy: css`
    position: absolute;
    top: ${Size.LARGE}px;
    right: ${Size.EXTRA_LARGE}px;
    z-index: 9;
  `,
};

interface PanelProps {
  stocks: Array<Stock>;
  onClickStock: (stock: Stock) => void;
  hidden: boolean;
  onChangeSort: (sort: ValueOf<typeof SortByEnum>) => void;
}

export const Panel = ({ stocks, onClickStock, hidden, onChangeSort }: PanelProps) => {
  const prevScrollOffset = useRef<number>(0);
  const timeout = useRef<NodeJS.Timeout>();
  const showLoading = useRef(false);
  const [showSortBy, setShowSortBy] = useState(true);
  const { screenSize, ScreenSizes } = useScreenSize();

  const handleScroll = ({ scrollOffset }: { scrollOffset: number }) => {
    if (timeout.current != null) {
      clearTimeout(timeout.current);
    }

    if (scrollOffset > 50 && showSortBy) {
      setShowSortBy(false);
    } else if (scrollOffset < 50 && !showSortBy) {
      setShowSortBy(true);
    }

    const delta = Math.abs(prevScrollOffset.current - scrollOffset);
    prevScrollOffset.current = scrollOffset;
    if (delta > 400) {
      showLoading.current = true;
    }

    timeout.current = setTimeout(function () {
      showLoading.current = false;
    }, 500);
  };

  const isMobile = screenSize <= ScreenSizes.M;
  const rowHeight = isMobile ? 90 : 60;

  return (
    <Fragment>
      <div className={styles.dragIcon} data-element="handle" />
      {showSortBy ? (
        <div className={styles.sortBy}>
          <SortBy onChange={onChangeSort} />
        </div>
      ) : null}
      <div className={cx(styles.panel, { [styles.hidden]: hidden })}>
        {stocks.length === 0 ? (
          <Box
            size={{ top: Size.LARGE }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '50%',
              width: '100%',
            }}>
            <Empty
              description={
                <Text color={Color.secondary} light>
                  No stocks match your profile
                </Text>
              }
            />
          </Box>
        ) : (
          <AutoSizer>
            {({ height, width }) => (
              <List
                useIsScrolling
                className={styles.table}
                height={height - (rowHeight + Size.MEDIUM) * (isMobile ? 3 : 4)}
                itemCount={stocks.length}
                itemSize={rowHeight + Size.MEDIUM * 2}
                onScroll={handleScroll}
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
                        width:
                          (style.width as number) - (isMobile ? Size.MEDIUM : Size.EXTRA_LARGE),
                        left: (style.left as number) + (isMobile ? Size.MEDIUM : Size.EXTRA_LARGE),
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
                      {isScrolling && showLoading.current ? (
                        <Fragment>
                          <Col span={isMobile ? 7 : 3}>
                            <Text bold size={Size.LARGE}>
                              {stock.symbol}
                            </Text>
                          </Col>
                          <Col span={isMobile ? 17 : 21}>
                            <div className={styles.loader} />
                          </Col>
                        </Fragment>
                      ) : (
                        <Fragment>
                          {isMobile ? (
                            <Col
                              span={24}
                              style={{
                                color: Color.tertiary,
                              }}>
                              <Text color={Color.tertiary}>{stock.name}</Text>
                            </Col>
                          ) : null}
                          <Col span={isMobile ? 8 : 3}>
                            <Text bold size={Size.LARGE}>
                              {stock.symbol}
                            </Text>
                          </Col>
                          {!isMobile ? (
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
                          ) : null}
                          {!isMobile ? (
                            <Col span={isMobile ? 24 : 5}>
                              <Text color={getSectorColors(stock.profile.sector).default}>
                                {stock.profile.sector}
                              </Text>
                            </Col>
                          ) : null}
                          {!isMobile ? (
                            <Col span={4} style={{ textAlign: 'right' }}>
                              <Text color={Color.tertiary}>
                                Valued at &nbsp;<Text bold>${stock.fairPrice}</Text>
                              </Text>
                            </Col>
                          ) : null}
                          <Col span={isMobile ? 6 : 4} style={{ textAlign: 'right' }}>
                            <Text bold size={Size.LARGE}>
                              ${round(stock.stats.currentPrice)}
                            </Text>
                          </Col>
                          <Col span={isMobile ? undefined : 2}>
                            <Discount
                              amount={Math.round(
                                (1 - stock.stats.currentPrice / stock.fairPrice) * 100,
                              )}
                            />
                          </Col>
                          {isMobile ? (
                            <Col
                              span={24}
                              style={{
                                color: Color.tertiary,
                              }}>
                              <Text color={getSectorColors(stock.profile.sector).default}>
                                {stock.profile.sector}
                              </Text>
                            </Col>
                          ) : null}
                        </Fragment>
                      )}
                    </Row>
                  );
                }}
              </List>
            )}
          </AutoSizer>
        )}
      </div>
    </Fragment>
  );
};
