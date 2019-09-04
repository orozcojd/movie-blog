import app from '@/main'; // import the instance
export default (promise) => {
	try {
		return promise.then(data => {
			return [null, data];
		})
			.catch(err => {
				app.$Progress.fail()
				return [err];
			});
	} catch(err) {
		app.$Progress.fail()
		return [err]
	}
}