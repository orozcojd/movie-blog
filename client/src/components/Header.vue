<template>
  <v-toolbar
    fixed
    light
    app
  >
    <v-toolbar-side-icon to="/">
      <v-icon>home</v-icon>
    </v-toolbar-side-icon>
    <v-toolbar-title>Movie Reviewer</v-toolbar-title>
    <v-spacer />
    <v-btn
      v-if="!!getUser"
      disabled
    >
      {{ getUser }}
    </v-btn>
    <v-toolbar-items
      v-if="!isUserLoggedin"
    >
      <v-btn
        flat
        :to="{name:'admin-login'}"
      >
        Log In
      </v-btn>
      <v-btn
        flat
        :to="{name:'admin-register'}"
      >
        Sign Up
      </v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-else>
      <v-btn
        flat
        to="/admin"
      >
        Admin
      </v-btn>
      <v-btn
        flat
        @click="logout"
      >
        Log Out
      </v-btn>
    </v-toolbar-items>
  </v-toolbar>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
	name: 'Header',
	computed: {
		...mapGetters([
			'getToken',
			'isUserLoggedin',
			'getUser'
		])
	},
	mounted () {
		if (!this.getToken) {
			this.getSetToken()
		}
	},
	methods: {
		...mapActions([
			'getSetToken',
			'setToken',
			'setUser',
			'logOut'
		]),
		logout () {
			this.logOut().then(() => {
				this.$router.push({
					name: 'root'
				})
			})
		}
	}
}
</script>
