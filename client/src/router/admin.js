import PostAdminView from '@/components/AdminView/PostAdminView'
import AdminPosts from '@/components/AdminView/Posts'
import Index from '@/components/AdminView/Index'
import AdminCategories from '@/components/AdminView/AdminCategories'
import Login from '@/components/AdminView/Login'
import Register from '@/components/AdminView/Register'

const adminRoutes = [
  {
    path: '/admin',
    component: Index,
    children: [
      {
        path: '',
        name: 'admin-categories',
        component: AdminCategories
      },
      {
        path: 'login',
        name: 'admin-login',
        component: Login
      },
      {
        path: 'register',
        name: 'admin-register',
        component: Register
      },
      {
        path: 'article/:id',
        name: 'admin-article-view',
        component: PostAdminView
      },
      {
        path: 'create-post',
        name: 'admin-create-post',
        component: PostAdminView
      },
      {
        path: 'edit-post/:id',
        name: 'admin-edit-post',
        component: PostAdminView
      },
      {
        path: 'edit-posts',
        name: 'admin-edit-posts',
        component: AdminPosts,
        props: {drafts: false}
      },
      {
        path: 'edit-drafts',
        name: 'admin-edit-drafts',
        component: AdminPosts,
        props: {drafts: true}
      }
    ]
  }

]

export default adminRoutes
