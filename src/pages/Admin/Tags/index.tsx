import React, { useEffect, useState } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Popconfirm } from 'antd';
import { getTags, createTag, updateTag, deleteTag } from '@/services/tintuc';

const AdminTags: React.FC = () => {
  const [list, setList] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [formKey, setFormKey] = useState('form-0');

  const load = async () => {
    const t = await getTags();
    setList(t);
  };

  useEffect(() => { load(); }, []);

  const onAdd = () => { setEditing(null); setFormKey(`new-${Date.now()}`); setOpen(true); };
  const onEdit = (t: string) => { setEditing(t); setFormKey(`edit-${t}-${Date.now()}`); setOpen(true); };

  const onDelete = async (t: string) => { await deleteTag(t); message.success('Đã xóa'); load(); };

  const onFinish = async (values: any) => {
    if (editing) {
      await updateTag(editing, values.tag);
      message.success('Đã cập nhật');
    } else {
      await createTag(values.tag);
      message.success('Đã thêm');
    }
    setOpen(false);
    load();
  };

  return (
    <div>
      <Card title="Quản lý thẻ" extra={<Button onClick={onAdd}>Thêm</Button>}>
        <List dataSource={list} renderItem={(item) => (
          <List.Item actions={[<Button key="e" onClick={() => onEdit(item)}>Sửa</Button>, <Popconfirm key="d" title="Xóa thẻ này?" onConfirm={() => onDelete(item)}><Button danger>Xóa</Button></Popconfirm>]}> 
            {item}
          </List.Item>
        )} />
      </Card>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null} title={editing ? 'Sửa thẻ' : 'Thêm thẻ'}>
        <Form key={formKey} initialValues={{ tag: editing || '' }} onFinish={onFinish} layout="vertical">
          <Form.Item name="tag" label="Tên thẻ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => setOpen(false)}>Hủy</Button>
              <Button type="primary" htmlType="submit">Lưu</Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminTags;
