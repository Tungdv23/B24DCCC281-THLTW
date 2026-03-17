import React from 'react';
import { Button, Table, Row, Col, Space, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { Appointment, Service, Staff } from '../data/models';

type Props = {
  appointments: Appointment[];
  services: Service[];
  staff: Staff[];
  onCreate: () => void;
  onChangeStatus: (id: string, status: Appointment['status']) => void;
  onDelete: (id: string) => void;
  onOpenReview: (a: Appointment) => void;
  getServiceName: (id: string) => string;
  getStaffName: (id: string) => string;
};

const AppointmentsTab: React.FC<Props> = ({ appointments, onCreate, onChangeStatus, onDelete, onOpenReview, getServiceName, getStaffName }) => {
  // Vietnamese local aliases
  const danhSachLichHen = appointments;
  const tao = onCreate;
  const thayDoiTrangThai = onChangeStatus;
  const xoa = onDelete;
  const moDanhGia = onOpenReview;
  const layTenDichVu = getServiceName;
  const layTenNhanVien = getStaffName;

  const columns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Dịch vụ', key: 'service', render: (_: any, r: Appointment) => layTenDichVu(r.serviceId) || '-' },
    { title: 'Nhân viên', key: 'staff', render: (_: any, r: Appointment) => layTenNhanVien(r.staffId) || '-' },
    { title: 'Ngày', dataIndex: 'appointmentDate', key: 'appointmentDate' },
    { title: 'Giờ', dataIndex: 'appointmentTime', key: 'appointmentTime' },
    { title: 'Trạng thái', key: 'status', render: (_: any, r: Appointment) => <Tag>{r.status}</Tag> },
    { title: 'Hành động', key: 'actions', render: (_: any, r: Appointment) => (
      <Space>
        {r.status === 'pending' && <Button size="small" onClick={() => thayDoiTrangThai(r.id, 'confirmed')}>Xác nhận</Button>}
        {r.status !== 'completed' && r.status !== 'cancelled' && <Button size="small" onClick={() => thayDoiTrangThai(r.id, 'completed')}>Hoàn thành</Button>}
        {r.status !== 'cancelled' && <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={() => thayDoiTrangThai(r.id, 'cancelled')}><Button size="small">Hủy</Button></Popconfirm>}
        <Button size="small" onClick={() => moDanhGia(r)}>Đánh giá</Button>
        <Popconfirm title="Xóa lịch này?" onConfirm={() => xoa(r.id)}><Button danger size="small">Xóa</Button></Popconfirm>
      </Space>
    ) },
  ];

  return (
    <div>
      <Row style={{ marginBottom: 12 }}>
        <Col><Button type="primary" icon={<PlusOutlined/>} onClick={tao}>Đặt lịch</Button></Col>
      </Row>
      <Table rowKey="id" dataSource={danhSachLichHen} columns={columns} />
    </div>
  );
};

export default AppointmentsTab;
