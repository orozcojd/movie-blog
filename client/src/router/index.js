import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Posts from '@/components/Posts/Posts'
import Register from '@/components/Register'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'root',
      component: Posts
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
