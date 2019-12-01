import types from './types';

export default {
	[types.ADD_ERRORS](state, payload) {
		state.errors.push(payload);
	},
	[types.POP_ERROR](state) {
		state.errors.pop();
	},
};
