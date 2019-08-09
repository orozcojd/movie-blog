<template>
  <div v-if="loaded">
    <admin-post-preview
      :new-post="true"
    />
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import AdminPostPreview from '@/components/AdminView/AdminPostPreview'
export default {
	name: 'AdminNewPPreview',
	components: {
		AdminPostPreview
	},
	data () {
		return {
			loaded: false
		}
	},
	computed: {
		...mapState([
			'tags',
			'article'
		]),
	},
	async mounted() {
		if(Object.keys(this.article).length === 0 && this.article.constructor === Object) {
			if(this.$route.params.id){
				await this.fetchArticleApi(this.$route.params.id)
					.then(async () => {
						// await this.setContent()
						await this.prepareArticle()
					})
					.catch((err) => {
						console.log(err)
					})
			}
			else {
				this.setSingleArticle({})
			}
		}
		this.loaded = true
	},
	methods: {
		...mapActions([
			'fetchArticleApi',
			'prepareArticle',
			'setSingleArticle'
		]),
	}
}
</script>

<style scoped>

</style>
