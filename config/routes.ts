import component from "@/locales/en-US/component";
import { icons } from "antd/lib/image/PreviewGroup";
import path from "path";

export default [
	{
		path: '/user',
		layout: false,
		routes: [
			{
				path: '/user/login',
				layout: false,
				name: 'login',
				component: './user/Login',
			},
			{
				path: '/user',
				redirect: '/user/login',
			},
		],
	},

	///////////////////////////////////
	// DEFAULT MENU
	{
		path: '/dashboard',
		name: 'Dashboard',
		component: './TrangChu',
		icon: 'HomeOutlined',
	},
	{
		path: '/du-lich',
		name: 'Du lịch',
		routes: [
			{
				path: '/du-lich',
				exact: true,
				redirect: '/du-lich/explore',
			},
			{
				path: '/du-lich/explore',
				name: 'Khám phá',
				component: './DuLich',
			},
			{
				path: '/du-lich/lich-trinh',
				name: 'Lập kế hoạch',
				component: './LichTrinh',
			},
			{
				path: '/du-lich/admin',
				name: 'Quản trị điểm đến',
				component: './Admin/DiaDiem',
			},
		],
	},
	{
		path: '/club-management',
		name: 'Quản lý CLB',
		component: './ClubManagement',
	},
	{
		path: '/VanBang',
		name: 'VanBang',
		component: './VanBang',
	},
	{
		path: '/tro-choi',
		name: 'trò chơi',
		component: './TroChoi',
	},
	{
		path: '/bai2',
		name: 'bài 2',
		component: './Bai2',
	},
	{
		path:"/san-Pham",
		name:"SanPham",
		component:"./SanPham",
	},
	{
		path: '/gioi-thieu',
		name: 'About',
		component: './TienIch/GioiThieu',
		hideInMenu: true,
	},
	{
		path: '/random-user',
		name: 'RandomUser',
		component: './RandomUser',
		icon: 'ArrowsAltOutlined',
	},
	{
		path: '/todo-list',
		name: 'TodoList',
		icon: 'OrderedListOutlined',
		component: './TodoList',
	},
	{
		path: '/quan-ly-khoa-hoc',
		name: 'Quản lý khóa học',
		icon: 'BookOutlined',
		component: './QuanLyKhoaHoc',
	},
	{
		path: '/lich-hen',
		name: 'Lịch hẹn',
		icon: 'CalendarOutlined',
		component: './LichHen/LichHen',
	},
	// moved LichTrinh and Admin under /du-lich

	// DANH MUC HE THONG
	// {
	// 	name: 'DanhMuc',
	// 	path: '/danh-muc',
	// 	icon: 'copy',
	// 	routes: [
	// 		{
	// 			name: 'ChucVu',
	// 			path: 'chuc-vu',
	// 			component: './DanhMuc/ChucVu',
	// 		},
	// 	],
	// },

	{
		path: '/notification',
		routes: [
			{
				path: './subscribe',
				exact: true,
				component: './ThongBao/Subscribe',
			},
			{
				path: './check',
				exact: true,
				component: './ThongBao/Check',
			},
			{
				path: './',
				exact: true,
				component: './ThongBao/NotifOneSignal',
			},
		],
		layout: false,
		hideInMenu: true,
	},
	{
		path: '/',
		redirect: '/dashboard',
	},
	{
		path: '/403',
		component: './exception/403/403Page',
		layout: false,
	},
	{
		path: '/hold-on',
		component: './exception/DangCapNhat',
		layout: false,
	},
	{
		component: './exception/404',
	},
];
