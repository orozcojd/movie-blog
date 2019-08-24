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
		...mapState('admin', ['article', 'tags'])
	},
	async mounted() {
		await this.getContributor(this.user.contributorId)

		const id = this.$route.params.id
		if(id) {
			await this.fetchArticleApi(id)
			await this.prepareArticle()
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
