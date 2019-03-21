import Posts from '@/components/Posts/Posts'
import Post from '@/components/Posts/Post'
import TagView from '@/components/Posts/TagView'
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
		component: TagView
	},
]

export default postRoutes
