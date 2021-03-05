import { grey } from '@ant-design/colors';
import { Layout, Space, Spin, Table, Typography } from 'antd';

import { useFetchStocks } from './utils';

export const App = () => {
  const { isLoading, stocks = [] } = useFetchStocks();
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
              dataSource={[...stocks]
                .sort((a, b) => b.stats.currentPrice - a.stats.currentPrice)
                .map((stock) => ({
                  name: stock.name,
                  ticker: stock.symbol,
                  price: stock.stats.currentPrice,
                  discount: '-30%',
                }))}
              columns={[
                {
                  title: 'Name',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: 'Ticker',
                  dataIndex: 'ticker',
                  key: 'ticker',
                },
                {
                  title: 'Price',
                  dataIndex: 'price',
                  key: 'price',
                },
                {
                  title: 'Discount',
                  dataIndex: 'discount',
                  key: 'discount',
                },
              ]}
            />
          </Spin>
        </div>
      </Layout.Content>
    </Layout>
  );
};
