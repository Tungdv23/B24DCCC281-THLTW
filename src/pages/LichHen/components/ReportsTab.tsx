import React from 'react';
import { Card, Row, Col, Statistic, Table } from 'antd';
import { ServiceStats } from '../data/models';

type Props = {
  totalAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  serviceStats: ServiceStats[];
};

const ReportsTab: React.FC<Props> = ({ totalAppointments, completedAppointments, totalRevenue, serviceStats }) => {
  // Vietnamese aliases
  const tongLich = totalAppointments;
  const daHoanThanh = completedAppointments;
  const tongDoanhThu = totalRevenue;
  const thongKeDichVu = serviceStats;

  return (
    <div>
      <Card>
        <Row gutter={16}>
          <Col span={8}><Statistic title="Tổng lịch" value={tongLich} /></Col>
          <Col span={8}><Statistic title="Đã hoàn thành" value={daHoanThanh} /></Col>
          <Col span={8}><Statistic title="Tổng doanh thu" value={tongDoanhThu} /></Col>
        </Row>
      </Card>
      <Card title="Thống kê theo dịch vụ" style={{ marginTop: 12 }}>
        <Table dataSource={thongKeDichVu} columns={[{ title: 'Dịch vụ', dataIndex: 'serviceName' }, { title: 'Số lượng', dataIndex: 'totalBookings' }, { title: 'Doanh thu', dataIndex: 'totalRevenue', render: (v: number) => `${v.toLocaleString()} VND` }, { title: 'Đánh giá', dataIndex: 'averageRating' }]} rowKey="serviceId" pagination={false} />
      </Card>
    </div>
  );
};

export default ReportsTab;
