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
		path: '/the-duc',
		name: 'Thể dục',
		icon: 'HeartOutlined',
		routes: [
			{
				path: '/the-duc',
				exact: true,
				redirect: '/the-duc/dashboard',
			},
			{
				path: '/the-duc/dashboard',
				name: 'Thể dục',
				component: './TheDuc/Dashboard',
			},
			{
				path: '/the-duc/nhat-ky-tap-luyen',
				name: 'Nhật ký tập luyện',
				component: './TheDuc/NhatKyTapLuyen',
			},
			{
				path: '/the-duc/nhat-ky-suc-khoe',
				name: 'Nhật ký sức khỏe',
				component: './TheDuc/NhatKySucKhoe',
			},
			{
				path: '/the-duc/muc-tieu',
				name: 'Quản lý mục tiêu',
				component: './TheDuc/QuanLyMucTieu',
			},
			{
				path: '/the-duc/thu-vien-bai-tap',
				name: 'Thư viện bài tập',
				component: './TheDuc/ThuVienBaiTap',
			},
		],
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
			path: '/admin',
			name: 'Quản trị',
			routes: [
				{
					path: '/admin/tin-tuc',
					name: 'Quản lý bài viết',
					component: './Admin/TinTuc',
				},
				{
					path: '/admin/tags',
					name: 'Quản lý thẻ',
					component: './Admin/Tags',
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
	path: '/tin-tuc',
	name: 'Tin tức',
	routes: [
		{
			path: '/tin-tuc',
			exact: true,
			component: './TinTuc',
		},
		{
			path: '/tin-tuc/detail',
			exact: true,
			component: './TinTuc/Detail',
			hideInMenu: true,
		},
		{
			path: '/tin-tuc/author',
			exact: true,
			component: './TinTuc/Author',
			hideInMenu: true,
		},
	],
	},
	{
 		path: '/todo-list',
 		name: 'Công việc cá nhân',
 		icon: 'OrderedListOutlined',
 		routes: [
 			{ path: '/todo-list', exact: true, redirect: '/todo-list/dashboard' },
 			{ path: '/todo-list/dashboard', name: 'Dashboard', component: './TodoList/Dashboard' },
 			{ path: '/todo-list/kanban', name: 'Kanban', component: './TodoList/Kanban' },
 			{ path: '/todo-list/list', name: 'Danh sách', component: './TodoList/List' },
 		],
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
