import React from 'react';
import moment from 'moment';
import { Modal, Form, Input, DatePicker, Select } from 'antd';

const { TextArea } = Input;

export default function TaskForm({ visible, onCancel, onSubmit, initialValues }: any) {
  const [form] = Form.useForm();

  React.useEffect(() => {
    if (visible) form.setFieldsValue({ ...initialValues, deadline: initialValues?.deadline ? moment(initialValues.deadline) : null });
    else form.resetFields();
  }, [visible]);

  return (
    <Modal visible={visible} title={initialValues ? 'Chỉnh sửa Task' : 'Thêm Task'} onCancel={onCancel} onOk={() => { form.validateFields().then(values => { const payload = { ...values, deadline: values.deadline ? values.deadline.toISOString() : undefined, tags: values.tags ? values.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [] }; onSubmit(payload); }); }}>
      <Form form={form} layout="vertical">
        <Form.Item name="title" label="Tên" rules={[{ required: true, message: 'Hãy nhập tên task' }]}>
          <Input />
        </Form.Item>
        <Form.Item name="description" label="Mô tả">
          <TextArea rows={3} />
        </Form.Item>
        <Form.Item name="deadline" label="Deadline">
          <DatePicker showTime />
        </Form.Item>
        <Form.Item name="priority" label="Ưu tiên" initialValue="Trung bình">
          <Select>
            <Select.Option value="Cao">Cao</Select.Option>
            <Select.Option value="Trung bình">Trung bình</Select.Option>
            <Select.Option value="Thấp">Thấp</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item name="tags" label="Tags (phân tách bởi dấu phẩy)">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
