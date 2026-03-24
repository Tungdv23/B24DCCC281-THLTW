import React from 'react';
import { Form, Input, DatePicker, Button, Table, message } from 'antd';
import moment from 'moment';

const SearchTab: React.FC<any> = ({ certs, decisions, setLogs, uid }) => {
  const [form] = Form.useForm();
  const [results, setResults] = React.useState<any[]>([]);

  const doSearch = (vals: any) => {
    const filled = Object.values(vals).filter((v: any) => v !== undefined && v !== null && String(v).trim() !== '');
    if (filled.length < 2) return message.error('Vui lòng nhập ít nhất 2 tham số tìm kiếm');
    const matched = certs.filter((c: any) => {
      if (vals.certificateNumber && !String(c.certificateNumber).includes(String(vals.certificateNumber))) return false;
      if (vals.registerNumber && Number(c.registerNumber) !== Number(vals.registerNumber)) return false;
      if (vals.studentId && !String(c.studentId).includes(String(vals.studentId))) return false;
      if (vals.fullName && !String(c.fullName).toLowerCase().includes(String(vals.fullName).toLowerCase())) return false;
      if (vals.dob && moment(c.dob).format('YYYY-MM-DD') !== moment(vals.dob).format('YYYY-MM-DD')) return false;
      return true;
    });
    setResults(matched);
    const logs = JSON.parse(localStorage.getItem('vb_lookup_logs') || '[]');
    logs.push({ id: uid(), searchAt: Date.now(), params: vals, resultCount: matched.length, decisionId: matched[0]?.decisionId || null });
    localStorage.setItem('vb_lookup_logs', JSON.stringify(logs));
    message.success(`Tìm được ${matched.length} kết quả`);
  };

  return (
    <div>
      <Form form={form} layout="inline" onFinish={doSearch} style={{ marginBottom: 12 }}>
        <Form.Item name="certificateNumber"><Input placeholder="Số hiệu văn bằng" /></Form.Item>
        <Form.Item name="registerNumber"><Input placeholder="Số vào sổ" /></Form.Item>
        <Form.Item name="studentId"><Input placeholder="Mã SV" /></Form.Item>
        <Form.Item name="fullName"><Input placeholder="Họ tên" /></Form.Item>
        <Form.Item name="dob"><DatePicker /></Form.Item>
        <Form.Item><Button type="primary" htmlType="submit">Tìm</Button></Form.Item>
      </Form>
      <Table rowKey="id" dataSource={results} columns={[{title:'Số vào sổ',dataIndex:'registerNumber'},{title:'Số hiệu',dataIndex:'certificateNumber'},{title:'Mã SV',dataIndex:'studentId'},{title:'Họ tên',dataIndex:'fullName'},{title:'Quyết định',dataIndex:'decisionId',render:(id:any)=>decisions.find((d:any)=>d.id===id)?.decisionNumber||''}]} pagination={{pageSize:5}} />
    </div>
  );
};

export default SearchTab;
