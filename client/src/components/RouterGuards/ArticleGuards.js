import store from '@/store/index'

export default {
	/**
	 * Returns an asyncfunction to fetch all tags and cross-check
	 * the current route param name is found in any of the tags.
	 * If not found, redirects to 404 page otherwise dispatches
	 * action to set state tag to tag matched
	 */
	tagViewGuard() {
		return async function(to, from, next) {
			// console.log('ENTERED GUARD')
			if(!store.state.posts.tags.length) {
				// console.log('REQUEST FOR TAGS MADE')
				await store.dispatch('posts/getTags')
			}
			let tag

			// if no _id found in params, find tag in tags array 
			if(!to.params._id) {
				tag = store.state.posts.tags.find(tag => tag.urlTag === to.params.urlTag)
			}
			
			// if tag not found, redirect
			if(!tag) {
				next('/404')
			}
			else {
				// this.tag = tag.name.split('-').join(" ")
				// await store.dispatch('getArticlesByTag',tag._id)
				store.dispatch('posts/setTag', tag)
				next()
			}
		}	
	}
}