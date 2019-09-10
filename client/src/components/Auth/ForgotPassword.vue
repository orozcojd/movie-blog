<template>
  <v-form
    ref="resetPasswordForm"
    v-model="resetFieldValid"
    lazy-validation
  >
    <div
      v-if="error"
      class="error"
    >
      {{ error }}
    </div>
    <br>
    <h2>Forgot Password</h2>
    <v-label>Please enter your email address to receive instructions for resetting your password.</v-label>
    <v-text-field
      v-model="emailReset.email"
      :rules="emailRules"
      autofocus
      label="Email"
      class="mb-xs"
      required
    />
    <vue-recaptcha
      ref="recaptcha"
      sitekey="6LdbmbQUAAAAAFqSXxy-GYvQwfYMcvpRkLTcUlgG"
      :load-recaptcha-script="true"
      theme="dark"
      @expired="onCaptchaExpired"
      @verify="verifyResetCaptcha"
    >
      <v-btn
        color="error"
        type="submit"
        @click.prevent=""
      >
        Reset Password
      </v-btn>
    </vue-recaptcha>
    <div align="right">
      <a @click="$emit('reset')">Back to Login</a>
    </div>
  </v-form>
</template>

<script>
import AdminRules from '@/components/Tools/AdminMainValidation'
import { mapActions } from 'vuex'
import VueRecaptcha from 'vue-recaptcha';
export default {
	name: 'ForgotPassword',
	components: {
		VueRecaptcha
	},
	data () {
		return {
			recaptcha: {
				token: '',
				verified: false
			},
			emailReset: {
				email: ''
			},
			error: '',
			emailRules: AdminRules.emailRules,
			passwordRules: AdminRules.passwordRules,
			resetFieldValid: true,
		}
	},
	methods: {
		...mapActions('auth',['passwordReset']),
		onCaptchaExpired: function () {
			this.$refs.recaptcha.reset();
		},
		checkVerifiedCaptcha() {
			if(!this.recaptcha.verified) {
				this.error = 'Please complete captcha'
				return true
			}
			this.validate()
		},
		validate() {
			if(this.$refs.resetPasswordForm.validate()) {
				this.resetPassword()
			}
			else {
				this.$emit('showalert',{
					val: true,
					message: 'Please enter a valid email address.',
					type: 'error'
				})
			}
		},
		async resetPassword () {
			await this.passwordReset({...this.emailReset, recaptchaToken: this.recaptcha.token})
				.then(res => {
					this.$emit('showalert', {
						val: true,
						message: res.message,
						type: 'success'
					})
					this.$emit('reset')
				})
				.catch(() => this.recaptcha.verified = false)
		},
		verifyResetCaptcha (token) {
			this.recaptcha.verified = true
			this.recaptcha.token = token
			this.error = ''
			this.$refs.recaptcha.reset();
			this.validate()
		},
	}
}
</script>

<style scoped>
  h2 {
    margin-top: 0;
  }
</style>
