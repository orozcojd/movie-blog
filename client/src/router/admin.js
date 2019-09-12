const AdminPostForm = () => import('@/components/AdminView/Forms/AdminPostForm')
const AdminEditPost = () => import('@/components/AdminView/Posts/AdminEditPost')
const AdminPosts = () => import('@/components/AdminView/Posts/Posts')
const Index = () => import('@/components/AdminView/Index')
const AdminCategories = () => import('@/components/AdminView/Posts/AdminCategories')
const AdminTagView = () => import('@/components/AdminView/Forms/AdminTagView')
const AddUser = () => import('@/components/AdminView/Forms/AddUser')
const AboutContributor = ()  => import('@/components/AdminView/Forms/AboutContributor')
const EditUsers = () => import('@/components/AdminView/Forms/EditUsers')
import {adminGuard} from '@/Authentication/AuthGuard'
import * as types from '@/constants/types'

const adminRoutes = [
	{
		path: '/admin',
		component: Index,
		children: [
			{
				path: types.adminCategories.path,
				name: types.adminCategories.name,
				component: AdminCategories,
				beforeEnter: adminGuard()
			},
			{
				path: types.addUser.path,
				name: types.addUser.name,
				component: AddUser,
				beforeEnter: adminGuard(),
				meta: {requiresAuth: true, roles: ['CREATOR', 'ADMINISTRATOR']},
			},
			{
				path: types.editUsers.path,
				name: types.editUsers.name,
				component: EditUsers,
				beforeEnter: adminGuard(),
				meta: {requiresAuth: true, roles: ['CREATOR']}
			},
			{
				path: types.adminArticleView.path,
				name: types.adminArticleView.name,
				component: AdminPostForm,
				beforeEnter: adminGuard()
			},
			{
				path: types.adminCreatePost.path,
				name: types.adminCreatePost.name,
				component: AdminEditPost,
				beforeEnter: adminGuard()
			},
			{
				path: types.adminEditPost.path,
				name: types.adminEditPost.name,
				props: true,
				component: AdminEditPost,
				beforeEnter: adminGuard()
			},
			{
				path: types.adminEditPosts.path,
				name: types.adminEditPosts.name,
				component: AdminPosts,
				props: { drafts: false },
				beforeEnter: adminGuard()
			},
			{
				path: types.adminEditDrafts.path,
				name: types.adminEditDrafts.name,
				component: AdminPosts,
				props: { drafts: true },
				beforeEnter: adminGuard()
			},
			{
				path: types.adminEditMain.path,
				name: types.adminEditMain.name,
				component: AdminTagView,
				beforeEnter: adminGuard()
			},
			{
				path: types.adminAboutContributor.path,
				name: types.adminAboutContributor.name,
				props: true,
				component: AboutContributor,
				beforeEnter: adminGuard()
			}
		]
	}
]

export default adminRoutes
