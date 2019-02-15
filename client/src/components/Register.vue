<template>
  <v-layout >
    <v-flex xs6 offset-xs3>
      <panel title="Register">
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
            @click="register">
            Register
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
  name: 'register',
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
    async register () {
      try {
        const response = await AuthenticationService.register({
          email: this.email,
          password: this.password
        })
        this.setToken(response.data.token)
        this.setUser(response.data.user)
        console.log(response.data)
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
</style>
