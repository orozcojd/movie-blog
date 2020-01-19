import Vue from 'vue';
import Router from 'vue-router';
// import Login from '@/components/Login'
// import Register from '@/components/Register'

import postRoutes from './posts';
import adminRoutes from './admin';
import authRoutes from './auth';
import { validatePermissions } from '@/Authentication/AuthGuard';

Vue.use(Router);

const routes = postRoutes.concat(adminRoutes).concat(authRoutes);
const router = new Router({
	routes,
	mode: 'history'
});
router.beforeEach(validatePermissions());
export default router;
