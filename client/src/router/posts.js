import Posts from '@/components/Posts/Posts'
import Post from '@/components/Posts/Post'

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
  }
]

export default postRoutes
