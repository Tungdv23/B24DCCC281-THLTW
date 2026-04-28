import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic, Progress, List } from 'antd';
import { getTrainingSessions, getHealthMetrics, getGoals } from '@/services/theduc';

const Dashboard: React.FC = () => {
	const [sessions, setSessions] = useState<any[]>([]);
	const [metrics, setMetrics] = useState<any[]>([]);
	const [goals, setGoals] = useState<any[]>([]);

	useEffect(() => { load(); }, []);

	const load = async () => {
		const s = await getTrainingSessions();
		const m = await getHealthMetrics();
		const g = await getGoals();
		setSessions(s);
		setMetrics(m);
		setGoals(g);
	};

	const totalSessions = sessions.length;
	const totalCalories = sessions.reduce((sum, s) => sum + (s.calories || 0), 0);

	// simple streak: consecutive days up to most recent session
	const calcStreak = () => {
		if (!sessions.length) return 0;
		const dates = Array.from(new Set(sessions.map(s => s.date))).sort().reverse();
		let streak = 1;
		const dayMs = 24 * 60 * 60 * 1000;
		for (let i = 1; i < dates.length; i++) {
			const prev = new Date(dates[i - 1]).getTime();
			const cur = new Date(dates[i]).getTime();
			if (prev - cur === dayMs) streak++; else break;
		}
		return streak;
	};

	const streak = calcStreak();

	// goal progress: if exists a sessions-based goal, compute percentage
	const sessionsGoal = goals.find((g: any) => g.type && g.type.toLowerCase().includes('sessions'));
	const goalPct = sessionsGoal && sessionsGoal.targetValue ? Math.min(100, Math.round((totalSessions / sessionsGoal.targetValue) * 100)) : 0;

	return (
		<div style={{ padding: 24 }}>
			<h1>Thể dục</h1>
			<Row gutter={16} style={{ marginBottom: 16 }}>
				<Col span={6}><Card><Statistic title="Tổng buổi tập" value={totalSessions} /></Card></Col>
				<Col span={6}><Card><Statistic title="Tổng calo" value={totalCalories} /></Card></Col>
				<Col span={6}><Card><Statistic title="Chuỗi liên tiếp" value={streak} suffix="ngày" /></Card></Col>
				<Col span={6}><Card title="Tiến độ mục tiêu"> <Progress percent={goalPct} /> </Card></Col>
			</Row>

			<Row gutter={16}>
				<Col span={12}>
					<Card title="Buổi tập gần đây">
						<List dataSource={sessions.slice(0, 5)} renderItem={item => (
							<List.Item>
								<List.Item.Meta title={`${item.date} — ${item.type}`} description={`Thời lượng: ${item.duration} phút — ${item.calories || 0} cal`} />
							</List.Item>
						)} />
					</Card>
				</Col>
				<Col span={12}>
					<Card title="Chỉ số sức khỏe gần nhất">
						{metrics[0] ? (
							<div>
								<div>Cân nặng: {metrics[0].weight} kg</div>
								<div>Chiều cao: {metrics[0].height} cm</div>
								<div>BMI: {metrics[0].bmi}</div>
								<div>Nhịp tim: {metrics[0].heartRate} bpm</div>
							</div>
						) : <div>Chưa có dữ liệu</div>}
					</Card>
				</Col>
			</Row>
		</div>
	);
};

export default Dashboard;
