import React, { useEffect, useState } from 'react'
import { Card, Statistic } from 'antd'

const KEYS = { clubs: 'cm_clubs', regs: 'cm_registrations', members: 'cm_members' }

function read(k: string) {
  try {
    const raw = localStorage.getItem(k)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export default function Reports() {
  const [clubs, setClubs] = useState<any[]>([])
  const [regs, setRegs] = useState<any[]>([])
  const [members, setMembers] = useState<any[]>([])

  useEffect(() => {
    setClubs(read(KEYS.clubs))
    setRegs(read(KEYS.regs))
    setMembers(read(KEYS.members))
  }, [])

  const counts = {
    clubs: clubs.length,
    pending: regs.filter((r) => r.status === 'Pending').length,
    approved: regs.filter((r) => r.status === 'Approved').length,
    rejected: regs.filter((r) => r.status === 'Rejected').length,
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
      <Card>
        <Statistic title="Số CLB" value={counts.clubs} />
      </Card>
      <Card>
        <Statistic title="Pending" value={counts.pending} />
      </Card>
      <Card>
        <Statistic title="Approved" value={counts.approved} />
      </Card>
      <Card>
        <Statistic title="Rejected" value={counts.rejected} />
      </Card>

      <div style={{ gridColumn: '1 / -1', marginTop: 12 }}>
        <h3>Số đơn đăng ký theo CLB (cột tương ứng 3 trạng thái)</h3>
        <div style={{ display: 'flex', gap: 12, alignItems: 'end' }}>
          {clubs.map((c) => {
            const totalPending = regs.filter((r: any) => r.clubId === c.id && r.status === 'Pending').length
            const totalApproved = regs.filter((r: any) => r.clubId === c.id && r.status === 'Approved').length
            const totalRejected = regs.filter((r: any) => r.clubId === c.id && r.status === 'Rejected').length
            const max = Math.max(totalPending, totalApproved, totalRejected, 1)
            return (
              <div key={c.id} style={{ textAlign: 'center' }}>
                <div style={{ height: 120, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                  <div style={{ width: 18, height: `${(totalPending / max) * 100}%`, background: '#ffd666' }} title={`Pending: ${totalPending}`} />
                  <div style={{ width: 18, height: `${(totalApproved / max) * 100}%`, background: '#73d13d' }} title={`Approved: ${totalApproved}`} />
                  <div style={{ width: 18, height: `${(totalRejected / max) * 100}%`, background: '#ff4d4f' }} title={`Rejected: ${totalRejected}`} />
                </div>
                <div style={{ marginTop: 6, width: 58 }}>{c.name}</div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
