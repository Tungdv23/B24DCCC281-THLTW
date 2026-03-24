import React, { useState, useEffect } from 'react';
import { Tabs, Table, Button, Modal, Form, Input, InputNumber, Select, DatePicker, TimePicker, message, Card, Row, Col, Statistic, Tag, Space, Rate, Popconfirm, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, UserOutlined, DollarOutlined } from '@ant-design/icons';
import { AppointmentData, Staff, Service, Appointment, Review, loadData, saveData, uid, getServiceById, getStaffById, checkTimeSlotAvailable, getServiceStats, defaultWorkSchedule } from './data/models';
import StaffModal from './components/StaffModal';
import ServiceModal from './components/ServiceModal';
import AppointmentModal from './components/AppointmentModal';
import ReviewModal from './components/ReviewModal';
import AppointmentsTab from './components/AppointmentsTab';
import StaffTab from './components/StaffTab';
import ServicesTab from './components/ServicesTab';
import ReportsTab from './components/ReportsTab';

const { TextArea } = Input;

const LichHen: React.FC = () => {
  const [data, setData] = useState<AppointmentData>(loadData());
  const [activeTab, setActiveTab] = useState('appointments');


  const [staffModalVisible, setStaffModalVisible] = useState(false);
  const [serviceModalVisible, setServiceModalVisible] = useState(false);
  const [appointmentModalVisible, setAppointmentModalVisible] = useState(false);
  const [reviewModalVisible, setReviewModalVisible] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Staff | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => saveData(data), [data]);

  const handleAddStaff = () => { setEditingStaff(null); setStaffModalVisible(true); };
  const handleEditStaff = (s: Staff) => { setEditingStaff(s); setStaffModalVisible(true); };
  const handleDeleteStaff = (id: string) => { setData(prev => ({ ...prev, staff: prev.staff.filter(x => x.id !== id) })); message.success('Xóa nhân viên thành công'); };
  const handleSaveStaff = (values: any) => {
    if (editingStaff) {
      setData(prev => ({ ...prev, staff: prev.staff.map(s => s.id === editingStaff.id ? { ...s, ...values, updatedAt: new Date().toISOString() } : s) }));
      message.success('Cập nhật nhân viên thành công');
    } else {
      const newStaff: Staff = { id: uid(), name: values.name, phone: values.phone || '', email: values.email || '', avatar: '', serviceIds: values.serviceIds || [], maxCustomersPerDay: values.maxCustomersPerDay || 10, workSchedule: values.workSchedule || defaultWorkSchedule, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setData(prev => ({ ...prev, staff: [...prev.staff, newStaff] }));
      message.success('Thêm nhân viên thành công');
    }
    setStaffModalVisible(false);
  };


  const handleAddService = () => { setEditingService(null); setServiceModalVisible(true); };
  const handleEditService = (s: Service) => { setEditingService(s); setServiceModalVisible(true); };
  const handleDeleteService = (id: string) => { setData(prev => ({ ...prev, services: prev.services.filter(x => x.id !== id) })); message.success('Xóa dịch vụ thành công'); };
  const handleSaveService = (values: any) => {
    if (editingService) {
      setData(prev => ({ ...prev, services: prev.services.map(s => s.id === editingService.id ? { ...s, ...values, updatedAt: new Date().toISOString() } : s) }));
      message.success('Cập nhật dịch vụ thành công');
    } else {
      const newService: Service = { id: uid(), name: values.name, description: values.description || '', price: values.price || 0, duration: values.duration || 30, category: values.category || 'khác', isActive: true, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      setData(prev => ({ ...prev, services: [...prev.services, newService] }));
      message.success('Thêm dịch vụ thành công');
    }
    setServiceModalVisible(false);
  };

  // Appointments
  const openCreateAppointment = () => { setSelectedAppointment(null); setAppointmentModalVisible(true); };
  const handleCreateAppointment = (values: any) => {
    const dateStr = values.date.format('YYYY-MM-DD');
    const timeStr = values.time.format('HH:mm');
    const service = getServiceById(data, values.serviceId as string);
    if (!service) { message.error('Dịch vụ không tồn tại'); return; }
    const ok = checkTimeSlotAvailable(data, values.staffId as string, dateStr, timeStr);
    if (!ok) { message.error('Khung giờ không khả dụng hoặc trùng'); return; }
    const newAppointment: Appointment = { id: uid(), customerName: values.customerName, customerPhone: values.customerPhone, customerEmail: values.customerEmail || '', serviceId: values.serviceId, staffId: values.staffId, appointmentDate: dateStr, appointmentTime: timeStr, status: 'pending', notes: values.notes || '', totalPrice: service.price, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
    setData(prev => ({ ...prev, appointments: [...prev.appointments, newAppointment] }));
    setAppointmentModalVisible(false); message.success('Đặt lịch thành công (Chờ duyệt)');
  };
  const changeAppointmentStatus = (id: string, status: Appointment['status']) => setData(prev => ({ ...prev, appointments: prev.appointments.map(a => a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a) }));
  const handleDeleteAppointment = (id: string) => { setData(prev => ({ ...prev, appointments: prev.appointments.filter(a => a.id !== id) })); message.success('Xóa lịch hẹn thành công'); };


  const openReviewModal = (appointment: Appointment) => { setSelectedAppointment(appointment); setReviewModalVisible(true); };
  const handleSaveReview = (values: any) => {
    if (!selectedAppointment) return;
    const newReview: any = { id: uid(), appointmentId: selectedAppointment.id, serviceId: selectedAppointment.serviceId, staffId: selectedAppointment.staffId, customerName: values.customerName || selectedAppointment.customerName, rating: values.rating, comment: values.comment || '', createdAt: new Date().toISOString() };
    setData(prev => ({ ...prev, reviews: [...prev.reviews, newReview] }));
    setReviewModalVisible(false); message.success('Cảm ơn bạn đã đánh giá');
  };

  const appointmentColumns = [
    { title: 'Khách hàng', dataIndex: 'customerName', key: 'customerName' },
    { title: 'Dịch vụ', key: 'service', render: (_: any, r: Appointment) => getServiceById(data, r.serviceId)?.name || '-' },
    { title: 'Nhân viên', key: 'staff', render: (_: any, r: Appointment) => getStaffById(data, r.staffId)?.name || '-' },
    { title: 'Ngày', dataIndex: 'appointmentDate', key: 'appointmentDate' },
    { title: 'Giờ', dataIndex: 'appointmentTime', key: 'appointmentTime' },
    { title: 'Trạng thái', key: 'status', render: (_: any, r: Appointment) => <Tag>{r.status}</Tag> },
    { title: 'Hành động', key: 'actions', render: (_: any, r: Appointment) => (
      <Space>
        {r.status === 'pending' && <Button size="small" onClick={() => changeAppointmentStatus(r.id, 'confirmed')}>Xác nhận</Button>}
        {r.status !== 'completed' && r.status !== 'cancelled' && <Button size="small" onClick={() => changeAppointmentStatus(r.id, 'completed')}>Hoàn thành</Button>}
        {r.status !== 'cancelled' && <Popconfirm title="Bạn có chắc muốn hủy?" onConfirm={() => changeAppointmentStatus(r.id, 'cancelled')}><Button size="small">Hủy</Button></Popconfirm>}
        <Button size="small" onClick={() => openReviewModal(r)}>Đánh giá</Button>
        <Popconfirm title="Xóa lịch này?" onConfirm={() => handleDeleteAppointment(r.id)}><Button danger size="small">Xóa</Button></Popconfirm>
      </Space>
    ) },
  ];

  const staffColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'SĐT', dataIndex: 'phone', key: 'phone' },
    { title: 'Dịch vụ', key: 'services', render: (_: any, r: Staff) => r.serviceIds.map(id => getServiceById(data, id)?.name).filter(Boolean).join(', ') },
    { title: 'Giới hạn/ngày', dataIndex: 'maxCustomersPerDay', key: 'limit' },
    { title: 'Hành động', key: 'actions', render: (_: any, r: Staff) => (
      <Space>
        <Button size="small" icon={<EditOutlined />} onClick={() => handleEditStaff(r)}>Sửa</Button>
        <Popconfirm title="Xóa nhân viên?" onConfirm={() => handleDeleteStaff(r.id)}><Button danger size="small" icon={<DeleteOutlined />}>Xóa</Button></Popconfirm>
      </Space>
    ) },
  ];

  const serviceColumns = [
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Giá', dataIndex: 'price', key: 'price', render: (p: number) => `${p.toLocaleString()} VND` },
    { title: 'Thời lượng', dataIndex: 'duration', key: 'duration', render: (d: number) => `${d} phút` },
    { title: 'Hành động', key: 'actions', render: (_: any, r: Service) => (
      <Space>
        <Button size="small" onClick={() => handleEditService(r)}>Sửa</Button>
        <Popconfirm title="Xóa dịch vụ?" onConfirm={() => handleDeleteService(r.id)}><Button danger size="small">Xóa</Button></Popconfirm>
      </Space>
    ) },
  ];

  return (
    <div>
      <Tabs activeKey={activeTab} onChange={k => setActiveTab(k)}>
        <Tabs.TabPane key="appointments" tab={<span><CalendarOutlined/> Lịch hẹn</span>}>
          <AppointmentsTab
            appointments={data.appointments}
            services={data.services}
            staff={data.staff}
            onCreate={openCreateAppointment}
            onChangeStatus={changeAppointmentStatus}
            onDelete={handleDeleteAppointment}
            onOpenReview={openReviewModal}
            getServiceName={(id) => getServiceById(data, id)?.name || ''}
            getStaffName={(id) => getStaffById(data, id)?.name || ''}
          />
          <AppointmentModal visible={appointmentModalVisible} onCancel={() => setAppointmentModalVisible(false)} onSave={handleCreateAppointment} services={data.services} staff={data.staff} />
        </Tabs.TabPane>
        <Tabs.TabPane key="staff" tab={<span><UserOutlined/> Nhân viên</span>}>
          <StaffTab staff={data.staff} services={data.services} onAdd={handleAddStaff} onEdit={handleEditStaff} onDelete={handleDeleteStaff} getServiceName={(id) => getServiceById(data, id)?.name || ''} />
          <StaffModal visible={staffModalVisible} onCancel={() => setStaffModalVisible(false)} onSave={handleSaveStaff} editing={editingStaff} services={data.services} />
        </Tabs.TabPane>

        <Tabs.TabPane key="services" tab={<span><DollarOutlined/> Dịch vụ</span>}>
          <ServicesTab services={data.services} onAdd={handleAddService} onEdit={handleEditService} onDelete={handleDeleteService} />
          <ServiceModal visible={serviceModalVisible} onCancel={() => setServiceModalVisible(false)} onSave={handleSaveService} editing={editingService} />
        </Tabs.TabPane>

        <Tabs.TabPane key="reports" tab={<span>Báo cáo</span>}>
          <ReportsTab
            totalAppointments={data.appointments.length}
            completedAppointments={data.appointments.filter(a => a.status === 'completed').length}
            totalRevenue={data.appointments.filter(a => a.status === 'completed').reduce((s, a) => s + a.totalPrice, 0)}
            serviceStats={getServiceStats(data)}
          />
        </Tabs.TabPane>
      </Tabs>

      <ReviewModal visible={reviewModalVisible} onCancel={() => setReviewModalVisible(false)} onSave={handleSaveReview} />
    </div>
  );
};

export default LichHen;
