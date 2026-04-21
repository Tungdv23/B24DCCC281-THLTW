import React, { useEffect, useState } from 'react';
import { Card, List, Button, Modal, Form, Input, message, Popconfirm, Row, Col, Tag } from 'antd';
import { getPosts, createPost, updatePost, deletePost, getTags, Post } from '@/services/tintuc';

const STORAGE_KEY = 'admin_posts_v1';

const AdminPosts: React.FC = () => {
  const [list, setList] = useState<Post[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Post | null>(null);
  const [formKey, setFormKey] = useState('form-0');
  const [tags, setTags] = useState<string[]>([]);

  const load = async () => {
    const res = await getPosts({ page: 1, pageSize: 1000 });
    setList(res.data);
  };

  useEffect(() => {
    load();
    getTags().then(setTags);
  }, []);

  const onAdd = () => {
    setEditing(null);
    setFormKey(`new-${Date.now()}`);
    setOpen(true);
  };

  const onEdit = (item: Post) => {
    setEditing(item);
    setFormKey(`edit-${item.id}-${Date.now()}`);
    setOpen(true);
  };

  const onDelete = async (id: string) => {
    await deletePost(id);
    message.success('Đã xóa');
    load();
  };

  const onFinish = async (values: any) => {
    const payload: Partial<Post> = {
      title: values.title,
      slug: values.slug,
      summary: values.summary,
      content: values.content,
      author: { name: values.author },
      tags: values.tags ? values.tags.split(',').map((s: string) => s.trim()).filter(Boolean) : [],
      createdAt: values.createdAt,
    };
    if (editing) {
      await updatePost(editing.id, payload as Partial<Post>);
      message.success('Đã cập nhật');
    } else {
      await createPost(payload);
      message.success('Đã thêm');
    }
    setOpen(false);
    load();
  };

  return (
    <div>
      <Card title="Quản lý bài viết" extra={<Button onClick={onAdd}>Thêm</Button>}>
        <List
          dataSource={list}
          renderItem={(item) => (
            <List.Item actions={[
              <Button key="e" onClick={() => onEdit(item)}>Sửa</Button>,
              <Popconfirm key="d" title="Xóa bài này?" onConfirm={() => onDelete(item.id)}>
                <Button danger>Xóa</Button>
              </Popconfirm>
            ]}>
              <List.Item.Meta
                title={item.title}
                description={<div>{item.summary}<div style={{ marginTop: 6 }}>{item.tags.map((t) => <Tag key={t}>{t}</Tag>)}</div></div>}
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal open={open} onCancel={() => setOpen(false)} footer={null} title={editing ? 'Sửa bài' : 'Thêm bài'}>
        <Form layout="vertical" key={formKey} initialValues={editing || {}} onFinish={onFinish}>
          <Row gutter={12}>
            <Col span={16}>
              <Form.Item name="title" label="Tiêu đề" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
              <Form.Item name="slug" label="Slug">
                <Input />
              </Form.Item>
              <Form.Item name="summary" label="Tóm tắt">
                <Input.TextArea rows={3} />
              </Form.Item>
              <Form.Item name="content" label="Nội dung (HTML)">
                <Input.TextArea rows={6} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="author" label="Tác giả">
                <Input />
              </Form.Item>
              <Form.Item name="tags" label="Thẻ (phân tách bằng ,)">
                <Input />
              </Form.Item>
              <Form.Item name="createdAt" label="Ngày tạo">
                <Input />
              </Form.Item>
              <div style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 6 }}>Danh sách thẻ hiện có:</div>
                {tags.map((t) => <Tag key={t}>{t}</Tag>)}
              </div>
            </Col>
          </Row>

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

export default AdminPosts;
