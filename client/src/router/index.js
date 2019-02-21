import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Posts from '@/components/Posts/Posts'
import Register from '@/components/Register'
import Post from '@/components/Posts/Post'
import PostAdminView from '@/components/Posts/PostAdminView'

Vue.use(Router)

export default new Router({
  routes: [
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
      path: '/article/:id/admin',
      name: 'admin-article-view',
      component: PostAdminView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/register',
      name: 'register',
      component: Register
    }
  ]
})
