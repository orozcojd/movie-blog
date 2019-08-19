const Posts = () => import('@/components/Posts/Posts')
const PostView = () => import('@/components/Posts/PostView')
const TagView = () => import('@/components/Posts/TagView')
const NotFound = () => import('@/components/Layouts/NotFound')
const ContributorView = () => import('@/components/Layouts/ContributorPreview')
const AboutView = () => import('@/components/Footer/About')
const ContactView = () => import('@/components/Footer/Contact')
import ArticleGuard from '@/components/RouterGuards/ArticleGuards'

import * as types from '@/constants/postTypes'
const postRoutes = [
	{
		path: types.root.path,
		name: types.root.name,
		component: Posts
	},
	{
		path: types.articleView.path,
		name: types.articleView.name,
		component: PostView
	},
	{
		path: types.tagView.path,
		name: types.tagView.name,
		component: TagView,
		beforeEnter: ArticleGuard.tagViewGuard(),
		props: true
	},
	{
		path: types.aboutContributor.path,
		name: types.aboutContributor.name,
		component: ContributorView,
		// props: true
	},
	{
		path: types.aboutView.path,
		name: types.aboutView.name,
		component: AboutView
	},
	{
		path: types.contactView.path,
		name: types.contactView.name,
		component: ContactView
	},
	{
		path: types.notFound.path,
		name: types.notFound.name,
		component: NotFound
	}
]
export default postRoutes
