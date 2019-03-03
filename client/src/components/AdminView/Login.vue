<template>
  <v-container fluid>
    <h1>Login</h1>
    <v-layout
      align-center
      justify-center
    >
      <v-flex xs12 md9>
        <v-card class="card-padding">
          <v-form>
            <v-text-field
              label="Email"
              required
              v-model="credentials.email"/>
            <v-text-field
              label="Password"
              type="password"
              required
              v-model="credentials.password"/>
              <br>
              <v-btn @click="submit">Submit</v-btn>
          </v-form>
          <br>
          <div class="error" v-html="error"/>
          <br>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions } from 'vuex'
export default {
  name: 'login',
  data () {
    return {
      credentials: {
        email: '',
        password: ''
      },
      error: ''
    }
  },
  methods: {
    ...mapActions([
      'setToken',
      'setUser'
    ]),
    async submit () {
      await AuthenticationService.login({
        email: this.credentials.email,
        password: this.credentials.password
      }).then(res => {
        this.setToken(res)
        this.setUser(this.credentials.email)
        this.error = null
        this.$router.push({
          path: '/admin'
        })
      }).catch(err => {
        console.log(err)
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
