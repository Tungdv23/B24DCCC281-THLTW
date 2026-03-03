import { Modal, Form, Input, InputNumber, message } from "antd";

interface SanPhamModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => void;
}

const SanPhamModal = ({ open, onCancel, onOk }: SanPhamModalProps) => {
  const [form] = Form.useForm();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onOk(values);
      form.resetFields();
    } catch (error) {
    }
  };

  return (
    <Modal
      title="Thêm sản phẩm"
      visible={open}
      onCancel={onCancel}
      onOk={handleOk}
      okText="Thêm"
      cancelText="Hủy"
    >
      <Form
        form={form}
        layout="vertical"
      >
        <Form.Item
          label="Tên sản phẩm"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên sản phẩm" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Giá"
          name="price"
          rules={[
            { required: true, message: "Vui lòng nhập giá" },
            { type: "number", min: 1, message: "Giá phải là số dương" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          label="Số lượng"
          name="quantity"
          rules={[
            { required: true, message: "Vui lòng nhập số lượng" },
            { type: "number", min: 1, message: "Số lượng phải > 0" },
          ]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SanPhamModal;
