export default (promise) => {
	try {
		return promise.then(data => {
			return [null, data];
		})
			.catch(err => [err]);
	} catch(err) {
		return [err]
	}
}