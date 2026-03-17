import React from 'react';
import { Button, Table, Row, Col, Space, Popconfirm } from 'antd';
import { Service } from '../data/models';

type Props = {
  services: Service[];
  onAdd: () => void;
  onEdit: (s: Service) => void;
  onDelete: (id: string) => void;
};

const ServicesTab: React.FC<Props> = ({ services, onAdd, onEdit, onDelete }) => {
  // Vietnamese local aliases
  const danhSachDichVu = services;
  const them = onAdd;
  const sua = onEdit;
  const xoa = onDelete;

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (p: number) => `${p.toLocaleString()} VND` },
    { title: 'Thời lượng', dataIndex: 'duration', key: 'duration', render: (d: number) => `${d} phút` },
    { title: 'Hành động', key: 'actions', render: (_: any, r: Service) => (
      <Space>
        <Button size="small" onClick={() => sua(r)}>Sửa</Button>
        <Popconfirm title="Xóa dịch vụ?" onConfirm={() => xoa(r.id)}><Button danger size="small">Xóa</Button></Popconfirm>
      </Space>
    ) },
  ];

  return (
    <div>
      <Row style={{ marginBottom: 12 }}>
        <Col><Button type="primary" onClick={them}>Thêm dịch vụ</Button></Col>
      </Row>
      <Table rowKey="id" dataSource={danhSachDichVu} columns={columns} />
    </div>
  );
};

export default ServicesTab;
