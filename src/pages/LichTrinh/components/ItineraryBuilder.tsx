import React, { useState, useMemo } from 'react';
import { Row, Col, Card, Button, List, Divider, Tag, InputNumber, Alert } from 'antd';
import { mockData } from '../../TrangChu/components/Destinations';

type Dest = {
  id: number;
  title: string;
  type: string;
  price: number;
  rating: number;
  image: string;
  location: string;
};

type Day = {
  id: number;
  name: string;
  items: Dest[];
};

const ItineraryBuilder: React.FC = () => {
  const STORAGE = 'app_itinerary_v1';
  const [days, setDays] = useState<Day[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE);
      if (raw) return JSON.parse(raw);
    } catch (e) {
      // ignore
    }
    return [{ id: 1, name: 'Ngày 1', items: [] }];
  });
  const [selected, setSelected] = useState<number>(0);

  const addDay = () => {
    setDays(d => {
      const next = { id: Date.now(), name: `Ngày ${d.length + 1}`, items: [] } as Day;
      setSelected(d.length);
      return [...d, next];
    });
  };

  const removeDay = (index: number) => {
    setDays(d => {
      const copy = [...d];
      copy.splice(index, 1);
      const newIndex = Math.max(0, Math.min(copy.length - 1, selected - (index <= selected ? 1 : 0)));
      setSelected(newIndex === -1 ? 0 : newIndex);
      return copy.length ? copy : [{ id: 1, name: 'Ngày 1', items: [] }];
    });
  };

  const moveDay = (i: number, dir: -1 | 1) => {
    setDays(d => {
      const copy = [...d];
      const j = i + dir;
      if (j < 0 || j >= copy.length) return copy;
      const tmp = copy[i];
      copy[i] = copy[j];
      copy[j] = tmp;
      return copy;
    });
    setSelected(s => {
      if (s === i) return i + dir;
      if (s === i + dir) return i;
      return s;
    });
  };

  const addToDay = (dest: Dest) => {
    setDays(d => {
      const copy = [...d];
      copy[selected].items = [...copy[selected].items, dest];
      try { localStorage.setItem(STORAGE, JSON.stringify(copy)); } catch (e) {}
      return copy;
    });
  };

  const removeItem = (dayIndex: number, itemIndex: number) => {
    setDays(d => {
      const copy = [...d];
      copy[dayIndex].items = [...copy[dayIndex].items];
      copy[dayIndex].items.splice(itemIndex, 1);
      try { localStorage.setItem(STORAGE, JSON.stringify(copy)); } catch (e) {}
      return copy;
    });
  };

  const moveItem = (dayIndex: number, i: number, dir: -1 | 1) => {
    setDays(d => {
      const copy = [...d];
      const items = [...copy[dayIndex].items];
      const j = i + dir;
      if (j < 0 || j >= items.length) return copy;
      const tmp = items[i];
      items[i] = items[j];
      items[j] = tmp;
      copy[dayIndex].items = items;
      try { localStorage.setItem(STORAGE, JSON.stringify(copy)); } catch (e) {}
      return copy;
    });
  };

  // persist days on any change (fallback)
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE, JSON.stringify(days)); } catch (e) {}
  }, [days]);

  // listen for external updates (from Destinations or admin)
  React.useEffect(() => {
    const handler = () => {
      try {
        const raw = localStorage.getItem(STORAGE);
        if (raw) setDays(JSON.parse(raw));
      } catch (e) {}
    };
    window.addEventListener('itineraryUpdated', handler as EventListener);
    window.addEventListener('storage', handler as EventListener);
    return () => {
      window.removeEventListener('itineraryUpdated', handler as EventListener);
      window.removeEventListener('storage', handler as EventListener);
    };
  }, []);

  const dayTotal = (day: Day) => day.items.reduce((s, it) => s + (it.price || 0), 0);

  const totalBudget = () => days.reduce((s, day) => s + day.items.reduce((a, b) => a + (b.price || 0), 0), 0);

  // haversine distance (km)
  const haversine = (a?: { lat: number; lng: number }, b?: { lat: number; lng: number }) => {
    if (!a || !b) return 0;
    const toRad = (v: number) => (v * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(b.lat - a.lat);
    const dLon = toRad(b.lng - a.lng);
    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);
    const aa = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
    return R * c;
  };

  // compute travel time per day (minutes) assuming average speed
  const avgSpeedKmh = 50; // configurable
  const travelTimeForDay = (day: Day) => {
    if (!day.items || day.items.length < 2) return 0;
    let total = 0;
    for (let i = 0; i < day.items.length - 1; i++) {
      const a = day.items[i].coords;
      const b = day.items[i + 1].coords;
      const dist = haversine(a, b);
      total += (dist / avgSpeedKmh) * 60;
    }
    return Math.round(total);
  };

  const [userBudget, setUserBudget] = useState<number | null>(null);

  const categoryTotals = useMemo(() => {
    const totals = { food: 0, transport: 0, lodging: 0 };
    for (const day of days) {
      for (const it of day.items) {
        if (it.costBreakdown) {
          totals.food += it.costBreakdown.food || 0;
          totals.transport += it.costBreakdown.transport || 0;
          totals.lodging += it.costBreakdown.lodging || 0;
        } else {
          // fallback: split price
          const p = it.price || 0;
          totals.food += Math.round(p * 0.2);
          totals.transport += Math.round(p * 0.2);
          totals.lodging += Math.round(p * 0.6);
        }
      }
    }
    return totals;
  }, [days]);

  return (
    <Row gutter={16}>
      <Col xs={24} md={8}>
        <Card title="Ngày" extra={<Button onClick={addDay}>Thêm ngày</Button>}>
          <List
            dataSource={days}
            renderItem={(day, idx) => (
              <List.Item style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <Button size="small" onClick={() => setSelected(idx)} type={selected === idx ? 'primary' : 'default'}>{day.name}</Button>
                  <Tag> {day.items.length} điểm</Tag>
                </div>
                <div>
                  <Button size="small" onClick={() => moveDay(idx, -1)} disabled={idx === 0}>↑</Button>
                  <Button size="small" onClick={() => moveDay(idx, 1)} disabled={idx === days.length - 1}>↓</Button>
                  <Button size="small" danger onClick={() => removeDay(idx)} style={{ marginLeft: 8 }}>Xóa</Button>
                </div>
              </List.Item>
            )}
          />
        </Card>

        <Card style={{ marginTop: 12 }}>
          <div style={{ marginBottom: 8 }}><b>Tổng ngân sách: </b>{totalBudget()}k</div>
          <div style={{ marginBottom: 8 }}>
            <b>Ngân sách mục tiêu: </b>
            <InputNumber min={0} formatter={v => `${v}k`} parser={v => Number(String(v).replace('k', ''))} value={userBudget as any} onChange={(v) => setUserBudget(v as number)} />
          </div>
          <div style={{ marginTop: 8 }}><small>Lưu ý: giá tính bằng đơn vị mock (k)</small></div>
          {userBudget !== null && totalBudget() > userBudget ? (
            <Alert type="error" message={`Ngân sách vượt ${totalBudget() - userBudget}k`} style={{ marginTop: 8 }} />
          ) : null}
        </Card>
      </Col>

      <Col xs={24} md={16}>
        <Card title={`Chi tiết ${days[selected].name}`}> 
          <div style={{ marginBottom: 12 }}>
            <b>Tổng ngày:</b> {dayTotal(days[selected])}k
          </div>

          <List
            dataSource={days[selected].items}
            bordered
            locale={{ emptyText: 'Chưa có điểm nào' }}
            renderItem={(it, i) => (
              <List.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{it.title}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{it.location} - {it.price}k</div>
                  </div>

                  <div>
                    <Button size="small" onClick={() => moveItem(selected, i, -1)} disabled={i === 0}>↑</Button>
                    <Button size="small" onClick={() => moveItem(selected, i, 1)} disabled={i === days[selected].items.length - 1}>↓</Button>
                    <Button size="small" danger onClick={() => removeItem(selected, i)} style={{ marginLeft: 8 }}>Xóa</Button>
                  </div>
                </div>
              </List.Item>
            )}
          />

          <Divider />

          <div>
            <h4>Danh sách điểm (thêm vào {days[selected].name})</h4>
            <Row gutter={[12, 12]}>
              {mockData.map(d => (
                <Col key={d.id} xs={24} sm={12} md={8} lg={6}>
                  <Card size="small" hoverable>
                    <div style={{ fontWeight: 600 }}>{d.title}</div>
                    <div style={{ fontSize: 12, color: '#666' }}>{d.location} - {d.price}k</div>
                    <div style={{ marginTop: 8 }}>
                      <Button size="small" type="primary" onClick={() => addToDay(d)}>Thêm</Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>

            <Divider />
            <h4>Phân bổ ngân sách</h4>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
              {Object.entries(categoryTotals).map(([k, v]) => {
                const total = categoryTotals.food + categoryTotals.transport + categoryTotals.lodging || 1;
                const pct = Math.round((v / total) * 100);
                return (
                  <div key={k} style={{ width: 120 }}>
                    <div style={{ height: 120, background: '#f5f5f5', display: 'flex', alignItems: 'flex-end' }}>
                      <div style={{ width: '100%', height: `${Math.max(6, pct)}%`, background: '#1890ff' }} />
                    </div>
                    <div style={{ textAlign: 'center', marginTop: 6 }}>{k} - {v}k</div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
};

export default ItineraryBuilder;
