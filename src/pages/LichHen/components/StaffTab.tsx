import React from 'react';
import { Button, Table, Row, Col, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Staff, Service } from '../data/models';

type Props = {
  staff: Staff[];
  services: Service[];
  onAdd: () => void;
  onEdit: (s: Staff) => void;
  onDelete: (id: string) => void;
  getServiceName: (id: string) => string;
};

const StaffTab: React.FC<Props> = ({ staff, services, onAdd, onEdit, onDelete, getServiceName }) => {
  const danhSachNhanVien = staff;
  const danhSachDichVu = services;
  const them = onAdd;
  const sua = onEdit;
  const xoa = onDelete;
  const layTenDichVu = getServiceName;

  const columns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Dịch vụ', key: 'services', render: (_: any, r: Staff) => r.serviceIds.map(id => layTenDichVu(id)).filter(Boolean).join(', ') },
    { title: 'Giới hạn/ngày', dataIndex: 'maxCustomersPerDay', key: 'limit' },
    { title: 'Hành động', key: 'actions', render: (_: any, r: Staff) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => sua(r)}>Sửa</Button>
        <Popconfirm title="Xóa nhân viên?" onConfirm={() => xoa(r.id)}><Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button></Popconfirm>
      </Space>
    ) },
  ];

  return (
    <div>
      <Row style={{ marginBottom: 12 }}>
        <Col><Button type="primary" onClick={them}>Thêm nhân viên</Button></Col>
      </Row>
      <Table rowKey="id" dataSource={danhSachNhanVien} columns={columns} />
    </div>
  );
};

export default StaffTab;
