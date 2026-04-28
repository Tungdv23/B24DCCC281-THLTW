import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Progress, Popconfirm, message } from 'antd';
import { getGoals, addGoal, updateGoal, deleteGoal } from '@/services/theduc';

const QuanLyMucTieu: React.FC = () => {
	const [data, setData] = useState<any[]>([]);
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);
	const [form] = Form.useForm();

	const load = async () => { const res = await getGoals(); setData(res); };
	useEffect(() => { load(); }, []);

	const openAdd = () => { setEditing(null); form.resetFields(); setVisible(true); };
	const onEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setVisible(true); };
	const onDelete = async (id: number) => { await deleteGoal(id); message.success('Đã xóa'); load(); };

	const onFinish = async (values: any) => {
		const payload = { title: values.title, type: values.type, targetValue: values.targetValue, currentValue: values.currentValue || 0, unit: values.unit, deadline: values.deadline };
		if (editing) { await updateGoal(editing.id, payload); message.success('Cập nhật mục tiêu'); } else { await addGoal(payload); message.success('Thêm mục tiêu'); }
		setVisible(false); load();
	};

	const columns = [
		{ title: 'Tên mục tiêu', dataIndex: 'title', key: 'title' },
		{ title: 'Loại', dataIndex: 'type', key: 'type' },
		{ title: 'Tiến độ', key: 'progress', render: (_: any, r: any) => <Progress percent={Math.round((r.currentValue / r.targetValue) * 100) || 0} /> },
		{ title: 'Deadline', dataIndex: 'deadline', key: 'deadline' },
		{ title: 'Hành động', key: 'action', render: (_: any, r: any) => (
			<>
				<Button size="small" onClick={() => onEdit(r)} style={{ marginRight: 8 }}>Sửa</Button>
				<Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(r.id)}>
					<Button size="small" danger> Xóa </Button>
				</Popconfirm>
			</>
		) }
	];

	return (
		<div style={{ padding: 24 }}>
			<h1>Quản lý mục tiêu</h1>
			<div style={{ marginBottom: 16 }}><Button type="primary" onClick={openAdd}>Thêm mục tiêu</Button></div>
			<Table rowKey={(r: any) => r.id} dataSource={data} columns={columns} />

			<Modal visible={visible} title={editing ? 'Sửa mục tiêu' : 'Thêm mục tiêu'} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ unit: 'kg' }}>
					<Form.Item name="title" label="Tên mục tiêu" rules={[{ required: true }]}><Input /></Form.Item>
					<Form.Item name="type" label="Loại" rules={[{ required: true }]}><Input /></Form.Item>
					<Form.Item name="targetValue" label="Giá trị mục tiêu" rules={[{ required: true }]}><InputNumber style={{ width: '100%' }} min={1} /></Form.Item>
					<Form.Item name="currentValue" label="Giá trị hiện tại"><InputNumber style={{ width: '100%' }} min={0} /></Form.Item>
					<Form.Item name="unit" label="Đơn vị"><Input /></Form.Item>
					<Form.Item name="deadline" label="Deadline"><Input placeholder="YYYY-MM-DD" /></Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">Lưu</Button>
						<Button style={{ marginLeft: 8 }} onClick={() => setVisible(false)}>Hủy</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default QuanLyMucTieu;
