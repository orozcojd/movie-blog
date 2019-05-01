import axios from 'axios'
import AuthGuard from '@/components/Authentication/AuthGuard'

export default (options={}) => {
	return axios.create({
		...options,
		baseURL: `http://localhost:8081/`,
		timeout: 1000,
		// Should inclue headers for every request ?
		headers: { 'Authorization': AuthGuard.getHeader() }
	})
}
