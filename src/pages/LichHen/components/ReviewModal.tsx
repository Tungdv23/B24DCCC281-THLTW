import React from 'react';
import { Modal, Form, Input, Rate } from 'antd';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onSave: (values: any) => void;
  editing?: any;
};

const ReviewModal: React.FC<Props> = ({ visible, onCancel, onSave }) => {
  const [form] = Form.useForm();
  const formNV = form;
  const hienThi = visible;
  const huy = onCancel;
  const luu = onSave;
  return (
    <Modal title="Gửi đánh giá" visible={hienThi} onOk={() => formNV.validateFields().then(luu)} onCancel={huy}>
      <Form form={formNV} layout="vertical">
        <Form.Item name="customerName" label="Tên khách"><Input/></Form.Item>
        <Form.Item name="rating" label="Đánh giá" rules={[{ required: true }]}><Rate/></Form.Item>
        <Form.Item name="comment" label="Nhận xét"><Input.TextArea rows={3} /></Form.Item>
      </Form>
    </Modal>
  );
};

export default ReviewModal;
