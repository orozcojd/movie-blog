const AdminPostForm = () => import('@/components/AdminView/Forms/AdminPostForm')
const AdminEditPost = () => import('@/components/AdminView/Posts/AdminEditPost')
const AdminPosts = () => import('@/components/AdminView/Posts/Posts')
const Index = () => import('@/components/AdminView/Index')
const AdminCategories = () => import('@/components/AdminView/Posts/AdminCategories')
const AdminTagView = () => import('@/components/AdminView/Forms/AdminTagView')
const AddUser = () => import('@/components/AdminView/Forms/AddUser')
const AboutContributor = ()  => import('@/components/AdminView/Forms/AboutContributor')
const EditUsers = () => import('@/components/AdminView/Forms/EditUsers')
const Review = () => import('@/components/AdminView/Reviews')
const rCategories = () => import('@/components/AdminView/Reviews/Categories')
const ReviewArticle = () => import('@/components/AdminView/Reviews/ReviewArticle')


import {adminGuard} from '@/Authentication/AuthGuard'
import * as types from '@/constants/types'
import ability from '@/Authentication/ability'
import store from '@/store'

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
				meta: {requiresAuth: true, allowed: () => ability(store.getters['auth/getAclUser']).can('view', 'User')},
			},
			{
				path: types.editUsers.path,
				name: types.editUsers.name,
				component: EditUsers,
				beforeEnter: adminGuard(),
				meta: {requiresAuth: true, allowed: () => ability(store.getters['auth/getAclUser']).can('view', 'Users')}
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
				props: { status: 'AP' },
				beforeEnter: adminGuard()
			},
			{
				path: types.adminEditDrafts.path,
				name: types.adminEditDrafts.name,
				component: AdminPosts,
				props: { status: 'DR' },
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
			},
			{
				path: 'review',
				component: Review,
				children: [
					{
						path: '',
						name: types.reviewArticles.name,
						component: rCategories,
						beforeEnter: adminGuard()
					},
					{
						path: 'articles/:id',
						name: 'review-articles',
						component: ReviewArticle,
						beforeEnter: adminGuard()
					},
					{
						path: 'articles',
						name: types.revAvail.name,
						component: AdminPosts,
						props: { status: 'NR', review: true },
						beforeEnter: adminGuard()
					},
					{
						path: 'await-review',
						name: 'await-review',
						component: AdminPosts,
						props: { status: 'NR', review: false},
						beforeEnter: adminGuard()
					},
					{
						path: 'edits',
						name: 'edit-review',
						component: AdminPosts,
						props: { status: 'ED' },
						beforeEnter: adminGuard()
					},
					{
						path: 'in-review',
						name: 'in-review',
						component: AdminPosts,
						props: { status: 'IR' },
						beforeEnter: adminGuard()
					},
					{
						path: 'claimed',
						name: 'claimed',
						component: AdminPosts,
						props: { status: 'IR', reviewer: true },
						beforeEnter: adminGuard()
					}
				]
			}
		]
	}
]

export default adminRoutes
