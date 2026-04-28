import React, { useEffect, useState } from 'react';
import { Card, Row, Col, Select, Input, Button, Modal, Form, InputNumber, Tag } from 'antd';
import { getExercises, addExercise, updateExercise, deleteExercise } from '@/services/theduc';

const { Option } = Select;

const ThuVienBaiTap: React.FC = () => {
	const [items, setItems] = useState<any[]>([]);
	const [filterGroup, setFilterGroup] = useState<string | null>(null);
	const [filterDifficulty, setFilterDifficulty] = useState<string | null>(null);
	const [visible, setVisible] = useState(false);
	const [editing, setEditing] = useState<any | null>(null);
	const [form] = Form.useForm();

	const load = async () => { const res = await getExercises(); setItems(res); };
	useEffect(() => { load(); }, []);

	const onFilter = (list: any[]) => list.filter(i => (!filterGroup || i.groups.includes(filterGroup)) && (!filterDifficulty || i.difficulty === filterDifficulty));

	const openAdd = () => { setEditing(null); form.resetFields(); setVisible(true); };
	const onEdit = (r: any) => { setEditing(r); form.setFieldsValue(r); setVisible(true); };

	const onFinish = async (values: any) => {
		const payload = { title: values.title, groups: (values.groups || '').split(',').map((s:string)=>s.trim()).filter(Boolean), difficulty: values.difficulty, description: values.description, caloriesPerHour: values.caloriesPerHour };
		if (editing) { await updateExercise(editing.id, payload); } else { await addExercise(payload); }
		setVisible(false); load();
	};

	return (
		<div style={{ padding: 24 }}>
			<h1>Thư viện bài tập</h1>
			<div style={{ marginBottom: 12 }}>
				<Select allowClear placeholder="Nhóm cơ" style={{ width: 160, marginRight: 8 }} onChange={v=>setFilterGroup(v)}>
					<Option value="Legs">Legs</Option>
					<Option value="Chest">Chest</Option>
					<Option value="Back">Back</Option>
					<Option value="Arms">Arms</Option>
					<Option value="Core">Core</Option>
				</Select>
				<Select allowClear placeholder="Độ khó" style={{ width: 140, marginRight: 8 }} onChange={v=>setFilterDifficulty(v)}>
					<Option value="Dễ">Dễ</Option>
					<Option value="Trung bình">Trung bình</Option>
					<Option value="Khó">Khó</Option>
				</Select>
				<Button type="primary" onClick={openAdd}>Thêm bài tập</Button>
			</div>

			<Row gutter={16}>
				{onFilter(items).map(item => (
					<Col key={item.id} span={6} style={{ marginBottom: 12 }}>
						<Card title={item.title} extra={<a onClick={()=>onEdit(item)}>Chi tiết</a>}>
							<div>{item.description}</div>
							<div style={{ marginTop: 8 }}>
								{item.groups && item.groups.map((g:string)=> <Tag key={g}>{g}</Tag>)}
							</div>
						</Card>
					</Col>
				))}
			</Row>

			<Modal visible={visible} title={editing ? 'Sửa bài tập' : 'Thêm bài tập'} onCancel={()=>setVisible(false)} footer={null}>
				<Form form={form} layout="vertical" onFinish={onFinish}>
					<Form.Item name="title" label="Tên bài tập" rules={[{ required: true }]}><Input /></Form.Item>
					<Form.Item name="groups" label="Nhóm cơ (phân tách bằng ,)"><Input placeholder="Legs, Core" /></Form.Item>
					<Form.Item name="difficulty" label="Độ khó"><Input /></Form.Item>
					<Form.Item name="caloriesPerHour" label="Calo/h"><InputNumber style={{ width: '100%' }} /></Form.Item>
					<Form.Item name="description" label="Mô tả"><Input.TextArea rows={4} /></Form.Item>
					<Form.Item>
						<Button type="primary" htmlType="submit">Lưu</Button>
						<Button style={{ marginLeft: 8 }} onClick={()=>setVisible(false)}>Hủy</Button>
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default ThuVienBaiTap;
