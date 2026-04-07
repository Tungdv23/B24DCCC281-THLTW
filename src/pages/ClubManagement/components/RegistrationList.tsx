import React, { useEffect, useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Space,
  Popconfirm,
  Select,
  message,
} from 'antd'
import { PlusOutlined } from '@ant-design/icons'

type Registration = {
  id: string
  name: string
  email?: string
  phone?: string
  gender?: string
  address?: string
  skill?: string
  clubId?: string
  reason?: string
  status?: 'Pending' | 'Approved' | 'Rejected'
  note?: string
}

const STORAGE = { regs: 'cm_registrations', members: 'cm_members', clubs: 'cm_clubs' }

function read<T>(k: string): T[] {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

function write<T>(k: string, v: T[]) {
  localStorage.setItem(k, JSON.stringify(v))
}

export default function RegistrationList() {
  const [regs, setRegs] = useState<Registration[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [visible, setVisible] = useState(false)
  const [form] = Form.useForm()
  const [rejectModal, setRejectModal] = useState(false)
  const [rejectReason, setRejectReason] = useState('')

  useEffect(() => {
    setRegs(read<Registration>(STORAGE.regs))
  }, [])

  function add(vals: any) {
    const id = Date.now().toString()
    const next = [{ id, status: 'Pending', ...vals }, ...regs]
    setRegs(next)
    write(STORAGE.regs, next)
    setVisible(false)
    message.success('Thêm đơn thành công')
  }

  function approveMany(ids: string[]) {
    const next = regs.map((r) => (ids.includes(r.id) ? { ...r, status: 'Approved' } : r))
    const members = read<any>(STORAGE.members)
    const toAdd = regs.filter((r) => ids.includes(r.id) && r.status !== 'Approved').map((r) => ({
      id: r.id,
      name: r.name,
      clubId: r.clubId || null,
    }))
    write(STORAGE.members, [...toAdd, ...members])
    setRegs(next)
    write(STORAGE.regs, next)
    setSelected([])
    message.success('Duyệt đơn thành công')
  }

  function rejectMany(ids: string[], reason: string) {
    const next = regs.map((r) => (ids.includes(r.id) ? { ...r, status: 'Rejected', note: reason } : r))
    setRegs(next)
    write(STORAGE.regs, next)
    setSelected([])
    setRejectModal(false)
    setRejectReason('')
    message.success('Từ chối đơn thành công')
  }

  const columns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone', width: 130 },
    { title: 'Câu lạc bộ', dataIndex: 'clubId', key: 'clubId', width: 160 },
    { title: 'Lý do', dataIndex: 'reason', key: 'reason' },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status', width: 120 },
  ]

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>
          Thêm đơn
        </Button>
        <Button
          style={{ marginLeft: 8 }}
          onClick={() => approveMany(selected)}
          disabled={!selected.length}
        >
          Duyệt đã chọn
        </Button>
        <Button
          danger
          style={{ marginLeft: 8 }}
          onClick={() => setRejectModal(true)}
          disabled={!selected.length}
        >
          Từ chối đã chọn
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={regs}
        rowSelection={{
          selectedRowKeys: selected,
          onChange: (keys) => setSelected(keys as string[]),
        }}
      />

      <Modal title="Tạo đơn" visible={visible} onCancel={() => setVisible(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={add}>
          <Form.Item name="name" label="Họ tên" rules={[{ required: true }]}> <Input /> </Form.Item>
          <Form.Item name="email" label="Email"> <Input /> </Form.Item>
          <Form.Item name="phone" label="SĐT"> <Input /> </Form.Item>
          <Form.Item name="clubId" label="Câu lạc bộ"> <Input /> </Form.Item>
          <Form.Item name="reason" label="Lý do"> <Input.TextArea rows={3} /> </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Từ chối đơn"
        visible={rejectModal}
        onCancel={() => setRejectModal(false)}
        onOk={() => rejectMany(selected, rejectReason)}
      >
        <p>Nhập lý do từ chối (bắt buộc)</p>
        <Input.TextArea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} rows={4} />
      </Modal>
    </div>
  )
}
