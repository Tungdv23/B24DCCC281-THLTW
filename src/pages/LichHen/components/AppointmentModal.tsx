import React from 'react';
import { Modal, Form, Input, Select, DatePicker, TimePicker } from 'antd';
import { Service, Staff } from '../data/models';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  services: Service[];
  staff: Staff[];
  editing?: any;
};

const AppointmentModal: React.FC<Props> = ({ visible, onCancel, onSave, services, staff }) => {
  const [form] = Form.useForm();

  // Vietnamese aliases
  const formNV = form;
  const hienThi = visible;
  const huy = onCancel;
  const luu = onSave;
  const danhSachDichVu = services;
  const danhSachNhanVien = staff;

  return (
    <Modal title="Đặt lịch mới" visible={hienThi} onOk={() => formNV.validateFields().then(luu)} onCancel={huy}>
      <Form form={formNV} layout="vertical">
        <Form.Item name="customerName" label="Tên khách" rules={[{ required: true }]}><Input/></Form.Item>
        <Form.Item name="customerPhone" label="Số điện thoại" rules={[{ required: true }]}><Input/></Form.Item>
        <Form.Item name="serviceId" label="Dịch vụ" rules={[{ required: true }] }>
          <Select>{danhSachDichVu.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select>
        </Form.Item>
        <Form.Item name="staffId" label="Nhân viên" rules={[{ required: true }]}>
          <Select>{danhSachNhanVien.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select>
        </Form.Item>
        <Form.Item name="date" label="Ngày" rules={[{ required: true }]}><DatePicker/></Form.Item>
        <Form.Item name="time" label="Giờ" rules={[{ required: true }]}><TimePicker format={'HH:mm'} minuteStep={30} /></Form.Item>
        <Form.Item name="notes" label="Ghi chú"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  );
};

export default AppointmentModal;
