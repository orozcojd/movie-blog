<template>
  <div
    v-if="loaded"
    style="padding:20px"
  >
    <h1>Admin View</h1>

    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <v-text-field
        v-model="title"
        label="Article Title"
        required
      />
      <v-text-field
        v-model="author"
        label="Author"
        required
      />
      <v-text-field
        v-model="thumbnailDescription"
        label="Thumbnail Description"
        required
      />
      <v-text-field
        v-model="img"
        label="Article Image"
        required 
      />
      <v-text-field
        v-model="category"
        label="Category"
        required 
      />
      <tip-tap />
      <v-btn
        :disabled="validation.cancelDisabled"
        @click.prevent="cancel"
      >
        Cancel
      </v-btn>
      <v-btn
        @click.prevent="article.draft=true; submit()"
      >
        Draft
      </v-btn>
      <v-btn
        :color="validation.btnType"
        @click.prevent="article.draft=false; submit()"
      >
        Submit
      </v-btn>
      <br>
      <div style="color:red">
        {{ validation.error }}
      </div>
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import TipTap from '@/components/Tools/TipTap'
import Article from '@/Model/Article'

export default {

	name: 'PostAdminView',
	components: {
		TipTap
	},
	data () {
		return {
			loaded: false,
			valid: true,
			validation: {
				btnType: 'undefined',
				error: '',
				cancelDisabled: false
			},
			requestRunning: false,
		}
	},
	computed: {
		...mapState([
			'article'
		]),
		...mapGetters([
			'getArticle'		
		]),
		/* 
			mapping state.article attributes to vuex mutations
		*/
		title: {
			get() {
				return this.article.title
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'title',
					value: value
				})
			}
		},
		author: {
			get() {
				return this.article.author
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'author',
					value: value
				})
			}
		},
		thumbnailDescription: {
			get() {
				return this.article.thumbnailDescription
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'thumbnailDescription',
					value: value
				})
			}
		},
		img: {
			get() {
				return this.article.img
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'img',
					value: value
				})
			}
		},
		category: {
			get() {
				return this.article.category
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'category',
					value: value
				})
			}
		},
		/* 
			end mapping state.article attributes to vuex mutations
		*/

	},
	async mounted () {
		/* later change to - if not found in store fetch */
		let id = this.$route.params.id
		// if article not found in store, fetch it
		if(id){
			let article = this.getArticle(id)
			if(article) {
				// if article set article state to article found in articles array
				this.setSingleArticle(article)
			}
			else {
				// else fetch then set article state
				await this.fetchArticle(id)
			}
		}	
		this.loaded = true
	},
	methods: {
		...mapMutations([
			'UPDATE_ARTICLE_CONTENT'
		]),
		...mapActions([
			'updateArticle',
			'postArticle',
			'fetchArticle',
			'setSingleArticle'
		]),
		cancel () {
			this.$router.push({
				name: 'root'
			})
		},
		async submit () {
			if (this.requestRunning) {
				return
			}
			
			// disable cancel button & prevent api from firing after multiple button clicks
			this.requestRunning = true
			this.validation.cancelDisabled = true
			if (this.$route.params.id) {
				let payload = {
					article: new Article(this.article),
					id: this.$route.params.id
				}
				await this.updateArticle(payload)
			} else {
				await this.postArticle(new Article(this.article))
			}
			this.validation.error = ''
			this.validation.btnType = 'success'
			setTimeout(() => {
				this.$router.push({
					name: 'root'
				})
			}, 500)
			// this.validation.btnType = 'danger'
			// this.validation.error = err
		}
	}
}
</script>

<style scoped>

</style>
