import Posts from '@/components/Posts/Posts'
import Post from '@/components/Posts/Post'
import RealmView from '@/components/Posts/RealmView'
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
		path: '/realm/:realmName',
		name: 'realm-view',
		component: RealmView
	},
]

export default postRoutes
