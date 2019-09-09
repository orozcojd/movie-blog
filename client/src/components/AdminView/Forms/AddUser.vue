<template>
  <v-container fluid>
    <vue-headful
      :title="headTitle"
    />
    <h1 align="center">
      Fill out the following fields to add a user.
    </h1>
    <v-layout
      row
      wrap
      justify-center
    >
      <v-flex
        xs12
        md6
      >
        <v-form
          ref="addUserForm"
          v-model="userFieldsValid"
          lazy-validation
        >
          <v-text-field
            v-model="user.email"
            :rules="emailRules"
            label="Email Address"
            :counter="40"
            required 
          />
          <v-text-field
            v-model="user.contributorName"
            :rules="contributorRules"
            label="Contributor Name"
            :counter="20"
            required 
          />
          <v-text-field
            v-model="user.password"
            label="Password"
            type="password"
            :rules="passwordRules"
            required 
          />
          <v-select
            v-model="user.permission"
            :items="permissions"
            :rules="permissionRules"
            label="Permission Level"
            required
          />
          <v-text-field
            :value="user.id"
            label="ID"
            disabled
            required 
          />
          <vue-recaptcha
            ref="recaptcha"
            sitekey="6LdbmbQUAAAAAFqSXxy-GYvQwfYMcvpRkLTcUlgG"
            :load-recaptcha-script="true"
            theme="dark"
            @expired="onCaptchaExpired"
            @verify="verifySubmitCaptcha"
          >
            <v-btn
              type="submit"
              :color="submitColor"
            >
              Submit
            </v-btn>
          </vue-recaptcha>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminValidation from '@/components/Tools/AdminMainValidation'
import { mapActions, mapState, mapGetters } from 'vuex'
import {adminCategories} from '@/constants/types'
import VueRecaptcha from 'vue-recaptcha';
export default {
	name: 'AdminAddUser',
	components: {
		VueRecaptcha
	},
	data () {
		return {
			user: {
				email: '',
				password: '',
				contributorName: '',
				permission: null,
				id: null
			},
			recaptcha: {
				token: '',
				verified: false
			},
			emailRules: AdminValidation.emailRules,
			contributorRules: AdminValidation.contributorRules,
			permissionRules: AdminValidation.permissionRules,
			passwordRules: AdminValidation.passwordRules,
			userFieldsValid: true,
			permissions: [{text:'Administrator', value:1}, {text:'Contributor', value: 2}],
			submitColor: 'default',
			snackText: ''
		}
	},
	computed: {
		...mapState('auth', {adminUser: 'user'}),
		...mapState('admin',['snackbar']),
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `Admin Add User - ${this.siteTitle}`
		},
		snackVal() {
			return this.snackbar.value
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
	mounted() {
		this.user.id = this.adminUser._id
	},
	methods: {
		...mapActions('admin',[
			'addUser',
			'setSnackbar'
		]),
		onCaptchaExpired: function () {
			this.$refs.recaptcha.reset();
		},
		verifySubmitCaptcha (token) {
			this.recaptcha.token = token
			this.recaptcha.verified = true
			this.$refs.recaptcha.reset();
			this.validateAddUserForm()
		},
		validateAddUserForm() {
			if (this.$refs.addUserForm.validate()) {
				this.submit()
			}
			else {
				this.submitColor = 'error'
			}
			setTimeout(() => {
				this.submitColor = 'default'
			}, this.snackbar.timeout)
		},
		async submit () {
			await this.addUser({...this.user, recaptchaToken: this.recaptcha.token})
				.then(() => this.submitColor = 'success')
				.catch(() => this.submitColor = 'error')
		}		
	}
}
</script>