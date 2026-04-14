import { Button, Input, Modal, Select, Space, message } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import BangKhoaHoc from './components/CourseTable';
import FormKhoaHoc from './components/CourseModalForm';
import { KhoaHoc, GIANG_VIEN } from './types';
import { taiKhoaHoc, luuKhoaHoc } from './utils';

const QuanLyKhoaHoc = () => {
  const [danhSach, setDanhSach] = useState<KhoaHoc[]>([]);
  const [hienModal, setHienModal] = useState(false);
  const [khoaHocDangChinhSua, setKhoaHocDangChinhSua] = useState<KhoaHoc | null>(null);
  const [locTen, setLocTen] = useState('');
  const [locGiangVien, setLocGiangVien] = useState<string | null>(null);
  const [locTrangThai, setLocTrangThai] = useState<string | null>(null);

  useEffect(() => {
    const ds = taiKhoaHoc();
    setDanhSach(ds);
  }, []);

  useEffect(() => {
    luuKhoaHoc(danhSach);
  }, [danhSach]);

  const duLieuLoc = useMemo(() => {
    return danhSach
      .filter((k) => k.name.toLowerCase().includes(locTen.toLowerCase()))
      .filter((k) => (locGiangVien ? k.instructor === locGiangVien : true))
      .filter((k) => (locTrangThai ? k.status === locTrangThai : true));
  }, [danhSach, locTen, locGiangVien, locTrangThai]);

  const xoaKhoaHoc = (k: KhoaHoc) => {
    if (k.students > 0) {
      Modal.info({ title: 'Không thể xóa', content: 'Chỉ được xóa khóa học chưa có học viên.' });
      return;
    }
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: `Bạn chắc chắn muốn xóa khóa "${k.name}"?`,
      onOk() {
        setDanhSach((prev) => prev.filter((p) => p.id !== k.id));
        message.success('Đã xóa thành công');
      },
    });
  };

  const guiKhoaHoc = (values: any) => {
    // kiểm tra trùng tên
    const name = (values.name || '').trim();
    const trung = danhSach.find((c) => c.name === name && c.id !== values.id);
    if (trung) return message.error('Tên khóa học đã tồn tại');

    if (values.id) {
      setDanhSach((prev) => prev.map((c) => (c.id === values.id ? { ...c, ...values } : c)));
      message.success('Cập nhật khóa học');
    } else {
      const newId = `KH${Math.floor(Math.random() * 900 + 100)}`;
      const moi: KhoaHoc = { ...values, id: newId };
      setDanhSach((prev) => [moi, ...prev]);
      message.success('Thêm khóa học thành công');
    }
    setHienModal(false);
  };

  return (
    <div>
      <h2>Quản lý khóa học</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder='Tìm theo tên khóa học' allowClear onSearch={(v) => setLocTen(v)} style={{ width: 280 }} />
        <Select placeholder='Lọc giảng viên' allowClear style={{ width: 200 }} onChange={(v) => setLocGiangVien(v ?? null)} options={GIANG_VIEN.map((i) => ({ label: i, value: i }))} />
        <Select placeholder='Lọc trạng thái' allowClear style={{ width: 160 }} onChange={(v) => setLocTrangThai(v ?? null)} options={[{ label: 'Đang mở', value: 'open' }, { label: 'Đã kết thúc', value: 'ended' }, { label: 'Tạm dừng', value: 'paused' }]} />
        <Button type='primary' onClick={() => { setKhoaHocDangChinhSua(null); setHienModal(true); }}>Thêm mới</Button>
      </Space>

      <BangKhoaHoc duLieu={duLieuLoc} sua={(k) => { setKhoaHocDangChinhSua(k); setHienModal(true); }} xoa={xoaKhoaHoc} />

      <FormKhoaHoc hien={hienModal} dangChinhSua={khoaHocDangChinhSua} huy={() => setHienModal(false)} gui={guiKhoaHoc} />
    </div>
  );
};

export default QuanLyKhoaHoc;
