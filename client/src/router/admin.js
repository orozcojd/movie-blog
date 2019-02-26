import PostAdminView from '@/components/AdminView/PostAdminView'
import AdminPosts from '@/components/AdminView/Posts'
import Index from '@/components/AdminView/Index'
const adminRoutes = [
  {
    path: '/admin/article/:id',
    name: 'admin-article-view',
    component: PostAdminView
  },
  {
    path: '/admin',
    name: 'admin-index',
    component: Index
  },
  {
    path: '/admin/create-post',
    name: 'admin-create-post',
    component: PostAdminView
  },
  {
    path: '/admin/edit-post',
    name: 'admin-edit-post',
    component: PostAdminView
  },
  {
    path: '/admin/edit-posts',
    name: 'admin-edit-posts',
    component: AdminPosts
  }
]

export default adminRoutes
