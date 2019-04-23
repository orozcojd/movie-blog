<template>
  <v-container fluid>
    <h1>Register</h1>
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        md9
      >
        <v-card class="card-padding">
          <v-form>
            <v-text-field
              v-model="credentials.email"
              label="Email"
              required
            />
            <v-text-field
              v-model="credentials.password"
              label="Password"
              type="password"
              required 
            />
            <br>
            <v-btn @click="submit">
              Submit
            </v-btn>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions } from 'vuex'
export default {
	name: 'Register',
	data () {
		return {
			credentials: {
				email: '',
				password: ''
			}
		}
	},
	methods: {
		...mapActions([
			'setToken',
			'setUser'
		]),
		async submit () {
			try {
				const response = await AuthenticationService.register(this.credentials)
				console.log(response.data)
				this.setToken(response.data.token)
				this.setUser(response.data.user)
				this.error = null
				this.$router.push({
					path: '/'
				})
			} catch (error) {
				this.error = error.response.data.error
			}
		}
	}
}
</script>

<style scoped>
  .card-padding{
    padding: 30px;
  }
</style>
