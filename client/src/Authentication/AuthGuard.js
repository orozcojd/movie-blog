import store from '@/store'

export function adminGuard() {
	/*
			If user is logged in, allow access admin routes
			otherwise redirect to main page
		*/
	return (to, from, next) => {
		if(!store.getters.isUserLoggedin) {
			store.dispatch('getSetToken')
		}
		if(store.getters.isUserLoggedin) {
			next()
		}
		else {
			console.log('not logged in!')
			next('/')
		}
	}
}
export function	loggedInRedirect() {
	/* 
			If user is logged in redirect to admin
			otherwise allow user to access login page
		*/
	return (to, from, next) => {
		if(store.getters.isUserLoggedin) {
			next('/admin')
		}
		else {
			next()
		}
	}
}
export function	getHeader() {
	return `Bearer ${localStorage.getItem('unsolicited-session-token')}`
}
