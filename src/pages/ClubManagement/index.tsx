import React from 'react'
import { Tabs, PageHeader } from 'antd'
import ClubList from './components/ClubList'
import RegistrationList from './components/RegistrationList'
import MembersList from './components/MembersList'
import Reports from './components/Reports'

const { TabPane } = Tabs

export default function ClubManagementPage() {
  return (
    <div style={{ padding: 16 }}>
      <PageHeader title="Quản lý Câu Lạc Bộ" />
      <Tabs defaultActiveKey="clubs">
        <TabPane tab="Danh sách CLB" key="clubs">
          <ClubList />
        </TabPane>
        <TabPane tab="Đơn đăng ký" key="registrations">
          <RegistrationList />
        </TabPane>
        <TabPane tab="Thành viên" key="members">
          <MembersList />
        </TabPane>
        <TabPane tab="Báo cáo" key="reports">
          <Reports />
        </TabPane>
      </Tabs>
    </div>
  )
}
