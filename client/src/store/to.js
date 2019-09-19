import app from '@/main'; // import the instance
import store from '@/store/index'
export default (promise) => {
	try {
		return promise.then(data => {
			return data;
		})
			.catch(err => {
				app.$Progress.fail()
				console.log(err.response)
				store.dispatch('errors/handleConnectionError', err.response, {root: true})
				return null;
			});
	} catch(err) {
		app.$Progress.fail()
		store.dispatch('errors/handleConnectionError', err.response, {root: true})
		return null
	}
}