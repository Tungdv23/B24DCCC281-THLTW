import React from 'react';
import { Modal, Form, Input, Select, InputNumber } from 'antd';
import { Staff, Service, defaultWorkSchedule } from '../data/models';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  editing?: Staff | null;
  services: Service[];
};

const StaffModal: React.FC<Props> = ({ visible, onCancel, onSave, editing, services }) => {
  const [form] = Form.useForm();


  const formNV = form;
  const hienThi = visible;
  const huy = onCancel;
  const luu = onSave;
  const nhanVienDangChinhSua = editing;
  const danhSachDichVu = services;

  React.useEffect(() => {
    if (nhanVienDangChinhSua) formNV.setFieldsValue(nhanVienDangChinhSua);
    else { formNV.resetFields(); formNV.setFieldsValue({ workSchedule: defaultWorkSchedule }); }
  }, [nhanVienDangChinhSua]);

  return (
    <Modal title={nhanVienDangChinhSua ? 'Sửa nhân viên' : 'Thêm nhân viên'} visible={hienThi} onOk={() => formNV.validateFields().then(luu)} onCancel={huy}>
      <Form form={formNV} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input /></Form.Item>
        <Form.Item name="phone" label="SĐT"><Input /></Form.Item>
        <Form.Item name="email" label="Email"><Input /></Form.Item>
        <Form.Item name="serviceIds" label="Dịch vụ"><Select mode="multiple">{danhSachDichVu.map(s => <Select.Option key={s.id} value={s.id}>{s.name}</Select.Option>)}</Select></Form.Item>
        <Form.Item name="maxCustomersPerDay" label="Giới hạn/ngày"><InputNumber min={1} /></Form.Item>
      </Form>
    </Modal>
  );
};

export default StaffModal;
