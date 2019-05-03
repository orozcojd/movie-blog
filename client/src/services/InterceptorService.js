import axios from 'axios'
import store from '@/store/index'

export default () => {
	return axios.interceptors.response.use((response) => {
		// Do something with response data
		console.log('response!')
		return response;
	}, function (error) {
		console.log(error)
		// Do something with response error
		return Promise.reject(error);
	});
}
