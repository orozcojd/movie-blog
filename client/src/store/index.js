import Vue from 'vue'
import Vuex from 'vuex'
import auth from '@/store/auth'
import posts from '@/store/posts'

Vue.use(Vuex)

const createStore = new Vuex.Store({
	strict: process.env.NODE_ENV !== 'production',
	modules: {
		auth,
		posts
	}
})
export default createStore
