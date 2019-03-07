<template>
  <div
    v-if="loaded"
    style="padding:5em"
  >
    <h1>Admin View</h1>
    <tip-tap />
    <v-form
      ref="form"
      v-model="valid"
      lazy-validation
    >
      <!-- <v-text-field
        v-model="article.title"
        label="Article Title"
        required
      />
      <v-text-field
        v-model="article.author"
        label="Author"
        required
      />
      <v-text-field
        v-model="article.thumbnailDescription"
        label="Thumbnail Description"
        required
      />
      <v-text-field
        v-model="article.img"
        label="Article Image"
        required 
      />
      <v-text-field
        v-model="article.category"
        label="Category"
        required 
      />
      <v-textarea
        v-model="article.body"
        min-height="400px"
        label="Article Body"
        required
      /> -->
      <!--  <v-btn
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
      </div> -->
    </v-form>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import TipTap from '@/components/Tools/TipTap'
import Article from '@/Model/Article.js'
// import { validationMixin } from 'vuelidate'
// import { required, maxLength, email } from 'vuelidate/lib/validators'
export default {
	// mixins: [validationMixin],
	// validations: {
	//   name: { required, maxLength: maxLength(10) },
	//   email: { required, email },
	//   select: { required },
	//   checkbox: {
	//     checked (val) {
	//       return val
	//     }
	//   }
	// },
	name: 'PostAdminView',
	components: {
		TipTap
	},
	data () {
		return {
			loaded: false,
			valid: true,
			article: {},
			validation: {
				btnType: 'undefined',
				error: '',
				cancelDisabled: false
			},
			requestRunning: false
		}
	},
	computed: {
		...mapGetters([
			'getArticle',
			'getSingleArticle'
		]),
		...mapState([
			'articles'
		])
		// titleErrors () {
		//   const errors = []
		//   if (!this.$v.article.title.$dirty) return errors
		//   !this.$v.article.title.maxLength && errors.push('Article Title must be at most 10 characters long')
		//   !this.$v.article.title.required && errors.push('Article Title is required.')
		//   return errors
		// },
	},
	async mounted () {
		/* later change to - if not found in store fetch */
		let id = this.$route.params.id
		if (id) {
			this.article = this.getArticle(id)
			if (!this.article) {
				await this.fetchArticle(id)
				this.article = JSON.parse(JSON.stringify(this.getSingleArticle))
			}
		}
		this.loaded = true
		// this.$validator.localize('en', this.dictionary)
	},
	methods: {
		...mapActions([
			'updateArticle',
			'postArticle',
			'fetchArticle'
		]),
		cancel () {
			this.$router.push({
				name: 'root'
			})
		},
		async submit () {
			// console.log(this.article)
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
