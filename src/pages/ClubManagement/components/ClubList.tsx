import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Switch,
  Avatar,
  Space,
  Popconfirm,
  message,
} from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

type Club = {
  id: string
  name: string
  founded?: string
  description?: string
  leader?: string
  active: boolean
}

const STORAGE_KEY = 'cm_clubs'

function readClubs(): Club[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function writeClubs(data: Club[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function ClubList() {
  const [clubs, setClubs] = useState<Club[]>([])
  const [editing, setEditing] = useState<Club | null>(null)
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()

  useEffect(() => {
    setClubs(readClubs())
  }, [])

  function openAdd() {
    setEditing(null)
    form.resetFields()
    setVisible(true)
  }

  function openEdit(record: Club) {
    setEditing(record)
    form.setFieldsValue(record)
    setVisible(true)
  }

  function remove(id: string) {
    const next = clubs.filter((c) => c.id !== id)
    setClubs(next)
    writeClubs(next)
    message.success('Đã xoá CLB')
  }

  function save(values: any) {
    if (editing) {
      const next = clubs.map((c) => (c.id === editing.id ? { ...c, ...values } : c))
      setClubs(next)
      writeClubs(next)
      message.success('Cập nhật CLB thành công')
    } else {
      const id = Date.now().toString()
      const next = [{ id, active: true, ...values }, ...clubs]
      setClubs(next)
      writeClubs(next)
      message.success('Thêm CLB thành công')
    }
    setVisible(false)
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      key: 'avatar',
      width: 80,
      render: (_: any, record: Club) => (
        <Avatar>{record.name ? record.name.charAt(0).toUpperCase() : '?'}</Avatar>
      ),
    },
    { title: 'Tên CLB', dataIndex: 'name', key: 'name' },
    { title: 'Ngày thành lập', dataIndex: 'founded', key: 'founded', width: 140 },
    { title: 'Chủ nhiệm', dataIndex: 'leader', key: 'leader', width: 160 },
    {
      title: 'Hoạt động',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (val: boolean) => (val ? 'Có' : 'Không'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 160,
      render: (_: any, record: Club) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => openEdit(record)} />
          <Popconfirm title="Xoá CLB?" onConfirm={() => remove(record.id)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAdd}>
          Thêm CLB
        </Button>
      </div>
      <Table rowKey="id" columns={columns} dataSource={clubs} />

      <Modal
        title={editing ? 'Chỉnh sửa CLB' : 'Thêm CLB'}
        visible={visible}
        onCancel={() => setVisible(false)}
        onOk={() => form.submit()}
      >
        <Form form={form} layout="vertical" onFinish={save} initialValues={{ active: true }}>
          <Form.Item name="name" label="Tên CLB" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="founded" label="Ngày thành lập">
            <Input placeholder="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="leader" label="Chủ nhiệm">
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="active" label="Hoạt động" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
