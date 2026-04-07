import React from 'react';
import { Card } from 'antd';
import Destinations from '../TrangChu/components/Destinations';

const DuLich: React.FC = () => {
  return (
    <>
      <Card bodyStyle={{ height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontWeight: 300 }}>DU LỊCH</h1>
          <p>Khám phá điểm đến và tạo lịch trình du lịch của bạn.</p>
        </div>
      </Card>

      <div style={{ marginTop: 16 }}>
        <Destinations />
      </div>
    </>
  );
};

export default DuLich;
