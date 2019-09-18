import axios from 'axios'
export default () => {
	return axios.interceptors.response.use((response) => {
		// Do something with response data
		return response;
	}, function (error) {
		// Do something with response error
		return Promise.reject(error);
	});
}
