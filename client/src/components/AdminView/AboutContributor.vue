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
		...mapState([
			'user',
			'snackbar',
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
		}
    
	},
	watch: {
		snackVal(val, prev) {
			if(val === false && prev === true) {
				this.submitColor = 'undefined'
				this.$router.push({name: 'admin-categories'})
			}
		}
	},
	async mounted() {
		await this.getContributorBio(this.user.contributorId)
		console.log('after setting contributor')
	},
	methods: {
		...mapActions([
			'updateContributorBio',
			'getContributorBio',
			'editContributorVal',
			'setSnackbar'
		]),
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
			const contributor = new Contributor(this.contributor)
			const payload = {...contributor, userId: this.user._id, id: this.contributor._id}
			await this.updateContributorBio(payload)
				.then(response => {
					this.submitColor = 'success'
					this.snackText = response.message
				})
				.catch(err => {
					this.submitColor = 'error'
					this.snackText = err
				})
			this.setSnackbar({
				type: 'text',
				value: this.snackText,
				show: true
			})
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
