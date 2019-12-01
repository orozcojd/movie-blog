import { loggedInRedirect } from '@/Authentication/AuthGuard';
import { adminLogin, passReset } from '@/constants/types';

const Login = () => import('@/components/Auth/Login');
const Index = () => import('@/components/Auth/Index');
const PasswordReset = () => import('@/components/AdminView/Forms/PasswordReset');

const authRoutes = [
	{
		path: '/auth',
		component: Index,
		children: [
			{
				path: adminLogin.path,
				name: adminLogin.name,
				component: Login,
				canReuse: false,
				beforeEnter: loggedInRedirect(),
			},
			{
				path: passReset.path,
				name: passReset.name,
				component: PasswordReset,
				canReuse: false,
				beforeEnter: loggedInRedirect(),
			},
		],
	},
];

export default authRoutes;
