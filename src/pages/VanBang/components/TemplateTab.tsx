import React, { useEffect } from 'react';
import { Button, Table, Select, Space, message } from 'antd';
const { Option } = Select;

const TemplateTab: React.FC<any> = ({ templates, setTemplates }) => {
  const [fields, setFields] = React.useState(templates);
  const addField = () => {
    const id = `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;
    setFields([...fields, { id, name: `field_${fields.length+1}`, label: `Trường ${fields.length+1}`, type: 'string' }]);
  };
  useEffect(() => setTemplates(fields), [fields]);

  return (
    <div>
      <Space style={{ marginBottom: 12 }}>
        <Button onClick={addField}>Thêm trường</Button>
        <Button onClick={() => { setFields([]); message.success('Đã xóa tất cả trường'); }}>Xóa tất cả</Button>
      </Space>
      <Table rowKey="id" dataSource={fields} pagination={false} columns={[
        { title: 'Tên', dataIndex: 'label' },
        { title: 'Kiểu', dataIndex: 'type', render: (t: any, r: any) => (
            <Select value={t} onChange={(v) => setFields(fields.map((f: any) => f.id === r.id ? { ...f, type: v } : f))}>
              <Option value='string'>String</Option>
              <Option value='number'>Number</Option>
              <Option value='date'>Date</Option>
            </Select>
          ) },
        { title: 'Hành động', render: (r: any) => (<Button danger onClick={() => setFields(fields.filter((f: any) => f.id !== r.id))}>Xóa</Button>) }
      ]} />
    </div>
  );
};

export default TemplateTab;
