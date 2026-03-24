import React, { useState } from 'react';
import { Button, Modal, Form, Input, Select, Table, Space, DatePicker, message } from 'antd';
const { Option } = Select;

const DecisionsTab: React.FC<any> = ({ decisions, setDecisions, books, uid }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const createDecision = (vals: any) => {
    const d = { id: uid(), decisionNumber: vals.decisionNumber, issuedAt: vals.issuedAt?.valueOf?.() || Date.now(), summary: vals.summary || '', bookId: vals.bookId || null };
    setDecisions([...decisions, d]);
    setOpen(false);
    form.resetFields();
    message.success('Đã thêm quyết định');
  };

  const cols = [
    { title: 'Số QĐ', dataIndex: 'decisionNumber' },
    { title: 'Ngày ban hành', dataIndex: 'issuedAt', render: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
    { title: 'Trích yếu', dataIndex: 'summary' },
    { title: 'Sổ liên kết', dataIndex: 'bookId', render: (id: any) => books.find((b: any) => b.id === id)?.name || '' }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => setOpen(true)}>Thêm quyết định</Button>
      </Space>
      <Table rowKey="id" dataSource={decisions} columns={cols} pagination={false} />
      <Modal visible={open} title="Thêm quyết định" onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={createDecision} layout="vertical">
          <Form.Item name="decisionNumber" label="Số QĐ" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="issuedAt" label="Ngày ban hành"><DatePicker style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="bookId" label="Sổ liên kết"><Select allowClear>{books.map((b: any) => <Option key={b.id} value={b.id}>{b.name} ({b.year})</Option>)}</Select></Form.Item>
          <Form.Item name="summary" label="Trích yếu"><Input.TextArea rows={3} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DecisionsTab;
