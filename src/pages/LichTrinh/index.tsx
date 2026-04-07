import React from 'react';
import { Card } from 'antd';
import ItineraryBuilder from './components/ItineraryBuilder';

const LichTrinh: React.FC = () => {
  return (
    <>
      <Card bodyStyle={{ height: '100%' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 >LẬP KẾ HOẠCH DU LỊCH</h1>
        </div>
      </Card>
      <div>
        <ItineraryBuilder />
      </div>
    </>
  );
};

export default LichTrinh;
