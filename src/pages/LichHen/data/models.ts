
export type Staff = {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  serviceIds: string[]; 
  maxCustomersPerDay: number; 
  workSchedule: WorkSchedule[];
  createdAt: string;
  updatedAt: string;
};


export type WorkSchedule = {
  dayOfWeek: number; 
  startTime: string; 
  endTime: string; 
  isWorking: boolean; 
};


export type Service = {
  id: string;
  name: string;
  description: string;
  price: number; 
  duration: number; 
  category: string; 
  image?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AppointmentStatus = 
  | 'pending'    
  | 'confirmed'  
  | 'completed' 
  | 'cancelled'; 


export type Appointment = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  serviceId: string;
  staffId: string;
  appointmentDate: string; 
  appointmentTime: string; 
  status: AppointmentStatus;
  notes?: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
};

export type Review = {
  id: string;
  appointmentId: string;
  serviceId: string;
  staffId: string;
  customerName: string;
  rating: number; 
  comment: string;
  response?: string; 
  responseAt?: string;
  createdAt: string;
};

export type DailyStats = {
  date: string;
  totalAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  revenue: number;
};

export type ServiceStats = {
  serviceId: string;
  serviceName: string;
  totalBookings: number;
  totalRevenue: number;
  averageRating: number;
};

export type StaffStats = {
  staffId: string;
  staffName: string;
  totalBookings: number;
  completedBookings: number;
  averageRating: number;
  totalRevenue: number;
};


export type AppointmentData = {
  services: Service[];
  staff: Staff[];
  appointments: Appointment[];
  reviews: Review[];
};

export const STORAGE_KEY = 'appointment_booking_data';


export const uid = () => Math.random().toString(36).slice(2, 11) + Date.now().toString(36);

export const defaultWorkSchedule: WorkSchedule[] = [
  { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isWorking: false },
  { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isWorking: true },
  { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isWorking: true },
  { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isWorking: true },
  { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isWorking: true },
  { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isWorking: true },
  { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isWorking: false },
];


