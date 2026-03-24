import React, { useEffect, useState } from 'react';
import { Card, Tabs } from 'antd';
import BooksTab from './components/BooksTab';
import DecisionsTab from './components/DecisionsTab';
import TemplateTab from './components/TemplateTab';
import CertificatesTab from './components/CertificatesTab';
import SearchTab from './components/SearchTab';

const { TabPane } = Tabs;

const ls = {
  get: (k: string, def: any = []) => {
    try { return JSON.parse(localStorage.getItem(k) || 'null') ?? def; } catch { return def; }
  },
  set: (k: string, v: any) => localStorage.setItem(k, JSON.stringify(v)),
};

const KEY_BOOKS = 'vb_books';
const KEY_DECISIONS = 'vb_decisions';
const KEY_TEMPLATES = 'vb_templates';
const KEY_CERTS = 'vb_certificates';

const uid = () => `${Date.now()}_${Math.random().toString(36).slice(2,8)}`;

const VanBangPage: React.FC = () => {
  const [books, setBooks] = useState(ls.get(KEY_BOOKS, []));
  const [decisions, setDecisions] = useState(ls.get(KEY_DECISIONS, []));
  const [templates, setTemplates] = useState(ls.get(KEY_TEMPLATES, []));
  const [certs, setCerts] = useState(ls.get(KEY_CERTS, []));

  useEffect(() => { ls.set(KEY_BOOKS, books); }, [books]);
  useEffect(() => { ls.set(KEY_DECISIONS, decisions); }, [decisions]);
  useEffect(() => { ls.set(KEY_TEMPLATES, templates); }, [templates]);
  useEffect(() => { ls.set(KEY_CERTS, certs); }, [certs]);

  return (
    <Card>
      <h2>Quản lý Văn bằng</h2>
      <Tabs defaultActiveKey="1">
        <TabPane tab="Quản lý sổ" key="1"><BooksTab books={books} setBooks={setBooks} uid={uid} /></TabPane>
        <TabPane tab="Quyết định" key="2"><DecisionsTab decisions={decisions} setDecisions={setDecisions} books={books} uid={uid} /></TabPane>
        <TabPane tab="Cấu hình biểu mẫu" key="3"><TemplateTab templates={templates} setTemplates={setTemplates} /></TabPane>
        <TabPane tab="Thông tin văn bằng" key="4"><CertificatesTab certs={certs} setCerts={setCerts} books={books} setBooks={setBooks} decisions={decisions} uid={uid} /></TabPane>
        <TabPane tab="Tra cứu" key="5"><SearchTab certs={certs} decisions={decisions} uid={uid} /></TabPane>
      </Tabs>
    </Card>
  );
};

export default VanBangPage;
