<template>
  <v-container fluid>
    <vue-headful
      :title="headTitle"
    />
    <h1>Login</h1>
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
              autofocus
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
            <v-btn 
              type="submit"
              @click="submit"
            >
              Submit
            </v-btn>
          </v-form>
          <br>
          <div
            class="error"
            v-html="error"
          />
          <br>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name: 'Login',
	data () {
		return {
			credentials: {
				email: 'socaljorozco@gmail.com',
				password: 'password'
			},
			error: ''
		}
	},
	methods: {
		...mapActions([
			'login'
		]),
		...mapGetters([
			'siteTitle'
		]),
		headTitle() {
			return `${this.siteTitle} - Login`
		},
		async submit () {
			this.login({
				email: this.credentials.email,
				password: this.credentials.password
			}).then(() => {
				this.error = null
				this.$router.push({
					path: '/admin'
				})
			}).catch(err => {
				this.error = err
			})
		}
	}
}
</script>

<style scoped>
  .card-padding{
    padding: 30px;
  }
</style>
