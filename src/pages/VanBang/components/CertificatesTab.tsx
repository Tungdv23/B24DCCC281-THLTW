import React from 'react';
import { Button, Modal, Form, Input, Select, Table, Space, DatePicker, message } from 'antd';
const { Option } = Select;

const CertificatesTab: React.FC<any> = ({ certs, setCerts, books, setBooks, decisions, uid }) => {
  const [open, setOpen] = React.useState(false);
  const [form] = Form.useForm();

  const createCert = (vals: any) => {
    if (!vals.bookId) return message.error('Chọn sổ');
    const book = books.find((b: any) => b.id === vals.bookId);
    if (!book) return message.error('Sổ không tồn tại');
    const register = book.nextRegister;
    const newCert = { id: uid(), bookId: book.id, registerNumber: register, certificateNumber: vals.certificateNumber || `VB-${book.year}-${register}`, studentId: vals.studentId || '', fullName: vals.fullName || '', dob: vals.dob?.valueOf?.() || null, decisionId: vals.decisionId || null, createdAt: Date.now() };
    setCerts([...certs, newCert]);
    setBooks(books.map((b: any) => b.id === book.id ? { ...b, nextRegister: b.nextRegister + 1 } : b));
    setOpen(false);
    form.resetFields();
    message.success('Đã tạo thông tin văn bằng');
  };

  const cols = [
    { title: 'Số vào sổ', dataIndex: 'registerNumber', width: 120 },
    { title: 'Số hiệu văn bằng', dataIndex: 'certificateNumber' },
    { title: 'Mã SV', dataIndex: 'studentId' },
    { title: 'Họ tên', dataIndex: 'fullName' },
    { title: 'Ngày sinh', dataIndex: 'dob', render: (v: any) => v ? new Date(v).toLocaleDateString() : '' },
    { title: 'Quyết định', dataIndex: 'decisionId', render: (id: any) => decisions.find((d: any) => d.id === id)?.decisionNumber || '' }
  ];

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={() => setOpen(true)}>Thêm thông tin văn bằng</Button>
      </Space>
      <Table rowKey="id" dataSource={certs} columns={cols} pagination={{ pageSize: 10 }} />
      <Modal visible={open} title="Thêm văn bằng" onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={createCert}>
          <Form.Item name="bookId" label="Chọn sổ" rules={[{ required: true }]}><Select>{books.map((b: any) => <Option key={b.id} value={b.id}>{b.name} ({b.year})</Option>)}</Select></Form.Item>
          <Form.Item name="decisionId" label="Quyết định"><Select allowClear>{decisions.map((d: any) => <Option key={d.id} value={d.id}>{d.decisionNumber}</Option>)}</Select></Form.Item>
          <Form.Item name="certificateNumber" label="Số hiệu văn bằng"><Input/></Form.Item>
          <Form.Item name="studentId" label="Mã sinh viên"><Input/></Form.Item>
          <Form.Item name="fullName" label="Họ tên"><Input/></Form.Item>
          <Form.Item name="dob" label="Ngày sinh"><DatePicker style={{ width: '100%' }} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CertificatesTab;
