import Posts from '@/components/Posts/Posts'
import Post from '@/components/Posts/Post'
import TagView from '@/components/Posts/TagView'
import NotFound from '@/components/Layouts/NotFound'
import ArticleGuard from '@/components/RouterGuards/ArticleGuards'

const postRoutes = [
	{
		path: '/',
		name: 'root',
		component: Posts
	},
	{
		path: '/article/:id',
		name: 'article-view',
		component: Post
	},
	{
		path: '/tag/:tagName',
		name: 'tag-view',
		component: TagView,
		beforeEnter: ArticleGuard.tagViewGuard(),
		beforeRouteLeave: (to, from, next) => {
			console.log('leaving')
		}, 
		props: true
	},
	{
		path: '*',
		name: 'not-found',
		component: NotFound
	},

]

export default postRoutes
