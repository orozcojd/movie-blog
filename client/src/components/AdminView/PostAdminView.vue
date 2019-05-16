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
            autofocus
            :rules="titleRules"
            :counter="90"
            label="Article Title"
            required
          />
          <v-text-field
            v-model="author"
            :rules="contributorRules"
            disabled
            label="Contributor"
            required
          />
          <v-text-field
            v-model="thumbnailDescription"
            :rules="descriptionRules"
            :counter="120"
            label="Thumbnail description"
            required
          />
          <v-text-field
            v-model="img"
            persistent-hint
            hint="Enter the image URL from lensdump"
            :rules="imageRules"
            label="Article image"
            required 
          />
          <v-text-field
            v-model="lazyImg"
            persistent-hint
            hint="Enter the medium image URL from lensdump"
            :rules="imageRules"
            label="Article medium image"
            required 
          />
          <v-text-field
            v-model="imgCred"
            :rules="descriptionRules"
            :counter="120"
            label="Image description"
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
            label="Choose tags"
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
  </v-container>
</template>

<script>
import { mapGetters, mapActions, mapState, mapMutations } from 'vuex'
import TipTap from '@/components/Tools/TipTap'
import Article from '@/Model/Article'
import FormValidation from '@/components/Tools/FormValidation'
export default {

	name: 'PostAdminView',
	components: {
		TipTap
	},
	data () {
		return {
			isEditing: true,
			valid: true,
			/* validation rules */
			titleRules: FormValidation.titleRules,
			contributorRules: FormValidation.contributorRules,
			descriptionRules: FormValidation.descriptionRules,
			imageRules: FormValidation.imageRules,
			realmRules: FormValidation.realmRules,
			loaded: false,
			requestRunning: false,
			validation: {
				draft: 'undefined',
				submit: 'undefined',
				cancelDisabled: false,
			},
		}
	},
	computed: {
		...mapState({
			article:'article',
			tagChoices: 'tags',
			snackbar: 'snackbar',
			user: 'user',
			contributor: 'contributor'
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
				return this.contributor.name
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
		lazyImg: {
			get() {
				return this.article.lazyImg
			},
			set(value) {
				this.UPDATE_ARTICLE_CONTENT({
					type: 'lazyImg',
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
		},
		snackVal() {
			return this.snackbar.value
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
				let index = this.tags.findIndex(tag => tag._id === val._id)
				if(index > -1){
					this.REMOVE_POST_TAG(index)
				}
			}
		},
		snackVal(val, prev) {
			if(val === false && prev === true) {
				this.submitColor = 'undefined'
				this.$router.push({name: 'admin-categories'})
			}
		}
	},
	async mounted () {
		let id = this.$route.params.id
		// if article not found in store, fetch it
		if(id){
			let article = this.getArticle(id)
			// console.log(article)
			if(article) {
				// if article set article state to article found in articles array
				this.setSingleArticle(article)
			}
			else {
				// else fetch then set article state
				await this.fetchArticle(id)
			}
		}
		else {
			this.SET_SINGLE_ARTICLE({});
		}
		this.prepareArticle()
		await this.getContributorBio(this.user.contributorId)
		this.loaded = true
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
			if(!!name.name && !!this.realm && name._id === this.realm._id)
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
			'prepareArticle',
			'setSnackbar',
			'getContributorBio'
		]),
		cancel () {
			this.$router.push({
				name: 'admin-categories'
			})
		},
		previewPost () {
			this.$router.push({
				name: 'admin-post-preview',
				params: {
					article: this.article
				}
			})
		},
		submitCallback(message, btnType, fail = false) {
			this.setSnackbar({
				type: 'text',
				value: message,
				show: true
			})
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
					})
					.catch(err => {
						this.submitCallback(err.response.data.error, btnType, true)
						this.$router.push({
							name: 'admin-categories'
						})
					})
			} else {
				await this.postArticle({...new Article({
					...this.article,
					author: this.contributor.name
				}),
				contributorId:this.user.contributorId})
					.then(response => {
						this.submitCallback(response, btnType)
					})
					.catch(err => {
						this.submitCallback(err.response.data.error, btnType, true)
					})
			}
		}
	}
}
</script>
<style lang="scss">
@import url('https://fonts.googleapis.com/css?family=Proza+Libre');
@import url('../../assets/style/tiptap.scss');
  h1 {
    font-size: 4rem;
    // margin-bottom: 2.5rem;
  }
</style>
