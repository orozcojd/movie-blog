import state from '@/store/auth/state'
import getters from '@/store/auth/getters'
import actions from '@/store/auth/actions'
import mutations from '@/store/auth/mutations'

export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
}