export const getInitialData = (): AppointmentData => ({
  services: [
    {
      id: 'sv001',
      name: 'Cắt tóc nam',
      description: 'Cắt tóc nam kiểu undercut, side part, pomade',
      price: 100000,
      duration: 30,
      category: 'cắt tóc',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sv002',
      name: 'Cắt tóc nữ',
      description: 'Cắt tóc nữ các kiểu theo yêu cầu',
      price: 150000,
      duration: 45,
      category: 'cắt tóc',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sv003',
      name: 'Massage body',
      description: 'Massage toàn thân 60 phút',
      price: 300000,
      duration: 60,
      category: 'spa',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sv004',
      name: 'Chăm sóc da mặt',
      description: 'Đắp mặt nạ, massage mặt, làm sạch da',
      price: 250000,
      duration: 45,
      category: 'spa',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sv005',
      name: 'Khám sức khỏe tổng quát',
      description: 'Khám tổng quát, xét nghiệm máu, nước tiểu',
      price: 500000,
      duration: 60,
      category: 'khám bệnh',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'sv006',
      name: 'Sửa chữa điện thoại',
      description: 'Thay màn hình, pin, sửa các lỗi phần mềm',
      price: 200000,
      duration: 60,
      category: 'sửa chữa',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  staff: [
    {
      id: 'staff001',
      name: 'Nguyễn Văn A',
      phone: '0912345678',
      email: 'nguyenvana@example.com',
      serviceIds: ['sv001', 'sv002'],
      maxCustomersPerDay: 10,
      workSchedule: [
        { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isWorking: false },
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isWorking: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'staff002',
      name: 'Trần Thị B',
      phone: '0912345679',
      email: 'tranthib@example.com',
      serviceIds: ['sv003', 'sv004'],
      maxCustomersPerDay: 8,
      workSchedule: [
        { dayOfWeek: 0, startTime: '09:00', endTime: '17:00', isWorking: false },
        { dayOfWeek: 1, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 2, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 3, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 4, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 5, startTime: '09:00', endTime: '17:00', isWorking: true },
        { dayOfWeek: 6, startTime: '09:00', endTime: '17:00', isWorking: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'staff003',
      name: 'Lê Văn C',
      phone: '0912345680',
      email: 'levanc@example.com',
      serviceIds: ['sv005'],
      maxCustomersPerDay: 15,
      workSchedule: [
        { dayOfWeek: 0, startTime: '08:00', endTime: '16:00', isWorking: false },
        { dayOfWeek: 1, startTime: '08:00', endTime: '16:00', isWorking: true },
        { dayOfWeek: 2, startTime: '08:00', endTime: '16:00', isWorking: true },
        { dayOfWeek: 3, startTime: '08:00', endTime: '16:00', isWorking: true },
        { dayOfWeek: 4, startTime: '08:00', endTime: '16:00', isWorking: true },
        { dayOfWeek: 5, startTime: '08:00', endTime: '16:00', isWorking: true },
        { dayOfWeek: 6, startTime: '08:00', endTime: '16:00', isWorking: false },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  appointments: [],
  reviews: [],
});


export const loadData = (): AppointmentData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initialData = getInitialData();
      saveData(initialData);
      return initialData;
    }
    return JSON.parse(raw) as AppointmentData;
  } catch {
    const initialData = getInitialData();
    saveData(initialData);
    return initialData;
  }
};

export const saveData = (data: AppointmentData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

export const getServiceById = (data: AppointmentData, id: string): Service | undefined => {
  return data.services.find(s => s.id === id);
};

export const getStaffById = (data: AppointmentData, id: string): Staff | undefined => {
  return data.staff.find(s => s.id === id);
};

export const getStaffForService = (data: AppointmentData, serviceId: string): Staff[] => {
  return data.staff.filter(s => s.serviceIds.includes(serviceId));
};

export const checkTimeSlotAvailable = (
  data: AppointmentData,
  staffId: string,
  date: string,
  time: string,
  excludeAppointmentId?: string
): boolean => {
  const dayOfWeek = new Date(date).getDay();
  const staff = getStaffById(data, staffId);
  
  if (!staff) return false;
  
  const workDay = staff.workSchedule.find(w => w.dayOfWeek === dayOfWeek);
  if (!workDay || !workDay.isWorking) return false;
  
  if (time < workDay.startTime || time > workDay.endTime) return false;
  
  const existingAppointments = data.appointments.filter(
    a => a.staffId === staffId && 
         a.appointmentDate === date && 
         a.appointmentTime === time &&
         a.status !== 'cancelled' &&
         a.id !== excludeAppointmentId
  );
  
  if (existingAppointments.length > 0) return false;
  
  const dailyAppointments = data.appointments.filter(
    a => a.staffId === staffId && 
         a.appointmentDate === date &&
         a.status !== 'cancelled' &&
         a.id !== excludeAppointmentId
  );
  
  if (dailyAppointments.length >= staff.maxCustomersPerDay) return false;
  
  return true;
};

export const getAvailableTimeSlots = (
  data: AppointmentData,
  staffId: string,
  date: string
): string[] => {
  const dayOfWeek = new Date(date).getDay();
  const staff = getStaffById(data, staffId);
  
  if (!staff) return [];
  
  const workDay = staff.workSchedule.find(w => w.dayOfWeek === dayOfWeek);
  if (!workDay || !workDay.isWorking) return [];
  
  const slots: string[] = [];
  const [startHour, startMin] = workDay.startTime.split(':').map(Number);
  const [endHour, endMin] = workDay.endTime.split(':').map(Number);
  
  let currentHour = startHour;
  let currentMin = startMin;
  
  while (currentHour < endHour || (currentHour === endHour && currentMin < endMin)) {
    const timeStr = `${currentHour.toString().padStart(2, '0')}:${currentMin.toString().padStart(2, '0')}`;
    
    if (checkTimeSlotAvailable(data, staffId, date, timeStr)) {
      slots.push(timeStr);
    }
    
    currentMin += 30;
    if (currentMin >= 60) {
      currentHour += 1;
      currentMin = 0;
    }
  }
  
  return slots;
};

export const getAverageRating = (data: AppointmentData, staffId: string): number => {
  const reviews = data.reviews.filter(r => r.staffId === staffId);
  if (reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + r.rating, 0);
  return Math.round((total / reviews.length) * 10) / 10;
};

export const getStatsByDateRange = (
  data: AppointmentData,
  startDate: string,
  endDate: string
): DailyStats[] => {
  const stats: Map<string, DailyStats> = new Map();
  
  // Initialize all dates in range
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split('T')[0];
    stats.set(dateStr, {
      date: dateStr,
      totalAppointments: 0,
      completedAppointments: 0,
      cancelledAppointments: 0,
      revenue: 0,
    });
  }
  
  // Count appointments
  data.appointments.forEach(a => {
    const dateStr = a.appointmentDate;
    if (dateStr >= startDate && dateStr <= endDate) {
      const stat = stats.get(dateStr);
      if (stat) {
        stat.totalAppointments++;
        if (a.status === 'completed') {
          stat.completedAppointments++;
          stat.revenue += a.totalPrice;
        } else if (a.status === 'cancelled') {
          stat.cancelledAppointments++;
        }
      }
    }
  });
  
  return Array.from(stats.values()).sort((a, b) => a.date.localeCompare(b.date));
};

export const getServiceStats = (data: AppointmentData): ServiceStats[] => {
  return data.services.map(service => {
    const appointments = data.appointments.filter(
      a => a.serviceId === service.id && a.status === 'completed'
    );
    const reviews = data.reviews.filter(r => r.serviceId === service.id);
    
    return {
      serviceId: service.id,
      serviceName: service.name,
      totalBookings: appointments.length,
      totalRevenue: appointments.reduce((sum, a) => sum + a.totalPrice, 0),
      averageRating: reviews.length > 0 
        ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
        : 0,
    };
  });
};

export const getStaffStats = (data: AppointmentData): StaffStats[] => {
  return data.staff.map(staff => {
    const appointments = data.appointments.filter(
      a => a.staffId === staff.id && a.status === 'completed'
    );
    const reviews = data.reviews.filter(r => r.staffId === staff.id);
    
    return {
      staffId: staff.id,
      staffName: staff.name,
      totalBookings: data.appointments.filter(a => a.staffId === staff.id).length,
      completedBookings: appointments.length,
      averageRating: getAverageRating(data, staff.id),
      totalRevenue: appointments.reduce((sum, a) => sum + a.totalPrice, 0),
    };
  });
};
