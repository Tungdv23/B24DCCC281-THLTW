import React, { useEffect, useState } from 'react'
import { Table, Button, Modal, Select, message } from 'antd'

const STORAGE = { members: 'cm_members', clubs: 'cm_clubs' }

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

export default function MembersList() {
  const [members, setMembers] = useState<any[]>([])
  const [clubs, setClubs] = useState<any[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [moveModal, setMoveModal] = useState(false)
  const [targetClub, setTargetClub] = useState<string | null>(null)

  useEffect(() => {
    setMembers(read(STORAGE.members))
    setClubs(read(STORAGE.clubs))
  }, [])

  function moveSelected() {
    if (!targetClub) return message.warn('Chọn CLB đích')
    const next = members.map((m) => (selected.includes(m.id) ? { ...m, clubId: targetClub } : m))
    setMembers(next)
    write(STORAGE.members, next)
    setSelected([])
    setMoveModal(false)
    message.success('Chuyển CLB thành công')
  }

  const columns = [
    { title: 'Họ tên', dataIndex: 'name', key: 'name' },
    { title: 'CLB', dataIndex: 'clubId', key: 'clubId' },
  ]

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <Button disabled={!selected.length} onClick={() => setMoveModal(true)}>
          Chuyển CLB cho đã chọn
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={members}
        rowSelection={{ selectedRowKeys: selected, onChange: (keys) => setSelected(keys as string[]) }}
      />

      <Modal title="Chuyển CLB" visible={moveModal} onCancel={() => setMoveModal(false)} onOk={moveSelected}>
        <Select style={{ width: '100%' }} placeholder="Chọn CLB đích" onChange={(v) => setTargetClub(v)}>
          {clubs.map((c: any) => (
            <Select.Option key={c.id} value={c.id}>
              {c.name}
            </Select.Option>
          ))}
        </Select>
      </Modal>
    </div>
  )
}
