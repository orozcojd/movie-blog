import Vue from 'vue'
import Router from 'vue-router'
// import Login from '@/components/Login'
// import Register from '@/components/Register'

import postRoutes from './posts'
import adminRoutes from './admin'
import authRoutes from './auth'

Vue.use(Router)

let routes = postRoutes.concat(adminRoutes).concat(authRoutes)
export default new Router({
	routes
})
