import Posts from '@/components/Posts/Posts'
import PostView from '@/components/Posts/PostView'
import TagView from '@/components/Posts/TagView'
import NotFound from '@/components/Layouts/NotFound'
import ArticleGuard from '@/components/RouterGuards/ArticleGuards'
import ContributorView from '@/components/Layouts/ContributorPreview'
import AboutView from '@/components/Footer/About'
import ConactView from '@/components/Footer/Contact'
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
		component: ConactView
	},
	{
		path: types.notFound.path,
		name: types.notFound.name,
		component: NotFound
	}
]
export default postRoutes
