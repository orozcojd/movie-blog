import store from '@/store/index'

export default {
	adminGuard() {
		/*
			If user is logged in, allow access admin routes
			otherwise redirect to main page
		*/
		return (to, from, next) => {
			if(store.getters.isUserLoggedin) {
				next()
			}
			else {
				next('/')
			}
		}
	},
	loggedInRedirect() {
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
}
