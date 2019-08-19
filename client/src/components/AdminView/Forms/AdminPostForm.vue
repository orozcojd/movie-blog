<template>
  <v-container
    id="post-admin"
    fluid
  >
    <vue-headful
      :title="headTitle"
    />
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
            hint="Enter the medium size image URL from lensdump"
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
            <slot />
          </v-layout>
          <br>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex'
import TipTap from '@/components/Tools/TipTap'
import FormValidation from '@/components/Tools/FormValidation'
import {adminCategories} from '@/constants/types'
import Article from '@/Model/Article'
export default {

	name: 'AdminPostForm',
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
			requestRunning: false,
			validation: {
				draft: 'undefined',
				submit: 'undefined',
				cancelDisabled: false
			},
		}
	},
	computed: {
		...mapState('auth',[
			'user',
			'contributor'
		]),
		...mapState('admin',{
			article:'article',
			tagChoices: 'tags',
			snackbar: 'snackbar'
		}),
		headTitle() {
			return this.article.title ? `Admin Edit - ${this.article.title}` : 'Admin Create Article - Unsolocited.mp3'
		},
		/* 
			mapping state.article attributes to vuex mutations
		*/
		title: {
			get() {
				return this.article.title
			},
			set(value) {
				this.updateArticleContent({
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
				this.updateArticleContent({
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
				this.updateArticleContent({
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
				this.updateArticleContent({
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
				this.updateArticleContent({
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
				this.updateArticleContent({
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
				this.updateArticleContent({
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
				this.updateArticleContent({
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
			}
		}
	},
	methods: {
		...mapActions('admin',[
			'updateArticle',
			'postArticle',
			'setSnackbar',
			'updateArticleContent'
		]),
		disableRealm (name) {
			if(!!name.name && !!this.realm && name._id === this.realm._id)
				return true
		},
		...mapMutations('admin',['REMOVE_POST_TAG']),
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
			this.requestRunning = false
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
			setTimeout(() => {
				this.validation[btnType] = 'undefined'
				this.$router.push({
					name: adminCategories.name
				})
			}, this.snackbar.timeout)
		},
		cancel () {
			this.$router.push({
				name: adminCategories.name
			})
		},
	}
}
</script>

<style>
#post-admin img {
  max-width: 100%;
}
</style>
