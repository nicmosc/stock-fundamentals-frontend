import { css, cx } from '@emotion/css';

import { Color, Size } from '../utils';
import { Text } from './Text';

const styles = {
  discount: css`
    position: relative;
    width: 66px;
    height: 36px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${Size.SMALL}px;
    text-align: center;
    background: linear-gradient(
      73deg,
      ${Color.lime.primary},
      15.54%,
      ${Color.green.primary} 69.69%
    );
    box-shadow: 0px 4px 8px rgba(82, 196, 26, 0.4);
    z-index: 1;

    &::before {
      content: ' ';
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      height: 20px;
      filter: blur(30px);
      opacity: 0.7;
      background: ${Color.green.primary};
      z-index: 0;
    }
  `,
  red: css`
    background: linear-gradient(
      73deg,
      ${Color.volcano.primary},
      15.54%,
      ${Color.red.primary} 69.69%
    );
    box-shadow: 0px 4px 8px rgba(245, 34, 45, 0.4);

    &::before {
      background: ${Color.red.primary};
    }
  `,
};

interface DiscountProps {
  amount: number;
}

export const Discount = ({ amount }: DiscountProps) => {
  return (
    <div className={cx(styles.discount, { [styles.red]: amount < 0 })}>
      <Text bold size={amount < 0 ? 10 : 18} color={Color.white}>
        {amount < 0 ? 'No discount' : `-${amount}%`}
      </Text>
    </div>
  );
};
