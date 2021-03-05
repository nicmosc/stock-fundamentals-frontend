import { green, grey, red } from '@ant-design/colors';
import { Layout, PageHeader, Slider, Space, Spin, Table, Tag, Typography } from 'antd';
import { useState } from 'react';

import { computeRankScores, useFetchStocks } from './utils';

export const App = () => {
  const { isLoading, stocks = [] } = useFetchStocks();
  const [margin, setMargin] = useState<number>(50);
  const [roi, setRoi] = useState<number>(20);

  const safety = 1 - margin / 100;

  const computedStocks = computeRankScores(roi / 100, safety, stocks);
  const sortedStocks = [...computedStocks].sort((a, b) => a.name.localeCompare(b.name));
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
          <PageHeader ghost={false}>
            <div style={{ display: 'flex' }}>
              <div>
                <div>Margin of safety (%)</div>
                <Space direction="vertical" size="large">
                  <div style={{ width: 200 }}>
                    <Slider value={margin} onChange={setMargin} />
                  </div>
                </Space>
              </div>
              <div>
                <div>Desired rate of return (%)</div>
                <Space direction="vertical" size="large">
                  <div style={{ width: 200 }}>
                    <Slider value={roi} onChange={setRoi} />
                  </div>
                </Space>
              </div>
            </div>
          </PageHeader>
          <Spin spinning={isLoading}>
            <Table
              dataSource={sortedStocks.map((stock) => ({
                name: (
                  <Typography.Link
                    href={`https://finance.yahoo.com/quote/${stock.symbol}`}
                    target="_blank"
                  >
                    {stock.name} ({stock.symbol})
                  </Typography.Link>
                ),
                sector: stock.profile.sector,
                price: `$${stock.stats.currentPrice}`,
                fair: `$${stock.fairPrice}`,
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
                  title: 'Sector',
                  dataIndex: 'sector',
                },
                {
                  title: 'Current Price',
                  dataIndex: 'price',
                },
                {
                  title: 'Est. Fair Price',
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
