export type TrangThai = 'open' | 'ended' | 'paused';

export interface KhoaHoc {
  id: string;
  name: string;
  instructor: string;
  students: number;
  status: TrangThai;
}

export const NHAN_TRANG_THAI: Record<TrangThai, string> = {
  open: 'Đang mở',
  ended: 'Đã kết thúc',
  paused: 'Tạm dừng',
};

export const GIANG_VIEN = ['Nguyễn Văn A', 'Trần Thị B', 'Lê Văn C'];

export const KHOA_HOC_KEY = 'courses_v1';

export const taoDuLieuMacDinh = (): KhoaHoc[] => [
  { id: 'KH001', name: 'Lập trình React cơ bản', instructor: GIANG_VIEN[0], students: 12, status: 'open' },
  { id: 'KH002', name: 'NodeJS cho người mới', instructor: GIANG_VIEN[1], students: 0, status: 'paused' },
  { id: 'KH003', name: 'Thiết kế UI/UX', instructor: GIANG_VIEN[2], students: 5, status: 'ended' },
  { id: 'KH004', name: 'Lập trình Python nâng cao', instructor: GIANG_VIEN[0], students: 20, status: 'open' },
];
