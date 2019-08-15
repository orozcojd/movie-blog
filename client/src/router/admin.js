
import {adminGuard} from '@/Authentication/AuthGuard'
import AdminPostForm from '@/components/AdminView/Forms/AdminPostForm'
import AdminEditPost from '@/components/AdminView/Posts/AdminEditPost'
import AdminPosts from '@/components/AdminView/Posts/Posts'
import Index from '@/components/AdminView/Index'
import AdminCategories from '@/components/AdminView/Posts/AdminCategories'
import AdminTagView from '@/components/AdminView/Forms/AdminTagView'
import AddUser from '@/components/AdminView/Forms/AddUser'
import AboutContributor from '@/components/AdminView/Forms/AboutContributor'
import EditUsers from '@/components/AdminView/Forms/EditUsers'
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
				beforeEnter: adminGuard()
			},
			{
				path: types.editUsers.path,
				name: types.editUsers.name,
				component: EditUsers,
				beforeEnter: adminGuard()
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
