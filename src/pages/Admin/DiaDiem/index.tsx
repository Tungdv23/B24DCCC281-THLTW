import React, { useEffect, useState } from 'react';
import { Card, List, Button, Modal, Form, Input, InputNumber, message, Upload, Popconfirm, Rate, Image, Row, Col } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { mockData } from '@/pages/TrangChu/components/Destinations';

const STORAGE_KEY = 'admin_destinations_v1';

const load = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) return JSON.parse(raw);
  // copy from mockData as initial
  return mockData;
};

const save = (list: any[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

const AdminDiaDiem: React.FC = () => {
  const [list, setList] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formKey, setFormKey] = useState<string>('form-0');

  useEffect(() => setList(load()), []);

  const onAdd = () => {
    setEditing(null);
    setPreview(null);
    setFormKey(`new-${Date.now()}`);
    setOpen(true);
  };

  const onEdit = (item: any) => {
    setEditing(item);
    setOpen(true);
    // set preview and form values after modal mounts (handled in effect below)
    setPreview(item.image || null);
  };
  React.useEffect(() => {
    if (editing) setFormKey(`edit-${editing.id}-${Date.now()}`);
  }, [editing]);

  const onDelete = (id: number) => {
    const newList = list.filter(i => i.id !== id);
    setList(newList);
    save(newList);
    message.success('Đã xóa');
  };

  const onFinish = (values: any) => {
    const payload = { ...values };
    // ensure nested fields
    payload.costBreakdown = values.costBreakdown || { food: 0, transport: 0, lodging: 0 };
    payload.coords = values.coords || { lat: null, lng: null };
    payload.rating = values.rating || 0;
    payload.image = preview || values.image || null;

    let newList = [...list];
    if (editing) {
      newList = newList.map(i => (i.id === editing.id ? { ...i, ...payload } : i));
      message.success('Đã cập nhật');
    } else {
      const newItem = { id: Date.now(), ...payload };
      newList.unshift(newItem);
      message.success('Đã thêm');
    }
    setList(newList);
    save(newList);
    setOpen(false);
    setPreview(null);
  };

  const getBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = error => reject(error);
  });

  const beforeUpload = async (file: File) => {
    try {
      const data = await getBase64(file);
      setPreview(data);
      // don't upload to server; prevent default upload
    } catch (e) {
      message.error('Không thể đọc file');
    }
    return false;
  };

  // export/import removed per request

  return (
    <div>
      <Card title="Quản lý điểm đến" extra={
        <Button onClick={onAdd}>Thêm</Button>
      }>
        <List
          dataSource={list}
          renderItem={(item: any) => (
            <List.Item actions={[
              <Button key="e" onClick={() => onEdit(item)}>Sửa</Button>,
              <Popconfirm key="d" title="Xóa điểm này?" onConfirm={() => onDelete(item.id)}>
                <Button danger>Xóa</Button>
              </Popconfirm>
            ]}>
              <List.Item.Meta
                avatar={item.image ? <Image src={item.image} width={80} /> : undefined}
                title={item.title}
                description={`${item.location || ''} — ${item.type || ''} — ${item.price || 0}k`}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal open={open} onCancel={() => { setOpen(false); setPreview(null); setEditing(null); }} footer={null} title={editing ? 'Sửa điểm' : 'Thêm điểm'}>
        <Form layout="vertical" key={formKey} initialValues={editing || {}} onFinish={onFinish}>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item name="title" label="Tên" rules={[{ required: true }]}>
                <Input />
              </Form.Item>

              <Form.Item name="location" label="Địa điểm">
                <Input />
              </Form.Item>

              <Form.Item name="type" label="Loại">
                <Input />
              </Form.Item>

              <Form.Item name="price" label="Giá">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name={["costBreakdown", "food"]} label="Chi phí - ăn uống">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name={["costBreakdown", "transport"]} label="Chi phí - di chuyển">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name={["costBreakdown", "lodging"]} label="Chi phí - lưu trú">
                <InputNumber min={0} style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name={["coords", "lat"]} label="Toạ độ lat">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
              <Form.Item name={["coords", "lng"]} label="Toạ độ lng">
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>

              <Form.Item name="rating" label="Đánh giá">
                <Rate />
              </Form.Item>

              <Form.Item name="description" label="Mô tả">
                <Input.TextArea rows={3} />
              </Form.Item>

            </Col>
            <Col span={8}>
              <div style={{ textAlign: 'center' }}>
                {preview ? <Image src={preview} alt="preview" style={{ maxWidth: '100%', marginBottom: 8 }} /> : <div style={{ height: 150, background: '#fafafa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Chưa có ảnh</div>}
                <Upload beforeUpload={beforeUpload} showUploadList={false} accept="image/*">
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </div>
            </Col>
          </Row>

          <Form.Item>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => { setOpen(false); setPreview(null); setEditing(null); }}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDiaDiem;
