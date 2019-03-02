import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login'
// import Register from '@/components/Register'

import postRoutes from './posts'
import adminRoutes from './admin'

Vue.use(Router)

let routes = postRoutes.concat(adminRoutes)
export default new Router({
  routes
})
