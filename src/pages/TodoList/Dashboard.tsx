import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Statistic } from 'antd';
import { getTasks } from '@/services/todo';

const Dashboard: React.FC = () => {
  const [total, setTotal] = useState(0);
  const [done, setDone] = useState(0);
  const [overdue, setOverdue] = useState(0);

  useEffect(() => {
    (async () => {
      const tasks = await getTasks();
      setTotal(tasks.length);
      setDone(tasks.filter(t => t.status === 'done').length);
      const now = Date.now();
      setOverdue(tasks.filter(t => t.deadline && new Date(t.deadline).getTime() < now && t.status !== 'done').length);
    })();
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={16}>
        <Col span={8}><Card><Statistic title="Tổng số task" value={total} /></Card></Col>
        <Col span={8}><Card><Statistic title="Đã hoàn thành" value={done} /></Card></Col>
        <Col span={8}><Card><Statistic title="Quá hạn" value={overdue} /></Card></Col>
      </Row>
    </div>
  );
};

export default Dashboard;
