import Posts from '@/components/Posts/Posts'
import PostView from '@/components/Posts/PostView'
import TagView from '@/components/Posts/TagView'
import NotFound from '@/components/Layouts/NotFound'
import ArticleGuard from '@/components/RouterGuards/ArticleGuards'
import ContributorView from '@/components/Layouts/ContributorPreview'
import AboutView from '@/components/Footer/About'
import ConactView from '@/components/Footer/Contact'
const postRoutes = [
	{
		path: '/',
		name: 'root',
		component: Posts
	},
	{
		path: '/article/:id',
		name: 'article-view',
		component: PostView
	},
	{
		path: '/tag/:tagName',
		name: 'tag-view',
		component: TagView,
		beforeEnter: ArticleGuard.tagViewGuard(),
		props: true
	},
	{
		path: '/contributor/:contributor/:id',
		name: 'about-contributor',
		component: ContributorView,
		// props: true
	},
	{
		path: '/about',
		name: 'about',
		component: AboutView
	},
	{
		path: '/contact',
		name: 'contact',
		component: ConactView
	},
	{
		path: '*',
		name: 'not-found',
		component: NotFound
	},

]
export default postRoutes
