import React, { useState } from 'react';
import { Button, Modal, Form, Input, Table, Space, message } from 'antd';

const BooksTab: React.FC<any> = ({ books, setBooks, uid }) => {
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const createBook = (vals: any) => {
    const b = { id: uid(), name: vals.name || `Sổ ${vals.year}`, year: vals.year, nextRegister: 1, createdAt: Date.now() };
    setBooks([...books, b]);
    setOpen(false);
    form.resetFields();
    message.success('Đã tạo sổ');
  };

  const cols = [
    { title: 'Tên sổ', dataIndex: 'name' },
    { title: 'Năm', dataIndex: 'year', width: 100 },
    { title: 'Số tiếp theo', dataIndex: 'nextRegister', width: 120 },
    { title: 'Hành động', render: (r: any) => (<Button onClick={() => { const next = prompt('Ghi số bắt đầu cho sổ này', String(r.nextRegister)); if (next) { const n = Number(next); setBooks(books.map((b: any) => b.id === r.id ? { ...b, nextRegister: n } : b)); } }}>Chỉnh</Button>) }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => setOpen(true)}>Tạo sổ mới</Button>
      </Space>
      <Table rowKey="id" dataSource={books} columns={cols} pagination={false} />
      <Modal visible={open} title="Tạo sổ" onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} onFinish={createBook} layout="vertical">
          <Form.Item name="year" label="Năm" rules={[{ required: true }]}><Input placeholder="Ví dụ 2026" /></Form.Item>
          <Form.Item name="name" label="Tên sổ"><Input placeholder="Tên (tuỳ chọn)" /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BooksTab;
