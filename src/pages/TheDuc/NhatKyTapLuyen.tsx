import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, Select, InputNumber, Popconfirm, Tag, message } from 'antd';
import { getTrainingSessions, addTrainingSession, updateTrainingSession, deleteTrainingSession } from '@/services/theduc';

const { Option } = Select;

const NhatKyTapLuyen: React.FC = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);

	const [form] = Form.useForm();

	const load = async () => {
		setLoading(true);
		const res = await getTrainingSessions();
		setData(res);
		setLoading(false);
	};

	useEffect(() => { load(); }, []);

	const openAdd = () => { setEditing(null); form.resetFields(); setVisible(true); };

	const onEdit = (record: any) => { setEditing(record); form.setFieldsValue({ ...record, date: record.date }); setVisible(true); };

	const onDelete = async (id: number) => {
		await deleteTrainingSession(id);
		message.success('Đã xóa');
		load();
	};

	const onFinish = async (values: any) => {
		const payload = {
			date: values.date && (values.date.format ? values.date.format('YYYY-MM-DD') : values.date),
			type: values.type,
			duration: values.duration,
			calories: values.calories,
			note: values.note,
			status: values.status || 'Hoàn thành',
		};

		if (editing) {
			await updateTrainingSession(editing.id, payload);
			message.success('Cập nhật thành công');
		} else {
			await addTrainingSession(payload);
			message.success('Thêm buổi tập thành công');
		}
		setVisible(false);
		load();
	};

	const columns = [
		{ title: 'Ngày', dataIndex: 'date', key: 'date' },
		{ title: 'Loại', dataIndex: 'type', key: 'type' },
		{ title: 'Thời lượng (phút)', dataIndex: 'duration', key: 'duration' },
		{ title: 'Calo', dataIndex: 'calories', key: 'calories' },
		{ title: 'Ghi chú', dataIndex: 'note', key: 'note' },
		{ title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (s: string) => <Tag color={s === 'Hoàn thành' ? 'green' : 'orange'}>{s}</Tag> },
		{
			title: 'Hành động', key: 'action', render: (_: any, record: any) => (
				<>
					<Button size="small" onClick={() => onEdit(record)} style={{ marginRight: 8 }}>Sửa</Button>
					<Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(record.id)}>
						<Button size="small" danger> Xóa </Button>
					</Popconfirm>
				</>
			),
		},
	];

	return (
		<div style={{ padding: 24 }}>
			<h1>Nhật ký tập luyện</h1>
			<div style={{ marginBottom: 16 }}>
				<Button type="primary" onClick={openAdd}>Thêm buổi tập</Button>
			</div>
			<Table rowKey={(r: any) => r.id} dataSource={data} columns={columns} loading={loading} />

			<Modal visible={visible} title={editing ? 'Sửa buổi tập' : 'Thêm buổi tập'} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} layout="vertical" onFinish={onFinish} initialValues={{ type: 'Cardio', status: 'Hoàn thành' }}>
					<Form.Item name="date" label="Ngày" rules={[{ required: true }]}> <DatePicker style={{ width: '100%' }} /> </Form.Item>
					<Form.Item name="type" label="Loại bài tập" rules={[{ required: true }]}>
						<Select>
							<Option value="Cardio">Cardio</Option>
							<Option value="Strength">Strength</Option>
							<Option value="Yoga">Yoga</Option>
							<Option value="HIIT">HIIT</Option>
						</Select>
					</Form.Item>
					<Form.Item name="duration" label="Thời lượng (phút)" rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="calories" label="Calo đốt" rules={[{ required: false }]}>
						<InputNumber min={0} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="note" label="Ghi chú">
						<Input.TextArea rows={3} />
					</Form.Item>
					<Form.Item name="status" label="Trạng thái">
						<Select>
							<Option value="Hoàn thành">Hoàn thành</Option>
							<Option value="Bỏ lỡ">Bỏ lỡ</Option>
						</Select>
					</Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">Lưu</Button>
						<Button style={{ marginLeft: 8 }} onClick={() => setVisible(false)}>Hủy</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default NhatKyTapLuyen;
