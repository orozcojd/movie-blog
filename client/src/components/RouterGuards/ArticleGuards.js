import store from '@/store/index'

export default {
	tagViewGuard() {
		return async function(to, from, next) {
			// console.log('ENTERED GUARD')
			if(!store.state.tags.length) {
				// console.log('REQUEST FOR TAGS MADE')
				await store.dispatch('getTags')
			}
			let tag

			// if no _id found in params, find tag in tags array 
			if(!to.params._id) {
				tag = store.state.tags.find(tag => tag.name === to.params.tagName)
			}
			
			// if tag not found, redirect
			if(!tag) {
				next('/404')
			}
			else {
				// this.tag = tag.name.split('-').join(" ")
				// await store.dispatch('getArticlesByTag',tag._id)
				store.dispatch('setTag', tag)
				next()
			}
		}	
	}
}