import React from 'react';
import { Button, Space, Tag, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { KhoaHoc, TrangThai, NHAN_TRANG_THAI } from '../types';

type Props = {
  duLieu: KhoaHoc[];
  sua: (k: KhoaHoc) => void;
  xoa: (k: KhoaHoc) => void;
};

const BangKhoaHoc: React.FC<Props> = ({ duLieu, sua, xoa }) => {
  const columns: ColumnsType<KhoaHoc> = [
    { title: 'Mã', dataIndex: 'id', key: 'id', width: 120 },
    { title: 'Tên khóa học', dataIndex: 'name', key: 'name' },
    { title: 'Giảng viên', dataIndex: 'instructor', key: 'instructor', width: 160 },
    { title: 'Số lượng học viên', dataIndex: 'students', key: 'students', width: 160, sorter: (a, b) => a.students - b.students },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 140,
      render: (val: TrangThai) => {
        const color = val === 'open' ? 'green' : val === 'ended' ? 'grey' : 'orange';
        return <Tag color={color}>{NHAN_TRANG_THAI[val]}</Tag>;
      },
    },
    {
      title: 'Hành động',
      key: 'action',
      width: 220,
      render: (_text, record) => (
        <Space>
          <Button onClick={() => sua(record)}>Sửa</Button>
          <Button danger onClick={() => xoa(record)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return <Table rowKey='id' dataSource={duLieu} columns={columns} />;
};

export default BangKhoaHoc;
