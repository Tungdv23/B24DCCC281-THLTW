import React, { useEffect, useState } from 'react';
import { Table, Button, Input, Space, Tag, Popconfirm, Select } from 'antd';
import { getTasks, addTask, updateTask, deleteTask, Task } from '@/services/todo';
import TaskForm from '@/components/TaskForm';

export default function ListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [q, setQ] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const [editing, setEditing] = useState<Task | null>(null);
  const [formVisible, setFormVisible] = useState(false);

  useEffect(() => { load(); }, []);
  async function load() { const t = await getTasks(); setTasks(t); }

  const onAdd = () => { setEditing(null); setFormVisible(true); };
  const onEdit = (rec: Task) => { setEditing(rec); setFormVisible(true); };
  const onDelete = async (id: number) => { await deleteTask(id); await load(); };
  const onSubmit = async (values: any) => {
    if (editing) await updateTask(editing.id, { ...values }); else await addTask({ ...values, status: 'todo' });
    setFormVisible(false); await load();
  };

  const data = tasks.filter(t => (!statusFilter || t.status === statusFilter) && (!q || t.title.toLowerCase().includes(q.toLowerCase())));

  const columns = [
    { title: 'Tên', dataIndex: 'title', key: 'title' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description' },
    { title: 'Deadline', dataIndex: 'deadline', key: 'deadline', sorter: (a: any,b:any)=> (a.deadline||'').localeCompare(b.deadline||'') },
    { title: 'Ưu tiên', dataIndex: 'priority', key: 'priority' },
    { title: 'Tags', dataIndex: 'tags', key: 'tags', render: (tags: string[]) => tags?.map(t=> <Tag key={t}>{t}</Tag>) },
    { title: 'Trạng thái', dataIndex: 'status', key: 'status' },
    { title: 'Hành động', key: 'action', render: (_: any, record: Task) => (
      <Space>
        <Button onClick={() => onEdit(record)}>Sửa</Button>
        <Popconfirm title="Xóa?" onConfirm={() => onDelete(record.id)}>
          <Button danger> Xóa </Button>
        </Popconfirm>
      </Space>
    ) }
  ];

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 12 }}>
        <Button type="primary" onClick={onAdd}>Thêm Task</Button>
        <Input placeholder="Tìm theo tên" value={q} onChange={e=>setQ(e.target.value)} />
        <Select allowClear placeholder="Lọc trạng thái" style={{ width: 160 }} onChange={(v)=>setStatusFilter(v)}>
          <Select.Option value="todo">Cần làm</Select.Option>
          <Select.Option value="doing">Đang làm</Select.Option>
          <Select.Option value="done">Hoàn thành</Select.Option>
        </Select>
      </Space>

      <Table dataSource={data} columns={columns} rowKey="id" />

      <TaskForm visible={formVisible} initialValues={editing || undefined} onCancel={() => setFormVisible(false)} onSubmit={onSubmit} />
    </div>
  );
}
