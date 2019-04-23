<template>
  <v-container fluid>
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
            :counter="20"
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
            required 
          />
          <v-btn
            :color="submitColor"
            @click="submit"
          >
            Submit
          </v-btn>
        </v-form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminValidation from '@/components/Tools/AdminMainValidation'
import { mapActions } from 'vuex'
export default {
	name: 'AdminAddUser',
	data () {
		return {
			user: {
				email: '',
				password: '',
				contributorName: ''
			},
			emailRules: AdminValidation.emailRules,
			contributorRules: AdminValidation.contributorRules,
			userFieldsValid: true,
			submitColor: 'default'
		}
	},
	computed: {

	},
	mounted() {
		console.log('inside add user')
	},
	methods: {
		...mapActions([
			'addUser'
		]),
		async submit () {
			await this.addUser(this.user).catch(err => {
				console.log(err)
			})
			
			if (this.$refs.addUserForm.validate()) {
				this.submitColor = 'success'
			}
			else {
				this.submitColor = 'error'
			}
			setTimeout(() => {
				this.submitColor = 'default'
			}, 1500)
		}
	}
}
</script>

<style scoped>

</style>
