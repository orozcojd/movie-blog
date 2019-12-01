import axios from 'axios';

export default () => axios.interceptors.response.use((response) =>
// Do something with response data
		 response,
	 (error) =>
// Do something with response error
		 Promise.reject(error));
