import React from 'react';
import { Modal, Form, Input, InputNumber } from 'antd';
import { Service } from '../data/models';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  editing?: Service | null;
};

const ServiceModal: React.FC<Props> = ({ visible, onCancel, onSave, editing }) => {
  const [form] = Form.useForm();

  // Vietnamese aliases
  const formNV = form;
  const hienThi = visible;
  const huy = onCancel;
  const luu = onSave;
  const dangChinhSua = editing;

  React.useEffect(() => {
    if (dangChinhSua) formNV.setFieldsValue(dangChinhSua);
    else formNV.resetFields();
  }, [dangChinhSua]);

  return (
    <Modal title={dangChinhSua ? 'Sửa dịch vụ' : 'Thêm dịch vụ'} visible={hienThi} onOk={() => formNV.validateFields().then(luu)} onCancel={huy}>
      <Form form={formNV} layout="vertical">
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}><Input/></Form.Item>
        <Form.Item name="description" label="Mô tả"><Input.TextArea rows={3} /></Form.Item>
        <Form.Item name="price" label="Giá"><InputNumber min={0} /></Form.Item>
        <Form.Item name="duration" label="Thời lượng (phút)"><InputNumber min={10} /></Form.Item>
        <Form.Item name="category" label="Danh mục"><Input/></Form.Item>
      </Form>
    </Modal>
  );
};

export default ServiceModal;
