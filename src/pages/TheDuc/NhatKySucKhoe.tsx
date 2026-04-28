import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, InputNumber, Input, Popconfirm, Tag, message } from 'antd';
import { getHealthMetrics, addHealthMetric, updateHealthMetric, deleteHealthMetric } from '@/services/theduc';

const bmiTag = (bmi: number) => {
	if (bmi < 18.5) return <Tag color="blue">Thiếu cân</Tag>;
	if (bmi < 25) return <Tag color="green">Bình thường</Tag>;
	if (bmi < 30) return <Tag color="gold">Thừa cân</Tag>;
	return <Tag color="red">Béo phì</Tag>;
};

const NhatKySucKhoe: React.FC = () => {
	const [data, setData] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);
	const [form] = Form.useForm();

	const load = async () => { setLoading(true); const res = await getHealthMetrics(); setData(res); setLoading(false); };
	useEffect(() => { load(); }, []);

	const openAdd = () => { setEditing(null); form.resetFields(); setVisible(true); };
	const onEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setVisible(true); };
	const onDelete = async (id: number) => { await deleteHealthMetric(id); message.success('Đã xóa'); load(); };

	const onFinish = async (values: any) => {
		const weight = values.weight; const height = values.height; const bmi = weight && height ? +(weight / ((height/100) * (height/100))).toFixed(1) : undefined;
		const payload = { date: values.date, weight, height, bmi, heartRate: values.heartRate, sleepHours: values.sleepHours };
		if (editing) { await updateHealthMetric(editing.id, payload); message.success('Cập nhật thành công'); } else { await addHealthMetric(payload); message.success('Thêm thành công'); }
		setVisible(false); load();
	};

	const columns = [
		{ title: 'Ngày', dataIndex: 'date', key: 'date' },
		{ title: 'Cân nặng (kg)', dataIndex: 'weight', key: 'weight' },
		{ title: 'Chiều cao (cm)', dataIndex: 'height', key: 'height' },
		{ title: 'BMI', dataIndex: 'bmi', key: 'bmi', render: (b: number) => <>{b} {bmiTag(b)}</> },
		{ title: 'Nhịp tim (bpm)', dataIndex: 'heartRate', key: 'heartRate' },
		{ title: 'Giờ ngủ', dataIndex: 'sleepHours', key: 'sleepHours' },
		{ title: 'Hành động', key: 'action', render: (_: any, r: any) => (
			<>
				<Button size="small" onClick={() => onEdit(r)} style={{ marginRight: 8 }}>Sửa</Button>
				<Popconfirm title="Xác nhận xóa?" onConfirm={() => onDelete(r.id)}>
					<Button size="small" danger> Xóa </Button>
				</Popconfirm>
			</>
		) },
	];

	return (
		<div style={{ padding: 24 }}>
			<h1>Nhật ký chỉ số sức khỏe</h1>
			<div style={{ marginBottom: 16 }}>
				<Button type="primary" onClick={openAdd}>Thêm chỉ số</Button>
			</div>
			<Table rowKey={(r: any) => r.id} dataSource={data} columns={columns} loading={loading} />

			<Modal visible={visible} title={editing ? 'Sửa chỉ số' : 'Thêm chỉ số'} onCancel={() => setVisible(false)} footer={null}>
				<Form form={form} layout="vertical" onFinish={onFinish} initialValues={{}}>
					<Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
						<Input placeholder="YYYY-MM-DD" />
					</Form.Item>
					<Form.Item name="weight" label="Cân nặng (kg)" rules={[{ required: true }]}>
						<InputNumber min={1} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="height" label="Chiều cao (cm)" rules={[{ required: true }]}>
						<InputNumber min={30} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="heartRate" label="Nhịp tim (bpm)">
						<InputNumber min={30} style={{ width: '100%' }} />
					</Form.Item>
					<Form.Item name="sleepHours" label="Giờ ngủ">
						<InputNumber min={0} max={24} style={{ width: '100%' }} />
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

export default NhatKySucKhoe;
