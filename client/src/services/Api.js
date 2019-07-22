import axios from 'axios'
import AuthGuard from '@/components/Authentication/AuthGuard'
import store from '@/store/index'
import router from '@/router'

export default {
	ApiGeneral(options={}) {
		return axios.create({
			...options,
			baseURL: process.env.ROOT_API,
			timeout: 60000,
		})
	},
	ApiAdmin(options = {}) {
		const instance =  axios
			.create({
				...options,
				baseURL: process.env.ROOT_API,
				timeout: 60000,
				headers: { 'Authorization': AuthGuard.getHeader() }
			})
		instance.interceptors.response.use(response => {
			return response;
		}, async (error) => {
			console.log(error)
			const originalRequest = error.config;
			let refreshTken = store.getters.getRefeshToken
			let user = store.getters.getUser
			if(!error.status) {
				return Promise.reject(error);
			}
			if(!(refreshTken && user)){
				store.dispatch('logOut')
				router.push({
					name: 'root'
				})				
				return Promise.reject(error);
			}
			if(error.response.statusText === 'Unauthorized' && error.response.status === 401 && !originalRequest._retry){
				originalRequest._retry = true
				const payload = {
					email: user.email,
					refreshToken: refreshTken
				}
				await store.dispatch('refreshToken', payload).then(async token => {
					// set new token in store
					await store.dispatch('setToken', {
						token: token.token,
						refreshToken: refreshTken
					})
					originalRequest.headers['Authorization'] = AuthGuard.getHeader()
					originalRequest._retry = false

				}).catch((err) => {
					console.log(err)
					store.dispatch('logOut')
					router.push({
						name: 'root'
					})
				})
				return instance(originalRequest)
			}
			else {
				return Promise.reject(error)
			}
		})
		return instance
	}
}