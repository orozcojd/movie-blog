import store from '@/store'

export function adminGuard() {
	/*
			If user is logged in, allow access admin routes
			otherwise redirect to main page
	*/
	return (to, from, next) => {
		if(!store.getters['auth/isUserLoggedin']) {
			store.dispatch('auth/getSetToken')
		}
		if(store.getters['auth/isUserLoggedin']) {
			next()
		}
		else {
			next('/404')
		}
	}
}
export function	loggedInRedirect() {
	/* 
			If user is logged in redirect to admin
			otherwise allow user to access login page
		*/
	return (to, from, next) => {
		if(store.getters['auth/isUserLoggedin']) {
			next('/admin')
		}
		else {
			next()
		}
	}
}
export function validatePermissions() {
	return (to, from, next) => {
		if(!to.meta.requiresAuth) return next()
		if(!to.meta.allowed()) return next('/admin')
		return next()
	}
}
export function	getHeader() {
	return `Bearer ${localStorage.getItem('unsolicited-session-token')}`
}
