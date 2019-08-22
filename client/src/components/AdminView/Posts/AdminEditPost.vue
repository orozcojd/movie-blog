<template>
  <div>
    <admin-post-form
      v-if="loaded && !preview"
    >
      <v-flex>
        <div align="right">
          <v-btn
            @click="previewPost"
          >
            Preview
          </v-btn>
        </div>
      </v-flex>
    </admin-post-form>
    <admin-preview
      v-if="preview"
      :article="article"
    >
      <v-layout>
        <v-btn
          @click="preview=false"
        >
          Back
        </v-btn>
      </v-layout>
    </admin-preview>
  </div>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import Article from '@/Model/Article'
export default {
	name: 'AdminEditPost',
	components: {
		AdminPostForm: () => import('@/components/AdminView/Forms/AdminPostForm'),
		AdminPreview: () => import('@/components/AdminView/Posts/AdminPreview')
	},
	data () {
		return {
			loaded: false,
			preview: false,
		}
	},
	computed: {
		...mapState('auth',['user', 'contributor']),
		...mapState('admin', ['article', 'tags']),
		...mapGetters('admin',['getArticle'])
	},
	async mounted() {
		await this.getContributor(this.user.contributorId)
		console.log(this.contributor)
		// await this.fetchTags()
		const id = this.$route.params.id
		let articleFound = this.getArticle(id)
		if(articleFound) {
			this.setArticle(articleFound)
			await this.prepareArticle()
		}
		else if(id) {
			await this.fetchArticleApi(id)
				.then(async () => {
					await this.prepareArticle()
				})
				.catch(err => {
					this.setSnackbar({
						type: 'text',
						value: err.response,
						show: true
					})
				})
		}
		else {
			this.setArticle(new Article({author: this.contributor.name}))
		}
		this.loaded = true
	},
	methods: {
		...mapActions('auth', ['getContributor']),
		...mapActions('admin',[
			'setArticle',
			'prepareArticle',
			'fetchArticleApi',
			'setSnackbar',
			'fetchTags'
		]),
		previewPost () {
			this.preview = true
		}
	}
}
</script>

<style scoped>

</style>
