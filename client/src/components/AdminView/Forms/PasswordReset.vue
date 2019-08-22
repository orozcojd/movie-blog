
<template>
  <v-container
    fluid
  >
    <vue-headful
      title="Login"
    />
    <v-layout
      align-top
      justify-center
    >
      <v-flex
        xs12
        sm8
      >
        <div
          align="left"
          class="mb-small"
        >
          <h1>Password Reset</h1>
        </div>
        <v-card
          
          class="card-padding"
        >
          <v-form
            ref="passResetForm"
            v-model="formValid"
          >
            <v-text-field
              v-model="password.pass"
              autofocus
              label="Password"
              type="password"
              autocomplete="on"
              required
              :counter="60"
            />
            <v-text-field
              v-model="password.passConfirm"
              label="Password Verify"
              type="password"
              autocomplete="on"
              :rules="passwordMatchError"
              required
              :counter="60"
            />
            <v-btn 
              :color="submitColor"
              type="submit"
              @click="validate"
            >
              Submit
            </v-btn>
          </v-form>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
export default {
	name: 'PasswordReset',
	data () {
		return {
			password: {
				pass: '',
				passConfirm: ''
			},
			formValid: true,
			submitColor: '',
			token: ''
		}
	},
	computed: {
		passwordMatchError () {
			return [
				this.password.pass === this.password.passConfirm || 'Passwords must match.',
				(this.password.passConfirm.length <= 60 && this.password.passConfirm.length >= 5)  || 'Password must be between 5 and 60 characters.',
			]
		}
	},
	mounted() {
		this.token = this.$route.query.token
	},
	methods: {
		...mapActions('auth',[
			'resetPassword'
		]),
		submit() {
			this.resetPassword({password: this.password, token: this.token})
				.then(() => {
					this.$router.push({path: '/admin'})
				})
				.catch(() => {
					this.submitColor = "error"
					setTimeout(() => {
						this.submitColor = ''
					}, 4000)
				})
		},
		validate() {
			if(this.$refs.passResetForm.validate()) {
				this.submit()
			}
			else {
				this.submitColor = "error"
				setTimeout(() => {
					this.submitColor = ''
				}, 4000)
			}
		}
	}
}
</script>

<style scoped>
 .card-padding{
    padding: 30px;
  }
  .mb-small {
    margin-bottom: 15px;
  }
</style>
