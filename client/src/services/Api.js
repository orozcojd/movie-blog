import axios from 'axios'

export default (options={}) => {
	return axios.create({
		...options,
		baseURL: `http://localhost:8081/`,
		timeout: 1000
	})
}
