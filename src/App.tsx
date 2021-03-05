import { green, grey, red } from '@ant-design/colors';
import { Layout, Space, Spin, Table, Tag, Typography } from 'antd';

import { computeRankScores, useFetchStocks } from './utils';

export const App = () => {
  const { isLoading, stocks = [] } = useFetchStocks();
  const computedStocks = computeRankScores(0.2, 0.5, stocks);
  const sortedStocks = [...computedStocks].sort((a, b) => a.discountScore - b.discountScore);
  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header>
        <Space align="center" style={{ height: '100%' }}>
          <Typography.Title level={2} style={{ color: grey[0], marginBottom: 0 }}>
            The Stock depot
          </Typography.Title>
        </Space>
      </Layout.Header>
      <Layout.Content>
        <div style={{ height: '100%', margin: 20 }}>
          <Spin spinning={isLoading}>
            <Table
              dataSource={sortedStocks.map((stock) => ({
                name: stock.name,
                ticker: stock.symbol,
                price: stock.stats.currentPrice,
                fair: stock.fairPrice,
                discount: String(
                  Math.round((1 - stock.stats.currentPrice / stock.fairPrice) * 100),
                ),
              }))}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                },
                {
                  title: 'Ticker',
                  dataIndex: 'ticker',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                },
                {
                  title: 'Fair',
                  dataIndex: 'fair',
                },
                {
                  title: 'Discount',
                  dataIndex: 'discount',
                  render: (discount) =>
                    discount <= 0 ? (
                      <Tag color={red.primary}>No discount</Tag>
                    ) : (
                      <Tag color={green.primary}>{`-${discount}%`}</Tag>
                    ),
                },
              ]}
            />
          </Spin>
        </div>
      </Layout.Content>
    </Layout>
  );
};
