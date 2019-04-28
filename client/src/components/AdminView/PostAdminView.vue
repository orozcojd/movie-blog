<template>
  <v-container
    v-if="loaded"
    fluid
  >
    <h1 align="left">
      Create your article.
    </h1>
    <v-layout
      align-center
      justify-start
    >
      <v-flex
        xs12
        md10
      >
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="title"
            :rules="titleRules"
            :counter="90"
            label="Article Title"
            required
          />
          <v-text-field
            v-model="author"
            :rules="authorRules"
            :counter="30"
            label="Author"
            required
          />
          <v-text-field
            v-model="thumbnailDescription"
            :rules="descriptionRules"
            :counter="120"
            label="Thumbnail Description"
            required
          />
          <v-text-field
            v-model="img"
            :rules="imageRules"
            label="Article Image"
            required 
          />
          <v-text-field
            v-model="imgCred"
            :rules="descriptionRules"
            :counter="120"
            label="Image Description"
            required 
          />
          <v-autocomplete
            v-model="realm"
            :items="tagChoices"
            :rules="realmRules"
            :counter="20"
            item-text="name"
            item-value="name"
            label="Realm"
            return-object
            required
          />
          <v-autocomplete
            v-model="tags"
            :items="tagChoices"
            item-text="name"
            item-value="name"
            :item-disabled="disableRealm"
            multiple
            label="Choose Tags"
            return-object
            small-chips
            deletable-chips
          />
          <tip-tap 
            align="left"
            class="editor"
          />
          <br><br>
          <v-layout>
            <v-flex
              xs4
            >
              <div
                align="left"
              >
                <v-btn
                  :disabled="validation.cancelDisabled"
                  @click.prevent="cancel"
                >
                  Cancel
                </v-btn>
              </div>
            </v-flex>
            <v-flex
              xs4
            >
              <v-btn
                :color="validation.draft"
                @click.prevent="draft=true;validate('draft')"
              >
                Draft
              </v-btn>
              <v-btn
                :color="validation.submit"
                @click.prevent="draft=false; validate('submit')"
              >
                Submit
              </v-btn>
            </v-flex>
            <v-flex>
              <div align="right">
                <v-btn
                  @click="previewPost"
                >
                  Preview
                </v-btn>
              </div>
            </v-flex>
          </v-layout>
          <br>
        </v-form>
      </v-flex>
    </v-layout>
    <v-snackbar
      v-model="snackbar"
      :timeout="4000"
      :top="true"
      :multi-line="true"
    >
      {{ snackText }}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import TipTap from '@/components/Tools/TipTap'
import Article from '@/Model/Article'
import PostValidation from '@/components/Tools/PostValidation'
export default {

	name: 'PostAdminView',
	components: {
		TipTap
	},
	data () {
		return {
			isEditing: true,
			// tags: [],
			valid: true,
			/* validation rules */
			titleRules: PostValidation.titleRules,
			authorRules: PostValidation.authorRules,
			descriptionRules: PostValidation.descriptionRules,
			imageRules: PostValidation.imageRules,
			realmRules: PostValidation.realmRules,
			loaded: false,
			requestRunning: false,
			validation: {
				draft: 'undefined',
				submit: 'undefined',
				// error: '',
				cancelDisabled: false,
			},
			snackbar: false,
			snackText: ''
		}
	},
	computed: {
		...mapState({
			article:'article',
			tagChoices: 'tags'
		}),

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
		imgCred: {
			get () {
				return this.article.imgCred
			},
			set (value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'imgCred',
					value: value
				})
			}
		},
		realm: {
			get() {
				return this.article.realm
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'realm',
					value: value
				})
			}
		},
		tags: {
			get() {
				console.log(this.article.tags)
				return this.article.tags
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'tags',
					value: value
				})
			}
		},
		draft: {
			get() {
				return this.article.draft
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'draft',
					value: value
				})
			}
		}
		/* 
			end mapping state.article attributes to vuex mutations
		*/
	},
	watch: {
		realm(val) {
			/* 
				if realm chosen is in list of tags chosen,
				remove from tag array 
			*/
			if(val && this.tags && this.tags.length) {
				let index = this.tags.findIndex(tag => tag == val)
				if(index > -1){
					this.REMOVE_POST_TAG(index)
				}
			}
		}
	},
	async mounted () {
		let id = this.$route.params.id
		// if article not found in store, fetch it
		// console.log(this.article)
		if(id){
			let article = this.getArticle(id)
			// console.log(article)
			if(article) {
				console.log('hitting this point')
				// if article set article state to article found in articles array
				this.setSingleArticle(article)
			}
			else {
				// else fetch then set article state
				console.log('fetching')
				await this.fetchArticle(id)
			}
		}
		else {
			console.log('hitting article set single')
			this.SET_SINGLE_ARTICLE({});
		}
		// console.log(this.article)
		this.prepareArticle()
		this.loaded = true
		// console.log(this.article)
		// console.log(this.tags)
	},
	methods: {
		validate (btnType) {
			if (this.$refs.form.validate()) {
				/* if validation is approved */
				this.submit(btnType)
			}
			else {
				this.validation[btnType] = 'error'
				setTimeout(() => {
					this.validation[btnType] = 'undefined'
				}, 2000)				
			}
		},
		disableRealm (name) {
			// console.log(this.realm)
			// console.log(name.name)
			if(!!name.name && name.name === this.realm)
				return true
		},
		...mapMutations([
			'UPDATE_ARTICLE_CONTENT',
			'SET_SINGLE_ARTICLE'
			,'REMOVE_POST_TAG'
		]),
		...mapActions([
			'updateArticle',
			'postArticle',
			'fetchArticle',
			'setSingleArticle',
			'getTags',
			'prepareArticle'
		]),
		cancel () {
			this.$router.push({
				name: 'root'
			})
		},
		previewPost () {
			this.$router.push({
				name: 'admin-post-preview',
				params: {
					article: {...this.article}
				}
			})
		},
		submitCallback(message, btnType, fail = false) {
			this.snackText = message
			this.snackbar = true
			if(fail)
				this.validation[btnType] = 'error'
			else
				this.validation[btnType] = 'success'
		},
		async submit (btnType) {
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
					.then(response => {
						this.submitCallback(response, btnType)
						setTimeout(() => {
							this.$router.push({
								name: 'root'
							})
						}, 3000)
					})
					.catch(err => {
						this.submitCallback(err.response.data.error, btnType, true)
					})
			} else {
				await this.postArticle(new Article(this.article))
					.then(response => {
						this.submitCallback(response, btnType)
					})
					.catch(err => {
						this.submitCallback(err.response.data.error, btnType, true)
					})
			}
			this.validation.error = ''
			setTimeout(() => {
				this.validation[btnType] = 'default'
				this.validation.cancelDisabled = false
			}, 3000)
		}
	}
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Proza+Libre');
@import url('../../assets/style/tiptap.scss');
  h1 {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }
</style>
