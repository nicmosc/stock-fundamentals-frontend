import { grey } from '@ant-design/colors';
import { Layout, Space, Table, Typography } from 'antd';

export const App = () => {
  const stockData: Array<{}> = [];
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
          <Table
            dataSource={stockData}
            columns={[
              {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
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
        </div>
      </Layout.Content>
    </Layout>
  );
};
