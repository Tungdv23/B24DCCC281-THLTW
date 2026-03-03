import { useState } from "react"
import { Tabs, Input, Button, List, Select, DatePicker, InputNumber } from "antd"
import dayjs from "dayjs"
import { loadData, saveData, uid } from "./data/datastore"

const Bai2 = () => {

  const [data, setData] = useState(loadData())
  const [tenMon, setTenMon] = useState("")
  const [monChon, setMonChon] = useState("")
  const [ngayHoc, setNgayHoc] = useState<any>(null)
  const [soGio, setSoGio] = useState(0)
  const [noiDung, setNoiDung] = useState("")
  const [ghiChu, setGhiChu] = useState("")

  const thang = dayjs().format("YYYY-MM")

  const themMon = () => {
    if (!tenMon) return
    data.subjects.push({ id: uid(), name: tenMon, lessons: [] })
    setData({ ...data })
    saveData(data)
    setTenMon("")
  }
  const xoaMon = (id: string) => {
    data.subjects = data.subjects.filter((m: any) => m.id !== id)
    setData({ ...data })
    saveData(data)
  }
  const themLich = () => {
    if (!monChon || !ngayHoc) return
    const lich = { id: uid(), ngay: ngayHoc.toISOString(), time: soGio, noidung: noiDung, note: ghiChu }
    const mon = data.subjects.find((m: any) => m.id === monChon)
    if (mon) mon.lessons.push(lich)
    setData({ ...data })
    saveData(data )
    setNgayHoc(null)
    setSoGio(0)
    setNoiDung("")
    setGhiChu("")
  }
  const xoaLich = (monId: string, lichId: string) => {
    const mon = data.subjects.find((m: any) => m.id === monId)
    if (mon) mon.lessons = mon.lessons.filter((l: any) => l.id !== lichId)
    setData({ ...data })
    saveData(data)
  }
  const tongGio = (mon: any) => {
    return mon.lessons
      .filter((l: any) => dayjs(l.ngay).format("YYYY-MM") === thang)
      .reduce((t: number, l: any) => t + l.time, 0)
  }
  const datMucTieu = (monId: string, value: number) => {
    const key = thang + "_" + monId
    data.targets[key] = value
    setData({ ...data })
    saveData(data )  
  }
  return (
    <div style={{ padding: 40 }}>
      <h2>Bài 2</h2>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Quản lý môn học" key="1">
          <Input value={tenMon} placeholder="Tên môn" onChange={(e) => setTenMon(e.target.value)} />
          <Button type="primary" style={{ marginTop: 10 }} onClick={themMon}>Thêm</Button>
          <List
            style={{ marginTop: 10 }}
            dataSource={data.subjects}
            renderItem={(item: any) => (
              <List.Item actions={[<Button danger onClick={() => xoaMon(item.id)}>Xóa</Button>]}>
                {item.name}
              </List.Item>)}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Lịch học" key="2">
          <Select style={{ width: "100%" }} placeholder="Chọn môn" value={monChon} onChange={(v) => setMonChon(v)}>
            {data.subjects.map((m: any) => (
              <Select.Option key={m.id} value={m.id}>{m.name}</Select.Option>
            ))}
          </Select>
          <DatePicker showTime style={{ width: "100%", marginTop: 10 }} value={ngayHoc} onChange={(v) => setNgayHoc(v)} />
          <InputNumber style={{ width: "100%", marginTop: 10 }} placeholder="Số giờ" value={soGio} onChange={(v) => setSoGio(v || 0)} />
          <Input style={{ marginTop: 10 }} placeholder="Nội dung" value={noiDung} onChange={(e) => setNoiDung(e.target.value)} />
          <Input style={{ marginTop: 10 }} placeholder="Ghi chú" value={ghiChu} onChange={(e) => setGhiChu(e.target.value)} />
          <Button type="primary" style={{ marginTop: 10 }} onClick={themLich}>Thêm lịch</Button>
          {data.subjects.map((m: any) =>
            m.lessons.map((l: any) => (
              <List key={l.id} style={{ marginTop: 10 }}>
                <List.Item actions={[<Button danger onClick={() => xoaLich(m.id, l.id)}>Xóa</Button>]}>
                  {m.name} - {dayjs(l.ngay).format("DD/MM/YYYY HH:mm")} - {l.time} giờ - {l.noidung}
                </List.Item>
              </List>
            ))
          )}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Mục tiêu tháng" key="3">
          {data.subjects.map((m: any) => {
            const tong = tongGio(m)
            const key = thang + "_" + m.id
            const mucTieu = data.targets[key] || 0
            return (
              <div key={m.id} style={{ marginBottom: 20 }}>
                <h4>{m.name}</h4>
                <InputNumber value={mucTieu} placeholder="Nhập mục tiêu giờ" onChange={(v) => datMucTieu(m.id, v || 0)} />
                <p style={{ marginTop: 5 }}>{tong} / {mucTieu} giờ</p>
                <p>{tong >= mucTieu ? "Đã đạt mục tiêu" : "Chưa đạt mục tiêu"}</p>
              </div>
            )
          })}
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}
export default Bai2