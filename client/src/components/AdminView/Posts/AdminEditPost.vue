<template>
  <div>
    <admin-post-form
      v-if="article._id && !preview"
    >
      <v-flex>
        <div
          align="right"
        >
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
import { mapActions, mapState } from 'vuex'
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
		if(!this.tags.length) await this.fetchTags()
		const id = this.$route.params.id
		if(id) {
			await this.fetchArticleApi(id)
			await this.prepareArticle()
		}
		else {
			await this.setArticle(new Article({author: this.contributor.name}))
		}
		this.loaded = true
	},
	methods: {
		...mapActions('auth', ['getContributor']),
		...mapActions('admin',['fetchTags']),
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
