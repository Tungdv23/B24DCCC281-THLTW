import { Table, Button, message } from "antd";
import { useState } from "react";
import SanphamModel from "../../components/SanPham/SanPham";
import { dataSource, columns } from "./data/dataSouse";

const SanPham = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(dataSource);

  const handleAddproduct = (values: any) => {
    const newProduct = {
      id: data.length + 1,
      ...values,
    };

    setData([...data, newProduct]);
    message.success("Thêm sản phẩm thành công");
    setOpen(false);
  };

  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Thêm sản phẩm
      </Button>

      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        style={{ marginTop: 16 }}
      />

      <SanphamModel
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleAddproduct}
      />
    </div>
  );
};

export default SanPham;
