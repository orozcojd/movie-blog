<template>
  <v-container
    fluid
  >
    <vue-headful
      :title="headTitle"
    />
    <v-alert
      v-model="alert.val"
      dismissible
      :type="alert.type"
    >
      {{ alert.message }}
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
         
          class="card-padding"
        >
          <div v-if="!resetTriggered">
            <v-form
              ref="loginForm"
            >
              <v-text-field
                v-model="credentials.email"
                :rules="emailRules"
                :counter="40"
                autofocus
                label="Email"
                autocomplete="on"
                required
              />
              <v-text-field
                v-model="credentials.password"
                :rules="passwordRules"
                :counter="300"
                label="Password"
                type="password"
                autocomplete="on"
                required
              />
              <div class="mb-xs">
                <a @click="resetTriggered = !resetTriggered">Forgot Password?</a>
              </div>
              <vue-recaptcha
                ref="recaptcha"
                sitekey="6LdbmbQUAAAAAFqSXxy-GYvQwfYMcvpRkLTcUlgG"
                :load-recaptcha-script="true"
                theme="dark"
                @expired="onCaptchaExpired"
                @verify="verifyLoginCaptcha"
              >
                <v-btn 
                  type="submit"
                  @click="validateLogin"
                >
                  Submit
                </v-btn>
              </vue-recaptcha>
            </v-form>
            <br>
          </div>
          <div v-else>
            <keep-alive>
              <forgot-password 
                v-if="resetTriggered"
                @reset="resetTriggered = false"
                @showalert="showAlert"
              />
            </keep-alive>
          </div>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>



<script>
import AdminRules from '@/components/Tools/AdminMainValidation'
import { mapActions, mapGetters } from 'vuex'
import VueRecaptcha from 'vue-recaptcha';
export default {
	name: 'Login',
	components: {
		VueRecaptcha,
		ForgotPassword: () => import('@/components/Auth/ForgotPassword')
	},
	data () {
		return {
			recaptcha: {
				token: '',
				verified: false
			},
			alert: {
				val: false,
				message: '',
				type: 'error'
			},
			credentials: {
				email: '',
				password: ''
			},
			resetTriggered: false,
			emailRules: AdminRules.emailRules,
			passwordRules: AdminRules.passwordRules,
		}
	},
	computed: {
		headTitle() {
			return `${this.siteTitle()} - Login`
		}
	},
	methods: {
		verifyLoginCaptcha (token) {
			this.recaptcha.token = token
			this.recaptcha.verified = true
			this.$refs.recaptcha.reset();
			this.validateLogin()
		},
		onCaptchaExpired: function () {
			this.$refs.recaptcha.reset();
		},
		...mapActions('auth',[
			'login',
		]),
		...mapGetters('posts', ['siteTitle']),
		showAlert (e) {
			this.alert = e
		},
		validateLogin () {
			if(this.$refs.loginForm.validate()) {
				this.submit()
			}
			else {
				this.alert.message = "Email and password must comply."
				this.alert.type = 'error'
				this.alert.val = true;
			}
		},
		async submit () {
			if(!this.recaptcha.verified)
				return
			this.login({
				email: this.credentials.email,
				password: this.credentials.password,
				recaptchaToken: this.recaptcha.token
			})
				.then(() => {
					this.$router.push({
						path: '/admin'
					})
				})
				.catch(() => this.recaptcha.verified = false) 
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
