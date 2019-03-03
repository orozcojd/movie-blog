<template>
  <v-layout >
    <v-flex xs6 offset-xs3>
      <panel title="Login">
          <form
          name="tab-tracker-form"
          autocomplete="off">
            <v-text-field
              type="email"
              name="email"
              v-model="email"
              placeholder="email">
            </v-text-field>
            <br>
            <v-text-field
              type="password"
              name="password"
              autocomplete="new-password"
              v-model="password"
              placeholder="password">
            </v-text-field>
          </form>
          <br>
          <div class="error" v-html="error"/>
          <br>
          <v-btn
            @click="login">
            Login
          </v-btn>
      </panel>
    </v-flex>
  </v-layout>
</template>

<script>
import AuthenticationService from '@/services/AuthenticationService'
import { mapActions } from 'vuex'
import Panel from '@/components/panel'
export default {
  name: 'login',
  data () {
    return {
      email: '',
      password: '',
      error: null
    }
  },
  components: {
    Panel
  },
  methods: {
    ...mapActions([
      'setToken',
      'setUser'
    ]),
    async login () {
      try {
        const response = await AuthenticationService.login({
          email: this.email,
          password: this.password
        })
        console.log(response)
        // this.setToken(response.data.token)
        // this.setUser(email)
        // this.error = null
      } catch (error) {
        this.error = error.response.data.error
      }
    }
  }
}
</script>

<style scoped>
</style>
