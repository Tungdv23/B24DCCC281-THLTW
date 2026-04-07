import React, { useMemo, useState } from 'react';
import { Row, Col, Card, Select, Slider, Rate, Input, Tag, Empty } from 'antd';
import { Button, message } from 'antd';
import './style.less';

const { Meta } = Card;
const { Option } = Select;

type Dest = {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number;
  image: string;
  location: string;
  coords?: { lat: number; lng: number };
  costBreakdown?: { food: number; transport: number; lodging: number };
};

const mockData: Dest[] = [
  { id: 1, title: 'Bãi biển Nha Trang', type: 'biển', price: 1200, rating: 4.6, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60', location: 'Nha Trang', coords: { lat: 12.2388, lng: 109.1967 }, costBreakdown: { food: 300, transport: 200, lodging: 700 } },
  { id: 2, title: 'Đà Lạt mộng mơ', type: 'núi', price: 900, rating: 4.4, image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&q=60', location: 'Đà Lạt', coords: { lat: 11.9404, lng: 108.4583 }, costBreakdown: { food: 250, transport: 150, lodging: 500 } },
  { id: 3, title: 'Hà Nội cổ kính', type: 'thành phố', price: 700, rating: 4.2, image: 'https://images.unsplash.com/photo-15008678829-8e6b5f9b7c8b?w=800&q=60', location: 'Hà Nội', coords: { lat: 21.0278, lng: 105.8342 }, costBreakdown: { food: 200, transport: 100, lodging: 400 } },
  { id: 4, title: 'Phú Quốc đảo ngọc', type: 'biển', price: 1500, rating: 4.8, image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=60', location: 'Phú Quốc', coords: { lat: 10.2250, lng: 103.9685 }, costBreakdown: { food: 400, transport: 300, lodging: 800 } },
  { id: 5, title: 'Sa Pa leo núi', type: 'núi', price: 800, rating: 4.1, image: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=800&q=60', location: 'Sa Pa', coords: { lat: 22.3370, lng: 103.8448 }, costBreakdown: { food: 200, transport: 150, lodging: 450 } },
  { id: 6, title: 'Hồ Chí Minh sôi động', type: 'thành phố', price: 650, rating: 4.0, image: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&q=60', location: 'TP HCM', coords: { lat: 10.8231, lng: 106.6297 }, costBreakdown: { food: 180, transport: 120, lodging: 350 } },
  { id: 7, title: 'Vịnh Hạ Long', type: 'biển', price: 1400, rating: 4.7, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&q=60', location: 'Hạ Long', coords: { lat: 20.9101, lng: 107.1839 }, costBreakdown: { food: 350, transport: 250, lodging: 800 } },
  { id: 8, title: 'Huế cổ xưa', type: 'thành phố', price: 600, rating: 3.9, image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=800&q=60', location: 'Huế', coords: { lat: 16.4637, lng: 107.5909 }, costBreakdown: { food: 150, transport: 100, lodging: 350 } },
];

const Destinations: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 2000]);
  const [minRating, setMinRating] = useState<number>(0);
  const [q, setQ] = useState<string>('');

  const types = useMemo(() => ['all', ...Array.from(new Set(mockData.map(d => d.type)))], []);

  const filtered = useMemo(() => {
    return mockData.filter(d => {
      if (typeFilter !== 'all' && d.type !== typeFilter) return false;
      if (d.price < priceRange[0] || d.price > priceRange[1]) return false;
      if (d.rating < minRating) return false;
      if (q && !d.title.toLowerCase().includes(q.toLowerCase()) && !d.location.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [typeFilter, priceRange, minRating, q]);

  const STORAGE = 'app_itinerary_v1';

  const getItinerary = (): any[] => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (!raw) return [];
      return JSON.parse(raw);
    } catch (e) {
      return [];
    }
  };

  const isInItinerary = (destId: number) => {
    const days = getItinerary();
    for (const d of days) {
      if ((d.items || []).some((it: any) => it.id === destId)) return true;
    }
    return false;
  };

  const addToItinerary = (dest: Dest) => {
    const days = getItinerary();
    if (!days.length) days.push({ id: Date.now(), name: 'Ngày 1', items: [] });
    days[0].items = days[0].items || [];
    days[0].items.push(dest);
    try {
      localStorage.setItem(STORAGE, JSON.stringify(days));
      message.success('Đã thêm vào lịch trình (Ngày 1)');
    } catch (e) {
      message.error('Lưu thất bại');
    }
    // notify other components in same window
    window.dispatchEvent(new CustomEvent('itineraryUpdated'));
  };

  const removeFromItinerary = (destId: number) => {
    const days = getItinerary();
    let removed = false;
    for (const d of days) {
      d.items = (d.items || []).filter((it: any) => {
        if (it.id === destId) { removed = true; return false; }
        return true;
      });
    }
    try {
      localStorage.setItem(STORAGE, JSON.stringify(days));
      if (removed) message.success('Đã xóa khỏi lịch trình'); else message.info('Không tìm thấy trong lịch');
    } catch (e) { message.error('Lưu thất bại'); }
    window.dispatchEvent(new CustomEvent('itineraryUpdated'));
  };

  return (
    <div className="destinations-container">
      <div className="filters">
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={8} md={6} lg={6}>
            <Select value={typeFilter} onChange={(v) => setTypeFilter(v)} style={{ width: '100%' }}>
              {types.map(t => (
                <Option key={t} value={t}>{t === 'all' ? 'Tất cả' : t}</Option>
              ))}
            </Select>
          </Col>

          <Col xs={24} sm={10} md={8} lg={8}>
            <Slider range min={0} max={2000} value={priceRange} onChange={(v: any) => setPriceRange(v)} tooltipVisible={false} />
            <div className="small">Giá: {priceRange[0]}k - {priceRange[1]}k</div>
          </Col>

          <Col xs={24} sm={6} md={4} lg={4}>
            <Rate allowHalf defaultValue={minRating} value={minRating} onChange={(v) => setMinRating(v)} />
            <div className="small">Từ {minRating} sao</div>
          </Col>

          <Col xs={24} sm={24} md={6} lg={6}>
            <Input.Search placeholder="Tìm theo tên hoặc địa điểm" onSearch={(val) => setQ(val)} allowClear onChange={(e) => setQ(e.target.value)} />
          </Col>
        </Row>
      </div>

      <div className="list">
        <Row gutter={[16, 16]}>
          {filtered.length === 0 ? (
            <Col span={24}><Empty description="Không có địa điểm phù hợp" /></Col>
          ) : (
            filtered.map(item => (
              <Col key={item.id} xs={24} sm={12} md={8} lg={6}>
                <Card
                  hoverable
                  cover={<img alt={item.title} src={item.image} style={{height: 160, objectFit: 'cover'}} />}
                >
                  <Meta title={item.title} description={item.location} />
                  <div style={{marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div>
                      <Tag color="blue">{item.type}</Tag>
                      <span style={{marginLeft:8}}>{item.price}k</span>
                    </div>
                    <div>
                      <Rate disabled allowHalf defaultValue={item.rating} />
                    </div>
                  </div>
                  <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
                    {!isInItinerary(item.id) ? (
                      <Button size="small" type="primary" onClick={() => addToItinerary(item)}>Thêm vào lịch</Button>
                    ) : (
                      <Button size="small" danger onClick={() => removeFromItinerary(item.id)}>Xóa khỏi lịch</Button>
                    )}
                  </div>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
};

export default Destinations;

export { mockData };
