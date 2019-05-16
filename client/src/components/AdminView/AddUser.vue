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
          <v-btn
            type="submit"
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
import { mapActions, mapState } from 'vuex'
export default {
	name: 'AdminAddUser',
	data () {
		return {
			user: {
				email: '',
				password: '',
				contributorName: '',
				permission: null,
				id: null
			},
			emailRules: AdminValidation.emailRules,
			contributorRules: AdminValidation.contributorRules,
			permissionRules: AdminValidation.permissionRules,
			passwordRules: AdminValidation.passwordRules,
			userFieldsValid: true,
			permissions: [{text:'Super User - 1', value:1}, {text:'Admin User - 2', value: 2}],
			submitColor: 'default',
			// error: false,
			errorMsg: '',
			snackText: ''
		}
	},
	computed: {
		...mapState({
			adminUser: 'user',
			snackbar: 'snackbar'  
		})
	},
	mounted() {
		this.user.id = this.adminUser._id
	},
	methods: {
		...mapActions([
			'addUser',
			'setSnackbar'
		]),
		async submit () {
			if (this.$refs.addUserForm.validate()) {
				await this.addUser(this.user)
					.then(() => {
						this.submitColor = 'success'
						this.snackText = `User ${this.user.email} was created.`
						setTimeout(() => {
							this.$router.push({
								name: 'admin-categories'
							})
						}, this.snackbar.timeout)
					})
					.catch(err => {
						if(err.response)
							this.snackText = err.response.data.error
						else
							this.snackText = err
						this.submitColor = 'error'

					})
				this.setSnackbar({
					type: 'text',
					value: this.snackText,
					show: true
				})
			}
			else {
				this.submitColor = 'error'
			}
			setTimeout(() => {
				this.submitColor = 'default'
			}, this.snackbar.timeout)
		}
	}
}
</script>

<style scoped>

</style>
