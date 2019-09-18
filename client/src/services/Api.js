import axios from 'axios'
import {getHeader} from '@/Authentication/AuthGuard'
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
				headers: { 'Authorization': getHeader() }
			})
		instance.interceptors.response.use(response => {
			return response;
		}, async (error) => {
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
				await store.dispatch('auth/refreshToken', payload).then(() => {
					originalRequest.headers['Authorization'] = getHeader()
					originalRequest._retry = false
				}).catch(() => {
					store.dispatch('auth/logOut')
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