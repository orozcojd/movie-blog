import Login from '@/components/AdminView/Login'
import Register from '@/components/AdminView/Register'
import AuthGuard from '@/components/Authentication/AuthGuard'
import AdminPostForm from '@/components/AdminView/AdminPostForm'
import AdminNewPost from '@/components/AdminView/AdminNewPost'
import AdminPosts from '@/components/AdminView/Posts'
import Index from '@/components/AdminView/Index'
import AdminCategories from '@/components/AdminView/AdminCategories'
import AdminTagView from '@/components/AdminView/AdminTagView'
import AddUser from '@/components/AdminView/AddUser'
import AdminPostPreview from '@/components/AdminView/AdminPostPreview'
import AdminNewPPreview from '@/components/AdminView/AdminNewPPreview'
import AboutContributor from '@/components/AdminView/AboutContributor'
import EditUsers from '@/components/AdminView/EditUsers'
import PasswordReset from '@/components/AdminView/PasswordReset'
import store from '@/store'
const adminRoutes = [
	{
		path: '/admin',
		component: Index,
		children: [
			{
				path: '',
				name: 'admin-categories',
				component: AdminCategories,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'add-user',
				name: 'admin-add-user',
				component: AddUser,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'edit-users',
				name: 'admin-edit-users',
				component: EditUsers,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'login',
				name: 'admin-login',
				component: Login,
				canReuse: false,
				beforeEnter: AuthGuard.loggedInRedirect()
			},
			{
				path: 'password-reset',
				name: 'admin-pass-reset',
				component: PasswordReset,
				canReuse: false,
				beforeEnter: AuthGuard.loggedInRedirect()
			},
			{
				path: 'register',
				name: 'admin-register',
				component: Register,
				// beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'article/:id',
				name: 'admin-article-view',
				component: AdminPostForm,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'create-post',
				name: 'admin-create-post',
				component: AdminNewPost,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'edit-post/:id',
				name: 'admin-edit-post',
				props: true,
				component: AdminNewPost,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'edit-posts',
				name: 'admin-edit-posts',
				component: AdminPosts,
				props: { drafts: false },
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'edit-drafts',
				name: 'admin-edit-drafts',
				component: AdminPosts,
				props: { drafts: true },
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'edit-main',
				name: 'admin-edit-main',
				component: AdminTagView,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'preview-post/:id',
				name: 'admin-post-preview',
				props: true,
				component: AdminNewPPreview,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'preview-post',
				name: 'admin-new-post-preview',
				props: true,
				component: AdminNewPPreview,
				beforeEnter: AuthGuard.adminGuard()
			},
			{
				path: 'about-contributor',
				name: 'admin-about-contributor',
				props: true,
				component: AboutContributor,
				beforeEnter: AuthGuard.adminGuard()
			}
		]
	}
]

export default adminRoutes
