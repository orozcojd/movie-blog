<template>
  <div v-if="loaded">
    <slot>
      <admin-post-form 
        :newpost="newPost"
        :preview-path="previewPath"
      />
    </slot>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import AdminPostForm from '@/components/AdminView/Forms/AdminPostForm'
import { adminCategories, adminEditPost, adminPostPreview, adminPreviewPost } from '@/constants/types'

export default {
	name: 'AdminNewPost',
	components: {
		AdminPostForm
	},
	data () {
		return {
			newPost: true,
			loaded: false,
			previewPath: 'admin-new-post-preview'
		}
	},
	computed: {
		...mapState([
			'article',
			'user'
		])
	},

	beforeRouteLeave (to, from, next) {
		if(to.name === adminPreviewPost.name || to.name === adminPostPreview.name || to.name === adminCategories.name){
			next()
			return
		}
		const answer = window.confirm('Do you really want to leave? you have unsaved changes!')
		if (answer) {
			next()
		} else {
			next(false)
		}
	},
	async mounted() {
		const id = this.$route.params.id
		await this.getContributorBio(this.user.contributorId)
		const getArticle = (Object.keys(this.article).length === 0 && this.article.constructor === Object)
		const postExists = this.$route.name === adminEditPost.name
		if(postExists) {
			this.previewPath = 'admin-post-preview'
		}
		if(getArticle) {
			this.newPost = false
			await this.fetchArticleApi(id)
				.catch(err => {
					this.setSnackbar({
						type: 'text',
						value: err.response.data.error,
						show: true
					})
				})
				.then(async () => {
					await this.prepareArticle()
				})
		}
		else if(!postExists && getArticle){
			this.setSingleArticle({})
		}
		this.loaded = true
	},
	methods: {
		...mapActions([
			'getContributorBio',
			'fetchArticleApi',
			'prepareArticle',
			'setSnackbar',
			'setSingleArticle'
		]),
	},
}
</script>

<style scoped>

</style>
