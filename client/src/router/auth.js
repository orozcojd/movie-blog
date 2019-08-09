import Login from '@/components/Auth/Login'
import Register from '@/components/Auth/Register'
import Index from '@/components/Auth/Index'
import PasswordReset from '@/components/AdminView/Forms/PasswordReset'
import {loggedInRedirect} from '@/Authentication/AuthGuard'
import { adminLogin, passReset } from '@/constants/types'

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
				beforeEnter: loggedInRedirect()
			},
			{
				path: passReset.path,
				name: passReset.name,
				component: PasswordReset,
				canReuse: false,
				beforeEnter: loggedInRedirect()
			},
			// {
			// 	path: 'register',
			// 	name: 'admin-register',
			// 	component: Register,
			// }
		]
	}
]

export default authRoutes