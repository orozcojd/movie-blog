<template>
  <v-container>
    <vue-headful
      :title="headTitle"
    />
    <h1 align="left">
      About You
    </h1>
    <v-layout
      row
      wrap
    >
      <v-flex
        xs12
        md8
      >
        <v-form
          ref="form"
          v-model="valid"
          lazy-validation
        >
          <v-text-field
            v-model="name"
            autofocus
            :rules="contributorRules"
            :counter="30"
            label="Contributor Name"
            required
          />
          <v-text-field
            v-model="profileImg"
            :rules="imageRules"
            label="Profile Image"
          />
          <v-textarea
            v-model="bio"
            :rules="bioRules"
            label="Describe yourself"
            :counter="1600"
            auto-grow
          />
          <v-text-field
            v-model="twitterLink"
            label="Twitter profile username"
            hint="e.g. www.twitter.com/username"
          />
          <v-text-field
            v-model="igLink"
            label="Instagram profile username"
            hint="e.g. www.instagram.com/username"
          />
          <v-text-field
            v-model="fbLink"
            label="Facebook profile username"
            hint="e.g. www.facebook.com/username"
          />
          <div
            align="left"
          >
            <v-btn
              :color="submitColor"
              :disabled="disabled"
              @click="validate"
            >
              Submit
            </v-btn>
          </div>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import FormValidation from '@/components/Tools/FormValidation'
import { mapActions, mapState } from 'vuex'
import Contributor from '@/Model/Contributor'
import {adminCategories} from '@/constants/types'

export default {
	name: 'AboutContributor',
	data () {
		return {
			snackText: '',
			valid: true,
			submitColor: 'default',
			contributorRules: FormValidation.contributorRules,
			imageRules: FormValidation.imageRules,
			bioRules: FormValidation.bioRules
		}
	},
	computed: {
		...mapState('admin', ['snackbar']),
		...mapState('auth',[
			'user',
			'contributor'
		]),
		headTitle() {
			return `Admin - About ${this.contributor.name} `
		},
		name: {
			get() {
				return this.contributor.name
			},
			set(val) {
				this.editContributorVal({
					type: 'name',
					val: val
				})
			}
		},
		profileImg: {
			get() {
				return this.contributor.img
			},
			set(val) {
				this.editContributorVal({
					type: 'img',
					val: val
				})
			},
		},
		bio: {
			get() {
				return this.contributor.bio
			},
			set(val) {
				this.editContributorVal({
					type: 'bio',
					val: val
				})
			}
		},
		twitterLink: {
			get() {
				return this.contributor.twitter
			},
			set(val) {
				this.editContributorVal({
					type: 'twitter',
					val: val
				})
			}
		},
		igLink: {
			get() {
				return this.contributor.instagram
			},
			set(val) {
				this.editContributorVal({
					type: 'instagram',
					val: val
				})
			}
		},
		fbLink: {
			get() {
				return this.contributor.facebook
			},
			set(val) {
				this.editContributorVal({
					type: 'facebook',
					val: val
				})
			}
		},
		snackVal() {
			return this.snackbar.value
		},
		disabled () {
			return !this.$can('update', this.contributor)
		}
	},
	watch: {
		snackVal(val, prev) {
			if(val === false && prev === true) {
				this.submitColor = 'undefined'
				this.$router.push({name: adminCategories.name})
			}
		}
	},
	async mounted() {
		if(!this.contributor.name) await this.getContributor(this.user.contributorId)
	},
	methods: {
		...mapActions('auth',[
			'updateContributorBio',
			'getContributor',
			'editContributorVal',
		]),
		...mapActions('admin', ['setSnackbar']),
		validate (){
			if (this.$refs.form.validate()) {
				/* if validation is approved */
				this.submit()
			}
			else {
				this.submitColor = 'error'
				setTimeout(() => {
					this.submitColor = 'undefined'
				}, 2000)				
			}
		},
		async submit (){
			if(this.disabled) return
			const contributor = new Contributor(this.contributor)
			const payload = {...contributor, userId: this.user._id, id: this.contributor._id}
			await this.updateContributorBio(payload)
				.then(() => {
					this.submitColor = 'success'
				})
				.catch(() => this.submitColor = 'error')

		}
	}
}
</script>

<style scoped>
  h1 {
    font-size: 4rem;
    margin-bottom: 2.5rem;
  }
</style>
