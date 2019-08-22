import types from './types'

function prepareErrorMessage(err) {
	const errorStatus = err ? err.status : '500';
	const errorMessage = err? err.data.error : 'INTERNAL SERVER ERROR'
	const msg = `${errorStatus} - ${errorMessage}`
	return msg
}
export default {
	async handleConnectionError({commit}, err) {
		const message = prepareErrorMessage(err)
		commit(types.ADD_ERRORS, message)
		setTimeout(() => {commit(types.POP_ERROR)}, 3000)
	}
}