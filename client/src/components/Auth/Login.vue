<template>
  <v-container
    fluid
  >
    <vue-headful
      title="Login"
    />
    <v-alert
      v-model="alert"
      dismissible
      :type="alertType"
    >
      {{ alertMessage }}
    </v-alert>
    <v-layout
      align-top
      justify-center
    >
      <v-flex
        xs12
        sm8
      >
        <div align="left">
          <h1>Login</h1>
        </div>
        <v-card
          v-if="!resetTriggered"
          class="card-padding"
        >
          <v-form>
            <v-text-field
              v-model="credentials.email"
              :rules="emailRules"
              autofocus
              label="Email"
              autocomplete="on"
              required
            />
            <v-text-field
              v-model="credentials.password"
              label="Password"
              type="password"
              autocomplete="on"
              required
            />
            <div class="mb-xs">
              <a @click="resetTriggered = !resetTriggered">Forgot Password?</a>
            </div>
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
          >
            {{ error }}
          </div>

          <br>
        </v-card>
        <keep-alive>
          <v-card
            v-if="resetTriggered"
            class="card-padding"
          >
            <v-form
              ref="resetPasswordForm"
              v-model="resetFieldValid"
              lazy-validation
            >
              <h2>Forgot Password</h2>
              <v-label>Please enter your email address and we will send you an email how to reset your password.</v-label>
              <v-text-field
                v-model="emailReset.email"
                :rules="emailRules"
                autofocus
                label="Email"
                class="mb-xs"
                required
              />
              <v-btn
                color="error"
                type="submit"
                @click="validate"
              >
                Reset Password
              </v-btn>
              <div align="right">
                <a @click="resetTriggered = !resetTriggered">Back to Login</a>
              </div>
            </v-form>
          </v-card>
        </keep-alive>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AdminRules from '@/components/Tools/AdminMainValidation'
import { mapActions, mapGetters } from 'vuex'
export default {
	name: 'Login',
	data () {
		return {
			alert: false,
			alertMessage: '',
			credentials: {
				email: 'socaljorozco@gmail.com',
				password: 'password'
			},
			resetTriggered: false,
			emailReset: {
				email: ''
			},
			error: '',
			emailRules: AdminRules.emailRules,
			resetFieldValid: true,
			loginFieldsValid: true,
			alertType: 'error'
		}
	},
	mounted() {
	},
	methods: {
		...mapActions('auth',[
			'login',
			'passwordReset'
		]),
		...mapGetters('posts', ['siteTitle']),
		headTitle() {
			return `${this.siteTitle} - Login`
		},
		validate() {
			if(this.$refs.resetPasswordForm.validate()) {
				this.resetPassword()
			}
			else {
				this.alert = true;
				this.alertType = 'error'
				this.alertMessage = 'Please enter a valid email address.'
			}
		},
		async resetPassword () {
			await this.passwordReset(this.emailReset)
				.then(res => {
					this.alertType = 'success'
					this.alertMessage = res.message
					this.alert = true;
					this.resetTriggered = false;
				})
				.catch()
		},
		async submit () {
			this.login({
				email: this.credentials.email,
				password: this.credentials.password
			})
				.then(() => {
					this.error = null
					this.$router.push({
						path: '/admin'
					})
				})
				.catch() 
		}
	}
}
</script>

<style scoped>
  h1{
    font-size: 3rem;
  }
  .card-padding{
    padding: 30px;
  }
  .mb-xs {
    margin-bottom: 15px;
  }
</style>
