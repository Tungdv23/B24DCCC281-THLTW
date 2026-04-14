import React from 'react';
import { Button, Form, Input, message, Modal, Select } from 'antd';
import { KhoaHoc, GIANG_VIEN } from '../types';

type Props = {
  hien: boolean;
  dangChinhSua: KhoaHoc | null;
  huy: () => void;
  gui: (values: Omit<KhoaHoc, 'id'> & { id?: string }) => void;
};

const FormKhoaHoc: React.FC<Props> = ({ hien, dangChinhSua, huy, gui }) => {
  return (
    <Modal title={dangChinhSua ? 'Chỉnh sửa khóa học' : 'Thêm khóa học'} visible={hien} onCancel={huy} footer={null} destroyOnClose>
      <Form
        initialValues={dangChinhSua ?? { id: '', name: '', instructor: GIANG_VIEN[0], students: 0, status: 'open' }}
        onFinish={(values: any) => {
          const name = (values.name || '').trim();
          if (!name) return message.error('Tên khóa học không được để trống');
          if (name.length > 100) return message.error('Tên khóa tối đa 100 ký tự');
          gui({ ...values, name });
        }}
      >
        <Form.Item label='Mã (tự tạo)' name='id'>
          <Input disabled />
        </Form.Item>
        <Form.Item name='name' label='Tên khóa học' rules={[{ required: true, message: 'Nhập tên khóa học' }, { max: 100, message: 'Tối đa 100 ký tự' }]}>
          <Input />
        </Form.Item>
        <Form.Item name='instructor' label='Giảng viên' rules={[{ required: true }]}>
          <Select options={GIANG_VIEN.map((i) => ({ label: i, value: i }))} />
        </Form.Item>
        <Form.Item name='students' label='Số lượng học viên' rules={[{ required: true }]}>
          <Input type='number' />
        </Form.Item>
        <Form.Item name='status' label='Trạng thái' rules={[{ required: true }]}>
          <Select options={[{ label: 'Đang mở', value: 'open' }, { label: 'Đã kết thúc', value: 'ended' }, { label: 'Tạm dừng', value: 'paused' }]} />
        </Form.Item>
        <div style={{ textAlign: 'right' }}>
          <Button style={{ marginRight: 8 }} onClick={huy}>Hủy</Button>
          <Button type='primary' htmlType='submit'>
            {dangChinhSua ? 'Cập nhật' : 'Thêm'}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default FormKhoaHoc;
