import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login'
// import Register from '@/components/Register'

import postRoutes from './posts'
import adminRoutes from './admin'

Vue.use(Router)

let routes = postRoutes.concat(adminRoutes)
console.log(routes)
export default new Router({
  routes
})
// {
//   path: '/login',
//   name: 'login',
//   component: Login
// },
// {
//   path: '/register',
//   name: 'register',
//   component: Register
// }
